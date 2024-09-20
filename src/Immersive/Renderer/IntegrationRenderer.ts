import { Camera, CanvasTexture, CineonToneMapping, Clock, ImageLoader, LinearFilter, LinearMipMapLinearFilter, LinearSRGBColorSpace, NearestFilter, NoColorSpace, PCFShadowMap, PerspectiveCamera, SRGBColorSpace, Scene, TextureLoader, Vector3, WebGLRenderTarget, WebGLRenderer } from 'three'
import { MainScene } from './MainScene'
import { OrbitCamera } from './OrbitCamera'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OdinConfigurator } from '../OdinConfigurator'
import { Composer } from './Composer'
import { getDownloadURL, ref } from 'firebase/storage'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshLibrary } from '../Libraries'
import { GUI } from 'dat.gui'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass'
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass.js';
import { MaskPass, ClearMaskPass } from 'three/examples/jsm/postprocessing/MaskPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'



export class IntegrationRenderer {
    private _renderer!: WebGLRenderer
    private stats: Stats
    private _scene!: MainScene
    public maskScene!: Scene
    get scene(): MainScene {
        return this._scene
    }
    private _maskComposer!: EffectComposer
    get maskComposer(): EffectComposer {
        return this._maskComposer
    }
    private _maskComposer2!: EffectComposer
    get maskComposer2(): EffectComposer {
        return this._maskComposer2
    }


    get canvas() {
        return this._renderer.domElement
    }
    private composer!: Composer;
    private container!: HTMLDivElement
    static _camera: PerspectiveCamera
    static _maskCamera: Camera
    private clock: Clock = new Clock()
    private previousTime = 0

    constructor() {
        this._scene = new MainScene()
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('webgl2', { alpha: true })
        if (context) {
            this._renderer = new WebGLRenderer({
                canvas,
                context,
                antialias: true,
                powerPreference: 'high-performance',
            })
        }
        this.maskScene = new Scene()
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = PCFShadowMap
        this._renderer.useLegacyLights = true
        this._renderer.toneMapping = CineonToneMapping
        this._renderer.toneMappingExposure = 1
        this._renderer.outputColorSpace = SRGBColorSpace
        this._renderer.setAnimationLoop(this.render.bind(this))

        //add statistics to the page
        this.stats = new Stats()
        if (OdinConfigurator.instance.debugMode === true) {
            // document.body.appendChild(this.stats.dom)
        }
    }
    public async mount(container: HTMLDivElement, cameraSettings: Array<any>) {
        this.container = container
        const { clientWidth, clientHeight } = this.container
        this.container.appendChild(this._renderer.domElement)
        this._renderer.setSize(clientWidth, clientHeight)

        await this.cameraSetup(clientWidth, clientHeight, cameraSettings)
        window.addEventListener('resize', this.onWindowResize)
        //provide own rendertarget to the composer 
        const renderTarget = new WebGLRenderTarget(
            800,
            600,
            {
                samples: 2
            }

        )


        this._scene.init()

    }
    public onWindowResize() {
        const clientWidth = OdinConfigurator.instance.canvas.clientWidth
        const clientHeight = OdinConfigurator.instance.canvas.clientHeight
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this._renderer.setSize(clientWidth, clientHeight)
        IntegrationRenderer._camera.aspect = clientWidth / clientHeight;
        IntegrationRenderer._camera.updateProjectionMatrix();

        this._maskComposer.setSize(clientWidth, clientHeight)
    }
    private async cameraSetup(clientWidth: number, clientHeight: number, cameraSettings: Array<any>) {

        if (OdinConfigurator.instance.productAssembler) {
            await OdinConfigurator.instance.productAssembler.object.traverse((child) => {
                if (child instanceof Camera) {
                    IntegrationRenderer._maskCamera = child
                }
            })

        }
        console.log(IntegrationRenderer._maskCamera)
        let CamPos = new Vector3(0, 0, 0)
        let TargetPos = new Vector3(0, 0, 0)

        const clearPass = new ClearPass();
        const clearMaskPass = new ClearMaskPass();



        const maskPass1 = new MaskPass(this.maskScene, IntegrationRenderer._maskCamera);
        const maskPass2 = new MaskPass(this.maskScene, IntegrationRenderer._maskCamera);
        maskPass1.inverse = true;

        const parameters = {
            stencilBuffer: true,
            samples: 6

        };


 

    }
    private render() {

        //updates for debugreasons
        if (OdinConfigurator.instance.debugMode === true) {
            this.stats.update()
        }

        //get times for future calculations
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this._renderer.render(this._scene, IntegrationRenderer._camera)

    }
    public unmount() {
        this._renderer.dispose()
        window.removeEventListener('resize', this.onWindowResize)
    }
}

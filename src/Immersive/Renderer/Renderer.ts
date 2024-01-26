import { Camera, CineonToneMapping, Clock, LinearSRGBColorSpace, PCFShadowMap, PerspectiveCamera, SRGBColorSpace, Scene, Vector3, WebGLRenderTarget, WebGLRenderer } from 'three'
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

export class Renderer {
    private _renderer!: WebGLRenderer
    private stats: Stats
    private _scene!: MainScene
    public maskScene!: Scene
    get scene(): MainScene {
        return this._scene
    }

    get canvas() {
        return this._renderer.domElement
    }
    private composer!: Composer;
    private container!: HTMLDivElement
    static _camera: PerspectiveCamera
    private clock: Clock = new Clock()
    private previousTime = 0
    public performanceCategory: 'Low' | 'Medium' | 'High' = 'High'

    constructor() {
        this._scene = new MainScene()
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('webgl2', { alpha: true })
        if (context) {
            this._renderer = new WebGLRenderer({
                canvas,
                context,
                // alpha:true,
                antialias: true,
                powerPreference: 'high-performance',
            })
        }
        this.maskScene = new Scene()
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = PCFShadowMap
        this._renderer.useLegacyLights = true
        this._renderer.toneMapping = CineonToneMapping
        this._renderer.toneMappingExposure = 2.2
        this._renderer.outputColorSpace = SRGBColorSpace
        this._renderer.setAnimationLoop(this.render.bind(this))


        //add statistics to the page
        this.stats = new Stats()
        if (OdinConfigurator.instance.debugMode === true) {
           // document.body.appendChild(this.stats.dom)
        }
    }
    public async mount(container: HTMLDivElement,cameraSettings:Array<any>) {
        this.container = container
        const { clientWidth, clientHeight } = this.container
        this.container.appendChild(this._renderer.domElement)
        this._renderer.setSize(clientWidth, clientHeight)

        await this.cameraSetup(clientWidth, clientHeight,cameraSettings)
        window.addEventListener('resize', this.onWindowResize)
        //provide own rendertarget to the composer 
        const renderTarget = new WebGLRenderTarget(
            800,
            600,
            {
                samples: 2
            }

        )
        this.composer = new Composer(this._renderer, renderTarget, this._scene, Renderer._camera, clientWidth, clientHeight, this.container)
        this.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.composer.setSize(clientWidth, clientHeight)

        let test: boolean = false
        const gui = new GUI()
        gui.close()
        this._scene.init()
        gui.add(this.scene.sunLight, 'intensity', 0, 30, 0.01).name('Sunlight intensity')
        gui.add(this.scene.hemisphericLight, 'intensity', 0, 30, 0.01).name('hemisphere intensity')

        gui.add( this.composer.GTAOPass, 'output', {
            'Default': GTAOPass.OUTPUT.Default,
            'Diffuse': GTAOPass.OUTPUT.Diffuse,
            'AO Only': GTAOPass.OUTPUT.AO,
            'AO Only + Denoise': GTAOPass.OUTPUT.Denoise,
            'Depth': GTAOPass.OUTPUT.Depth,
            'Normal': GTAOPass.OUTPUT.Normal
        } ).onChange( function ( value ) {

            OdinConfigurator.instance.renderer.composer.GTAOPass.output = value;

        } );
        const aoParameters = {
            enable:true,
            radius: 1,
            distanceExponent: 3.73,
            thickness: 10,
            scale: 2,
            samples: 32,
            distanceFallOff: 1.,
            screenSpaceRadius: true,
        };
        const pdParameters = {
            lumaPhi: 10.,
            depthPhi: 2.,
            normalPhi:11.,
            radius: 18,
            radiusExponent: 4.,
            rings: 2.,
            samples: 16,
        };

        gui.add(aoParameters, "enable" ).onChange( () => this.composer.AOEnabled= aoParameters.enable  );
        gui.add(this.composer.GTAOPass,'blendIntensity' ).min( 0 ).max( 1 ).step( 0.01 );
        gui.add(aoParameters,'radius' ).min( 0.01 ).max( 1 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updateGtaoMaterial( aoParameters ) );
        gui.add( aoParameters, 'distanceExponent' ).min( 1 ).max( 4 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updateGtaoMaterial( aoParameters ) );
        gui.add( aoParameters, 'thickness' ).min( 0.01 ).max( 10 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updateGtaoMaterial( aoParameters ) );
        gui.add( aoParameters, 'distanceFallOff' ).min( 0 ).max( 1 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updateGtaoMaterial( aoParameters ) );
        gui.add( aoParameters, 'scale' ).min( 0.01 ).max( 2.0 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updateGtaoMaterial( aoParameters ) );
        gui.add( aoParameters, 'samples' ).min( 2 ).max( 32 ).step( 1 ).onChange( () => this.composer.GTAOPass.updateGtaoMaterial( aoParameters ) );
        gui.add( aoParameters, 'screenSpaceRadius' ).onChange( () => this.composer.GTAOPass.updateGtaoMaterial( aoParameters ) );
        gui.add( pdParameters, 'lumaPhi' ).min( 0 ).max( 20 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updatePdMaterial( pdParameters ) );
        gui.add( pdParameters, 'depthPhi' ).min( 0.01 ).max( 20 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updatePdMaterial( pdParameters ) );
        gui.add( pdParameters, 'normalPhi' ).min( 0.01 ).max( 20 ).step( 0.01 ).onChange( () => this.composer.GTAOPass.updatePdMaterial( pdParameters ) );
        gui.add( pdParameters, 'radius' ).min( 0 ).max( 32 ).step( 1 ).onChange( () => this.composer.GTAOPass.updatePdMaterial( pdParameters ) );
        gui.add( pdParameters, 'radiusExponent' ).min( 0.1 ).max( 4. ).step( 0.1 ).onChange( () => this.composer.GTAOPass.updatePdMaterial( pdParameters ) );
        gui.add( pdParameters, 'rings' ).min( 1 ).max( 16 ).step( 0.125 ).onChange( () => this.composer.GTAOPass.updatePdMaterial( pdParameters ) );
        gui.add( pdParameters, 'samples' ).min( 2 ).max( 32 ).step( 1 ).onChange( () => this.composer.GTAOPass.updatePdMaterial( pdParameters ) );

    }
    public onWindowResize() {
        const clientWidth = OdinConfigurator.instance.canvas.clientWidth
        const clientHeight = OdinConfigurator.instance.canvas.clientHeight
        OdinConfigurator.instance.renderer._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        OdinConfigurator.instance.renderer._renderer.setSize(clientWidth, clientHeight)
        Renderer._camera.aspect = clientWidth / clientHeight;
        Renderer._camera.updateProjectionMatrix();
        OdinConfigurator.instance.renderer.composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        OdinConfigurator.instance.renderer.composer.setSize(clientWidth, clientHeight)

    }
    private async cameraSetup(clientWidth: number, clientHeight: number,cameraSettings:Array<any>) {

        if (OdinConfigurator.instance.productAssembler) {
            const camera = await OdinConfigurator.instance.productAssembler.object.traverse((child) => {
                if (child instanceof Camera) {
                    return child
                }
            })
            if (camera != null) {
                Renderer._camera = camera
                Renderer._camera.updateProjectionMatrix()

            }
        }
        const CamPos = new Vector3(cameraSettings[0].xCam, cameraSettings[0].yCam, cameraSettings[0].zCam)
        const TargetPos = new Vector3(cameraSettings[0].xLook, cameraSettings[0].yLook, cameraSettings[0].zLook)

        if (Renderer._camera == null) {
            Renderer._camera = new OrbitCamera(60, this.canvas, 0.01, 100,CamPos,TargetPos)
            if (Renderer._camera instanceof OrbitCamera) {

                Renderer._camera.aspect = clientWidth / clientHeight
                Renderer._camera.updateProjectionMatrix()
            }
        }


    }
    private render() {
        if (Renderer._camera instanceof OrbitCamera) {
            Renderer._camera.controls.update();
        }

        //updates for debugreasons
        if (OdinConfigurator.instance.debugMode === true) {
            this.stats.update()
        }

        //get times for future calculations
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        //if (OdinConfigurator.instance.typeOfConfigurator!='Integration') {
        //this.composer.render()  
        //this._renderer.render(this.scene, Renderer._camera)
        this.composer.render()
        //}
        /* else{
            this._renderer.clear()
            this._renderer.render(this.maskScene, Renderer._camera)
            this._renderer.render(this._scene, Renderer._camera)
        } */
    }
    public unmount() {
        this._renderer.dispose()
        window.removeEventListener('resize', this.onWindowResize)
    }
}

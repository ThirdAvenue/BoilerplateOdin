import { CineonToneMapping, Clock, LinearSRGBColorSpace, PCFShadowMap, WebGLRenderer } from 'three'
import { MainScene } from './MainScene'
import { OrbitCamera } from './OrbitCamera'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { ImmersiveConfigurator } from '../ImmersiveConfigurator'
import { Composer } from './Composer'

export class Renderer {
    private _renderer!: WebGLRenderer
    private stats: Stats
    private _scene!: MainScene
    get scene(): MainScene {
        return this._scene
    }
    get canvas() {
        return this._renderer.domElement
    }
    private composer!: Composer;
    private container!: HTMLDivElement
    static _camera: OrbitCamera
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
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = PCFShadowMap
        this._renderer.useLegacyLights = true
        this._renderer.toneMapping = CineonToneMapping
        this._renderer.toneMappingExposure = 2.2
        this._renderer.outputColorSpace = LinearSRGBColorSpace
        this._renderer.setAnimationLoop(this.render.bind(this))

        //add statistics to the page
        this.stats = new Stats()
        if (ImmersiveConfigurator.instance.debugMode === true) {
            document.body.appendChild(this.stats.dom)
        }
    }
    public mount(container: HTMLDivElement) {
        this.container = container
        const { clientWidth, clientHeight } = this.container
        this.container.appendChild(this._renderer.domElement)
        this._renderer.setSize(clientWidth, clientHeight)

        Renderer._camera = new OrbitCamera(60, this.canvas, 0.01, 100)
        Renderer._camera.aspect = clientWidth / clientHeight
        Renderer._camera.updateProjectionMatrix()
        window.addEventListener('resize', this.onWindowResize)

        this.composer = new Composer(this._renderer, this._scene, Renderer._camera, clientWidth, clientHeight, this.container)

        this._scene.init()
    }
    public onWindowResize() {
        const clientWidth = ImmersiveConfigurator.instance.canvas.clientWidth
        const clientHeight = ImmersiveConfigurator.instance.canvas.clientHeight
        Renderer._camera.aspect = clientWidth / clientHeight
        Renderer._camera.updateProjectionMatrix()
        ImmersiveConfigurator.instance.renderer._renderer.setSize(clientWidth, clientHeight)
    }

    private render() {
        Renderer._camera.controls.update();

        //updates for debugreasons
        if (ImmersiveConfigurator.instance.debugMode === true) {
            this.stats.update()
        }

        //get times for future calculations
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this.composer.render()
    }
    public unmount() {
        this._renderer.dispose()
        window.removeEventListener('resize', this.onWindowResize)
    }
}

import { Color, WebGLRenderTarget, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { MainScene } from '.'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass.js';


export class Composer extends EffectComposer {
    public renderPass!: RenderPass
    public saoPass!: SAOPass
    public fxaaPass!: ShaderPass
    public GTAOPass!: GTAOPass
    public outputPass!: OutputPass
    public saoBias = 0.5
    public saoIntensity = 0.01
    public saoScale = 1
    public saoKernelRadius = 100
    public saoMinResolution = 0
    public saoBlur = true
    public saoBlurRadius = 5
    public saoBlurStdDev = 4
    public saoBlurDepthCutoff = 0.01
    public AOEnabled: boolean = true
    

    constructor(
        renderer: WebGLRenderer,
        webglRenderTarget: WebGLRenderTarget,
        private scene: MainScene,
        public camera: any,
        private clientWidth: number,
        private clientHeight: number,
        private container: HTMLDivElement
    ) {
        super(renderer, webglRenderTarget)
        this.initialize()
    }
    public initialize() {
        //this.addAAPass()

        this.addRenderPass()
        if (this.AOEnabled = true)  this.gtaoPass()
        this.addFXAAPass()
        //this.addTAAPass()
        //always last one 
        this.outputpass()
        //this.addGammaCorrection()

    }
    private addRenderPass() {
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.renderPass.clearColor = new Color(0, 0, 0)
        this.renderPass.clearAlpha = 0
        this.addPass(this.renderPass)
    }
    private addFXAAPass() {
        const fxaaPass = new ShaderPass(FXAAShader);
        var pixelRatio = this.renderer.getPixelRatio();
        fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.container.offsetWidth * (pixelRatio));
        fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.container.offsetHeight * (pixelRatio));
        this.addPass(fxaaPass);
    }
    private addSSOA() {
        this.saoPass = new SAOPass(this.scene, this.camera)
        this.saoPass.params.saoIntensity = 0.005
        this.saoPass.params.saoBlurRadius = 1
        this.saoPass.params.saoKernelRadius = 0.001

        this.addPass(this.saoPass)
    }
    private addAAPass() {
        this.fxaaPass = new ShaderPass(FXAAShader);
        const pixelRatio = this.renderer.getPixelRatio();

        this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.container.offsetWidth * (pixelRatio));
        this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.container.offsetHeight * (pixelRatio));
        this.addPass(this.fxaaPass);
    }
    private addTAAPass() {
        const taapass = new TAARenderPass(this.scene, this.camera)
        taapass.sampleLevel = 2
        this.addPass(taapass);

    }
    private gtaoPass() {

        this.GTAOPass = new GTAOPass(this.scene, this.camera, this.clientWidth, this.clientHeight)
        this.GTAOPass.output = GTAOPass.OUTPUT.Default;
        this.addPass(this.GTAOPass)

    }
    private outputpass() {
        this.outputPass = new OutputPass();
        this.addPass(this.outputPass)
    }
    private addGammaCorrection() {
        this.addPass(new ShaderPass(GammaCorrectionShader))
    }
}

import { Color, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { MainScene } from '.'
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

export class Composer extends EffectComposer {
    public renderPass!: RenderPass
    public saoPass!: SAOPass
    public fxaaPass!: ShaderPass
    constructor(
        renderer: WebGLRenderer,
        private scene: MainScene,
        public camera: any,
        private clientWidth: number,
        private clientHeight: number,
        private container: HTMLDivElement
    ) {
        super(renderer)
        this.initialize()
    }
    public initialize() {
        this.addRenderPass()
        this.addSSOA()

        this.addAAPass()
    }
    private addRenderPass() {
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.renderPass.clearColor = new Color(0, 0, 0)
        this.renderPass.clearAlpha = 0
        this.addPass(this.renderPass)
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
}

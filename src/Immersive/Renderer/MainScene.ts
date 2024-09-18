import {
    BoxGeometry,
    CameraHelper,
    DirectionalLight,
    Group,
    HemisphereLight,
    Mesh,
    MeshPhysicalMaterial,
    Object3D,
    RectAreaLight,
    Scene,
    ShadowMaterial,
    TextureLoader,
} from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

import { OdinConfigurator } from '..'

export type layer = 'Scene' | 'Product'

export class MainScene extends Scene {
    private scenery: Group
    public product: Group
    private uiElements: Group
    private dimensionElements: Group
    public sunLight!: DirectionalLight
    public hemisphericLight!: HemisphereLight
    constructor() {
        super()
        this.scenery = new Group()
        this.product = new Group()
        this.uiElements = new Group()
        this.dimensionElements = new Group()
    }
    public init() {
        this.scenery.name = 'Scenery'
        this.product.name = 'Product'
        this.uiElements.name = 'UI'
        this.dimensionElements.name = 'Dimensions'

        this.add(this.scenery, this.product, this.uiElements, this.dimensionElements)
        this.setupScene()
    }
    public addScenery(object: Object3D) {
        this.scenery.add(object)
    }
    public addProduct(object: Object3D) {
        this.product.add(object)
        const loadingscreen = document.getElementById('loadingScreen')
        if (loadingscreen)loadingscreen.style.display = 'none'
        
    }
    public addUIElement(object: Object3D) {
        this.uiElements.add(object)
    }
    public addDimensionElement(object: Object3D) {
        this.dimensionElements.add(object)
    }
    private setupScene() {
        this.hemisphericLight = new HemisphereLight(0xfcf8e3, 0xfffdf2, 0.1)
        this.sunLight = new DirectionalLight('#fcf8e3', 0.7)
        this.sunLight.position.set(5, 3.8, 10)
        this.sunLight.target.position.set(0, 0, 0)
        this.sunLight.shadow.radius = 12
        this.sunLight.castShadow = true
        this.sunLight.shadow.bias = -0.00001
        this.sunLight.shadow.normalBias = 0.01
        this.sunLight.shadow.mapSize.width = 4096*4
        this.sunLight.shadow.mapSize.height = 4096*4
        this.sunLight.shadow.camera.left = -10
        this.sunLight.shadow.camera.right = 10
        this.sunLight.shadow.camera.top = 10
        this.sunLight.shadow.camera.bottom = -10

        this.sunLight.layers.enable(1)
        this.hemisphericLight.layers.enable(1)

        this.sunLight.layers.enable(1)
        this.sunLight.layers.enable(2)
        this.sunLight.layers.enable(3)

        this.hemisphericLight.layers.enable(1)
        this.hemisphericLight.layers.enable(2)
        this.hemisphericLight.layers.enable(3)

        this.sunLight.target.position.set(-2, 0, 1.5)

        const floor = new Mesh(new BoxGeometry(100, 0.1, 100), new ShadowMaterial({ color: 0xffffff }))
        floor.position.y = -0.05
        floor.receiveShadow = true
        this.scenery.add(this.hemisphericLight, this.sunLight, floor)



         const lightplane = new RectAreaLight(0xffffff, 0.2, 2, 2.3)
        lightplane.position.set(-3, 0, -2.3)
    
        lightplane.rotateY(-Math.PI/2)
        const helper = new RectAreaLightHelper(lightplane)



        this.scenery.add(lightplane,helper);

      /*   const lightplane2 = new RectAreaLight(0xffffff, 3, 2, 2.3)
        const helper = new RectAreaLightHelper(lightplane2)
        lightplane2.position.set(0, 3, 3.3)
        lightplane2.rotateY(-1.4)
      
        this.scenery.add(lightplane2);  */

/*         const backgroundImage = new TextureLoader()
        backgroundImage.load('Assets/BackGround1.jpg', function (texture) {
            texture.

        })
 */
    }


}
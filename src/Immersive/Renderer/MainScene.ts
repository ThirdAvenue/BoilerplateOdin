import {
    BoxGeometry,
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
        console.log(object)
        this.product.add(object)
        
    }
    public addUIElement(object: Object3D) {
        this.uiElements.add(object)
    }
    public addDimensionElement(object: Object3D) {
        this.dimensionElements.add(object)
    }
    private setupScene() {
        this.hemisphericLight = new HemisphereLight(0xfffdf2, 0xfffdf2, 1)
        this.sunLight = new DirectionalLight('#fffdf2', 0.1)
        this.sunLight.position.set(10, 10, 10)
        this.sunLight.target.position.set(0, 0, 0)
        this.sunLight.shadow.radius = 10
        this.sunLight.castShadow = true
        this.sunLight.shadow.bias = -0.00001
        this.sunLight.shadow.normalBias = 0.1
        this.sunLight.shadow.mapSize.width = 4096
        this.sunLight.shadow.mapSize.height = 4096

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


        const lightplane = new RectAreaLight(0xffffff, 2, 2, 2.3)
        lightplane.position.set(-0, 3.1, -3.3)
        lightplane.rotateY(Math.PI/3)
        lightplane.rotateY(Math.PI/2)
        lightplane.rotateY(-Math.PI/9)


        this.scenery.add(lightplane);

        const lightplane2 = new RectAreaLight(0xffffff, 3, 2, 2.3)
        const helper = new RectAreaLightHelper(lightplane2)
        lightplane2.position.set(0, 3, 3.3)
        lightplane2.rotateY(-1.4)
      
        this.scenery.add(lightplane2);

/*         const backgroundImage = new TextureLoader()
        backgroundImage.load('Assets/BackGround1.jpg', function (texture) {
            texture.

        })
 */
    }


}
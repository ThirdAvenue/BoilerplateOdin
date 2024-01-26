import { Renderer } from './Renderer/Renderer'
import { AbstractProductAssembler } from './Abstracts/AbstractProductAssembler'
import { MeshLibrary } from './Libraries/ModelLibrary/meshLibrary'
import { EventDispatcher } from './Renderer/EventDispatcher'
import { MeshInfo } from './Libraries/ModelLibrary/LoadMesh'
import { apiCall } from './Utils/API'
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from "firebase/database";
import { FirebaseStorage, getDownloadURL, getStorage, ref as storageRef } from "firebase/storage";
import { product } from '../product/productX'
import { IntegrationProductAssembler } from '../product/Assemblers/IntegrationProductAssembler'
import { v4 as uuidv4 } from 'uuid'
import { Vector3 } from 'three'


type configuratorType = 'Configurator' | 'Integration' | 'Custom'

export class OdinConfigurator {
    private _renderer!: Renderer
    get renderer(): Renderer {
        return this._renderer
    }
    public typeOfConfigurator: configuratorType = "Integration"
    public productmodel!: product
    public static instance: OdinConfigurator
    public productAssembler!: AbstractProductAssembler | IntegrationProductAssembler
    public meshLibrary!: MeshLibrary
    public debugMode: boolean = true
    public canvas!: HTMLDivElement
    public showWireFrame: boolean = true
    public firebaseapp!: FirebaseApp
    public firebaseStorage!: FirebaseStorage
    public firebasePath!: string
    private _eventDispatcher!: EventDispatcher
    private _product: any
    private meshInfo: MeshInfo[] = []
    private camPos: Vector3 = new Vector3(0, 0, 0)
    private targetPos: Vector3 = new Vector3(0, 0, 0)
    private cameraSettings = []

    constructor() {
        OdinConfigurator.instance = this
        if (this.debugMode === true) {
            this.debugFunctions()
        }

    }

    /**
     * @param assembler The product assembler extending the AbstractProductAssembler
     * @param product product dataModel, impmenting the model interface
     * @param canvasName Name of the Canvas element in the HTML file.
     * @param meshes Information about what meshes need to be loaded and what their names are.
     * @description: Initiates the ImmersiveConfigurator.
     */
    public async init(
        assembler: AbstractProductAssembler | IntegrationProductAssembler,
        id: string,
        canvasName: string,
        meshes: MeshInfo[]
    ): Promise<void> {
        const product = await this.getProductFromDAtabase(id)

        const firebaseConfig = {
            databaseURL: 'https://boilerplate3d-default-rtdb.europe-west1.firebasedatabase.app/',
            storageBucket: 'gs://boilerplate3d.appspot.com'
        };
        this.firebasePath = `${product.customer}/`;

        this.firebaseapp = initializeApp(firebaseConfig);
        const database = getDatabase(this.firebaseapp);
        this.firebaseStorage = getStorage(this.firebaseapp)
        onValue(ref(database, 'slots/'), (snapshot) => { this.modelUpdate(snapshot.val()) })

        await this.setupConfigurator(product)

        this._product = structuredClone(product)
        this.meshLibrary = new MeshLibrary()
        this.productAssembler = assembler
        this._eventDispatcher = new EventDispatcher()
        // create the canvas
        this.canvas = document.querySelector(canvasName) as HTMLDivElement
        await this.createMeshesInfo(product.customer, product.model, 1)
        await this.loadData(product.id, this.meshInfo)
        await this.setUI(product.customer)
        await this.cameraSetup(product.customer)
        this._renderer = new Renderer()
        await this._renderer.mount(this.canvas, this.cameraSettings)
        this.renderer.scene.addProduct(assembler.object)


    }
    /**
     * @param next new model that needs to be loaded. 
     * @description: Updates the model and the productAssembler.
     * @comment function now only returns that the model is changed. This needs to be extended to give the type and model. 

     */
    public async setUI(customer: string) {
        const path = `${customer}/logo.png`;
        getDownloadURL(storageRef(this.firebaseStorage, path)).then((url) => {
            // Create image element
            let dynamicImage = document.createElement('img');
            // Initialize the image source
            dynamicImage.src = url;
            var logo = document.getElementById('logo');
            if (logo) logo.appendChild(dynamicImage);

        })
    }
    public async modelUpdate(product: product) {
        //fill in data 
        //this.productmodel = product
        //this.productAssembler.updateProduct(this.productmodel)
    }

    /**
     * @param type Type of the product that needs to be loaded
     * @param meshes Information of the meshes.
     * @description: Loads the meshes from the meshLibrary and generates the product.
     */
    private async loadData(type: string, meshes: MeshInfo[]): Promise<void> {
        const modeldata = {
            type: 'GLTF',
            data: {
                identifier: type,
                meshInfos: meshes,
            },
        }

        await this.meshLibrary.load(modeldata)
        await this.productAssembler.generateProduct(this._product)
    }
    private async getProductFromDAtabase(id: string) {
        const url: string = "https://firebasestorage.googleapis.com/v0/b/boilerplate3d.appspot.com/o/ProductsDatabase.json?alt=media&token=72b91e58-0d89-4b54-bd94-54c3fd1a2b34";

        const response = await fetch(url);
        const data = await response.json();
        const productData = data.find((product: { id: string }) => product.id === id);
        const productModel = productData?.model;
        const customer = productData?.customer;
        const product: product = {
            id: uuidv4(),
            version: 1.0,
            customer: customer,
            model: productModel,
            rotation: 0,
            position: { x: 0, y: 0, z: 0 }

        }
        //get cameraposition


        this.camPos.set(0, 0, 0)
        this.targetPos.set(0, 0, 0)
        return product

    }
    private async cameraSetup(customer: string) {
        let dataurl = ""
        console.log(OdinConfigurator.instance.firebaseStorage)
        const url = `${customer}/CameraSettings.json`
        console.log(url)
        await getDownloadURL(storageRef(OdinConfigurator.instance.firebaseStorage, url)).then((url) => {
            dataurl = url;
        })
        const response = await fetch(dataurl);
        this.cameraSettings = await response.json();

    }
    private async createMeshesInfo(company: string, name: string, scale: number) {
        this.meshInfo.push({
            company: company,
            name: name,
            scale: scale
        })

    }
    private debugFunctions() {
        document.addEventListener('keydown', async (e) => {
            if (e.code === 'KeyS') {
                console.log(this.renderer.scene)
            }
        })
    }
    private async setupConfigurator(product: product) {
       /*  let dataurl = ""
        console.log(OdinConfigurator.instance.firebaseStorage)
        const url = `${product.customer}/Configuration.json`
        console.log(url)
        await getDownloadURL(storageRef(OdinConfigurator.instance.firebaseStorage, url)).then((url) => {
            dataurl = url;
        })
       

        const response = await fetch(dataurl);
        const configuration = await response.json();
        console.log(configuration)
 */
    }

}

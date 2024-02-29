import { Renderer } from './Renderer/Renderer'
import { AbstractProductAssembler } from './Abstracts/AbstractProductAssembler'
import { MeshLibrary } from './Libraries/ModelLibrary/meshLibrary'
import { EventDispatcher } from './Renderer/EventDispatcher'
import { MeshInfo } from './Libraries/ModelLibrary/LoadMesh'
import { apiCall } from './Utils/API'
import { FirebaseApp, initializeApp } from 'firebase/app';
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import { FirebaseStorage, getDownloadURL, getStorage, ref as storageRef } from "firebase/storage";
import { product, screenConfig, wallConfig } from '../product/controllRoomApp'
import { IntegrationProductAssembler } from '../product/Assemblers/IntegrationProductAssembler'
import { v4 as uuidv4 } from 'uuid'
import { Vector3 } from 'three'
import { IntegrationRenderer } from './Renderer/IntegrationRenderer'


export type configuratorType = 'Configurator' | 'Integration' | 'Custom'

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
    private meshInfo: MeshInfo[] = []
    private camPos: Vector3 = new Vector3(0, 0, 0)
    private targetPos: Vector3 = new Vector3(0, 0, 0)
    private cameraSettings = []
    private wallConfigs: wallConfig[] = []
    private screenConfigs: screenConfig[] = []
    private _product: product = {
        id: uuidv4(),
        version: 1.0,
        customer: "Barco",
        walls: this.wallConfigs,
        screens: this.screenConfigs,
    }
    private firebasedata!: any

    constructor() {
        OdinConfigurator.instance = this
        if (this.debugMode === true) {
            this.debugFunctions()
        }
    }

    /**
     * @param assembler The product assembler extending the AbstractProductAssembler
     * @param firebaseC The firebase configuration link 
     * @param sorageB The firebase storage link
     * @param id: The id of the product that needs to be loaded.
     * @param canvasName Name of the Canvas element in the HTML file.
     * @description: Initiates the ImmersiveConfigurator.
     */
    public async init(
        assembler: AbstractProductAssembler | IntegrationProductAssembler,
        id: string,
        canvasName: string,
        customer: string
    ): Promise<void> {

        //setup firebase
        await this.firebaseSetup(customer)
        //create the product 
        const productData = await this.createProduct()
        //this.createProduct(productData)

        //check info of the configuruator
        this.typeOfConfigurator = "Configurator"

        this.meshLibrary = new MeshLibrary()
        this.productAssembler = assembler
        this._eventDispatcher = new EventDispatcher()
        // create the canvas
        this.canvas = document.querySelector(canvasName) as HTMLDivElement
        //await this.createMeshesInfo(product.customer, product.model, 1)
        await this.loadData(id, this.meshInfo)
        await this.setUI(customer)
        if (this.typeOfConfigurator === "Configurator") {
            await this.cameraSetup(customer)
            this._renderer = new Renderer()
        }
        else this._renderer = new Renderer()
        await this._renderer.mount(this.canvas, this.cameraSettings)
        this.renderer.scene.addProduct(this.productAssembler.object)
        //check if this.preoductAssembler is type of IntegrationProductAssembler
        /*         if (this.productAssembler instanceof IntegrationProductAssembler) {
                    this.renderer.maskScene.add(this.productAssembler.maskObject)
                } */
        //pruduct is loaded, remove loading screen 

        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

    }
    /**
     * @param next new model that needs to be loaded. 
     * @description: Updates the model and the productAssembler.
     * @comment function now only returns that the model is changed. This needs to be extended to give the type and model. 

     */
    public async setUI(customer: string) {
        /*  const path = `${customer}/logo.png`;
         getDownloadURL(storageRef(this.firebaseStorage, path)).then((url) => {
             // Create image element
             let dynamicImage = document.createElement('img');
             // Initialize the image source
             dynamicImage.src = url;
             var logo = document.getElementById('logo');
             if (logo) logo.appendChild(dynamicImage);
 
         }) */
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
        console.log(this._product)
        await this.productAssembler.generateProduct(this._product)
    }

    private async cameraSetup(customer: string) {
        /*  let dataurl = ""
        console.log(OdinConfigurator.instance.firebaseStorage)
        const url = `${customer}/CameraSettings.json`
        await getDownloadURL(storageRef(OdinConfigurator.instance.firebaseStorage, url)).then((url) => {
            dataurl = url;
        })
        const response = await fetch(dataurl); */
        //this.cameraSettings = await response.json(); 

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
            if (e.code === 'KeyC') {
                console.log("changematerial")
                if (this.productAssembler instanceof IntegrationProductAssembler) this.productAssembler.updateMaterial("2")
            }
        })
        window.addEventListener('message', (event) => {
            // Check the origin of the sender to ensure it matches expectations for security
            const data = event.data
            if (data==="rail" && this.productAssembler instanceof IntegrationProductAssembler){this.productAssembler.addOrRemoveRail()}
            else if (this.productAssembler instanceof IntegrationProductAssembler) this.productAssembler.updateMaterial(data)
        });
    }

    private async firebaseSetup(customer: string) {
        const firebaseConfig = {
            databaseURL: "https://barco-controllroom-default-rtdb.europe-west1.firebasedatabase.app",
            storageBucket: "barco-controllroom.appspot.com",
        };
        this.firebaseapp = initializeApp(firebaseConfig);
        const database = getDatabase(this.firebaseapp)

        this.firebaseStorage = getStorage(this.firebaseapp)
        //get data from realtime database

        const wallScreenRef = ref(database, '/WallScreen');
        try {
            // Fetch the initial value using async/await
            const snapshot = await get(wallScreenRef);
            if (snapshot.exists()) {
                console.log('Initial data:', snapshot.val());
                this.firebasedata = snapshot.val()
            } else {
                console.log('No data available');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        // Subscribe to updates
        onValue(wallScreenRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Updated data:', data);
            this.firebasedata = data
            this.updateProduct()
        });

    }
    private async createProduct() {

        const wallconfig : wallConfig = {
            type: this.firebasedata.Type,
            columns: this.firebasedata.column,
            rows: this.firebasedata.row
        }

        this.wallConfigs.push(wallconfig)

    }
    private  updateProduct() {
        this.wallConfigs = []
        this.screenConfigs = []

        const wallconfig : wallConfig = {
            type: this.firebasedata.Type,
            columns: this.firebasedata.column,
            rows: this.firebasedata.row
        }
        this.wallConfigs.push(wallconfig)
        this._product = {
            id: uuidv4(),
            version: 1.0,
            customer: "Barco",
            walls: this.wallConfigs,
            screens: this.screenConfigs,
        }
        console.log(this._product)
        this.productAssembler.updateProduct(this._product)


    }

}

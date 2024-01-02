import { Renderer } from './Renderer/Renderer'
import { AbstractProductAssembler } from './Abstracts/AbstractProductAssembler'
import { MeshLibrary } from './Libraries/ModelLibrary/meshLibrary'
import { EventDispatcher } from './Renderer/EventDispatcher'
import { MeshInfo } from './Libraries/ModelLibrary/LoadMesh'
import { apiCall } from './Utils/API'
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from "firebase/database";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { product } from '../product/productX'

export class ImmersiveConfigurator {
    private _renderer!: Renderer
    get renderer(): Renderer {
        return this._renderer
    }
    public productmodel!: product
    public static instance: ImmersiveConfigurator
    public productAssembler!: AbstractProductAssembler
    public meshLibrary!: MeshLibrary
    public debugMode: boolean = true
    public canvas!: HTMLDivElement
    public showWireFrame: boolean = true
    public firebaseapp!: FirebaseApp
    public firebaseStorage!: FirebaseStorage
    private _eventDispatcher!: EventDispatcher
    private _product: any

    constructor() {
        ImmersiveConfigurator.instance = this
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
        assembler: AbstractProductAssembler,
        product: product,
        canvasName: string,
        meshes: MeshInfo[]
    ): Promise<void> {

        const firebaseConfig = {
            databaseURL: 'https://boilerplate3d-default-rtdb.europe-west1.firebasedatabase.app/',
            storageBucket:'gs://boilerplate3d.appspot.com'
        };

        this.firebaseapp = initializeApp(firebaseConfig);
        const database = getDatabase(this.firebaseapp);
        this.firebaseStorage= getStorage(this.firebaseapp)
        onValue(ref(database, 'slots/'), (snapshot) => { this.modelUpdate(snapshot.val()) })


        this._product = structuredClone(product)
        this.meshLibrary = new MeshLibrary()
        this.productAssembler = assembler
        this._eventDispatcher = new EventDispatcher()
        // create the canvas
        this.canvas = document.querySelector(canvasName) as HTMLDivElement
        this._renderer = new Renderer()
        this._renderer.mount(this.canvas)
        await this.loadData(product.id, meshes)
    }
    /**
     * @param next new model that needs to be loaded. 
     * @description: Updates the model and the productAssembler.
     * @comment function now only returns that the model is changed. This needs to be extended to give the type and model. 

     */
    public async modelUpdate(product: product) {
        console.log(product)
        //fill in data 
        this.productmodel = product
        this.productAssembler.updateProduct(this.productmodel)
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
        this.productAssembler.generateProduct(this._product)
    }
    private debugFunctions() {
        document.addEventListener('keydown', async (e) => {
            if (e.code === 'KeyS') {
                console.log(this.renderer.scene)
            }
        })
    }

}

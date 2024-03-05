import { BoxGeometry, Camera, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, RepeatWrapping, SRGBColorSpace, ShadowMaterial, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MaterialLibrary, OdinConfigurator } from "../../Immersive";
import { getDownloadURL, ref } from "firebase/storage";

export class SceneLoaderMesh {
    public scene!: GLTF
    public camera!: PerspectiveCamera | null
    public products: Mesh[] = []
    public mask!: Mesh
    public railadded: boolean = false

    public async load(url: string, products: string[]): Promise<void> {
        const loader = new GLTFLoader();
        this.scene = await loader.loadAsync(url)
        await this.loadCamera()
        await this.loadProduct(products)
    }
    private async loadCamera() {
        if (this.scene.cameras[0] instanceof PerspectiveCamera) this.camera = this.scene.cameras[0]
    }


    private async loadProduct(products: string[]) {
        console.log(products)
        const curtain1 = products[0]
        const curtain2 = products[1]
        if (products.find((product) => product === "Rail") != undefined) {
            this.railadded = true
        }
        else this.railadded = false
        const material = await MaterialLibrary.get("Vadain1")
        if (material == null) return
        const loader = new TextureLoader();
        let aOmapUrl = ""
        await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}CurtainAO2.jpg`)).then((url) => {
            aOmapUrl = url
        })
        const texture = await loader.loadAsync(aOmapUrl);
        material.aoMap = texture;
        material.aoMap.repeat.x = 1
        material.aoMap.repeat.y = 1

        let textureUrl = ""
        await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}Curtain1_1_Fabric1_d.jpg`)).then((url) => {
            textureUrl = url
        })
        const diffusetexture = await loader.loadAsync(textureUrl);
        diffusetexture.colorSpace = SRGBColorSpace
        material.map = diffusetexture;
        material.map.repeat.x = 1;
        material.map.wrapS = RepeatWrapping;
        material.map.repeat.y = 1;
        material.map.wrapT = RepeatWrapping;
        material.needsUpdate = true

        let textureUrlTrans = ""
        await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}Curtain1_1_Fabric1_a.jpg`)).then((url) => {
            textureUrlTrans = url
        })
        const transtexture = await loader.loadAsync(textureUrlTrans);
        transtexture.colorSpace = SRGBColorSpace
        material.alphaMap = transtexture;
        material.alphaMap.repeat.x = 1;
        material.alphaMap.wrapS = RepeatWrapping;
        material.alphaMap.repeat.y = 1;
        material.alphaMap.wrapT = RepeatWrapping;
        material.needsUpdate = true


        const metalMaterial = await MaterialLibrary.get("AluminiumMaterial2")
        for (const child of this.scene.scene.children) {
            if (child instanceof Mesh) {
                child.material = material
                if (child instanceof Mesh && child.name == curtain2) {
                    this.products.push(child)
                }
                if (child instanceof Mesh && child.name == curtain1) {
                    this.products.push(child)
                }
                if (child instanceof Mesh && child.name == "MDL_Horder" && this.railadded === true) {
                    if (metalMaterial) {
                        this.products.push(child)
                        child.material = metalMaterial
                    }

                }
                /*  if (child instanceof Mesh && child.name === "Mask") {
                     child.material = new MeshBasicMaterial({ opacity: 1 })
                     this.products.push(child)
                 }  */
            }
        }


        //this.scene.scene.traverse((child) => {
        //  if (child instanceof Mesh && child.name == product) {
        /*  child.receiveShadow = false
         child.castShadow = false
         // Check if UV2 exists, if not create it
         if (!child.geometry.attributes.uv2) { child.geometry.setAttribute('uv2', child.geometry.attributes.uv.clone()); }
         // Copy UV1 to UV2
         child.geometry.attributes.uv2.array =  child.geometry.attributes.uv.array.slice()
         // Update the attribute in case it needs to be re-uploaded to the GPU
         child.geometry.attributes.uv2.needsUpdate = true
         child.material = material */
        // this.products.push(child)
        /* }
        if (child instanceof Mesh && child.name === "Mask") {
            //console.log("mask")
            this.products.push(child)
        }
    
       
    }) */
    }
}


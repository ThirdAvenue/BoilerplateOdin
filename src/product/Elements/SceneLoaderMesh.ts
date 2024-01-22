import { BoxGeometry, Camera, Mesh, MeshStandardMaterial, PerspectiveCamera, ShadowMaterial, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MaterialLibrary, OdinConfigurator } from "../../Immersive";
import { getDownloadURL, ref } from "firebase/storage";

export class SceneLoaderMesh {
    public scene!: GLTF
    public camera!: PerspectiveCamera | null
    public products: Mesh[] = []
    public mask!: Mesh

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
        const material = await MaterialLibrary.get("Color1")
        if (material == null) return
        const loader = new TextureLoader();
        let aOmapUrl = ""
        /*     await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}CurtainAO.jpg`)).then((url) => {
                aOmapUrl = url
            }) */
        //const texture = await loader.loadAsync(aOmapUrl);
        // material.map = texture;

        for (const child of this.scene.scene.children) {
            if (child instanceof Mesh) {
                child.material = material
                if (child instanceof Mesh && child.name == "Curtain1") {
                    this.products.push(child)
                }
                if (child instanceof Mesh && child.name == "Curtain2") {
                    this.products.push(child)
                }
                if (child instanceof Mesh && child.name === "Mask") {
                    this.products.push(child)
                }
                console.log(this.products)
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


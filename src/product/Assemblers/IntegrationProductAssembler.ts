import { Camera, Group, LinearSRGBColorSpace, MeshPhysicalMaterial, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, TextureLoader, Vector2, sRGBEncoding } from 'three'
import { AbstractProductAssembler, MaterialLibrary, MeshLibrary, OdinConfigurator, Renderer, model } from '../../Immersive'
import { productMesh } from '../Elements/productMesh'
import { product } from '../productX'
import { getDownloadURL, ref } from 'firebase/storage'
import { SceneLoaderMesh } from '../Elements/SceneLoaderMesh'

export class IntegrationProductAssembler {

    public object: Group = new Group()
    public maskObject: Group = new Group()
    private fabricnr: number = 1
    private addrail: boolean = false
    private curtainType: number = 1
    private camloaded = false;

    public async generateProduct(product: product): Promise<void> {
        //Build the parts, this can be done in a seperate "Buildstrategy but for this demo it is done right here in the assembler"
        await this.buildProduct(product)
        this.updateMaterial(this.fabricnr.toString())
    }
    public async updateProduct(product: product): Promise<void> {
        //clear the object (if you have granual controll: add this)
        /*  this.object.clear()
         await this.buildProduct(product) */
    }
    public async addOrRemoveRail() {
        if (this.addrail === false) this.addrail = true;
        else this.addrail = false;
        this.object.clear()
        this.generateProduct(OdinConfigurator.instance.productmodel)

    }
    public async changeCurtain(type: string) {
        if (type=="curtain2") this.curtainType = 2;
        else this.curtainType = 1;
        this.object.clear()
        this.generateProduct(OdinConfigurator.instance.productmodel)

    }
    public async updateMaterial(data: string) {

        const material = await MaterialLibrary.get("Vadain1")
        this.fabricnr = parseInt(data)
        if (material == null) return
        if (material instanceof MeshPhysicalMaterial) {

            const loader = new TextureLoader();
            
            let textureUrl = ""
            await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}Curtain1_1_Fabric${this.fabricnr}_d.jpg`)).then((url) => {
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
            if (this.fabricnr>2){
                material.map.repeat.x = 5;
                material.map.repeat.y = 5;
            }

            let textureUrlTrans = ""
            await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}Curtain1_1_Fabric${this.fabricnr}_a.jpg`)).then((url) => {
                textureUrlTrans = url
            })
            const transtexture = await loader.loadAsync(textureUrlTrans);
            transtexture.colorSpace = SRGBColorSpace
            material.alphaMap = transtexture;
            material.alphaMap.repeat.x = 1;
            material.alphaMap.wrapS = RepeatWrapping;
            material.alphaMap.repeat.y = 1;
            material.alphaMap.wrapT = RepeatWrapping;
            if (this.fabricnr>2){
                material.alphaMap.repeat.x = 5;
                material.alphaMap.repeat.y = 5;
            }
            //test
            let textureUrlNormal = ""
            await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}Curtain1_1_Fabric${this.fabricnr}_n.jpg`)).then((url) => {
                textureUrlTrans = url
            })
            const normaltexture = await loader.loadAsync(textureUrlNormal);
            normaltexture.colorSpace = SRGBColorSpace
            material.normalMap = normaltexture;
            material.normalMap.repeat.x = 1;
            material.normalMap.wrapS = RepeatWrapping;
            material.normalMap.repeat.y = 1;
            material.normalMap.wrapT = RepeatWrapping;
            material.normalScale = new Vector2(1,1); // affects the scale of the normal
            if (this.fabricnr>2){
                material.normalMap.repeat.x = 5;
                material.normalMap.repeat.y = 5;
            }
        }

    }

    private async buildProduct(product: product): Promise<void> {
        let downloadUrl = ""
        await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}scene.glb`)).then((url) => {
            downloadUrl = url;
        })
        const scene = new SceneLoaderMesh()
        let curtain1 = "Curtain1"
        let curtain2 = "Curtain2"
        if (this.curtainType == 2) {
            curtain1="Curtain3"
            curtain2="Curtain4"
        }

        if (this.addrail == true) await scene.load(downloadUrl, [curtain1, curtain2, "Rail"])
        else await scene.load(downloadUrl, [curtain1, curtain2])

        for (const product of scene.products) {
            if (product.name != "Mask") this.object.add(product)
            //if (product.name === "Mask")this.maskObject.add(product);
        }

        //this.object.add(scene.mask)
        //OdinConfigurator.instance.renderer.maskScene.add(scene.mask)
        if (scene.camera != null && this.camloaded===false) {
            this.object.add(scene.camera)
            Renderer._camera = scene.camera
            this.camloaded=true
        }


    }
}

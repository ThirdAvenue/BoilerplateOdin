import { Camera, Group, LinearSRGBColorSpace, MeshPhysicalMaterial, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, TextureLoader, sRGBEncoding } from 'three'
import { AbstractProductAssembler, MaterialLibrary, MeshLibrary, OdinConfigurator, Renderer, model } from '../../Immersive'
import { productMesh } from '../Elements/productMesh'
import { product } from '../controllRoomApp'
import { getDownloadURL, ref } from 'firebase/storage'
import { SceneLoaderMesh } from '../Elements/SceneLoaderMesh'

export class IntegrationProductAssembler {

    public object: Group = new Group()
    public maskObject: Group = new Group()
    private fabricnr: number = 1

    public async generateProduct(product: product): Promise<void> {
        //Build the parts, this can be done in a seperate "Buildstrategy but for this demo it is done right here in the assembler"
        await this.buildProduct(product)
    }
    public async updateProduct(product: product): Promise<void> {
        //clear the object (if you have granual controll: add this)
        /*  this.object.clear()
         await this.buildProduct(product) */
    }
    public async updateMaterial(data:string) {

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

            let textureUrlTrans = ""
            await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}Curtain1_1_Fabric${this.fabricnr}_a.jpg`)).then((url) => {
                textureUrlTrans = url
           }) 
           const transtexture = await loader.loadAsync(textureUrlTrans);
           transtexture.colorSpace= SRGBColorSpace
           material.alphaMap = transtexture;
           material.alphaMap.repeat.x = 1;
           material.alphaMap.wrapS = RepeatWrapping;
           material.alphaMap.repeat.y = 1;
           material.alphaMap.wrapT = RepeatWrapping;
        }

    }

    private async buildProduct(product: product): Promise<void> {
    
        


    }
}

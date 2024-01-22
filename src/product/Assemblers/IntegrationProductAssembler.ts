import { Camera, Group, LinearSRGBColorSpace, MeshStandardMaterial, SRGBColorSpace, TextureLoader, sRGBEncoding } from 'three'
import { AbstractProductAssembler, MaterialLibrary, MeshLibrary, OdinConfigurator, Renderer, model } from '../../Immersive'
import { productMesh } from '../Elements/productMesh'
import { product } from '../productX'
import { getDownloadURL, ref } from 'firebase/storage'
import { SceneLoaderMesh } from '../Elements/SceneLoaderMesh'

export class IntegrationProductAssembler {

    public object: Group = new Group()

    public async generateProduct(product: product): Promise<void> {
        //Build the parts, this can be done in a seperate "Buildstrategy but for this demo it is done right here in the assembler"
        await this.buildProduct(product)
    }
    public async updateProduct(product: product): Promise<void> {
        //clear the object (if you have granual controll: add this)
       /*  this.object.clear()
        await this.buildProduct(product) */
    }

    private async buildProduct(product: product): Promise<void> {
        let downloadUrl = ""
        console.log('build product')
        await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}scene.glb`)).then((url) => {
            downloadUrl = url;
        })
        const scene = new SceneLoaderMesh()
        await scene.load(downloadUrl, ["Curtain1", "Curtain2"])
        for (const product of scene.products) {
            if (product.name!="Mask") this.object.add(product)
            //if (product.name === "Mask")OdinConfigurator.instance.renderer.scene.addProduct(product);
        }
        //this.object.add(scene.mask)
        //OdinConfigurator.instance.renderer.maskScene.add(scene.mask)
        if (scene.camera != null) {
            this.object.add(scene.camera)
            Renderer._camera = scene.camera
        }


    }
}

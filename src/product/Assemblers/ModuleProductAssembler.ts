import { LinearSRGBColorSpace, Mesh, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, TextureLoader, sRGBEncoding } from 'three'
import { AbstractProductAssembler, MaterialLibrary, MeshLibrary, OdinConfigurator, model } from '../../Immersive'
import { productMesh } from '../Elements/productMesh'
import { product } from '../productX'
import { getDownloadURL, ref } from 'firebase/storage'
import test from 'node:test'

export class ModuleProductAssembler extends AbstractProductAssembler {

    public async generateProduct(product: product): Promise<void> {
        let downloadUrl = ""
        await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}${product.model}_Parts.json`)).then((url) => {
            downloadUrl = url;
        })
        await this.buildProduct(product)
        await this.setMaterial(downloadUrl, product)
    }
    public async updateProduct(product: product): Promise<void> {

        this.object.clear()
        await this.buildProduct(product)
    }

    private async buildProduct(product: product): Promise<void> {
        const material = await MaterialLibrary.get('AluminiumMaterial1')
        const meshData = await MeshLibrary.get(product.model)
        if (material && meshData) {
            for (let i = 0; i < meshData.geometry.length; i++) {
                const mesh = new productMesh(meshData, material, product.rotation, i)
                this.object.add(mesh)
            }
        }
    }
    private async setMaterial(url: string, product: product) {
        //load json from url and create model 
        const response = await fetch(url);
        const data = await response.json();

        for (const model of this.object.children) {
            if (model instanceof Mesh) {
                //find product in data get the index in data 
                console.log(model.name)

                let materialName = data.find((material: { model: string }) => material.model === model.name)?.material;
                console.log(data)
                if (materialName == undefined) { console.log(materialName), materialName = "AluminiumMaterial1", console.log("no material found") }
                const material = await MaterialLibrary.get(materialName)
                const textureMap = data.find((material: { model: string }) => material.model === model.name)?.texture;
                //get the material from the material library
                if (textureMap && textureMap != "None") {
                    let diffuseUrl = ""
                    let bumpUrl = ""
                    await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_d.jpg`)).then((url) => {
                        diffuseUrl = url;
                    })
                    await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_d.jpg`)).then((url) => {
                        bumpUrl = url;
                    })
                    const texture = new TextureLoader().load(diffuseUrl)
                    const bumptexture = new TextureLoader().load(bumpUrl)
                    if (texture && material) {
                        material.map = texture
                        material.bumpMap = bumptexture

                        material.bumpMap.repeat.x = 1;
                        material.map.repeat.x = 1;
                        material.bumpMap.wrapS = RepeatWrapping;
                        material.map.wrapS = RepeatWrapping;
                        material.bumpMap.repeat.y = 1;
                        material.map.repeat.y = 1;
                        material.bumpMap.wrapT = RepeatWrapping;
                        material.map.wrapT = RepeatWrapping;
                        material.needsUpdate = true


                    }
                }
                model.material = material

            }
        }

    }
}

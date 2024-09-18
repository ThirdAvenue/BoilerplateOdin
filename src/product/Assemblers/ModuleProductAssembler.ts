import {
    LinearSRGBColorSpace,
    Mesh,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    RepeatWrapping,
    SRGBColorSpace,
    TextureLoader,
    sRGBEncoding,
} from 'three'
import {
    AbstractProductAssembler,
    MaterialLibrary,
    MeshLibrary,
    OdinConfigurator,
    model,
} from '../../Immersive'
import { productMesh } from '../Elements/productMesh'
import { product } from '../productX'
import { getDownloadURL, ref } from 'firebase/storage'
import test from 'node:test'

export class ModuleProductAssembler extends AbstractProductAssembler {
    public async generateProduct(product: product): Promise<void> {
        let downloadUrl = ''
        await getDownloadURL(
            ref(
                OdinConfigurator.instance.firebaseStorage,
                `${OdinConfigurator.instance.firebasePath}${product.model}_Parts.json`
            )
        ).then((url) => {
            downloadUrl = url
        })
        await this.buildProduct(product)
        await this.setMaterial(downloadUrl, product)
    }
    public async updateProduct(product: product): Promise<void> {
        this.object.clear()
        await this.buildProduct(product)
    }

    private async buildProduct(product: product): Promise<void> {
        console.log(product)
        const material = await MaterialLibrary.get('BasicColor1')
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
        const response = await fetch(url)
        const data = await response.json()
        console.log('data', data)

        for (const model of this.object.children) {
            if (model instanceof Mesh) {
                //find product in data get the index in data
                let materialName = data.find(
                    (material: { model: string }) => material.model === model.name
                )?.material
                if (materialName == undefined) {
                    console.log(materialName),
                        (materialName = 'AluminiumMaterial1'),
                        console.log('no material found')
                }
                const material = await MaterialLibrary.get(materialName)
                const textureMap = data.find(
                    (material: { model: string }) => material.model === model.name
                )?.texture
                //get the material from the material library
                if (model.name === 'logo') {
                    const alphamap = '/Assets/tafel_logo_a.png'
                    const alphaTexture = new TextureLoader().load(alphamap)

                    material!.alphaMap = alphaTexture
                }
                if (model.name === 'tree') {
                    model.castShadow = true
                    const alphamap = '/Assets/tree.png'
                    const alphaTexture = new TextureLoader().load(alphamap)
                    material!.alphaMap = alphaTexture
                    material!.alphaTest = 0.4
                    material!.needsUpdate = true
                    

                }
                if (textureMap && textureMap != 'None') {
                    let diffuseUrl = ''
                    let bumpUrl = ''
                    let specularMap = ''
                    let alphaMap = ''
                    await getDownloadURL(
                        ref(
                            OdinConfigurator.instance.firebaseStorage,
                            `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_d.jpg`
                        )
                    ).then((url) => {
                        diffuseUrl = url
                    })
                    try {
                        bumpUrl = await getDownloadURL(
                            ref(
                                OdinConfigurator.instance.firebaseStorage,
                                `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_b.jpg`
                            )
                        )
                    } catch (error) {
                        console.log('Error fetching bump map')
                    }
                    try {
                        bumpUrl = await getDownloadURL(
                            ref(
                                OdinConfigurator.instance.firebaseStorage,
                                `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_b.jpg`
                            )
                        )
                    } catch (error) {
                        console.log('Error fetching bump map')
                    }
                    try {
                        specularMap = await getDownloadURL(
                            ref(
                                OdinConfigurator.instance.firebaseStorage,
                                `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_s.jpg`
                            )
                        )
                    } catch (error) {
                        console.log('Error fetching spec map')
                    }

                    /* await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_b.jpg`)).then((url) => {
                        bumpUrl = url;
                    }) */
                    /*   await getDownloadURL(ref(OdinConfigurator.instance.firebaseStorage, `${OdinConfigurator.instance.firebasePath}${product.model}_${textureMap}_s.jpg`)).then((url) => {
                        specularMap = url;
                    }) */
                    const texture = new TextureLoader().load(diffuseUrl)
                    const bumptexture = new TextureLoader().load(bumpUrl)
                    const specularTexture = new TextureLoader().load(specularMap)
                    const repeat = data.find(
                        (material: { model: string }) => material.model === model.name
                    )?.repeat
                    console.log(model)

                    if (material) {
                        if (texture) {
                            material.map = texture
                            material.map.repeat.x = repeat.x
                            material.map.repeat.y = repeat.y
                            material.map.wrapS = RepeatWrapping
                            material.map.wrapT = RepeatWrapping
                        }

                        if (bumptexture && material instanceof MeshPhysicalMaterial) {
                            material.bumpMap = bumptexture
                        }
                        if (specularTexture && material instanceof MeshPhysicalMaterial)
                            material.roughnessMap = specularTexture
                        /*                         if (specularTexture && material instanceof(MeshPhysicalMaterial)) {material.metalnessMap = specularTexture}
                         */ /* material.bumpMap = bumptexture
                        
                        material.bumpMap.repeat.x = 1;
                        material.map.repeat.x = 1;
                        material.bumpMap.wrapS = RepeatWrapping;
                        material.map.wrapS = RepeatWrapping;
                        material.bumpMap.repeat.y = 1;
                        material.map.repeat.y = 1;
                        material.bumpMap.wrapT = RepeatWrapping;
                        material.map.wrapT = RepeatWrapping; */
                        material.needsUpdate = true
                    }
                }
                console.log('martial', material)
                model.material = material
            }
        }
    }
}

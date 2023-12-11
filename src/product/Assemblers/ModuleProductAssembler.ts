import { AbstractProductAssembler, MaterialLibrary, MeshLibrary, model } from '../../Immersive'
import { productMesh } from '../Elements/productMesh'
import { product } from '../productX'

export class ModuleProductAssembler extends AbstractProductAssembler {

    public async generateProduct(product: product): Promise<void> {
        //Build the parts, this can be done in a seperate "Buildstrategy but for this demo it is done right here in the assembler"
        await this.buildProduct(product)

    }
    public async updateProduct(product: product): Promise<void> {
        //clear the object (if you have granual controll: add this)
        this.object.clear()
        await this.buildProduct(product)
    }

    private async buildProduct(product: product): Promise<void> {

        const material = await MaterialLibrary.get('AluminiumMaterial1')
        const meshData = await MeshLibrary.get(product.model)

        if (material && meshData) {
            const mesh = new productMesh(meshData, material, product.rotation,)
            this.object.add(mesh)
        }

    }
}

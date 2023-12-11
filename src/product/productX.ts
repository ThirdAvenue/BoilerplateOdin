import { ImmersiveConfigurator, model } from '../Immersive'
import { v4 as uuidv4 } from 'uuid'
import { ProductData } from './MeshData/ProductModel'
import { IVector3 } from '../Immersive/Elements/IVector3'
import { ModuleProductAssembler } from './Assemblers/ModuleProductAssembler'

const assembler = new ModuleProductAssembler()
const configurator = new ImmersiveConfigurator()
export type product = model & {
    model: string
    rotation: number
    position: IVector3
}

const demoProduct: product = {
    id: uuidv4(),
    version: 1.0,
    model: 'CurtainsExample',
    rotation:0,
    position:{x:0,y:0,z:0}
      
}

configurator.init(assembler, demoProduct, '.canvasWindow', ProductData)
configurator.renderer.scene.addProduct(assembler.object)


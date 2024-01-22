import { v4 as uuidv4 } from 'uuid'
import { ProductData } from './MeshData/ProductModel'
import { IVector3 } from '../Immersive/Elements/IVector3'
import { OdinConfigurator, model } from '../Immersive'
import { IntegrationProductAssembler } from './Assemblers/IntegrationProductAssembler'
import { ModuleProductAssembler } from './Assemblers/ModuleProductAssembler'

const assembler = new ModuleProductAssembler()
const configurator = new OdinConfigurator()
configurator.typeOfConfigurator="Configurator"
export type product = model & {
    customer: string
    model: string
    rotation: number
    position: IVector3
}

const demoProduct: product = {
    id: uuidv4(),
    version: 1.0,
    customer: 'VincentSheppard',
    model: 'David_Armchair',
    rotation: 0,
    position: { x: 0, y: 0, z: 0 }

}

configurator.init(assembler, demoProduct, '.canvasWindow', ProductData)


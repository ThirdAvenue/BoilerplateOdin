import { Color, MeshPhysicalMaterial } from 'three'
import { Material, MaterialData } from './MaterialData'
import { MaterialFactory } from './MaterialFactory'

import { XRayMaterial } from './Materials/XRayMaterial'
import { CubeMapClass } from './Environment/CubeMap'
import { color1 } from './Materials/ColorMaterial1'
import { color2 } from './Materials/ColorMaterial2'
import { color3 } from './Materials/ColorMaterial3'
import { AluminiumMaterial1 } from './Materials/AluminiumMaterial1'
import { AluminiumMaterial2 } from './Materials/AluminiumMaterial2'
import { Wood } from './Materials/Wood'
import { FrostedGlassMaterial } from './Materials/FrostedGlassMaterial'
import { GlassMaterial } from './Materials/GlassMaterial'
import { Fabric1 } from './Materials/Fabric1'
import { Wire } from './Materials/wire'
import { BlackPlastic } from './Materials/BlackPlastic'
import { Light } from './Materials/Light'
import { Metal2 } from './Materials/Metal2'
import { Metal1 } from './Materials/Metal1'
import { Aluminium1 } from './Materials/Aluminium1'
import { standard1 } from './Materials/standard1'
import { standard2 } from './Materials/standard2'
import { Vadain1 } from './Materials/Vadain1'

export class MaterialLibrary {
    public static materials: Map<string, Material> = new Map()
    private static materialsData: Record<string, MaterialData> = {
        Color1: color1,
        Color2: color2,
        Color3: color3,
        standard1: standard1,
        standard2: standard2,
        XRayMaterial: XRayMaterial,
        AluminiumMaterial1: AluminiumMaterial1,
        AluminiumMaterial2: AluminiumMaterial2,
        Wood: Wood,
        Vadain1:Vadain1,
        Fabric1:Fabric1,
        Wire:Wire,
        Light:Light,
        Metal1: Metal1,
        Metal2: Metal2,
        BlackPlastic: BlackPlastic,
        FrostedGlassMaterial: FrostedGlassMaterial,
        GlassMaterial: GlassMaterial,
        Aluminium1:Aluminium1,
    }

    static async get(materialName: string) {
        if (MaterialLibrary.materials.has(materialName))
            return Promise.resolve(MaterialLibrary.materials.get(materialName))

        const material: Material = await MaterialFactory.get(this.materialsData[materialName]!)
        MaterialLibrary.materials.set(materialName, material)

        return material
    }

    public static async updateColor(materialName: string, color: string) {
        const material = await MaterialLibrary.get(materialName)
        ;(material as MeshPhysicalMaterial).color = await new Color(color)
    }

    public static async cloneMaterial(materialName: string) {
        let newMaterial

        if (this.materials.has(materialName))
            newMaterial = MaterialLibrary.materials.get(materialName)!.clone()
        else newMaterial = this.get(materialName)
        return newMaterial
    }

    public static updateEnvironment() {
        MaterialLibrary.materials.forEach((material) => {
            if (material.envMap !== undefined) {
                material.envMap = CubeMapClass.cubeMap
            }
        })
    }

    public static remove(materialName: string) {
        if (MaterialLibrary.materials.has(materialName)) {
            MaterialLibrary.materials.delete(materialName)
        }
    }

    public static clear() {
        MaterialLibrary.materials.clear()
    }
}

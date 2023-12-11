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
import { AluminiumMaterial3 } from './Materials/AluminiumMaterial3'
import { FrostedGlassMaterial } from './Materials/FrostedGlassMaterial'
import { GlassMaterial } from './Materials/GlassMaterial'

export class MaterialLibrary {
    public static materials: Map<string, Material> = new Map()
    private static materialsData: Record<string, MaterialData> = {
        Color1: color1,
        Color2: color2,
        Color3: color3,
        XRayMaterial: XRayMaterial,
        AluminiumMaterial1: AluminiumMaterial1,
        AluminiumMaterial2: AluminiumMaterial2,
        AluminiumMaterial3: AluminiumMaterial3,
        FrostedGlassMaterial: FrostedGlassMaterial,
        GlassMaterial: GlassMaterial,
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

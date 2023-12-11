import { MeshPhysicalMaterial, RepeatWrapping, sRGBEncoding } from 'three';
import { TextureLoader } from '../../Utils/TextureLoader';
import { Material, MaterialData } from './MaterialData';

export class MaterialFactory {
  static async get(data: MaterialData): Promise<Material> {
    switch (data.type) {
      case 'MeshPhysicalMaterial':
        return await this.createPhysicalMaterial(data);
      case 'MeshBasicMaterial':
        return await this.createMeshBasicMaterial(data);
      default:
        return await this.createPhysicalMaterial(data);
    }
  }

  private static async createPhysicalMaterial(data: MaterialData) {
    if (data.textures) {
      const textures = await TextureLoader.loadTextures(data.textures);
      Object.entries(textures).forEach((obj) => {
        obj[1].repeat.x = data.size.width;
        obj[1].wrapS = RepeatWrapping;
        obj[1].repeat.y = data.size.height;
        obj[1].wrapT = RepeatWrapping;
        obj[1].encoding = sRGBEncoding;
      });

      const material = new MeshPhysicalMaterial({ ...data.properties, ...textures });
      material.name = data.name;
      material.userData = data.size;

      return material;
    } else {
      const material = new MeshPhysicalMaterial({ ...data.properties });
      material.name = data.name;
      return material;
    }
  }
  private static async createMeshBasicMaterial(data: MaterialData) {
    if (data.textures) {
      const textures = await TextureLoader.loadTextures(data.textures);
      const material = new MeshPhysicalMaterial({ ...data.properties, ...textures });
      material.name = data.name;
      material.userData = data.size;
      return material;
    } else {
      const material = new MeshPhysicalMaterial({ ...data.properties });
      material.name = data.name;
      return material;
    }
  }
}

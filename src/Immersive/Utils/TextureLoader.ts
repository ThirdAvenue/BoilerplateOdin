import { RepeatWrapping, Texture, TextureLoader as Loader } from 'three';

export class TextureLoader {
  private static loader: Loader = new Loader();

  public static async loadTextures(texturesData: { [key: string]: string }) {
    const materialPromises = Object.entries(texturesData).map(([type, url]) => {
      return this.load(url, type);
    });
    const texturesResults = await Promise.all(materialPromises);
    const textures: { [key: string]: Texture } = {};
    texturesResults.forEach((result) => (textures[result.type] = result.texture));
    return textures;
  }

  public static async load(url: string, type: string): Promise<{ type: string; texture: Texture }> {
    return new Promise((resolve) => {
      this.loader.load(url, (texture: Texture) => {
        texture.wrapS = texture.wrapT = RepeatWrapping;
        resolve({ type, texture });
      });
    });
  }
}

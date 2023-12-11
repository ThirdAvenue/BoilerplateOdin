import { CubeTexture } from 'three';
import { EnvironmentMap } from './EnvironmentMaps';

export class CubeMapClass {
  private static _cubeMap?: CubeTexture;
  public static get cubeMap(): CubeTexture {
    if (!this._cubeMap) {
      this._cubeMap = EnvironmentMap.updateMap(EnvironmentMap.currentmap);
    }
    return this._cubeMap;
  }

  public static set cubeMap(v: CubeTexture) {
    this._cubeMap = v;
  }
}

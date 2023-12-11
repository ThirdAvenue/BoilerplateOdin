import { CubeTextureLoader, sRGBEncoding } from 'three';
import { MaterialLibrary } from '../MaterialLibrary';
import { CubeMapClass } from './CubeMap';

const AssetLocation = '';

const EvironmentTextureLocation = '../Assets';

export class EnvironmentMap {
  static currentmap = 1;
static change(event: any) {
    switch (event.type) {
      case 'SWAP':
        CubeMapClass.cubeMap = EnvironmentMap.updateMap(event.data.id);
        CubeMapClass.cubeMap.encoding = sRGBEncoding;
        MaterialLibrary.updateEnvironment();
        EnvironmentMap.currentmap = event.data.id;
        return;
    }
  }

  static updateMap(location = 1) {
    return new CubeTextureLoader()
      .setPath(`${EvironmentTextureLocation}/`)
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
  }
}
export { CubeMapClass };
import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const GlassMaterial: MaterialData = {
  name: 'GlassMaterial',
  type: 'MeshPhysicalMaterial',
  properties: {
    color: 0xadd8e6,
    roughness: 0,
    metalness: 1,
    envMap: CubeMapClass.cubeMap,
    envMapIntensity: 1,
    reflectivity: 0.8,
    opacity: 0.2,
    alphaTest: 0.18,
    thickness: 0.1,
    transparent: true,
    depthWrite: false,
    side: DoubleSide
  },
  size: {
    width: 1,
    height: 1,
  },
};


import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';

export const XRayMaterial: MaterialData = {
  name: 'XRayMaterial',
  type: 'MeshPhysicalMaterial',
  properties: {
    color: 0xadd8e6,
    opacity: 0.3,
    alphaTest: 0.1,
    thickness: 0.1,
    transparent: true,
    side: DoubleSide,
  },
  size: {
    width: 1,
    height: 1,
  },
};

import { DoubleSide } from 'three';
import { MaterialData } from '../MaterialData';

export const color1: MaterialData = {
  name: 'Color1',
  type: 'MeshPhysicalMaterial',
  size: {
    width: 1,
    height: 1,
  },
  textures: {
     //map: '../Assets/1ESSE02011.jpg',
     //alphaMap: '../Assets/Alpha_Test.jpg',
     //aoMap:'../Assets/CurtainAO.jpg'
    // normalMap:''
  },
  properties: {
    color: 0xffffff,
    side: DoubleSide,
    transparent: true,
  },
};


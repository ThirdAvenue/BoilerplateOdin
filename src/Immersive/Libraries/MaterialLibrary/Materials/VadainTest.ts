import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const VadainTest: MaterialData = {
    name: 'VadainTest',
    type: 'MeshPhysicalMaterial',
    properties: {
        color: 0xffffff,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.1, 
        side: DoubleSide,
        transparent: true,
        opacity: 1,
        //metalness: 1
    },
    size: {
        width: 1,
        height: 1,
    },
    textures: {
        //normalMap: '../Assets/YourNormalMap.jpg',
        // normalMap:''
    },
};

//export default FrameMaterial;

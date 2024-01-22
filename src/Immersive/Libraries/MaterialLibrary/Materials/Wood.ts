import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const Wood: MaterialData = {
    name: 'Wood',
    type: 'MeshPhysicalMaterial',
    properties: {
        color: 0xffffff,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.5,
        metalness: 1 
    },
    size: {
        width: 1,
        height: 1,
    },
};

//export default FrameMaterial;

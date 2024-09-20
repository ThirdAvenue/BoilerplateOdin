import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const Wood: MaterialData = {
    name: 'Wood',
    type: 'MeshPhysicalMaterial',
    properties: {
        color: 0x9c9189,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.1,
        reflectivity: 0.2,
        roughness: 1,
        bumpScale:0.3,
    },
    size: {
        width: 5,
        height: 5,
    },
};

//export default FrameMaterial;

import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const AluminiumMaterial2: MaterialData = {
    name: 'AluminiumMaterial2',
    type: 'MeshPhysicalMaterial',
    properties: {
        roughness: 0.3,
        metalness: 0.3,
        color: 0xffffff,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.1,
        transparent: true,
    },
    size: {
        width: 1,
        height: 1,
    },
};

//export default FrameMaterial;

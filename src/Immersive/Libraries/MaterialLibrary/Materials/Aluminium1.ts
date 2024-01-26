import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const Aluminium1: MaterialData = {
    name: 'Aluminium1',
    type: 'MeshPhysicalMaterial',
    properties: {
        roughness: 0.3,
        metalness: 1,
        color: 0xffffff,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.5,
        transparent: true,
    },
    size: {
        width: 1,
        height: 1,
    },
};

//export default FrameMaterial;

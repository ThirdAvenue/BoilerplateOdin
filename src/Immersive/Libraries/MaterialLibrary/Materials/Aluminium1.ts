import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const Aluminium1: MaterialData = {
    name: 'Aluminium1',
    type: 'MeshPhysicalMaterial',
    properties: {
        roughness: 0.224,
        metalness: 1,
        color: 0xa67c00,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 1,
        transparent: true,

        specularcolor: 0xffdc73,
    },
    size: {
        width: 1,
        height: 1,
    },
};

//export default FrameMaterial;

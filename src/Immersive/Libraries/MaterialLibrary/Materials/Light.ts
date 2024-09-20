import { MaterialData } from '../MaterialData';
import { CubeMapClass } from '../Environment/EnvironmentMaps';
import { DoubleSide } from 'three';

export const Light: MaterialData = {
    name: 'Light',
    type: 'MeshPhysicalMaterial',
    properties: {
        //roughness: 0.3,
        //metalness: 1,
        color: 0x808080,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.5,
        side:DoubleSide
    },
    size: {
        width: 1,
        height: 1,
    },
};

//export default FrameMaterial;

import { MaterialData } from '../MaterialData';
import { CubeMapClass } from '../Environment/EnvironmentMaps';
import { DoubleSide } from 'three';

export const Metal1: MaterialData = {
    name: 'Metal1',
    type: 'MeshPhongMaterial',
    properties: {
        color: 0x2e2922,
        shininess:100,
        specular: 0xb09b7f,
        reflectivity: 0.8,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 5,
        side:DoubleSide
    },
    size: {
        width: 1,
        height: 1,
    },
};

//export default FrameMaterial;

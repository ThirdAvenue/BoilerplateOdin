import { MaterialData } from '../MaterialData';
import { CubeMapClass } from '../Environment/EnvironmentMaps';
import { DoubleSide } from 'three';

export const Metal2: MaterialData = {
    name: 'Metal2',
    type: 'MeshPhongMaterial',
    properties: {
        color: 0x7d6f5b,
        shininess:30,
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

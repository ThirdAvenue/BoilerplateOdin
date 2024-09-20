import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const Fabric1: MaterialData = {
    name: 'Fabric1',
    type: 'MeshPhysicalMaterial',
    properties: {
        color: 0xffffff,
       /*  envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.5, */
        metalness: 1 
    },
    textures: {
        map: '../Assets/Curtain1_1_Fabric1_d.jpg',
        //alphaMap: '../Assets/Alpha_Test.jpg',
        //aoMap:'../Assets/CurtainAO.jpg'
       // normalMap:''
     },
    size: {
        width: 5,
        height: 5,
    },
};

//export default FrameMaterial;

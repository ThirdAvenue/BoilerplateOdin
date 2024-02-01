import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const Vadain1: MaterialData = {
    name: 'Vadain1',
    type: 'MeshBasicMaterial',
    properties: {
        color: 0xffffff,
        /* envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.5, */
        side: DoubleSide,
        transparent: true,
        opacity: 1,
        //metalness: 1
    },
    size: {
        width: 5,
        height: 5,
    },
    textures: {
        map: '../Assets/Curtain1_1_Fabric1_d.jpg',
        alphaMap: '../Assets/CurtainTransp.jpg',
        aoMap: '../Assets/CurtainAO.jpg'
        // normalMap:''
    },
};

//export default FrameMaterial;

import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const Vadain1: MaterialData = {
    name: 'Vadain1',
    type: 'MeshBasicMaterial',
    properties: {
        color: 0xffffff,
        envMap: CubeMapClass.cubeMap,
        envMapIntensity: 0.5, 
        side: DoubleSide,
        transparent: true,
        opacity: 1,
        //metalness: 1
    },
    size: {
        width: 3,
        height: 3,
    },
    textures: {
        map: '../Assets/0leCY.jpg',
        alphaMap: '../Assets/CurtainTransp.jpg',
        bumpMap: '../Assets/CurtainTransp.jpg',
        //normalMap: '../Assets/YourNormalMap.jpg',
        // normalMap:''
    },
};

//export default FrameMaterial;

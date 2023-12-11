import { MaterialData } from '../MaterialData';
import { DoubleSide } from 'three';
import { CubeMapClass } from '../Environment/CubeMap';

export const FrostedGlassMaterial: MaterialData = {
    name: 'FrostedGlass',
    type: 'MeshPhysicalMaterial',
    size: {
        width: 300,
        height: 300
    },
    properties: {
        color: 0xadd8e6,
        envMap : CubeMapClass.cubeMap,
        envMapIntensity:1,
        opacity: 0.82,
        metalness: 1,
        roughness: .67,
        transparent: true,
        reflectivity: 0.8,
        depthWrite: false,

    }
};


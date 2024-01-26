import { MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';

export type MaterialData = {
  type: string;
  name: string;
  properties?: { [key: string]: any };
  textures?: { [key: string]: string };
  size: { width: number; height: number };
};

export type Material = MeshStandardMaterial | MeshPhysicalMaterial | MeshPhongMaterial;

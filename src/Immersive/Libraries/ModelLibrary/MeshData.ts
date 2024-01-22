import { BufferGeometry, Group } from 'three';

export class MeshData {
  name = '';
  group!: Group;
  UUID!: number;
  geometry!: BufferGeometry[];
}

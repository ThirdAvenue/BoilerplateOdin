import { BufferGeometry, Group } from 'three';

export class MeshData {
  url = '';
  name = '';
  group!: Group;
  UUID!: number;
  geometry!: BufferGeometry[];
}

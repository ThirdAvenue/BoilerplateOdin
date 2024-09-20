import { BufferGeometry, Mesh, Object3D } from 'three';
import { LoadMesh, MeshInfo } from './LoadMesh';
import { MeshData } from './MeshData';


export interface InputData {
  meshInfos: MeshInfo[];
  identifier: string;
}
export class MeshLibrary {
  public static meshes: MeshData[] = [];
  public async load(event: { type: string; data: InputData }): Promise<void> {
    switch (event.type) {
      case 'GLTF':
        return await this.loadMesh(event);
    }
  }
  private async loadMesh(event: { type: string; data: InputData }) {
    return await Promise.all(
      event.data.meshInfos.map(async (target: MeshInfo) => {
        await LoadMesh.GLTF(target).then((gltf) => {
          const geomArray: BufferGeometry[] = [];
          gltf.traverse((o: Object3D) => {
            if (o.type === 'Mesh') {
              geomArray.push((o as Mesh).geometry);
              geomArray[geomArray.length - 1].name = o.name;

            }
          });
          const meshData: MeshData = {
            group: gltf,
            name: target.name,
            UUID: gltf.id,
            geometry: geomArray,
          };
          MeshLibrary.meshes.push(meshData);
        });
      }),
    ).then((_) => {
      return;
    });
  }
  public static get = async (meshName: string) => {
    const meshIndex = MeshLibrary.meshes.findIndex((mesh) => mesh.name === meshName);
    if (meshIndex !== -1) {
      MeshLibrary.meshes[meshIndex]!.geometry.forEach((element) => {
        element = element.clone();
      });

      return MeshLibrary.meshes[meshIndex];
    }
    return null;
  };
  public static add(data: MeshData) {
    if (MeshLibrary.meshes.find((mesh) => mesh !== data)) {
      MeshLibrary.meshes.push(data);
    }
  }
  public static remove(meshName: string) {
    const meshIndex = MeshLibrary.meshes.findIndex((mesh) => mesh.name === meshName);
    if (meshIndex !== -1) {
      MeshLibrary.meshes[meshIndex]!.group.traverse((o: Object3D) => {
        if (o) (o as Mesh).geometry.dispose();
      });
    }
  }
}

import { LoadingManager } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { ImmersiveConfigurator } from '../../ImmersiveConfigurator';

export interface MeshInfo {
  url: string;
  name: string;
  scale?: number;
}
export class LoadMesh {
  static nrloadedsuccesfully = 0;

  public static async GLTF(data: MeshInfo, manager?: LoadingManager) {

    getDownloadURL(ref(ImmersiveConfigurator.instance.firebaseStorage, 'Cover_Chair/cover_chair.glb')).then((url) => {
      console.log(url)
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
    })


    /* return new GLTFLoader(manager)
      .loadAsync(data.url, (p) => this.progress(p))
      .then((gltf) => this.loadResolve(gltf, data)); */
  }

  private static progress(xhr: ProgressEvent<EventTarget>) {
    if (xhr.loaded / xhr.total === 1) {
      this.nrloadedsuccesfully++;
    }
  }

  static async loadResolve(gltf: GLTF, data: MeshInfo): Promise<THREE.Group> {
    const group = gltf.scene;
    if (data.scale) group.scale.set(data.scale, data.scale, data.scale);
    if (data.name) group.name = data.name;

    group.traverse((e) => {
      e.castShadow = true;
    });

    return group;
  }
}

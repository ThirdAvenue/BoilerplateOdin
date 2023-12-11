import { Color, Mesh, Vector3 } from 'three';
import { Material } from '../../Libraries/MaterialLibrary/MaterialData';
import { Axis } from '../ElementTypes';
import { MeshData } from '../../Libraries/ModelLibrary/MeshData';
import { MaterialLibrary } from '../../Libraries/MaterialLibrary/MaterialLibrary';

export abstract class AbstractImportedMesh extends Mesh {
  public isClickable = false;
  private savedMaterial!: Material;
  public override material!: Material;

  constructor(data: MeshData, material: Material, position: Vector3) {
    super(data.geometry[0]!.clone(), material);
    this.material = material;
    this.updatePosition(position);
    this.castShadow = true;
    this.receiveShadow = true;
    this.matrixAutoUpdate = true;
  }

  public getSize(): Vector3 {
    const size = new Vector3();
    if (this.geometry.boundingBox) this.geometry.boundingBox.getSize(size);

    return size;
  }

  public updatePosition(position: Vector3) {
    if (position === undefined) {
      return;
    }
    position = new Vector3(position.x / 1000, position.y / 1000, position.z / 1000);
    this.position.copy(position);
  }

  public select() {
    this.savedMaterial = this.material;
    this.material = this.material.clone();
    this.material.color = new Color(0x6774a6);
    this.receiveShadow = true;
  }

  public deselect() {
    this.material.dispose();
    this.material = this.savedMaterial;
    this.receiveShadow = true;
  }

  public async updateMaterial(materialName: string) {
    const material = await MaterialLibrary.get(materialName);
    if (material) this.material = material;
    else throw new Error(`Material ${materialName} not found`);
  }

  public cloneElement(geometry = this.geometry) {
    const mesh = new Mesh(geometry, this.material);
    mesh.position.copy(this.position);
    mesh.rotation.copy(this.rotation);
    mesh.scale.copy(this.scale);
    mesh.frustumCulled = false;
    mesh.userData = this.userData;
    mesh.castShadow = this.castShadow;
    mesh.receiveShadow = this.receiveShadow;
    mesh.name = this.name;
    return mesh;
  }
  /**
   * @param width Length of the mesh
   * @param offset Offset for selecting vertices: 0 = x, 1 = y, 2 = z
   * @param axis Axis of to move vertices to
   * @param movelimit optional: skips the vertices that fall within this limit
   * @summary This function is used to update the size of the mesh. It is used for the resize function.
   */
  public async UpdateSize(width: number, offset: number, axis: Axis, movelimit?: number) {
    const attribute = 'position';
    let origSize = 0;
    let pickVertexes: number;
    const vertexcoordinates = this.geometry.attributes[attribute]!.array.length;
    const scaledwidth = (width * 1) / this.scale.x;

    switch (axis) {
      case 'x':
        origSize = this.getSize().x;
        break;
      case 'y':
        origSize = this.getSize().y;
        break;
      case 'z':
        origSize = this.getSize().z;
        break;
    }
    if (movelimit !== undefined) {
      pickVertexes = origSize - movelimit;
    } else pickVertexes = origSize / 2;

    for (let i = 0; i < vertexcoordinates; i += 3) {
      const i3 = i + offset;

      // The Vertex values can be negative, depending on the export of the model (does not matter where it is in the world)

      if (this.geometry.attributes[attribute]!.array[i3]! > 0) {
        const widthDiff = origSize - this.geometry.attributes[attribute]!.array[i3]!;

        if (this.geometry.attributes[attribute]!.array[i3]! >= pickVertexes) {
          (this.geometry.attributes[attribute]!.array[i3]! as number) = scaledwidth - widthDiff;
        }
      } else {
        const widthDiff = origSize + this.geometry.attributes[attribute]!.array[i3]!;

        if (this.geometry.attributes[attribute]!.array[i3]! <= -pickVertexes) {
          (this.geometry.attributes[attribute]!.array[i3]! as number) = -scaledwidth + widthDiff;
        }
      }
    }
    this.geometry.attributes[attribute]!.needsUpdate = true;
    this.geometry.computeBoundingBox();
    this.geometry.computeBoundingSphere();
  }
}

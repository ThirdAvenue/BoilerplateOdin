import { BoxGeometry, Mesh, Vector3 } from "three";
import { Material } from "../../Immersive";

export async function buildBoxMesh(width: number, height: number, depth: number, position: Vector3, material: Material): Promise<Mesh> {
    const boxModel = new BoxGeometry(width, height, depth);
    const boxMesh = new Mesh(boxModel, material);
    boxMesh.position.set(position.x, position.y, position.z);
    return boxMesh
}
export async function buildWireFrame(){
    
}
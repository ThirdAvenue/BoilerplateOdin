import {  AxesHelper, Vector3 } from "three";
import { AbstractImportedMesh, Material, MeshData } from "../../Immersive";


export class productMesh extends AbstractImportedMesh{

    constructor(data: MeshData,material:Material,rotation:number) {
        super(data,material,new Vector3(0,0,0)); 
       // this.add(new AxesHelper(1))
        this.rotation.y = rotation
       //this.UpdateSize(length,2,"x")
    }

}
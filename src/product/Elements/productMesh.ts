import {  AxesHelper, Vector3 } from "three";
import { AbstractImportedMesh, Material, MaterialLibrary, MeshData } from "../../Immersive";


export class productMesh extends AbstractImportedMesh{

    constructor(data: MeshData,material:Material,rotation:number,index:number) {
        super(data,material,new Vector3(0,0,0),index); 
       // this.add(new AxesHelper(1))
       this.scale.set(0.1,0.1,0.1)
        this.rotation.z = rotation
       //this.UpdateSize(length,2,"x")
       this.name = data.geometry[index].name
    }


}
import { v4 as uuidv4 } from 'uuid'
import { ProductData } from './MeshData/ProductModel'
import { IVector3 } from '../Immersive/Elements/IVector3'
import { OdinConfigurator, model } from '../Immersive'
import { IntegrationProductAssembler } from './Assemblers/IntegrationProductAssembler'
import { ModuleProductAssembler } from './Assemblers/ModuleProductAssembler'
export type product = model & {
    customer: string
    walls: wallConfig[]
    screens: screenConfig[]
}
export type wallConfig = {
    type: string;
    columns:number;
    rows:number
}
export type screenConfig= {
    type: string;
    rotation: screenRotation;
    position: number
}
type screenRotation = 'landscape' | 'portrait'
type configuratorType = 'Configurator' | 'Integration' | 'Custom'

const configurator = new OdinConfigurator()
// get Url 
const currentUrl = window.location.href;
const urlParams = new URLSearchParams(new URL(currentUrl).search);
//for debug:  http://localhost:8080/?UserID=12345
let userId = urlParams.get('UserID');
if (userId == null) userId = "None"
const firebaseDataBase = "https://barco-controllroom-default-rtdb.europe-west1.firebasedatabase.app/"
const firebaseStorage = "gs://barco-controllroom.appspot.com"

configurator.init(new ModuleProductAssembler(),firebaseDataBase,firebaseStorage, userId,'.canvasWindow',"Barco")



//buttons 

document.addEventListener('DOMContentLoaded', (event) => {
    var myButton = document.getElementById('myButton');
    if (myButton != null) {
        myButton.addEventListener('click', function () {

        });
    }
}
);


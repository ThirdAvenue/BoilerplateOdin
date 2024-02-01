import { v4 as uuidv4 } from 'uuid'
import { ProductData } from './MeshData/ProductModel'
import { IVector3 } from '../Immersive/Elements/IVector3'
import { OdinConfigurator, model } from '../Immersive'
import { IntegrationProductAssembler } from './Assemblers/IntegrationProductAssembler'
import { ModuleProductAssembler } from './Assemblers/ModuleProductAssembler'
export type product = model & {
    customer: string
    model: string
    rotation: number
    position: IVector3
}
type configuratorType = 'Configurator' | 'Integration' | 'Custom'

const configurator = new OdinConfigurator()
// get Url 
const currentUrl = window.location.href;
const urlParams = new URLSearchParams(new URL(currentUrl).search);
//for debug:  http://localhost:8080/?productID=12345
const productId = urlParams.get('productID');

if (productId) {
    configurator.init(new ModuleProductAssembler(), productId, '.canvasWindow', ProductData)
}

//buttons 

document.addEventListener('DOMContentLoaded', (event) => {
    var myButton = document.getElementById('myButton');
    if (myButton != null) {
        myButton.addEventListener('click', function () {

        });
    }
}
);


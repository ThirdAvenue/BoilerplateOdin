import { PerspectiveCamera, Vector3 } from "three";
import { Renderer } from "./Renderer";

export class WigleCamera extends PerspectiveCamera {

    public test = "test"

    constructor(fov: number, private canvas: HTMLCanvasElement, near: number, far: number, private camPos: Vector3, private targetPos: Vector3) {
        super(fov, canvas.width / canvas.height, near, far)
        this.init()
    }

    private init() {

        this.setPosition()

    }
    private setPosition() {
        this.position.copy(this.camPos)
        this.lookAt(this.targetPos)
    }

    public onMouseMove() {
        let sensitivity = 100;
        // Calculate normalized mouse position (-1 to 1)
        let mouseX = (800 / window.innerWidth) * 2 - 1;
        let mouseY = -(300 / window.innerHeight) * 2 + 1;
        console.log(mouseX, mouseY)
        // Adjust camera position based on mouse position
        // This example only moves the camera along the X-axis
        this.camPos.x += (mouseX - this.camPos.x) / sensitivity;
        this.camPos.y += (mouseY - this.camPos.y) / sensitivity;


    }


}
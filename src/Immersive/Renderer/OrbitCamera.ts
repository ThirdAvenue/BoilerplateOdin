import gsap from 'gsap'
import { Vector3, Spherical, PerspectiveCamera, Event, MathUtils, Object3D, Clock } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Renderer } from './Renderer'
import { Axis } from '../Elements/ElementTypes'

export class OrbitCamera extends PerspectiveCamera {
    private target = new Vector3(0, 1, 1.5)
    private cameraRadiusLimit: [number, number] = [3, 9]
    public controls: OrbitControls
    static CameraQuadrant: number
    private toQuadrant = -1

    private clock: Clock
    private lastMoveTime: number
    private zoomSpeed = 0.8

    //time in seconds until the rotation starts
    private autoMoveTimer = 25

    constructor(fov: number, private canvas: HTMLCanvasElement, near: number, far: number) {
        super(fov, canvas.width / canvas.height, near, far)
        this.controls = new OrbitControls(this, canvas)
        this.controls.zoomSpeed = this.zoomSpeed
        this.init()
        this.clock = new Clock()
        this.clock.start()
        this.controls.autoRotateSpeed = -1
        //initially rotate
        this.lastMoveTime = -this.autoMoveTimer
    }

    private init() {
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.1
        this.controls.maxDistance = 11
        this.controls.enablePan = false
        this.controls.rotateSpeed = 0.2
        this.controls.maxPolarAngle = Math.PI /2.1
        this.goToOrigin(1)
    }


    public autoRotate() {
        if (this.clock.getElapsedTime() - this.lastMoveTime >= this.autoMoveTimer) {
            this.controls.autoRotate = false
        } else {
            this.controls.autoRotate = false
        }
    }

    public setTarget(element: Object3D) {
        const worldPosition = new Vector3().setFromMatrixPosition(element.matrixWorld)
        const offset = new Vector3().copy(worldPosition).sub(new Vector3(0, 1, 0))
        const newPosition = worldPosition.clone().add(offset.normalize().multiplyScalar(5))
        this.moveTo(newPosition, worldPosition, 1)
    }

    public setTargetPosition(vec3: Vector3, duration: number) {
        const offset = new Vector3().copy(vec3).sub(new Vector3(0, 1, 0))
        const newPosition = vec3.clone().add(offset.normalize().multiplyScalar(2))

        this.moveTo(newPosition, vec3, duration)

        this.target = new Vector3()
    }

    public goToOrigin(duration: number) {
        this.snapto(new Vector3(2, 1.2, 3), new Vector3(0, 1, 0))
    }

    public moveTarget(endPosition: Vector3, target: Vector3, duration: number) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const scope = this
        const tl = gsap.timeline()
        tl.to(scope.controls.target, {
            duration: duration,
            ...target,
        })
    }
    public moveTo(endPosition: Vector3, target: Vector3, duration: number) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const scope = this
        const tl = gsap.timeline()
        tl.to(this.position, {
            duration: duration,
            ...endPosition,
            onUpdate: function () {
                scope.lookAt(target)
                scope.controls.target.copy(
                    new Vector3(scope.position.x, scope.controls.target.y, scope.controls.target.z)
                )
            },
            onComplet: function () {},
        })
    }
    public snapto(snapToPos: Vector3, lookat?: Vector3) {
        //xposition needs to be inverted because we flipped the scene
        this.position.set(snapToPos.x * -1, snapToPos.y, snapToPos.z)
        if (lookat) this.controls.target.set(lookat.x * -1, lookat.y, lookat.z)
        this.controls.update()
    }
    public moveCameraForArea(axis: Axis, translate: number) {
        if (axis == 'x') {
            this.position.set(this.position.x - translate, this.position.y, this.position.z)
            this.controls.target.set(
                this.controls.target.x + translate * -1,
                1,
                this.controls.target.z
            )
        }
        if (axis == 'z') {
            this.position.set(this.position.x, this.position.y, this.position.z + translate)
            this.controls.target.set(this.controls.target.x, 1, this.controls.target.z + translate)
        }
    }

    public zoomIn() {
        const offset = new Vector3().copy(this.position).sub(this.target)
        const spherical = new Spherical().setFromVector3(offset)
        spherical.radius *= this.zoomSpeed
        spherical.radius = MathUtils.clamp(
            spherical.radius,
            this.cameraRadiusLimit[0],
            this.cameraRadiusLimit[1]
        )
        offset.setFromSpherical(spherical)
        this.position.copy(this.target).add(offset)
    }

    public zoomOut() {
        const offset = new Vector3().copy(this.position).sub(this.target)
        const spherical = new Spherical().setFromVector3(offset)
        spherical.radius /= this.zoomSpeed
        spherical.radius = MathUtils.clamp(
            spherical.radius,
            this.cameraRadiusLimit[0],
            this.cameraRadiusLimit[1]
        )
        offset.setFromSpherical(spherical)
        this.position.copy(this.target).add(offset)
    }
}

//export default OrbitCamera

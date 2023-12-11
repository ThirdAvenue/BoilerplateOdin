import { Box3, BufferGeometry, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, Object3D, Vector3 } from 'three'
import { model } from './models'
import { ImmersiveConfigurator } from '../ImmersiveConfigurator'
type paramsValue = 'width' | 'height' | 'depth'

export abstract class AbstractProductAssembler {
    protected _object = new Group()
    get object() {
        return this._object
    }
    protected _wireframe: Group = new Group()
    get wireframe() {
        return this._wireframe
    }

    public abstract generateProduct(product: model): void
    public abstract updateProduct(product: model): void
    public destroyAssembler(): void {
        this._object.clear()
    }
    protected _params: Record<paramsValue, number> = {
        width: 0,
        height: 0,
        depth: 0,
    }
    get params() {
        return this._params
    }
    set params(param: Record<paramsValue, number>) {
      this._params = param;
    }

    public dispose() {
        this.object.clear()
    }
    public getSize() {
        const boundingBox = new Box3().setFromObject(this.object)
        const size = boundingBox.getSize(new Vector3())
        return size
    }
    public buildWireFrame(object: Object3D, color = 'Black') {
        this._wireframe.clear()
        if (!ImmersiveConfigurator.instance.showWireFrame) return
        const objectToWireFrame: BufferGeometry[] = []
        const wireColor = new Color(color)
        const material = new LineBasicMaterial({
            color: wireColor,
            linewidth: 50,
            precision: 'highp',
            polygonOffset: true,
            polygonOffsetFactor: 0.3,
        })
        const position = new Vector3()
        if (object instanceof Mesh) {
            const geometry = new EdgesGeometry(object.geometry)
            const wireframeObject = new LineSegments(geometry, material)
            wireframeObject.layers.set(3)
            object.getWorldPosition(position)
            objectToWireFrame.push(object.geometry)
            wireframeObject.rotation.set(object.rotation.x, object.rotation.y, object.rotation.z)
            wireframeObject.position.set(position.x, position.y, position.z)
            wireframeObject.name = 'wireframe'
            this._wireframe.add(wireframeObject)
        }
        if (object instanceof Group) {
            for (const child of object.children) {
                if (child instanceof Mesh) {
                    const geometry = new EdgesGeometry(child.geometry)
                    const wireframeObject = new LineSegments(geometry, material)
                    wireframeObject.layers.set(3)
                    child.getWorldPosition(position)
                    objectToWireFrame.push(child.geometry)
                    wireframeObject.rotation.set(
                        child.rotation.x,
                        child.rotation.y,
                        child.rotation.z
                    )
                    wireframeObject.position.set(position.x, position.y, position.z)
                    wireframeObject.name = 'wireframe'
                    this._wireframe.add(wireframeObject)
                }
            }
        }
        this.object.add(this.wireframe)
        console.log(this.object)
    }
    
}

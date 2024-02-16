import { Group, Mesh, Vector3 } from 'three'
import { AbstractProductAssembler, MaterialLibrary, MeshLibrary, OdinConfigurator, model } from '../../Immersive'
import { productMesh } from '../Elements/productMesh'
import { buildBoxMesh } from '../Utils/buildBoxMesh'
import { product } from '../controllRoomApp'
import { getSizeScreen, getWallPieces } from '../../partsModel/Builders/videoWall'

export class ModuleProductAssembler extends AbstractProductAssembler {

    private wall!: Mesh;
    private product!: Group

    private typeOfScreen = "test1"
    private rows = 3
    private columns = 1

    public wallWidth = 5
    public wallHeight = 3
    public wallDepth = 0.3
    private screenFromGround = 0.3
    private totalScreenSize = { width: 0, height: 0, depth: 0 }
    private screenGap = 0.01


    public async generateProduct(product: product): Promise<void> {
        console.log(product)
        //just as a test 
        this.typeOfScreen = product.walls[0].type
        this.rows = product.walls[0].rows
        this.columns = product.walls[0].columns



        await this.buildProduct()
        await this.buildWall()
        this.buildWireFrame(this.object, "#d1d1d1")


    }
    public async updateProduct(product: product): Promise<void> {

        this.object.clear()
        await this.generateProduct(product)

    }


    private async buildWall() {
        const material = await MaterialLibrary.get('BasicColor2')
        const wallWidthOvershoot = 2
        const wallHeightOvershoot = 1
        this.buildWallSize()

        if (material) {
            const wallMesh = await buildBoxMesh(this.wallWidth, this.wallHeight, this.wallDepth, new Vector3(0, this.wallHeight / 2, -this.wallDepth / 2), material)
            wallMesh.receiveShadow = true
            wallMesh.castShadow = true
            this.object.add(wallMesh)
        }
    }
    private async buildProduct(): Promise<void> {
        const screenType = this.typeOfScreen
        const rows: number = this.rows
        const columns: number = this.columns
        const material = await MaterialLibrary.get('BasicColor1')
        const screenPositions = await getWallPieces(rows, columns, screenType)
        const screenSize = await getSizeScreen(screenType)
        const totalScreen = new Group()
        this.totalScreenSize = {

            width: screenSize.width * rows,
            height: screenSize.height * columns,
            depth: screenSize.depth
        }
        let screenHeightPlacement = this.screenFromGround
        if (this.totalScreenSize.height < 2) { screenHeightPlacement = 1.5 - this.totalScreenSize.height / 2 }


        if (material) {
            for (let i = 0; i < screenPositions.length; i++) {
                const screen = await buildBoxMesh(screenSize.width - this.screenGap, screenSize.height - this.screenGap, screenSize.depth, new Vector3(screenPositions[i].x, screenPositions[i].y + screenHeightPlacement, screenPositions[i].z), material)
                totalScreen.add(screen)
            }
        }
        this.object.add(totalScreen)
        this.totalScreenSize = {

            width: screenSize.width * rows,
            height: screenSize.height * columns,
            depth: screenSize.depth
        }

    }
    private async buildWallSize() {
        const wallWidthOvershoot = 2
        const wallHeightOvershoot = 1

        this.wallWidth = this.totalScreenSize.width + wallWidthOvershoot
        this.wallHeight = this.totalScreenSize.height + wallHeightOvershoot

        if (this.wallHeight < 3) {
            this.wallHeight = 3
        }
        if (this.wallWidth < 5) {
            this.wallWidth = 5
        }
    }

}

import { Vector3 } from "three"

export type screenSize = {
    width: number
    height: number
    depth: number
}


export async function getWallPieces(row: number, column: number, screenType: string) {

    const size = await getSizeScreen(screenType)
    const screenPositions: Vector3[] = []

    const rowPositions = await getrowposition(row, size.width)
    const columnPositions = await getcolumnposition(column, size.height)

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            screenPositions.push(new Vector3(rowPositions[i], columnPositions[j], 0))
        }
    }

    return screenPositions
}
async function getrowposition(row: number, screenwidth: number) {
    const totalwidth = row * screenwidth
    const rowPositions: number[] = []
    for (let i = 0; i < row; i++) {
        rowPositions.push(-totalwidth / 2 + screenwidth / 2 + screenwidth * i)
    }
    return rowPositions

}
async function getcolumnposition(column: number, screenHeight: number) {
    const totalheight = column * screenHeight
    const columnPositions: number[] = []
    for (let i = 0; i < column; i++) {
        columnPositions.push(screenHeight/2+screenHeight* i)
    }
    return columnPositions

}
export async function getSizeScreen(type: string) {
    let size: screenSize = {
        width: 1.2,
        height: 0.8,
        depth: 0.01
    }

    if (type === "test1") {
        size = {
            width: 1,
            height: 0.6,
            depth: 0.01
        }
    }
    if (type === "test2") {
        size = {
            width: 1.6,
            height: 0.9,
            depth: 0.01
        }
    }
    return size


}
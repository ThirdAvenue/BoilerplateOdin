
export type IVector3 = {
  x: number;
  y: number;
  z: number;
};

export function vector3Eq(v1: IVector3, v2: IVector3): boolean {
  return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
}

export function vector3Clone(v: IVector3): IVector3 {
  return {
    x: v.x,
    y: v.y,
    z: v.z,
  };
}

export function Vector3ToString(v: IVector3): string {
  return `{x: ${v.x}, y: ${v.y}, z: ${v.z}}`;
}
import {
  Scene,
  TransformNode,
  MeshBuilder,
  Vector3,
  Color3,
} from '@babylonjs/core';
import { makeTextPlane } from './makeTextPlane';

/** 로컬 좌표계 생성 */
export const localAxes = (
  size: number,
  scene: Scene,
  hasAxisLabel?: boolean,
) => {
  const local_origin = new TransformNode('local_origin', scene, true);

  /*  라인 경로를 통해 화살표 모양 드로잉 */
  // X 좌표계 라인.
  const local_axisX = MeshBuilder.CreateLines('local_axisX', {
    points: [
      Vector3.Zero(), //시작점
      new Vector3(size, 0, 0), // 길이 끝점
      new Vector3(size * 0.95, 0.05 * size, 0), // 화살표 깃
      new Vector3(size, 0, 0), // 길이 끝점
      new Vector3(size * 0.95, -0.05 * size, 0), // 화살표 깃
    ],
  });
  local_axisX.color = new Color3(1, 0, 0);
  if (hasAxisLabel) {
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(size, -0.05 * size, 0);
    xChar.parent = local_axisX;
  }

  // Y 좌표계 라인
  const local_axisY = MeshBuilder.CreateLines('local_axisX', {
    points: [
      Vector3.Zero(), //시작점
      new Vector3(0, size, 0), // 길이 끝점
      new Vector3(0, size * 0.95, 0.05 * size), // 화살표 깃
      new Vector3(0, size, 0), // 길이 끝점
      new Vector3(0, size * 0.95, -0.05 * size), // 화살표 깃
    ],
  });
  local_axisY.color = new Color3(0, 1, 0);
  if (hasAxisLabel) {
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, size, -0.05 * size);
    yChar.parent = local_axisY;
  }

  // Z 좌표계 라인
  const local_axisZ = MeshBuilder.CreateLines('local_axisX', {
    points: [
      Vector3.Zero(), //시작점
      new Vector3(0, 0, size), // 길이 끝점
      new Vector3(0, 0.05 * size, size * 0.95), // 화살표 깃
      new Vector3(0, 0, size), // 길이 끝점
      new Vector3(0, -0.05 * size, size * 0.95), // 화살표 깃
    ],
  });
  local_axisZ.color = new Color3(0, 0, 1);
  if (hasAxisLabel) {
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, size);
    zChar.parent = local_axisZ;
  }

  local_axisX.parent = local_origin;
  local_axisY.parent = local_origin;
  local_axisZ.parent = local_origin;

  return local_origin;
};

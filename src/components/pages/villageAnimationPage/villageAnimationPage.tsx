import React from 'react';
import SceneComponent from 'babylonjs-hook';
import * as BABYLON from '@babylonjs/core';

const VillageAnimationPage = () => {
  /** 텍스트 택스처 생성 */
  const makeTextPlane = (
    text: string,
    color: string,
    size: number,
    scene?: BABYLON.Scene,
  ) => {
    // 텍스트 텍스처 생성
    // 두번째 인자 : canvas | {width:number, height:number} |  number(width, height 크기)
    const dynamicTexture = new BABYLON.DynamicTexture(
      'DynamicTexture',
      50,
      scene ?? null,
      false,
    );
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
      text,
      5,
      40,
      'bold 36px Arial',
      color,
      'transparent',
      true,
    );

    // Material 생성. 텍스처 적용을 위함
    const standartMaterial = new BABYLON.StandardMaterial(
      'TextPlaneMaterial',
      scene,
    );
    standartMaterial.backFaceCulling = false;
    standartMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    standartMaterial.diffuseTexture = dynamicTexture;

    // plane Mesh 생성
    const plane = BABYLON.MeshBuilder.CreatePlane(
      'TextPlane',
      { size, updatable: true },
      scene,
    );
    plane.material = standartMaterial;

    return plane;
  };

  /** 로컬 좌표계 생성 */
  const localAxes = (
    size: number,
    scene: BABYLON.Scene,
    hasAxisLabel?: boolean,
  ) => {
    const local_origin = new BABYLON.TransformNode('local_origin', scene, true);

    /*  라인 경로를 통해 화살표 모양 드로잉 */
    // X 좌표계 라인.
    const local_axisX = BABYLON.MeshBuilder.CreateLines('local_axisX', {
      points: [
        BABYLON.Vector3.Zero(), //시작점
        new BABYLON.Vector3(size, 0, 0), // 길이 끝점
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), // 화살표 깃
        new BABYLON.Vector3(size, 0, 0), // 길이 끝점
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0), // 화살표 깃
      ],
    });
    local_axisX.color = new BABYLON.Color3(1, 0, 0);
    if (hasAxisLabel) {
      const xChar = makeTextPlane('X', 'red', size / 10);
      xChar.position = new BABYLON.Vector3(size, -0.05 * size, 0);
      xChar.parent = local_axisX;
    }

    // Y 좌표계 라인
    const local_axisY = BABYLON.MeshBuilder.CreateLines('local_axisX', {
      points: [
        BABYLON.Vector3.Zero(), //시작점
        new BABYLON.Vector3(0, size, 0), // 길이 끝점
        new BABYLON.Vector3(0, size * 0.95, 0.05 * size), // 화살표 깃
        new BABYLON.Vector3(0, size, 0), // 길이 끝점
        new BABYLON.Vector3(0, size * 0.95, -0.05 * size), // 화살표 깃
      ],
    });
    local_axisY.color = new BABYLON.Color3(0, 1, 0);
    if (hasAxisLabel) {
      const yChar = makeTextPlane('Y', 'green', size / 10);
      yChar.position = new BABYLON.Vector3(0, size, -0.05 * size);
      yChar.parent = local_axisY;
    }

    // Z 좌표계 라인
    const local_axisZ = BABYLON.MeshBuilder.CreateLines('local_axisX', {
      points: [
        BABYLON.Vector3.Zero(), //시작점
        new BABYLON.Vector3(0, 0, size), // 길이 끝점
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95), // 화살표 깃
        new BABYLON.Vector3(0, 0, size), // 길이 끝점
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95), // 화살표 깃
      ],
    });
    local_axisZ.color = new BABYLON.Color3(0, 0, 1);
    if (hasAxisLabel) {
      const zChar = makeTextPlane('Z', 'blue', size / 10);
      zChar.position = new BABYLON.Vector3(0, 0.05 * size, size);
      zChar.parent = local_axisZ;
    }

    local_axisX.parent = local_origin;
    local_axisY.parent = local_origin;
    local_axisZ.parent = local_origin;

    return local_origin;
  };

  const onSceneReady = (scene: BABYLON.Scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 4,
      Math.PI / 4,
      15,
      new BABYLON.Vector3(0, 0, 0),
      scene,
    );
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(1, 1, 0),
    );
    const light2 = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(-1, -1, 0),
    );

    /* 육면체 면 색상 설정*/
    const faceColors: BABYLON.Color4[] = [];
    // Z 방향 면
    faceColors[0] = new BABYLON.Color4(
      BABYLON.Color3.Blue().r,
      BABYLON.Color3.Blue().g,
      BABYLON.Color3.Blue().b,
      1,
    );
    faceColors[1] = new BABYLON.Color4(
      BABYLON.Color3.Teal().r,
      BABYLON.Color3.Teal().g,
      BABYLON.Color3.Teal().b,
      1,
    );
    // X 방향 면
    faceColors[2] = new BABYLON.Color4(
      BABYLON.Color3.Red().r,
      BABYLON.Color3.Red().g,
      BABYLON.Color3.Red().b,
      1,
    );
    faceColors[3] = new BABYLON.Color4(
      BABYLON.Color3.Purple().r,
      BABYLON.Color3.Purple().g,
      BABYLON.Color3.Purple().b,
      1,
    );
    // Y 방향 면
    faceColors[4] = new BABYLON.Color4(
      BABYLON.Color3.Green().r,
      BABYLON.Color3.Green().g,
      BABYLON.Color3.Green().b,
      1,
    );
    faceColors[5] = new BABYLON.Color4(
      BABYLON.Color3.Yellow().r,
      BABYLON.Color3.Yellow().g,
      BABYLON.Color3.Yellow().b,
      1,
    );

    // 부모 박스
    const boxParent = BABYLON.MeshBuilder.CreateBox('Box', {
      faceColors: faceColors,
    });

    // 자식 박스
    const boxChild = BABYLON.MeshBuilder.CreateBox('Box', {
      size: 0.5,
      faceColors: faceColors,
    });
    boxChild.setParent(boxParent);
    boxChild.position.x = 0;
    boxChild.position.y = 2;
    boxChild.position.z = 0;

    boxChild.rotation.x = Math.PI / 4;
    boxChild.rotation.y = Math.PI / 4;
    boxChild.rotation.z = Math.PI / 4;

    boxParent.position.x = 2;
    boxParent.position.y = 0;
    boxParent.position.z = 0;

    boxParent.rotation.x = 0;
    boxParent.rotation.y = 0;
    boxParent.rotation.z = -Math.PI / 4;

    localAxes(6, scene, true);
    // 로컬 좌표계
    const boxChildAxes = localAxes(1, scene, true);
    boxChildAxes.parent = boxChild;

    const boxParentAxes = localAxes(1, scene, true);
    boxParentAxes.parent = boxParent;
  };

  return (
    <SceneComponent
      onSceneReady={onSceneReady}
      id={'canvas-build-a-village'}
      width={'1280'}
      height={'720'}
    />
  );
};

export default VillageAnimationPage;

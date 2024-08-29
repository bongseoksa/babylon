import React from 'react';
import SceneComponent from 'babylonjs-hook';
import * as BABYLON from '@babylonjs/core';
import earcut from 'earcut';

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

  /** 차 몸체 생성 */
  const buildCar = (scene: BABYLON.Scene) => {
    // base;
    const outline = [
      new BABYLON.Vector3(-0.3, 0, -0.1),
      new BABYLON.Vector3(0.2, 0, -0.1),
    ];

    //curved front
    for (let i = 0; i < 20; i++) {
      outline.push(
        new BABYLON.Vector3(
          0.2 * Math.cos((i * Math.PI) / 40),
          0,
          0.2 * Math.sin((i * Math.PI) / 40) - 0.1,
        ),
      );
    }

    //top
    outline.push(new BABYLON.Vector3(0, 0, 0.1));
    outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

    //face UVs
    const faceUV: BABYLON.Vector4[] = [];
    faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
    faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
    faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

    //material
    const carMat = new BABYLON.StandardMaterial('carMat');
    carMat.diffuseTexture = new BABYLON.Texture(
      'https://assets.babylonjs.com/environments/car.png',
    );

    const car = BABYLON.MeshBuilder.ExtrudePolygon(
      'car',
      {
        shape: outline,
        depth: 0.2,
        faceUV: faceUV,
        wrap: true,
      },
      scene,
      earcut,
    );
    car.material = carMat;

    return car;
  };

  const buildWheel = (scene: BABYLON.Scene, parent?: BABYLON.Mesh) => {
    const wheelUV: BABYLON.Vector4[] = [];
    wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    const wheelMat = new BABYLON.StandardMaterial('wheelMat');
    wheelMat.diffuseTexture = new BABYLON.Texture(
      'https://assets.babylonjs.com/environments/wheel.png',
    );

    const wheel = BABYLON.MeshBuilder.CreateCylinder('wheelRB', {
      diameter: 0.125,
      height: 0.05,
      faceUV: wheelUV,
    });
    if (parent) {
      wheel.parent = parent;
    }
    wheel.position.z = -0.1;
    wheel.position.x = -0.2;
    wheel.position.y = 0.035;
    wheel.material = wheelMat;

    //Animate the Wheels
    const animWheel = new BABYLON.Animation(
      'wheelAnimation',
      'rotation.y',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const wheelKeys: { frame: number; value: number }[] = [];
    wheelKeys.push({ frame: 0, value: 0 }); // 0 프레임에 회전0
    wheelKeys.push({ frame: 30, value: 2 * Math.PI }); // 30프레임에 1바퀴 회전

    animWheel.setKeys(wheelKeys);

    wheel.animations = [];
    wheel.animations.push(animWheel);

    return wheel;
  };

  const onSceneReady = (scene: BABYLON.Scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      3,
      new BABYLON.Vector3(0, 0, 0),
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 10; // zoom 속도 조절. 값이 커질수록 느려짐
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(1, 1, 0),
    );

    localAxes(6, scene, true);

    const car = buildCar(scene);
    car.rotation.x = -Math.PI / 2;

    const wheelRB = buildWheel(scene, car);
    const wheelRF = wheelRB.clone('wheelRF');
    wheelRF.position.x = 0.1;
    const wheelLB = wheelRB.clone('wheelLB');
    wheelLB.position.y = -0.2 - 0.035;
    const wheelLF = wheelRF.clone('wheelLF');
    wheelLF.position.y = -0.2 - 0.035;

    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
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

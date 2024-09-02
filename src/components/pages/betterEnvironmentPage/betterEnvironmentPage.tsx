import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  AbstractMesh,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  Vector3,
  Animation,
} from '@babylonjs/core';
import { createScene } from '@/utils/createScene';
import '@babylonjs/loaders';
import { buildDwellings, buildCar } from '@/utils/builds';
import { buildSkybox } from '@/utils/builds/buildSkybox';
import { Trees } from '../_fragments/trees';
import { UFOs } from '../_fragments/ufo';

const BetterEnvironmentPage = () => {
  const runWheelAnimation = (scene: Scene, car: Mesh) => {
    const meshes = car.getChildMeshes();
    meshes.map((wheel) => {
      scene.beginAnimation(wheel, 0, 30, true);
    });
  };

  const runCarAnimation = (scene: Scene) => {
    const animCar = new Animation(
      'carAnimation',
      'position.z',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const carKeys: { frame: number; value: number }[] = [];
    carKeys.push({ frame: 0, value: 8 });
    carKeys.push({ frame: 150, value: -7 });
    carKeys.push({ frame: 200, value: -7 });
    animCar.setKeys(carKeys);

    const car: AbstractMesh = scene.getMeshByName('car') as AbstractMesh;
    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);
  };

  const onSceneReady = async (scene: Scene) => {
    const skybox = buildSkybox(scene);
    const { canvas, camera, light } = createScene(scene);
    camera.upperBetaLimit = Math.PI / 2.2;

    const trees = Trees(scene);
    const ufos = UFOs(scene);

    // // 실제 작업할 맵
    // const groundMat = new StandardMaterial('groundMat');
    // groundMat.diffuseTexture = new Texture(
    //   'https://assets.babylonjs.com/environments/villagegreen.png',
    // );
    // groundMat.diffuseTexture.hasAlpha = true;

    // // 디자인을 위한 보여주기용 큰 맵
    // const largeGroundMat = new StandardMaterial('largeGroundMat');
    // largeGroundMat.diffuseTexture = new Texture(
    //   'https://assets.babylonjs.com/environments/valleygrass.png',
    // );

    // const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    //   'largeGround',
    //   'https://assets.babylonjs.com/environments/villageheightmap.png',
    //   {
    //     width: 150,
    //     height: 150,
    //     subdivisions: 20, // 지형 그리드 세분화 정도
    //     minHeight: 0,
    //     maxHeight: 10,
    //   },
    // );
    // largeGround.material = largeGroundMat;
    // largeGround.position.y = -0.01; // 맵이 겹쳐서 발생하는 blink 현상 방지

    // buildDwellings();

    /* 동적 로드 */
    SceneLoader.ImportMeshAsync(
      '',
      'https://assets.babylonjs.com/meshes/',
      'valleyvillage.glb',
      scene,
      null,
      '.glb',
    );

    /* ----- Car ----- */
    // const car = buildCar(scene);
    // car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
    // car.rotation = new Vector3(-Math.PI / 2, Math.PI, -Math.PI / 2);
    // car.position.y = 0.16;
    // car.position.x = 3;
    // car.position.z = 8;

    // runWheelAnimation(scene, car);
    // runCarAnimation(scene);

    /** 동적 로드 */
    const carLoaderResult = await SceneLoader.ImportMeshAsync(
      '',
      'https://assets.babylonjs.com/meshes/',
      'car.glb',
    );
    const car = scene.getMeshByName('car') as Mesh;
    car.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
    car.position.y = 0.16;
    car.position.x = -3;
    car.position.z = 8;

    const animCar = new Animation(
      'carAnimation',
      'position.z',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const carKeys = [];

    carKeys.push({
      frame: 0,
      value: 10,
    });

    carKeys.push({
      frame: 200,
      value: -15,
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);
    const wheelRB = scene.getMeshByName('wheelRB');
    const wheelRF = scene.getMeshByName('wheelRF');
    const wheelLB = scene.getMeshByName('wheelLB');
    const wheelLF = scene.getMeshByName('wheelLF');

    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
  };

  return (
    <SceneComponent
      onSceneReady={onSceneReady}
      id={'canvas-better-environment'}
      width={'1280'}
      height={'720'}
    />
  );
};

export default BetterEnvironmentPage;

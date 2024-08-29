import React from 'react';
import SceneComponent from 'babylonjs-hook';
import * as BABYLON from '@babylonjs/core';
import { buildDwellings } from '@/utils/builds';
import { createScene } from '@/utils/createScene';
import { localAxes } from '@/utils/localAxes';
import { buildCar } from '@/utils/builds';

const VillageAnimationPage = () => {
  const runWheelAnimation = (scene: BABYLON.Scene, car: BABYLON.Mesh) => {
    const meshes = car.getChildMeshes();
    meshes.map((wheel) => {
      scene.beginAnimation(wheel, 0, 30, true);
    });
  };

  const runCarAnimation = (scene: BABYLON.Scene) => {
    const animCar = new BABYLON.Animation(
      'carAnimation',
      'position.z',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const carKeys: { frame: number; value: number }[] = [];
    carKeys.push({ frame: 0, value: 8 });
    carKeys.push({ frame: 150, value: -7 });
    carKeys.push({ frame: 200, value: -7 });
    animCar.setKeys(carKeys);

    const car: BABYLON.AbstractMesh = scene.getMeshByName(
      'car',
    ) as BABYLON.AbstractMesh;
    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);
  };

  const onSceneReady = async (scene: BABYLON.Scene) => {
    const { canvas, camera, light } = createScene(scene);
    camera.wheelPrecision = 10;
    localAxes(6, scene, true);

    const village = buildDwellings();

    const car = buildCar(scene);
    car.rotation = new BABYLON.Vector3(-Math.PI / 2, Math.PI, -Math.PI / 2);
    car.position.y = 0.16;
    car.position.x = 3;
    car.position.z = 8;

    runWheelAnimation(scene, car);
    runCarAnimation(scene);

    const dudeLoaderResult: BABYLON.ISceneLoaderAsyncResult =
      await BABYLON.SceneLoader.ImportMeshAsync(
        'him',
        '/assets/dude/scenes/',
        'Dude.babylon',
        scene,
      );
    var dude = dudeLoaderResult.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.25, 0.25, 0.25);
    scene.beginAnimation(dudeLoaderResult.skeletons[0], 0, 100, true, 1.0);
  };

  return (
    <SceneComponent
      onSceneReady={onSceneReady}
      id={'canvas-village-animation'}
      width={'1280'}
      height={'720'}
    />
  );
};

export default VillageAnimationPage;

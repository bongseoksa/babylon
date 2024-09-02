import React from 'react';
import SceneComponent from 'babylonjs-hook';
import { Mesh, Scene, SceneLoader, Vector3, Animation } from '@babylonjs/core';
import { createScene } from '@/utils/createScene';
import '@babylonjs/loaders';
import { buildSkybox } from '@/utils/builds/buildSkybox';
import { Trees } from './_fragments/trees';

const ParticleFountainPage = () => {
  const onSceneReady = async (scene: Scene) => {
    const skybox = buildSkybox(scene);
    const { canvas, camera, light } = createScene(scene);
    camera.upperBetaLimit = Math.PI / 2.2;

    const trees = Trees(scene);
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

export default ParticleFountainPage;

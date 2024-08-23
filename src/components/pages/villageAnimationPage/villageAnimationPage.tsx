import React from 'react';
import SceneComponent from 'babylonjs-hook';
import * as BABYLON from '@babylonjs/core';

const VillageAnimationPage = () => {
  const onSceneReady = (scene: BABYLON.Scene) => {
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      15,
      new BABYLON.Vector3(0, 0, 0),
    );
    const canvas = scene.getEngine().getRenderingCanvas();
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(1, 1, 0),
    );

    BABYLON.SceneLoader.ImportMeshAsync(
      '',
      'https://assets.babylonjs.com/meshes/',
      'both_houses_scene.babylon',
    ).then((result) => {
      const house1 = scene.getMeshByName(
        'detached_house',
      ) as BABYLON.AbstractMesh;
      house1.position.y = 2;
      const house2 = result.meshes[2];
      house2.position.y = 1;
    });
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

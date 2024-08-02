import React from 'react';
import SceneComponent from '@/components/sceneComponent';
import {
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from '@babylonjs/core';

const BuildVillage = () => {
  const onSceneReady = (scene: Scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();

    // Camera
    const camera = new ArcRotateCamera(
      'camera1',
      -Math.PI * 0.5,
      Math.PI * 0.25,
      10,
      new Vector3(0, 0, 0),
    );
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    // Light
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7; // 빛 강도 0 ~ 1

    // Ground
    const ground = MeshBuilder.CreateGround('ground', {
      width: 10,
      height: 10,
    });

    // Vilage
    const box = MeshBuilder.CreateBox('box', { width: 2, height: 1 });
  };

  const onRender = (scene: Scene) => {};

  return (
    <div>
      <SceneComponent
        onSceneReady={onSceneReady}
        onRender={onRender}
        id={'canvas-build-a-village'}
        width={'1280'}
        height={'720'}
      />
    </div>
  );
};

export default BuildVillage;

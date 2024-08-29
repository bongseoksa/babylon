import * as BABYLON from '@babylonjs/core';

export const createScene = (scene: BABYLON.Scene) => {
  const canvas = scene.getEngine().getRenderingCanvas();

  // Camera
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0),
  );
  // camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  // Light
  const light = new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(1, 1, 0),
    scene,
  );

  return { canvas, camera, light };
};

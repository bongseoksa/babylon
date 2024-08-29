import {
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Scene,
} from '@babylonjs/core';

export const createScene = (scene: Scene) => {
  const canvas = scene.getEngine().getRenderingCanvas();

  // Camera
  const camera = new ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new Vector3(0, 0, 0),
  );
  // camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  // Light
  const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);

  return { canvas, camera, light };
};

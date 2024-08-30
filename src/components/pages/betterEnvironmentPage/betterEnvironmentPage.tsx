import React from 'react';
import SceneComponent from 'babylonjs-hook';
import { Scene } from '@babylonjs/core';
import { createScene } from '@/utils/createScene';

const BetterEnvironmentPage = () => {
  const onSceneReady = (scene: Scene) => {
    const { canvas, camera, light } = createScene(scene);
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

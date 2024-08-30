import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';
import { createScene } from '@/utils/createScene';

const BetterEnvironmentPage = () => {
  const onSceneReady = (scene: Scene) => {
    const { canvas, camera, light } = createScene(scene);
    camera.radius = 200;
    light.direction = new Vector3(4, 1, 0);

    const largeGroundMat = new StandardMaterial('largeGroundMat');
    largeGroundMat.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/valleygrass.png',
    );

    const largeGround = MeshBuilder.CreateGroundFromHeightMap(
      'largeGround',
      'https://assets.babylonjs.com/environments/villageheightmap.png',
      {
        width: 150,
        height: 150,
        subdivisions: 20, // 지형 그리드 세분화 정도
        minHeight: 0,
        maxHeight: 10,
      },
    );
    largeGround.material = largeGroundMat;
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

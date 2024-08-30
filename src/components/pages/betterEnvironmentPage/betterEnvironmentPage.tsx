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

    // 실제 작업할 맵
    const groundMat = new StandardMaterial('groundMat');
    groundMat.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/villagegreen.png',
    );
    groundMat.diffuseTexture.hasAlpha = true;

    // 디자인을 위한 보여주기용 큰 맵
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
    largeGround.position.y = -0.01; // 맵이 겹쳐서 발생하는 blink 현상 방지
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

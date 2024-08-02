import React, { useEffect, useState } from 'react';
import SceneComponent from '@/components/sceneComponent';
import {
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Sound,
  Vector3,
} from '@babylonjs/core';

let music: Sound;
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

  // Sound
  music = new Sound('cello', 'sounds/cellolong.wav', scene, null, {
    loop: true,
  });

  // Ground
  const ground = MeshBuilder.CreateGround('ground', {
    width: 10,
    height: 10,
  });

  // Vilage
  const box = MeshBuilder.CreateBox('box', { width: 2, height: 2, depth: 1 });
  const boxBounding = box.getBoundingInfo().boundingBox; // mesh의 영역 데이터
  box.position.y = (boxBounding.maximum.y - boxBounding.minimum.y) * 0.5; // 좌표계에서의 최대,최소 데이터를 통해 사이즈 계산
};

const onRender = (scene: Scene) => {};

const onUserGesture = (e: any) => {
  if (!music) return;

  music.stop();
  music.play();
};

const BuildVillage = () => {
  useEffect(() => {
    window.addEventListener('click', onUserGesture);
    return () => {
      window.removeEventListener('click', onUserGesture);
    };
  }, []);

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

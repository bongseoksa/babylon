import React, { useEffect, useState } from 'react';
import SceneComponent from '@/components/sceneComponent';
import {
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Sound,
  Vector3,
  Tools,
  StandardMaterial,
  Texture,
  Color3,
  Vector4,
  Mesh,
} from '@babylonjs/core';

let music: Sound;

/** ----- Build Functions ----- */
const buildGround = () => {
  // Ground
  const groundMaterial = new StandardMaterial('groundMat');
  groundMaterial.diffuseColor = new Color3(0, 1, 0);

  // Ground
  const ground = MeshBuilder.CreateGround('ground', {
    width: 10,
    height: 10,
  });
  ground.material = groundMaterial;

  return ground;
};

const buildBox = () => {
  // Box
  const boxMaterial = new StandardMaterial('boxMat');
  boxMaterial.diffuseTexture = new Texture(
    'https://assets.babylonjs.com/environments/semihouse.png',
  );
  /* Material for each box side 
    faceUV index 순서: 뒷면(0) -> 앞면(1) -> 우측면(2) -> 좌측면(3) -> 상면(4) -> 하면(5)
    Vector4(좌하단x, 좌하단y, 우상단x, 우상단y) : 0 ~ 1 비율 사이의 이미지 offset */
  const faceUV: Vector4[] = [];
  faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
  faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
  faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
  faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
  faceUV[4] = Vector4.Zero(); //top side
  faceUV[5] = Vector4.Zero(); //bottom side

  // Box
  const box = MeshBuilder.CreateBox('box', { faceUV: faceUV, wrap: true });
  const boxBounding = box.getBoundingInfo().boundingBox; // mesh의 영역 데이터
  box.position.y = (boxBounding.maximum.y - boxBounding.minimum.y) * 0.5; // 좌표계에서의 최대,최소 데이터를 통해 사이즈 계산
  box.material = boxMaterial;

  return box;
};

const buildRoof = () => {
  // Roof
  const roofMaterial = new StandardMaterial('roofMat');
  roofMaterial.diffuseTexture = new Texture(
    'https://assets.babylonjs.com/environments/roof.jpg',
  );

  // Roof
  const roof = MeshBuilder.CreateCylinder('roof', {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling = new Vector3(0.75, 1, 1);
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  roof.material = roofMaterial;

  return roof;
};

const createScene = (scene: Scene) => {
  const canvas = scene.getEngine().getRenderingCanvas();

  // Camera
  const camera = new ArcRotateCamera(
    'camera1',
    -Math.PI / 2,
    Math.PI / 2.5,
    10,
    new Vector3(0, 0, 0),
  );
  // camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  // Light
  const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene);
  // light.intensity = 0.7; // 빛 강도 0 ~ 1

  // Sound
  music = new Sound('cello', 'sounds/cellolong.wav', scene, null, {
    loop: true,
  });

  const ground = buildGround();
  const box = buildBox();
  const roof = buildRoof();

  const house = Mesh.MergeMeshes(
    [box, roof],
    true,
    false,
    undefined,
    false,
    true, // 메쉬 세분화, 다중 머테리얼 허용여부
  );
};

const onSceneReady = (scene: Scene) => {
  createScene(scene);
};

const onRender = (scene: Scene) => {};

const onUserGesture = (e: any) => {
  if (!music || music?.isPlaying) return;
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

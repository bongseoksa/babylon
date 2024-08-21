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
    width: 15,
    height: 16,
  });
  ground.material = groundMaterial;

  return ground;
};

const buildBox = (width: 1 | 2 = 1) => {
  // Box
  const boxMaterial = new StandardMaterial('boxMat');
  if (width === 1) {
    boxMaterial.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/cubehouse.png',
    );
  } else {
    boxMaterial.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/semihouse.png',
    );
  }
  /* Material for each box side 
    faceUV index 순서: 뒷면(0) -> 앞면(1) -> 우측면(2) -> 좌측면(3) -> 상면(4) -> 하면(5)
    Vector4(좌하단x, 좌하단y, 우상단x, 우상단y) : 0 ~ 1 비율 사이의 이미지 offset */
  const faceUV: Vector4[] = [];
  if (width === 1) {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
  } else {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
  }
  faceUV[4] = Vector4.Zero(); //top side
  faceUV[5] = Vector4.Zero(); //bottom side

  // Box
  const box = MeshBuilder.CreateBox('box', {
    width: width,
    faceUV: faceUV,
    wrap: true,
  });
  const boxBounding = box.getBoundingInfo().boundingBox; // mesh의 영역 데이터
  box.position.y = (boxBounding.maximum.y - boxBounding.minimum.y) * 0.5; // 좌표계에서의 최대,최소 데이터를 통해 사이즈 계산
  box.material = boxMaterial;

  return box;
};

const buildRoof = (width: 1 | 2 = 1) => {
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
  roof.scaling = new Vector3(0.75, width, 1);
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  roof.material = roofMaterial;

  return roof;
};

const buildHouse = (width: 1 | 2 = 1): Mesh => {
  const box = buildBox(width);
  const roof = buildRoof(width);

  return Mesh.MergeMeshes(
    [box, roof],
    true,
    false,
    undefined,
    false,
    true, // 메쉬 세분화, 다중 머테리얼 허용여부
  ) as Mesh;
};

/** 주거지 생성 */
const buildDwellings = () => {
  const ground = buildGround();
  const detached_house = buildHouse(1); // 짧은 하우스
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  const semi_house = buildHouse(2); // 긴 하우스
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places = []; //each entry is an array [house type, rotation, x, z]
  places.push([1, -Math.PI / 16, -6.8, 2.5]);
  places.push([2, -Math.PI / 16, -4.5, 3]);
  places.push([2, -Math.PI / 16, -1.5, 4]);
  places.push([2, -Math.PI / 3, 1.5, 6]);
  places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
  places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
  places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
  places.push([1, (5 * Math.PI) / 4, 0, -1]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
  places.push([2, Math.PI / 1.9, 4.75, -1]);
  places.push([1, Math.PI / 1.95, 4.5, -3]);
  places.push([2, Math.PI / 1.9, 4.75, -5]);
  places.push([1, Math.PI / 1.9, 4.75, -7]);
  places.push([2, -Math.PI / 3, 5.25, 2]);
  places.push([1, -Math.PI / 3, 6, 4]);

  //Create instances from the first two that were built
  const houses = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance('house' + i);
    } else {
      houses[i] = semi_house.createInstance('house' + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }
};

const createScene = (scene: Scene) => {
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
  // light.intensity = 0.7; // 빛 강도 0 ~ 1

  // Sound
  music = new Sound('cello', 'sounds/cellolong.wav', scene, null, {
    loop: true,
  });

  buildDwellings();
};

const onUserGesture = (e: any) => {
  if (!music || music?.isPlaying) return;
  music.stop();
  music.play();
};

const BuildVillage = () => {
  const onSceneReady = (scene: Scene) => {
    createScene(scene);
  };

  const onRender = (scene: Scene) => {};

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

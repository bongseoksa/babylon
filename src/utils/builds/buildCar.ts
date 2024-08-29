import {
  Scene,
  Vector3,
  Vector4,
  StandardMaterial,
  Texture,
  Animation,
  MeshBuilder,
  Mesh,
} from '@babylonjs/core';
import earcut from 'earcut';

/** 차 몸체 생성 */
const buildCarBody = (scene: Scene) => {
  // base;
  const outline = [new Vector3(-0.3, 0, -0.1), new Vector3(0.2, 0, -0.1)];

  //curved front
  for (let i = 0; i < 20; i++) {
    outline.push(
      new Vector3(
        0.2 * Math.cos((i * Math.PI) / 40),
        0,
        0.2 * Math.sin((i * Math.PI) / 40) - 0.1,
      ),
    );
  }

  //top
  outline.push(new Vector3(0, 0, 0.1));
  outline.push(new Vector3(-0.3, 0, 0.1));

  //face UVs
  const faceUV: Vector4[] = [];
  faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new Vector4(0, 0, 1, 0.5);
  faceUV[2] = new Vector4(0.38, 1, 0, 0.5);

  //material
  const carMat = new StandardMaterial('carMat');
  carMat.diffuseTexture = new Texture(
    'https://assets.babylonjs.com/environments/car.png',
  );

  const car = MeshBuilder.ExtrudePolygon(
    'car',
    {
      shape: outline,
      depth: 0.2,
      faceUV: faceUV,
      wrap: true,
    },
    scene,
    earcut,
  );
  car.material = carMat;

  return car;
};

/** 바퀴 생성 */
const buildWheel = (scene: Scene, parent?: Mesh) => {
  const wheelUV: Vector4[] = [];
  wheelUV[0] = new Vector4(0, 0, 1, 1);
  wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new Vector4(0, 0, 1, 1);

  const wheelMat = new StandardMaterial('wheelMat');
  wheelMat.diffuseTexture = new Texture(
    'https://assets.babylonjs.com/environments/wheel.png',
  );

  const wheel = MeshBuilder.CreateCylinder('wheel', {
    diameter: 0.125,
    height: 0.05,
    faceUV: wheelUV,
  });
  if (parent) {
    wheel.parent = parent;
  }
  wheel.position.z = -0.1;
  wheel.position.x = -0.2;
  wheel.position.y = 0.035;
  wheel.material = wheelMat;

  //Animate the Wheels
  const animWheel = new Animation(
    'wheelAnimation',
    'rotation.y',
    30,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE,
  );

  const wheelKeys: { frame: number; value: number }[] = [];
  wheelKeys.push({ frame: 0, value: 0 }); // 0 프레임에 회전0
  wheelKeys.push({ frame: 30, value: 2 * Math.PI }); // 30프레임에 1바퀴 회전

  animWheel.setKeys(wheelKeys);

  wheel.animations = [];
  wheel.animations.push(animWheel);

  return wheel;
};

export const buildCar = (scene: Scene) => {
  const car = buildCarBody(scene);
  car.rotation = new Vector3(-Math.PI / 2, Math.PI, -Math.PI / 2);
  car.position.y = 0.16; // ground y 좌표계가 0이라는 전제

  const wheelRB = buildWheel(scene, car);
  const wheelRF = wheelRB.clone('wheelRF');
  wheelRF.position.x = 0.1;
  const wheelLB = wheelRB.clone('wheelLB');
  wheelLB.position.y = -0.2 - 0.035;
  const wheelLF = wheelRF.clone('wheelLF');
  wheelLF.position.y = -0.2 - 0.035;

  return car;
};

import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Scene,
  Mesh,
  Animation,
  AbstractMesh,
  Vector3,
  ISceneLoaderAsyncResult,
  SceneLoader,
  Axis,
  Tools,
  Space,
  Quaternion,
} from '@babylonjs/core';
import { buildDwellings, buildCar } from '@/utils/builds';
import { createScene } from '@/utils/createScene';
import { localAxes } from '@/utils/localAxes';

/** turn : 회전각, dist : 거리 */
class walk {
  public turn: number;
  public dist: number;
  //after covering dist apply turn
  constructor(turn: number, dist: number) {
    this.turn = turn;
    this.dist = dist;
  }
}
const VillageAnimationPage = () => {
  const runWheelAnimation = (scene: Scene, car: Mesh) => {
    const meshes = car.getChildMeshes();
    meshes.map((wheel) => {
      scene.beginAnimation(wheel, 0, 30, true);
    });
  };

  const runCarAnimation = (scene: Scene) => {
    const animCar = new Animation(
      'carAnimation',
      'position.z',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE,
    );

    const carKeys: { frame: number; value: number }[] = [];
    carKeys.push({ frame: 0, value: 8 });
    carKeys.push({ frame: 150, value: -7 });
    carKeys.push({ frame: 200, value: -7 });
    animCar.setKeys(carKeys);

    const car: AbstractMesh = scene.getMeshByName('car') as AbstractMesh;
    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);
  };

  const onSceneReady = async (scene: Scene) => {
    const { canvas, camera, light } = createScene(scene);
    camera.alpha = -Math.PI / 1.5;
    camera.beta = Math.PI / 4;
    camera.wheelPrecision = 10;
    localAxes(6, scene, true);

    const village = buildDwellings();

    /** ----- Car ----- */
    const car = buildCar(scene);
    car.rotation = new Vector3(-Math.PI / 2, Math.PI, -Math.PI / 2);
    car.position.y = 0.16;
    car.position.x = 3;
    car.position.z = 8;

    runWheelAnimation(scene, car);
    runCarAnimation(scene);

    /** ----- Dude ----- */
    const dudeLoaderResult: ISceneLoaderAsyncResult =
      await SceneLoader.ImportMeshAsync(
        'him',
        '/assets/dude/scenes/',
        'Dude.babylon',
        scene,
      );
    var dude = dudeLoaderResult.meshes[0];
    dude.scaling = new Vector3(0.008, 0.008, 0.008);
    dude.position = new Vector3(-6, 0, 0);
    dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);
    scene.beginAnimation(dudeLoaderResult.skeletons[0], 0, 100, true, 1.0);

    /* Dude Movement */
    const startRotation = dude.rotationQuaternion?.clone() as Quaternion;

    const track: walk[] = [];
    track.push(new walk(86, 7));
    track.push(new walk(-85, 14.8));
    track.push(new walk(-93, 16.5));
    track.push(new walk(48, 25.5));
    track.push(new walk(-112, 30.5));
    track.push(new walk(-72, 33.2));
    track.push(new walk(42, 37.5));
    track.push(new walk(-98, 45.2));
    track.push(new walk(0, 47));

    let distance = 0;
    let step = 0.015;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
      dude.movePOV(0, 0, step);
      distance += step;
      if (distance > track[p].dist) {
        dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          dude.position = new Vector3(-6, 0, 0);
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });
  };

  return (
    <SceneComponent
      onSceneReady={onSceneReady}
      id={'canvas-village-animation'}
      width={'1280'}
      height={'720'}
    />
  );
};

export default VillageAnimationPage;

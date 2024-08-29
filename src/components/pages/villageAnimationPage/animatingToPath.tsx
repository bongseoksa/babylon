import React from 'react';
import SceneComponent from 'babylonjs-hook';
import { Axis, MeshBuilder, Scene, Space, Vector3 } from '@babylonjs/core';
import { createScene } from '@/utils/createScene';
import { localAxes } from '@/utils/localAxes';

class slide {
  public turn: number;
  public dist: number;
  //after covering dist apply turn
  constructor(turn: number, dist: number) {
    this.turn = turn;
    this.dist = turn;
  }
}

const AnimatingToPath = () => {
  const onSceneReady = (scene: Scene) => {
    createScene(scene);
    localAxes(6, scene, true);

    //create a sphere
    const sphere = MeshBuilder.CreateSphere('sphere', {
      diameter: 0.25,
    });
    sphere.position = new Vector3(2, 0, 2);

    //draw lines to form a triangle
    const points = [];
    points.push(new Vector3(2, 0, 2));
    points.push(new Vector3(2, 0, -2));
    points.push(new Vector3(-2, 0, -2));
    points.push(points[0]); //close the triangle;

    MeshBuilder.CreateLines('triangle', { points: points });

    const track: any = [];
    track.push(new slide(Math.PI / 2, 4));
    track.push(new slide((3 * Math.PI) / 4, 8));
    track.push(new slide((3 * Math.PI) / 4, 8 + 4 * Math.sqrt(2)));

    let distance = 0;
    let step = 0.05;
    let p = 0;
    scene.onBeforeRenderObservable.add(() => {
      sphere.movePOV(0, 0, step);
      distance += step;

      if (distance > track[p].dist) {
        sphere.rotate(Axis.Y, track[p].turn, Space.LOCAL);
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          sphere.position = new Vector3(2, 0, 2); //reset to initial conditions
          sphere.rotation = Vector3.Zero(); //prevents error accumulation
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

export default AnimatingToPath;

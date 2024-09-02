import React, { useEffect, useState } from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Scene,
  SceneLoader,
  PointerEventTypes,
  PointerInfo,
  Mesh,
  ParticleSystem,
  Vector3,
} from '@babylonjs/core';
import { createScene } from '@/utils/createScene';
import '@babylonjs/loaders';
import { buildSkybox } from '@/utils/builds/buildSkybox';
import { Trees } from '../_fragments/trees';
import { buildFountain } from '@/utils/builds/buildFountain';
import { fountainParticleSystem } from '@/utils/particles/fountainParticle';
import { buildStreetLight } from '@/utils/builds/buildStreetLight';

const LightTheNightPage = () => {
  const [switched, setSwitched] = useState(false);
  const [particleSystem, setParticleSystem] = useState<ParticleSystem>();

  const onSceneReady = async (scene: Scene) => {
    const skybox = buildSkybox(scene);
    const { canvas, camera, light } = createScene(scene);
    camera.alpha = -Math.PI / 1.5;
    light.intensity = 0.1;

    // trees
    const trees = Trees(scene);

    // village
    SceneLoader.ImportMeshAsync(
      '',
      'https://assets.babylonjs.com/meshes/',
      'valleyvillage.glb',
      scene,
      null,
      '.glb',
    );

    // Fountain
    const fountain = buildFountain(scene);
    fountain.position.x = -4;
    fountain.position.z = -6;

    // Particles
    setParticleSystem(fountainParticleSystem(scene, fountain.position));

    // Lamp
    // const lamp = buildStreetLight(scene);
    // lamp.scaling = new Vector3(0.1, 0.1, 0.1);
    const lampLoaderResult = await SceneLoader.ImportMeshAsync(
      '',
      'https://assets.babylonjs.com/meshes/',
      'lamp.babylon',
    );
    const lamp = scene.getMeshByName('lamp') as Mesh;
    lamp.position = new Vector3(2, 0, 2);
    lamp.rotation = Vector3.Zero();
    lamp.rotation.y = -Math.PI / 4;

    const lamp1 = lamp.clone('lamp1');
    lamp1.position.x = -8;
    lamp1.position.z = 1.2;
    lamp1.rotation.y = Math.PI / 2;

    const lamp2 = lamp1.clone('lamp2');
    lamp2.position.x = -2.7;
    lamp2.position.z = 0.8;
    lamp2.rotation.y = -Math.PI / 2;

    const lamp3 = lamp.clone('lamp3');
    lamp3.position.z = -8;

    const pointerDown = (mesh: Mesh) => {
      if (mesh.id === 'fountain') {
        setSwitched((prev) => !prev);
      }
    };

    /** 씬 포인터 이벤트 */
    scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERDOWN:
          if (pointerInfo.pickInfo?.hit) {
            pointerDown(pointerInfo.pickInfo.pickedMesh as Mesh);
          }
          break;
      }
    });
  };

  useEffect(() => {
    if (!particleSystem) return;

    if (switched) {
      // Start the particle system
      particleSystem.start();
    } else {
      // Stop the particle system
      particleSystem.stop();
    }
  }, [switched]);

  return (
    <SceneComponent
      onSceneReady={onSceneReady}
      id={'canvas-better-environment'}
      width={'1280'}
      height={'720'}
    />
  );
};

export default LightTheNightPage;

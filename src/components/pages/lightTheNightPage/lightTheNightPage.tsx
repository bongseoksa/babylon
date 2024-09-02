import React, { useEffect, useState } from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Scene,
  SceneLoader,
  PointerEventTypes,
  PointerInfo,
  Mesh,
  ParticleSystem,
} from '@babylonjs/core';
import { createScene } from '@/utils/createScene';
import '@babylonjs/loaders';
import { buildSkybox } from '@/utils/builds/buildSkybox';
import { Trees } from '../_fragments/trees';
import { buildFountain } from '@/utils/builds/buildFountain';
import { fountainParticleSystem } from '@/utils/particles/fountainParticle';

const LightTheNightPage = () => {
  const [switched, setSwitched] = useState(false);
  const [particleSystem, setParticleSystem] = useState<ParticleSystem>();

  const onSceneReady = async (scene: Scene) => {
    const skybox = buildSkybox(scene);
    const { canvas, camera, light } = createScene(scene);
    // camera.upperBetaLimit = Math.PI / 2.2;
    camera.alpha = -Math.PI / 1.5;
    camera.beta = Math.PI / 2.2;

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

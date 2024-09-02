import React from 'react';
import SceneComponent from 'babylonjs-hook';
import { Mesh, Scene, SceneLoader, Vector3, Animation } from '@babylonjs/core';
import { createScene } from '@/utils/createScene';
import '@babylonjs/loaders';
import { buildSkybox } from '@/utils/builds/buildSkybox';
import { Trees } from './_fragments/trees';
import { buildFountain } from '@/utils/builds/buildFountain';
import { fountainParticleSystem } from '@/utils/particles/fountainParticle';

const ParticleFountainPage = () => {
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
    const fountainParticles = fountainParticleSystem(scene, fountain.position);
    fountainParticles.start();
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

export default ParticleFountainPage;

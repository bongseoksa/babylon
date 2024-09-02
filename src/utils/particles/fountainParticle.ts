import {
  Scene,
  ParticleSystem,
  Texture,
  Vector3,
  Color4,
} from '@babylonjs/core';

/** 분수대 파티클 */
export const fountainParticleSystem = (scene: Scene, position: Vector3) => {
  const particleSystem = new ParticleSystem('fountainParticles', 5000, scene);

  //Texture of each particle
  particleSystem.particleTexture = new Texture(
    'textures/particles/flare.png',
    scene,
  );

  // Where the particles come from
  particleSystem.emitter = new Vector3(
    position.x,
    position.y + 0.95,
    position.z,
  ); // the starting object, the emitter

  particleSystem.minEmitBox = new Vector3(0, 0, 0); // Starting all from
  particleSystem.maxEmitBox = new Vector3(0, 0, 0); // To...
  // Colors of all particles
  particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
  particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
  particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);
  // Size of each particle (random between...
  particleSystem.minSize = 0.01;
  particleSystem.maxSize = 0.05;
  // Life time of each particle (random between...
  particleSystem.minLifeTime = 2;
  particleSystem.maxLifeTime = 3.5;
  // Emission rate
  particleSystem.emitRate = 1500;
  // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
  particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
  // Set the gravity of all particles
  particleSystem.gravity = new Vector3(0, -9.81, 0);
  // Direction of each particle after it has been emitted
  particleSystem.direction1 = new Vector3(-2, 8, 1.5);
  particleSystem.direction2 = new Vector3(2, 8, -1.5);
  // Angular speed, in radians
  particleSystem.minAngularSpeed = 0;
  particleSystem.maxAngularSpeed = Math.PI;
  // Speed
  particleSystem.minEmitPower = 0.1;
  particleSystem.maxEmitPower = 0.3;
  particleSystem.updateSpeed = 0.025;

  return particleSystem;
};

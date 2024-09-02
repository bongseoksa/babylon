import { Mesh, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';

/** 분수대 */
export const buildFountain = (scene: Scene) => {
  const fountainProfile = [
    new Vector3(0, 0, 0),
    new Vector3(0.5, 0, 0),
    new Vector3(0.5, 0.2, 0),
    new Vector3(0.4, 0.2, 0),
    new Vector3(0.4, 0.05, 0),
    new Vector3(0.05, 0.1, 0),
    new Vector3(0.05, 0.8, 0),
    new Vector3(0.15, 0.9, 0),
  ];

  const fountain = MeshBuilder.CreateLathe(
    'fountain',
    {
      shape: fountainProfile,
      sideOrientation: Mesh.DOUBLESIDE, // Mesh 외부, 내부 모두 볼 수 있게 세팅
    },
    scene,
  );

  return fountain;
};

import { Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core';

export const buildGround = (
  { width, height }: { width: number; height: number } = {
    width: 15,
    height: 16,
  },
) => {
  // Ground
  const groundMaterial = new StandardMaterial('groundMat');
  groundMaterial.diffuseColor = new Color3(0, 1, 0);

  // Ground
  const ground = MeshBuilder.CreateGround('ground', {
    width,
    height,
  });
  ground.material = groundMaterial;

  return ground;
};

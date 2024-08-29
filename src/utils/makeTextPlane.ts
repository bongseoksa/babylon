import {
  Scene,
  DynamicTexture,
  StandardMaterial,
  Color3,
  MeshBuilder,
} from '@babylonjs/core';

/** 텍스트 택스처 생성 */
export const makeTextPlane = (
  text: string,
  color: string,
  size: number,
  scene?: Scene,
) => {
  // 텍스트 텍스처 생성
  // 두번째 인자 : canvas | {width:number, height:number} |  number(width, height 크기)
  const dynamicTexture = new DynamicTexture(
    'DynamicTexture',
    50,
    scene ?? null,
    false,
  );
  dynamicTexture.hasAlpha = true;
  dynamicTexture.drawText(
    text,
    5,
    40,
    'bold 36px Arial',
    color,
    'transparent',
    true,
  );

  // Material 생성. 텍스처 적용을 위함
  const standartMaterial = new StandardMaterial('TextPlaneMaterial', scene);
  standartMaterial.backFaceCulling = false;
  standartMaterial.specularColor = new Color3(0, 0, 0);
  standartMaterial.diffuseTexture = dynamicTexture;

  // plane Mesh 생성
  const plane = MeshBuilder.CreatePlane(
    'TextPlane',
    { size, updatable: true },
    scene,
  );
  plane.material = standartMaterial;

  return plane;
};

import {
  StandardMaterial,
  Texture,
  Vector3,
  Vector4,
  MeshBuilder,
  Mesh,
} from '@babylonjs/core';

/** 집 샘플 생성 */
const buildBox = (width: 1 | 2 = 1) => {
  // Box
  const boxMaterial = new StandardMaterial('boxMat');
  if (width === 1) {
    boxMaterial.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/cubehouse.png',
    );
  } else {
    boxMaterial.diffuseTexture = new Texture(
      'https://assets.babylonjs.com/environments/semihouse.png',
    );
  }
  /* Material for each box side 
    faceUV index 순서: 뒷면(0) -> 앞면(1) -> 우측면(2) -> 좌측면(3) -> 상면(4) -> 하면(5)
    Vector4(좌하단x, 좌하단y, 우상단x, 우상단y) : 0 ~ 1 비율 사이의 이미지 offset */
  const faceUV: Vector4[] = [];
  if (width === 1) {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
  } else {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
  }
  faceUV[4] = Vector4.Zero(); //top side
  faceUV[5] = Vector4.Zero(); //bottom side

  // Box
  const box = MeshBuilder.CreateBox('box', {
    width: width,
    faceUV: faceUV,
    wrap: true,
  });
  const boxBounding = box.getBoundingInfo().boundingBox; // mesh의 영역 데이터
  box.position.y = (boxBounding.maximum.y - boxBounding.minimum.y) * 0.5; // 좌표계에서의 최대,최소 데이터를 통해 사이즈 계산
  box.material = boxMaterial;

  return box;
};

const buildRoof = (width: 1 | 2 = 1) => {
  // Roof
  const roofMaterial = new StandardMaterial('roofMat');
  roofMaterial.diffuseTexture = new Texture(
    'https://assets.babylonjs.com/environments/roof.jpg',
  );

  // Roof
  const roof = MeshBuilder.CreateCylinder('roof', {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling = new Vector3(0.75, width, 1);
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;
  roof.material = roofMaterial;

  return roof;
};

export const buildHouse = (width: 1 | 2 = 1): Mesh => {
  const box = buildBox(width);
  const roof = buildRoof(width);

  return Mesh.MergeMeshes(
    [box, roof],
    true,
    false,
    undefined,
    false,
    true, // 메쉬 세분화, 다중 머테리얼 허용여부
  ) as Mesh;
};

import {
  Color3,
  Scene,
  SpotLight,
  StandardMaterial,
  Vector3,
  MeshBuilder,
  Mesh,
} from '@babylonjs/core';

export const buildStreetLight = (scene: Scene) => {
  const lampLight = new SpotLight(
    'lampLight',
    Vector3.Zero(),
    new Vector3(0, -1, 0),
    Math.PI,
    1,
    scene,
  );
  lampLight.diffuse = Color3.Yellow();

  //shape to extrude
  const lampShape = [];
  for (let i = 0; i < 20; i++) {
    lampShape.push(
      new Vector3(
        Math.cos((i * Math.PI) / 10),
        Math.sin((i * Math.PI) / 10),
        0,
      ),
    );
  }
  lampShape.push(lampShape[0]); //close shape

  //extrusion path
  const lampPath = [];
  lampPath.push(new Vector3(0, 0, 0));
  lampPath.push(new Vector3(0, 10, 0));
  // 전봇대 커브 영역
  for (let i = 0; i < 20; i++) {
    lampPath.push(
      new Vector3(
        1 + Math.cos(Math.PI - (i * Math.PI) / 40),
        10 + Math.sin(Math.PI - (i * Math.PI) / 40),
        0,
      ),
    );
  }
  lampPath.push(new Vector3(3, 11, 0));

  const yellowMat = new StandardMaterial('yellowMat');
  yellowMat.emissiveColor = Color3.Yellow();

  //extrude lamp
  const lamp = MeshBuilder.ExtrudeShape('lamp', {
    cap: Mesh.CAP_END,
    shape: lampShape,
    path: lampPath,
    scale: 0.5,
  });

  //add bulb
  const bulb = MeshBuilder.CreateSphere('bulb', {
    diameterX: 1.5,
    diameterZ: 0.8,
  });
  bulb.material = yellowMat;
  bulb.parent = lamp;
  bulb.position.x = 2;
  bulb.position.y = 10.5;

  lampLight.parent = bulb;
  return lamp;
};

import { Scene, Sprite, SpriteManager } from '@babylonjs/core';

export const UFOs = (scene: Scene) => {
  let UFOs: Sprite[] = [];
  const spriteManagerUFOs = new SpriteManager(
    'UFOsManager',
    'https://assets.babylonjs.com/environments/ufo.png',
    2000,
    { width: 128, height: 76 }, // 스프라이트 이미지의 셀 사이즈. 설정되는 값만큼 sprite가 나눠짐
    scene,
  );

  const ufo = new Sprite('ufo', spriteManagerUFOs);
  ufo.position.y = 3;
  ufo.width = 2;
  ufo.height = 1;
  ufo.playAnimation(0, 16, true, 125);

  UFOs.push(ufo);

  return { manager: null, sprites: UFOs };
};

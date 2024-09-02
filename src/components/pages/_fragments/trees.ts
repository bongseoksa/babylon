import { Scene, Sprite, SpriteManager } from '@babylonjs/core';

export const Trees = (scene: Scene) => {
  let trees: Sprite[] = [];
  const spriteManagerTrees = new SpriteManager(
    'treesManager',
    'textures/trees/palmtree.png',
    2000,
    { width: 512, height: 1024 },
    scene,
  );

  for (let i = 0; i < 500; i++) {
    const tree = new Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
    trees.push(tree);
  }

  for (let i = 0; i < 500; i++) {
    const tree = new Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
    trees.push(tree);
  }

  return { manager: spriteManagerTrees, sprites: trees };
};

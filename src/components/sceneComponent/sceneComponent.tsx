import React, { useEffect, useRef } from 'react';
import { Scene, Engine, EngineOptions, SceneOptions } from '@babylonjs/core';

type SceneComponentType = {
  antialias?: boolean;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender: (scene: Scene, engine: Engine) => void;
  onSceneReady: (scene: Scene, engine: Engine) => void;
  [key: string]: any; //rest 옵션
};

const SceneComponent = ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  onRender,
  onSceneReady,
  ...rest
}: SceneComponentType) => {
  const reactCanvas = useRef(null);

  useEffect(() => {
    const { current: canvas } = reactCanvas;
    if (!canvas) return;

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio,
    );
    const scene = new Scene(engine, sceneOptions);

    if (scene.isReady()) {
      onSceneReady(scene, engine);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene, engine));
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === 'function') onRender(scene, engine);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener('resize', resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener('resize', resize);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    onRender,
    onSceneReady,
  ]);

  return <canvas ref={reactCanvas} {...rest} />;
};

export default SceneComponent;

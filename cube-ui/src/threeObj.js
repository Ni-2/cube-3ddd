import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const setCubeEnvParams = (currentParams, cubeEnv) => {
  const { boxLength, boxHeight, boxWidth } = currentParams;
  const { camera, controls } = cubeEnv;

  camera.position.set(boxLength * 2, boxHeight * 1.2, boxWidth * 3);
  controls.target.set(boxLength / 2, boxHeight / 2, boxWidth / 2);
  controls.update();
};

export const makeCube = (currentParams, cubeEnv, oldCubeName) => {
  const { points, faces } = currentParams;
  const { scene } = cubeEnv;

  if (oldCubeName) scene.remove(scene.getObjectByName(oldCubeName));

  const geometry = new THREE.Geometry();
  points.forEach((point) => geometry.vertices.push(new THREE.Vector3(...point)));
  faces.map((face) => geometry.faces.push(new THREE.Face3(...face)));

  geometry.computeFaceNormals();

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    const cubeName = 'Cube';
    cube.name = cubeName;
    scene.add(cube);

    cube.position.x = x;

    return cubeName;
  }

  const cubeName = makeInstance(geometry, 0xFFB300,  0);
  return cubeName;
};

export const makeCubeEnvWithCube = (canvasRef, currentParams ) => {
  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef });

  const fov = 50;
  const aspect = window.innerWidth / window.innerHeight;  // the canvas default
  const near = 0.1;
  const far = 2000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  const controls = new OrbitControls(camera, canvasRef);

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x61B7CF);

  const addLight = (...pos) => {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
  };

  addLight(-1, 2, 4);
  addLight(1, 2, -2);
  addLight(1, -2, 4);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function renderCube() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
  }

  const cubeEnv = { camera, controls, scene };
  setCubeEnvParams(currentParams, cubeEnv);
  const cubeName = makeCube(currentParams, cubeEnv);

  renderCube();

  controls.addEventListener('change', renderCube);
  window.addEventListener('resize', renderCube);

  return { cubeEnv, cubeName, renderCube };
};
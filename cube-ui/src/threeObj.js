import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const makeThreeObj = (canvasRef, currentParams ) => {
  const { boxLength, boxHeight, boxWidth, points, faces } = currentParams;
  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef });

  const fov = 50;
  const aspect = window.innerWidth / window.innerHeight;  // the canvas default
  const near = 0.1;
  const far = 2000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(boxLength * 2, boxHeight * 1.2, boxWidth * 3);

  const controls = new OrbitControls(camera, canvasRef);
  controls.target.set(boxLength / 2, boxHeight / 2, boxWidth / 2);
  controls.update();

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

  const geometry = new THREE.Geometry();
  points.forEach((point) => geometry.vertices.push(new THREE.Vector3(...point)));
  faces.map((face) => geometry.faces.push(new THREE.Face3(...face)));

  geometry.computeFaceNormals();

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  makeInstance(geometry, 0xFFB300,  0);

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

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
  }

  render();
  
  controls.addEventListener('change', render);
  window.addEventListener('resize', render);

};
import * as THREE from 'https://cdn.skypack.dev/three';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';

import { Config } from './config.js';

let scene, renderer, camera, sheepModel, sheep;

const backgroundSection = document.querySelector('.background');
const mainNode = document.querySelector('main');

/* --------------------------------- Models --------------------------------- */

// Load the sheep model
new GLTFLoader().load(Config.modelsPath + Config.sheepModelName, gltf => {
    sheepModel = gltf;

    // Load the other models
    init();
});

/* -------------------------------------------------------------------------- */
/*                           ThreeJS main functions                           */
/* -------------------------------------------------------------------------- */

/**
 * Init function
 */
function init() {
    // Setting up the scene
    scene = new THREE.Scene();

    // Setting up the renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(Config.screenWidth, Config.screenHeight);
    backgroundSection.appendChild(renderer.domElement);

    // Setting up the camera
    camera = new THREE.PerspectiveCamera(75, Config.screenWidth / Config.screenHeight, 1, 10000);
    camera.position.set(2, 0, 2);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // Setting up lights
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(directionalLight);


    sheep = sheepModel.scene.clone();
    scene.add(sheep);
    sheep.rotation.y = 2 * Math.PI;
    // sheep.rotation.y = 0;

    mainNode.style = "flex";
    render();
}

/**
 * Main loop function
 */
function render() {
    // Rendering the 3D scene
    renderer.render(scene, camera);

    sheep.rotation.y += 0.01;

    // Wait before looping
    requestAnimationFrame(render);
}
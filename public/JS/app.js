import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader.js';

import { Config } from './config.js';

let scene, renderer, camera, controls, sheep;

const backgroundSection = document.querySelector('.background');

/* --------------------------------- Models --------------------------------- */

// Load the sheep model
new MTLLoader().load(Config.modelsPath + Config.sheepModelMTL, (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(Config.modelsPath + Config.sheepModelMTL, (object) => {
        sheep = object;

        // Start ThreeJS
        init();
    });

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
        // alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(Config.screenWidth, Config.screenHeight);
    backgroundSection.appendChild(renderer.domElement);

    // Setting up the camera
    camera = new THREE.PerspectiveCamera(75, Config.screenWidth / Config.screenHeight, 1, 10000);
    camera.position.set(10, 10, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // Setting up the camera controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Setting up lights
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(10, 20, 10);
    // directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight2.position.set(0, -10, 0);
    // directionalLight2.target.position.set(0, 0, 0);
    // scene.add(directionalLight2);

    console.log(sheep);
    scene.add(sheep);

    render();
}

/**
 * Main loop function
 */
function render() {
    // DEBUG : Update OrbitControl (camera control)
    controls.update();

    // Rendering the 3D scene
    renderer.render(scene, camera);

    // Wait before looping
    requestAnimationFrame(render);
}
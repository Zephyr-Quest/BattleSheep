import * as THREE from 'three'
import { GLTFLoader } from 'https://unpkg.com/three@0.137.0/examples/jsm/loaders/GLTFLoader.js';

const Config = {
    screenWidth: 400,
    screenHeight: 400,
    modelsPath: 'models/',
    sheepModelName: 'sheep.glb'
};

let scene, renderer, camera, sheepModel, sheep;

const backgroundSection = document.getElementById('sheep_display');
const mainNode = document.getElementById('home_main');

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
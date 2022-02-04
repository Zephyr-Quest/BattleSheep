import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.137.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.137.0/examples/jsm/loaders/GLTFLoader.js';

import { Config } from './config.js';
import { Model3D } from './Model3D.js';
import { MeshManager } from './MeshManager.js';

let scene, renderer, camera, controls;

let map;

/* ---------------------------------- Debug --------------------------------- */

// Stats
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

/* --------------------------------- Texture -------------------------------- */

// Textures load manager
const loadManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadManager);
const skyboxImages = []

// Load each texture of the skybox
const skyboxExt = ["bk.tga", "dn.tga", "ft.tga", "lf.tga", "rt.tga", "up.tga"]
for (const ext of skyboxExt) {
    // Add the texture to the loader
    skyboxImages.push(textureLoader.load(Config.skyboxPath + ext));
    // currentType.texture.magFilter = THREE.NearestFilter;
}

/* --------------------------------- Models --------------------------------- */

// Model load manager
const modelLoader = new GLTFLoader();

/**
 * Load an empty model and restart (recursive, start 'init' when it's done)
 */
function loadModels() {
    let loaded = true;

    // Try to find an unloaded model in 'Model3D'
    for (let modelName in Model3D) {
        if (!Model3D.hasOwnProperty(modelName)) continue;

        const currentModel = Model3D[modelName];
        if (currentModel.model === null) {
            // The model is not loaded yet
            loaded = false;

            // Add the model to the load manager
            modelLoader.load(Config.modelsPath + currentModel.modelName, gltf => {
                currentModel.model = gltf;

                // Load the other models
                loadModels();
            });

            break;
        }
    }

    // Start ThreeJS when it's done
    if (loaded) init();
}

// Load models after textures
loadManager.onLoad = loadModels;

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
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Setting up the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(30, 15, 30);
    // camera.position.set(0, 50, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // Setting up the camera controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Setting up lights
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xF1E6B7, 2);
    directionalLight.position.set(30, 20, 30);
    // directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight2.position.set(0, -10, 0);
    // directionalLight2.target.position.set(0, 0, 0);
    // scene.add(directionalLight2);

    map = new MeshManager("Map", 0, 0, 0);
    map.addToScene(scene);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const origin = new THREE.Mesh(geometry, material);
    const lightCube = new THREE.Mesh(geometry, material);
    lightCube.position.fromArray(directionalLight.position.toArray());
    
    scene.add(origin);
    scene.add(lightCube);
    
    render();
}

/**
 * Main loop function
 */
function render() {
    // DEBUG : Start calcul frame rate
    stats.begin();

    // DEBUG : Update OrbitControl (camera control)
    controls.update();

    // Rendering the 3D scene
    renderer.render(scene, camera);

    // DEBUG : Stop calcul frame rate
    stats.end();

    // Wait before looping
    requestAnimationFrame(render);
}
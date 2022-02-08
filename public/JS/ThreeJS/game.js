import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.137.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.137.0/examples/jsm/loaders/GLTFLoader.js';

import { Config } from './config.js';
import { Model3D } from './model_3d.js';
import { MeshManager } from './level_design/MeshManager.js';
import { Elements } from './level_design/level_design.js';

let scene, renderer, camera, controls;

const allObjects = {};
let turningGrass = null;

/* ---------------------------------- Debug --------------------------------- */

// Stats
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', event => {
    // Convert coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Interpret raycaster data
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Choose the best result from raycaster
        const currentIntersect = intersects[0];
        console.log(currentIntersect);

        // Try to get the real clicked element
        let clicked;
        try {
            let searching = true, currentParent = currentIntersect.object;
            
            // Search a referenced mesh
            while (searching) {
                if (currentParent.parent instanceof THREE.Mesh || currentParent.parent instanceof THREE.Group)
                    currentParent = currentParent.parent;
                else searching = false;
            }

            clicked = allObjects[currentParent.name];
        } catch (error) {
            console.error('Error finding the clicked element');
            return;
        }

        console.log(clicked);
        if (clicked.type === 'Grass') {
            clicked.upGrass()

            // Down the previous selected grass
            if (turningGrass !== null)
                turningGrass.downGrass();

            // Turn the selected grass
            turningGrass = clicked;
        }
    }
}, false);

/* --------------------------------- Models --------------------------------- */

// Model load manager
const modelLoader = new GLTFLoader();
loadModels();

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

/* -------------------------------------------------------------------------- */
/*                           ThreeJS main functions                           */
/* -------------------------------------------------------------------------- */

/**
 * Init function
 */
function init() {
    /* --------------------------- Scene and renderer --------------------------- */

    // Setting up the scene
    scene = new THREE.Scene();

    // Setting up the renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    /* --------------------------------- Camera --------------------------------- */

    const cameraPosition = Config.cameraPositions[Object.keys(Config.cameraPositions)[0]]
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.fromArray(cameraPosition.toArray());
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    /* -------------------------------- Controls -------------------------------- */
    
    // Setting up the orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    /* --------------------------------- Lights --------------------------------- */

    // Setting up the ambient light
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
    scene.add(ambientLight);

    // Setting up the directional light
    const directionalLight = new THREE.DirectionalLight(0xF1E6B7, 2);
    directionalLight.position.fromArray(Config.lightPosition.toArray());
    scene.add(directionalLight);

    /* ------------------------------ Level design ------------------------------ */

    // Display all element
    console.log(Elements);
    for (const element of Elements) {
        const currentMesh = new MeshManager(element.name, element.type, element.position);

        // Set the rotation
        if (element.hasOwnProperty('rotation'))
            currentMesh.setRotationFromVector(element.rotation);

        // Add the current element to the scene
        allObjects[element.name] = currentMesh;
        currentMesh.addToScene(scene);
    }
    console.log(allObjects);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const origin = new THREE.Mesh(geometry, material);
    const lightCube = new THREE.Mesh(geometry, material);
    lightCube.position.fromArray(directionalLight.position.toArray());
    
    // scene.add(origin);
    scene.add(lightCube);

    window.addEventListener("keyup", e => {
        // console.log(e);

        if (e.code === 'Space')
            console.log(camera.position);
        else if (e.key === 'f') {
            const renderDom = renderer.domElement;
            if (renderDom.requestFullscreen) renderDom.requestFullscreen();
            else if (renderDom.webkitRequestFullscreen) renderDom.webkitRequestFullscreen();
            else if (renderDom.msRequestFullscreen) renderDom.msRequestFullscreen();
        } else if (e.key === 'u') {
            directionalLight.position.add(new THREE.Vector3(5, 0, 0));
            lightCube.position.add(new THREE.Vector3(5, 0, 0));
            console.log(directionalLight.position);
        } else if (e.key === 'i') {
            directionalLight.position.add(new THREE.Vector3(0, 5, 0));
            lightCube.position.add(new THREE.Vector3(0, 5, 0));
            console.log(directionalLight.position);
        } else if (e.key === 'o') {
            directionalLight.position.add(new THREE.Vector3(0, 0, 5));
            lightCube.position.add(new THREE.Vector3(0, 0, 5));
            console.log(directionalLight.position);
        } else if (e.key === 'j') {
            directionalLight.position.add(new THREE.Vector3(-5, 0, 0));
            lightCube.position.add(new THREE.Vector3(-5, 0, 0));
            console.log(directionalLight.position);
        } else if (e.key === 'k') {
            directionalLight.position.add(new THREE.Vector3(0, -5, 0));
            lightCube.position.add(new THREE.Vector3(0, -5, 0));
            console.log(directionalLight.position);
        } else if (e.key === 'l') {
            directionalLight.position.add(new THREE.Vector3(0, 0, -5));
            lightCube.position.add(new THREE.Vector3(0, 0, -5));
            console.log(directionalLight.position);
        } else {
            // Check camera controls
            for (const keyCode in Config.cameraPositions) {
                if (!Config.cameraPositions.hasOwnProperty(keyCode) || e.key !== keyCode)
                    continue;

                // Switch the camera position
                const pos = Config.cameraPositions[keyCode];
                camera.position.fromArray(pos.toArray());
            }
        }
    });
    
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

    // Turn the selected grass
    if (turningGrass !== null) {
        turningGrass.rotY += 0.01;
        turningGrass.updateScene();
    }

    // Rendering the 3D scene
    renderer.render(scene, camera);

    // DEBUG : Stop calcul frame rate
    stats.end();

    // Wait before looping
    requestAnimationFrame(render);
}
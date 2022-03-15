import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.137.0/examples/jsm/controls/OrbitControls.js';

import { Config } from './config.js';

// Gameplay imports
import { CustomRaycaster } from './gameplay/Raycaster.js';
import { View } from './gameplay/View.js';
import { HUD } from './gameplay/HUD.js';

// Grid imports
import { setPlayerGrid } from './grid/setPlayerGrid.js';
import { Textures } from './level_design/textures.js';

let scene, renderer, camera, controls, raycaster, view;

/* ---------------------------------- Debug --------------------------------- */

let stats;
const DEBUG_STATS = true;
const USE_ORBIT_CONTROLS = true;
const DEBUG_RAYCASTER = true;

/* ---------------------------------- View ---------------------------------- */

/**
 * Init the view and load models and textures
 */
function init(callback) {
    view = new View();
    view.load(() => initAfterLoading(callback));
}

/**
 * Get the current game view
 * @returns The game view
 */
const getView = () => view;

/* -------------------------------- Raycaster ------------------------------- */

/**
 * Change the raycaster state
 * @param {boolean} state If the raycaster must be active or not
 */
function setRaycasterState(state) {
    raycaster.isActive = state;
}

/**
 * Set the raycaster event
 * @param   {function}  func  The raycaster event
 */
function setRaycasterEvent(func) {
    raycaster.clickCallback = func;
}

/**
 * Set the player id to the raycaster
 * @param {Number} playerId The player id
 */
function setPlayerId(playerId) {
    raycaster.playerId = playerId;
}

/* -------------------------------------------------------------------------- */
/*                           ThreeJS main functions                           */
/* -------------------------------------------------------------------------- */

/**
 * Init function
 */
function initAfterLoading(callback) {
    /* --------------------------- Scene and renderer --------------------------- */

    // Setting up the scene
    scene = new THREE.Scene();
    scene.background = Config.backgroundColor;
    view.scene = scene;

    // Setting up the renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        physicallyCorrectLights: true
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

    /* -------------------------------- Controls -------------------------------- */

    // Setting up the raycaster
    raycaster = new CustomRaycaster(scene, camera, view, DEBUG_RAYCASTER);
    raycaster.isActive = false;

    /* --------------------------------- Lights --------------------------------- */

    // Setting up the ambient light
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
    scene.add(ambientLight);

    // Setting up the directional light
    const directionalLight = new THREE.DirectionalLight(Config.light.color, Config.light.intensity);
    directionalLight.position.fromArray(Config.lightPosition.toArray());
    scene.add(directionalLight);

    /* ------------------------------ Level design ------------------------------ */

    // Display all element
    view.displayAllElements();
    
    // Create the floor
    const floorGeometry = new THREE.BoxGeometry(25, 0.05, 52);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x1b6d19 });
    const floorCube = new THREE.Mesh(floorGeometry, floorMaterial);
    floorCube.position.set(1, -0.5, 0);
    floorCube.name = "Floor0";
    scene.add(floorCube);
    
    /* --------------------------------- Events --------------------------------- */
    
    raycaster.initEvent();
    window.addEventListener('resize', onResize, false);

    /* ------------------------------- Start grid ------------------------------- */

    new setPlayerGrid(view);
    
    /* ---------------------------------- Debug --------------------------------- */

    // Display FPS
    if (DEBUG_STATS) {
        stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
    }

    // Init OrbitControls
    if (USE_ORBIT_CONTROLS) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
    }

    /* -------------------------------- End debug ------------------------------- */
    
    HUD.showAnnouncement("Waiting for a player", "Please wait...");

    callback();

    render();
}

/**
 * Main loop function
 */
function render() {
    // DEBUG : Start calcul frame rate
    if (DEBUG_STATS) stats.begin();

    // DEBUG : Update OrbitControl (camera control)
    if (USE_ORBIT_CONTROLS) controls.update();

    // Animate capillotractoms
    if (view.sceneState.isCapillotractomAnimate) {
        for (let i = 0; i < view.capillotractoms.length; i++) {
            view.capillotractoms[i].position.x += (i === 0 ? -Config.capillotractom.speed : Config.capillotractom.speed);
        }
    }

    // Rendering the 3D scene
    renderer.render(scene, camera);

    // DEBUG : Stop calcul frame rate
    if (DEBUG_STATS) stats.end();

    // Wait before looping
    requestAnimationFrame(render);
}

/**
 * Set the camera position from a THREE.Vector3
 * @param {THREE.Vector3} pos The camera position
 */
function setCameraFromVector(pos) {
    camera.position.fromArray(pos.toArray());
}

/**
 * Update the 3D scene when the user resize the page
 */
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export default {
    init,
    getView,
    setRaycasterState,
    setRaycasterEvent,
    setCameraFromVector,
    setPlayerId
};
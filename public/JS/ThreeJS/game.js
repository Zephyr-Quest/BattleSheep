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

let scene, renderer, camera, controls, raycaster;

/* ---------------------------------- Debug --------------------------------- */

let stats;
const DEBUG_STATS = true;
const USE_ORBIT_CONTROLS = true;
const DEBUG_RAYCASTER = false;

/* ---------------------------------- View ---------------------------------- */

const view = new View();
view.load(init);

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
    scene.background = Config.backgroundColor;
    view.scene = scene;

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

    /* -------------------------------- Controls -------------------------------- */

    // Setting up the raycaster
    raycaster = new CustomRaycaster(scene, camera, view, DEBUG_RAYCASTER);
    raycaster.clickCallback = (pos) => {
        setTimeout(() => {
            view.uncoverGridCase(new THREE.Vector2(pos.x, pos.y), pos.z, true);
        }, 1000);
    };
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
    
    /* --------------------------------- Events --------------------------------- */
    
    raycaster.initEvent();
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener('resize', onResize, false);

    /* ------------------------------- Start grid ------------------------------- */

    new setPlayerGrid(view, () => {
        HUD.hideStartGrid();
        HUD.showAnnouncement("The other player is setting up his grid", "Please wait...")
    });
    
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

    const material = new THREE.SpriteMaterial({ map: Textures.Cross.texture });
    const sprite = new THREE.Sprite(material);
    scene.add(sprite);

    /* -------------------------------- End debug ------------------------------- */

    HUD.showAnnouncement("Waiting for a player", "Please wait...");

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

    // Turn the selected grass
    if (view.sceneState.turningGrass !== null) {
        view.sceneState.turningGrass.rotY += 0.01;
        view.sceneState.turningGrass.updateScene();
    }

    // Rendering the 3D scene
    renderer.render(scene, camera);

    // DEBUG : Stop calcul frame rate
    if (DEBUG_STATS) stats.end();

    // Wait before looping
    requestAnimationFrame(render);
}

/**
 * Callback of keyup event
 * @param {KeyboardEvent} e The keyup event object
 */
function onKeyUp(e) {
    // console.log(e);

    if (e.code === 'Space') {
        HUD.hideAnnouncement();
        setTimeout(HUD.showStartGrid, 1000);
    } else if (e.key === 'f') {
        // const renderDom = renderer.domElement;
        const renderDom = document.querySelector("body");
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
}

/**
 * Update the 3D scene when the user resize the page
 */
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
import { Raycaster, Vector2, Vector3, Mesh, Group, Sprite } from 'three';
import { createTarget } from '../level_design/level_design.js';

const TARGET_Y = 2;

/**
 * Check if two vectors are equals or not
 * @param {THREE.Vector3} v1 The first vector
 * @param {THREE.Vector3} v2 The second vector
 * @returns If they're equals or not
 */
const isVector3Equals = (v1, v2) => v1 && v2 && v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;

/* -------------------------------------------------------------------------- */
/*                        Manage the ThreeJS Raycaster                        */
/* -------------------------------------------------------------------------- */
export class CustomRaycaster {

    /**
     * The CustomRaycaster constructor
     * @param {THREE.Scene} scene The current ThreeJS scene
     * @param {THREE.PerspectiveCamera} camera The ThreeJS camera
     * @param {View} view The game view
     * @param {boolean} debug If we want to print some debug info or not
     */
    constructor(scene, camera, view, debug = false) {
        // Init the raycaster
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();

        this.scene = scene;
        this.camera = camera;
        this.view = view;
        this.debug = debug;
        this.isActive = true;

        this.clickCallback = null;

        this.targetedGrass = null;
        this.crossAndTarget = [];
    }

    /**
     * Init the window click event to use the raycaster
     */
    initEvent() {
        window.addEventListener("click", e => this.onClick(e), false);
        window.addEventListener("mousemove", e => this.onMouseHover(e), false);
    }

    /**
     * Define what is going to do when an user click on 3D screen
     * @param {ClickEvent} event The click event
     */
    onClick(event) {
        if (!this.isActive) return;

        // Convert coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Interpret raycaster data
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (this.debug) console.log(intersects);

        if (intersects.length > 0) {
            // Choose the best result from raycaster
            const currentIntersect = intersects[0];
            if (this.debug) console.log(currentIntersect);

            // Try to get the real clicked element
            let clicked;
            try {
                let searching = true, currentParent = currentIntersect.object;
                if (currentIntersect.object instanceof Sprite)
                    return;

                // Search a referenced mesh
                while (searching) {
                    if (currentParent.parent instanceof Mesh || currentParent.parent instanceof Group)
                        currentParent = currentParent.parent;
                    else searching = false;
                }

                clicked = this.view.allObjects[currentParent.name];
                if (!clicked) throw "The clicked element is not referenced.";
            } catch (error) {
                console.error('Error finding the clicked element.');
                if (this.debug) console.error(error);
                return;
            }

            if (this.debug) console.log(clicked);

            // Down the previous selected grass
            if (this.view.sceneState.turningGrass !== null) {
                this.view.sceneState.turningGrass.downGrass();
                this.view.sceneState.turningGrass = null;
            }

            if (clicked.type === 'Grass') {
                clicked.upGrass();

                // Turn the selected grass
                this.view.sceneState.turningGrass = clicked;
                
                const gridPosition = clicked.getGridPosition();

                if (this.clickCallback) this.clickCallback(gridPosition);
            }
        }
    }

    /**
     * Define what is going to do when a user hover the 3D screen
     * @param {MouseEnterEvent} event The Hover event
     */
    onMouseHover(event) {
        if (!this.isActive) return;

        // Convert coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Interpret raycaster data
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            // Choose the best result from raycaster
            const currentIntersect = intersects[0];
            // if (this.debug) console.log(currentIntersect);

            // Try to get the real hover element
            let hovered;
            try {
                let searching = true, currentParent = currentIntersect.object;
                if (currentIntersect.object instanceof Sprite)
                    return;

                // Search a referenced mesh
                while (searching) {
                    if (currentParent.parent instanceof Mesh || currentParent.parent instanceof Group)
                        currentParent = currentParent.parent;
                    else searching = false;
                }

                hovered = this.view.allObjects[currentParent.name];
                if (!hovered) throw "The hovered element is not referenced.";
            } catch (error) {
                console.error('Error finding the hovered element.');
                if (this.debug) console.error(error);
                return;
            }

            // Check the mesh type
            const interested = ["Map", "Grass", "Sheep", "ShornSheep", "Cross", "Target"];
            if (!interested.includes(hovered.type)) return;
            
            if (this.debug) console.log(hovered.type);

            // Get the mesh position
            const pos3d = hovered.getGridPosition();
            console.log(hovered.getPositionVector(), pos3d);
            let pos3dLower = new Vector3(pos3d.x, pos3d.y - TARGET_Y, pos3d.z);
            const pos2d = new Vector2(pos3d.x, pos3d.y), playerId = pos3d.z;
            console.log(pos3d, this.targetedGrass, isVector3Equals(pos3d, this.targetedGrass));
            
            if (hovered.type === 'Grass' && !isVector3Equals(pos3d, this.targetedGrass)) {
                this.targetedGrass = pos3d;

                // Create the target
                const target = createTarget(pos2d, TARGET_Y, playerId);
                this.view.displayElement(target);
                console.log(this.view.allObjects[target.name]);
                this.crossAndTarget.push(this.view.allObjects[target.name]);
            } else if (hovered.type === 'Map' && this.targetedGrass !== null) {
                this.targetedGrass = null;

                // Remove cross and targets
                while (this.crossAndTarget.length > 0) {
                    this.crossAndTarget[0].removeFromScene(this.scene);
                    delete this.view.allObjects[this.crossAndTarget[0].name];
                    this.crossAndTarget.splice(0, 1);
                }
            }
        }
    }
};
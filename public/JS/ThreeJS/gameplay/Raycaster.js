import { Raycaster, Vector2, Mesh, Group } from 'three';

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
    }

    /**
     * Init the window click event to use the raycaster
     */
    initEvent() {
        window.addEventListener("click", e => this.onClick(e), false);
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

        if (intersects.length > 0) {
            // Choose the best result from raycaster
            const currentIntersect = intersects[0];
            if (this.debug) console.log(currentIntersect);

            // Try to get the real clicked element
            let clicked;
            try {
                let searching = true, currentParent = currentIntersect.object;

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
};
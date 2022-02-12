import { Vector2 } from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.137.0/examples/jsm/loaders/GLTFLoader.js';

import { Model3D } from '../level_design/model_3d.js';
import { Config } from '../config.js';

// Level design imports
import { MeshManager } from '../level_design/MeshManager.js';
import { Elements, createSheep } from '../level_design/level_design.js';

export class View {

    /**
     * The View constructor
     */
    constructor() {
        this.scene = undefined;

        this.sceneState = {
            turningGrass: null
        };
        this.allObjects = {};

        // Load manager
        this.modelLoader = new GLTFLoader();
    }

    /**
     * Load each 3D models (recursive function)
     * @param {Function} callback Function executed after the loading
     */
    loadModels(callback) {
        let loaded = true;

        // Try to find an unloaded model in 'Model3D'
        for (let modelName in Model3D) {
            if (!Model3D.hasOwnProperty(modelName)) continue;

            const currentModel = Model3D[modelName];
            if (currentModel.model === null) {
                // The model is not loaded yet
                loaded = false;

                // Add the model to the load manager
                this.modelLoader.load(Config.modelsPath + currentModel.modelName, gltf => {
                    currentModel.model = gltf;

                    // Load the other models
                    this.loadModels(callback);
                });

                break;
            }
        }

        // Start ThreeJS when it's done
        if (loaded) callback();
    }

    /**
     * Display a given level design element
     * @param {Object} element The element to display
     */
    displayElement(element) {
        const currentMesh = new MeshManager(element.name, element.type, element.position);

        // Set the rotation
        if (element.hasOwnProperty('rotation'))
            currentMesh.setRotationFromVector(element.rotation);

        // Add the current element to the scene
        this.allObjects[element.name] = currentMesh;
        currentMesh.addToScene(this.scene);
    }

    /**
     * Display all of level design elements
     */
    displayAllElements() {
        for (const element of Elements)
            this.displayElement(element);
    }

    /**
     * Search an object name on the grid by its position
     * @param {THREE.Vector2} pos The 2D position of the searched object
     * @param {Number} playerId The grid id of the searched object
     * @returns The found object name or null
     */
    getObjectNameOnGrid(pos, playerId) {
        for (const objName in this.allObjects) {
            const obj = this.allObjects[objName];

            // Check the object type
            if (obj.type !== 'Grass' && obj.type !== 'Sheep')
                continue;

            // Check the object position
            const currentPos = obj.getGridPosition();
            if (currentPos.x == pos.x && currentPos.y == pos.y && currentPos.z == playerId)
                return objName;
        }

        return null;
    }

    /**
     * Display the given grid as the player grid
     * @param {Array} grid The grid to display
     * @param {Number} playerId The owner id
     */
    displayPlayerGrid(grid, playerId) {
        for (let x = 0; x < grid.length; x++)
            for (let y = 0; y < grid.length; y++) {
                const currentCase = grid[y][x];
                const currentPosition = new Vector2(x, y);
                
                // Check if a sheep must be placed
                if (currentCase !== 1) continue;

                const currentObjName = this.getObjectNameOnGrid(currentPosition, playerId);
                const currentObj = this.allObjects[currentObjName];

                // Check if a sheep is already placed
                if (currentObj.type === 'Sheep') continue;

                // Replace the grass object by a sheep object
                currentObj.removeFromScene(this.scene);
                delete this.allObjects[currentObjName];
                const newSheep = createSheep(currentPosition, playerId);
                this.displayElement(newSheep);
            }
    }

    uncoverGridCase(pos, playerId) {

    }
};
import { GLTFLoader } from 'https://unpkg.com/three@0.137.0/examples/jsm/loaders/GLTFLoader.js';

import { Model3D } from '../level_design/model_3d.js';
import { Config } from '../config.js';

// Level design imports
import { MeshManager } from '../level_design/MeshManager.js';
import { Elements } from '../level_design/level_design.js';

export class View {
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

    displayAllElements() {
        for (const element of Elements) {
            const currentMesh = new MeshManager(element.name, element.type, element.position);

            // Set the rotation
            if (element.hasOwnProperty('rotation'))
                currentMesh.setRotationFromVector(element.rotation);

            // Add the current element to the scene
            this.allObjects[element.name] = currentMesh;
            currentMesh.addToScene(this.scene);
        }
    }
};
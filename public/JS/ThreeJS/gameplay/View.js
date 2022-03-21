import { Vector2, LoadingManager, TextureLoader, NearestFilter, SpriteMaterial, Sprite } from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.137.0/examples/jsm/loaders/GLTFLoader.js';

import { Config } from '../config.js';

// Level design imports
import { Model3D } from '../level_design/model_3d.js';
import { MeshManager } from '../level_design/MeshManager.js';
import { Elements, createSheep, createGrass } from '../level_design/level_design.js';
import { Textures } from '../level_design/textures.js';

/* -------------------------------------------------------------------------- */
/*                           Manage the ThreeJS view                          */
/* -------------------------------------------------------------------------- */
export class View {

    /**
     * The View constructor
     */
    constructor() {
        this.scene = undefined;

        this.sceneState = {
            turningGrass: null,
            isCapillotractomAnimate: false
        };
        this.allObjects = {};
        this.capillotractoms = [];

        // Init load managers
        this.loadManager = new LoadingManager();
        this.textureLoader = new TextureLoader(this.loadManager);
        this.modelLoader = new GLTFLoader();
    }

    /**
     * Load each textures and start loading models
     * @param {Function} callback Function executed after the models loading
     */
    load(callback) {
        // Load each texture
        for (let textureName in Textures) {
            if (!Textures.hasOwnProperty(textureName)) continue;

            // Skip loaded textures
            const current = Textures[textureName];
            if (current.texture !== null) continue;

            // Add the texture to the loader
            current.texture = this.textureLoader.load(Config.texturesPath + current.fileName);
            current.texture.magFilter = NearestFilter;
        }

        this.loadManager.onLoad = () => this.loadModels(callback);

        // Create the Capillotractom
        const capillotractomMaterial = new SpriteMaterial({ map: Textures.Capillotractom.texture });
        const capillotractom1 = new Sprite(capillotractomMaterial);
        capillotractom1.scale.multiplyScalar(Config.capillotractom.scale);
        this.capillotractoms.push(capillotractom1, capillotractom1.clone());
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
        console.log(this.allObjects);
        for (const objName in this.allObjects) {
            const obj = this.allObjects[objName];

            // Check the object type
            // Skip objects which aren't on the grid
            const interested = ['Grass', 'Sheep', 'ShornSheep'];
            if (!interested.includes(obj.type))
                continue;

            // Check the object position
            const currentPos = obj.getGridPosition();
            if (currentPos.x === pos.x && currentPos.y === pos.y && currentPos.z === playerId)
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
                // Get position data
                const currentCase = grid[y][x];
                const currentPosition = new Vector2(x, y);
                
                // Get current placed object
                const currentObjName = this.getObjectNameOnGrid(currentPosition, playerId);
                const currentObj = this.allObjects[currentObjName];
                
                if (currentCase === 1 && currentObj.type !== 'Sheep') {
                    // Replace the grass object by a sheep object
                    currentObj.removeFromScene(this.scene);
                    delete this.allObjects[currentObjName];
                    const newSheep = createSheep(currentPosition, playerId);
                    this.displayElement(newSheep);
                } else if (currentCase === 0 && currentObj.type === 'Sheep') {
                    // Replace the sheep by a grass
                    currentObj.removeFromScene(this.scene);
                    delete this.allObjects[currentObjName];
                    const newGrass = createGrass(currentPosition, playerId);
                    this.displayElement(newGrass);
                }
            }
    }

    /**
     * Uncover a grid case
     * @param {THREE.Vector2} pos The position of the case to uncover
     * @param {Number} playerId The player id
     * @param {Number} type 0 -> Nothing, 1 -> A basic sheep, 2 -> A shorn sheep
     */
    uncoverGridCase(pos, playerId, type = 0) {
        const grassName = this.getObjectNameOnGrid(pos, playerId);
        if (!grassName) throw "Error finding an object at (" + pos.x + ", " + pos.y + ", " + playerId + ")";
        const grass = this.allObjects[grassName];
        
        // Remove the grass
        grass.removeFromScene(this.scene);
        delete this.allObjects[grassName];

        // Show a sheep if it should
        if (type > 0) {
            const newSheep = createSheep(pos, playerId, type === 2);
            this.displayElement(newSheep);
        }
    }

    /**
     * Show Capillotractoms go through the map
     */
    showCapillotractoms() {
        for (let i = 0; i < this.capillotractoms.length; i++) {
            // Update the capillotractom position
            this.capillotractoms[i].position.fromArray(Config.capillotractom.startPositions[i].toArray());
            
            // Add it to the scene
            this.scene.add(this.capillotractoms[i]);
        }

        // Animate
        this.sceneState.isCapillotractomAnimate = true;
        
        setTimeout(() => {
            // Stop animation
            this.sceneState.isCapillotractomAnimate = false;

            setTimeout(() => {
                // Remove them from scene
                for (const cpt of this.capillotractoms)
                    this.scene.remove(cpt);
            }, 1000);
        }, 2500);
    }
};
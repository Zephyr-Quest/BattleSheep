import { Vector3 } from "three";

import { Locatable } from "./Locatable.js";
import { Model3D } from "../model_3d.js";

/* -------------------------------------------------------------------------- */
/*                         Manage a displayed 3D model                        */
/* -------------------------------------------------------------------------- */
export class MeshManager extends Locatable {
    constructor(name, type, position) {
        super(position.x, position.y, position.z);

        this.name = name;
        this.type = type;
        this.scaleFactor = Model3D[type].scale;
        this.positionDelta = Model3D[type].positionDelta;
        this.rotationDelta = Model3D[type].rotationDelta;
        this.mesh = null;
    }

    /**
     * Add the mesh to the ThreeJS scene
     * @param {THREE.Scene} scene The ThreeJS scene
     */
    addToScene(scene) {
        // Create the mesh from the model
        this.mesh = Model3D[this.type].model.scene.clone();
        
        // Update it with all params
        this.updateScene();

        // Add it to the scene
        scene.add(this.mesh);
    }

    /**
     * Update the mesh with all params
     */
    updateScene() {
        this.mesh.name = this.name;

        // Set the position
        this.mesh.position.fromArray(this.getPositionArray());
        this.mesh.position.add(this.positionDelta);

        // Set the rotation
        const rot = this.getRotationVector();
        rot.add(this.rotationDelta);
        this.mesh.rotation.setFromVector3(rot);

        // Update the size
        this.mesh.scale.fromArray([1, 1, 1]);
        this.mesh.scale.multiplyScalar(this.scaleFactor);
    }

    /**
     * Up the mesh if it's a grass mesh
     */
    upGrass() {
        if (this.type !== 'Grass') return;
        
        // Up the grass
        this.y++;
        this.updateScene();
    }

    /**
     * Down the mesh if it's a grass mesh
     */
    downGrass() {
        if (this.type !== 'Grass') return;

        // Up the grass
        this.y--;
        this.rotY = 0;
        this.updateScene();
    }
};
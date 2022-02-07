import { Locatable } from "./Locatable.js";
import { Model3D } from "../model_3d.js";

/* -------------------------------------------------------------------------- */
/*                         Manage a displayed 3D model                        */
/* -------------------------------------------------------------------------- */
export class MeshManager extends Locatable {
    constructor(name, position) {
        super(position.x, position.y, position.z);

        this.name = name;
        this.scaleFactor = Model3D[name].scale;
        this.positionDelta = Model3D[name].positionDelta;
        this.rotationDelta = Model3D[name].rotationDelta;
        this.mesh = null;
    }

    addToScene(scene) {
        this.mesh = Model3D[this.name].model.scene.clone();
        
        // Set the position
        this.mesh.position.fromArray(this.getPositionArray());
        this.mesh.position.add(this.positionDelta);

        // Set the rotation
        const rot = this.getRotationVector();
        rot.add(this.rotationDelta);
        this.mesh.rotation.setFromVector3(rot);

        // Update the size
        this.mesh.scale.multiplyScalar(this.scaleFactor);

        scene.add(this.mesh);
    }
};
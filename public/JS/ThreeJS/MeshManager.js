import { Locatable } from "./Locatable.js";
import { Model3D } from "./Model3D.js";

/* -------------------------------------------------------------------------- */
/*                         Manage a displayed 3D model                        */
/* -------------------------------------------------------------------------- */
export class MeshManager extends Locatable {
    constructor(name, x, y, z) {
        super(x, y, z);

        this.name = name;
        this.scaleFactor = Model3D[name].scale;
        this.positionDelta = Model3D[name].position;
        this.mesh = null;
    }

    addToScene(scene) {
        this.mesh = Model3D[this.name].model.scene.clone();
        
        // Set the position
        this.mesh.position.fromArray(this.getPositionArray());

        // Update the position
        this.mesh.position.add(this.positionDelta);

        // Update the size
        this.mesh.scale.multiplyScalar(this.scaleFactor);

        scene.add(this.mesh);
    }
};
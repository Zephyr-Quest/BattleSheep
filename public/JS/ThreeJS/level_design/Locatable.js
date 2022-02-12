import { Vector3, Vector2 } from "three";

/* -------------------------------------------------------------------------- */
/*              Represent a 3D object with position and rotation              */
/* -------------------------------------------------------------------------- */
export class Locatable {
    /**
     * The Locatable constructor
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Number} z The Z position
     */
    constructor(x, y, z) {
        // Positions
        this.x = x;
        this.y = y;
        this.z = z;

        // Rotations
        this.rotX = this.rotY = this.rotZ = 0;
    }

    /**
     * Convert the position to an array
     * @returns The position array
     */
    getPositionArray() {
        return [this.x, this.y, this.z];
    }

    /**
     * Set the position from an array
     * @returns The position array
     */
    setPositionFromArray(array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
    }

    /**
     * Convert the position to an 3D vector
     * @returns The position vector
     */
    getPositionVector() {
        return new Vector3(this.x, this.y, this.z);
    }

    /**
     * Set the position from a vector
     * @returns The position vector
     */
    setPositionFromVector(vector) {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
    }

    /**
     * Convert the rotation to an array
     * @returns The rotation array
     */
    getRotationArray() {
        return [this.rotX, this.rotY, this.rotZ];
    }

    /**
     * Set the rotation from an array
     * @returns The rotation array
     */
    setRotationFromArray(array) {
        this.rotX = array[0];
        this.rotY = array[1];
        this.rotZ = array[2];
    }

    /**
     * Convert the rotation to an 3D vector
     * @returns The rotation vector
     */
    getRotationVector() {
        return new Vector3(this.rotX, this.rotY, this.rotZ);
    }

    /**
     * Set the rotation from a vector
     * @returns The rotation vector
     */
    setRotationFromVector(vector) {
        this.rotX = vector.x;
        this.rotY = vector.y;
        this.rotZ = vector.z;
    }

    /**
     * Convert the position to a grid position
     * @returns The grid position
     */
    getGridPosition() {
        let x, y, z = this.z > 0 ? 0 : 1;
        if (z === 0) {
            x = (this.x + 10) / 2.5;
            y = (this.z - 2) / 2.5;
        } else {
            x = (this.x - 12.5) / (-2.5);
            y = (this.z + 2.5) / (-2.5);
        }
        return new Vector3(Math.abs(x), Math.abs(y), z);
    }
}
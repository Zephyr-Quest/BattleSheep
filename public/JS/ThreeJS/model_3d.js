import { Vector3 } from 'three';

/* -------------------------------------------------------------------------- */
/*                   List all of 3D models used in the game                   */
/* -------------------------------------------------------------------------- */
export const Model3D = {
    Map: {
        modelName: 'map.glb',
        model: null,
        scale: 200,
        positionDelta: new Vector3(-50, -0.525, -50)
    },
    Fence: {
        modelName: 'fence.glb',
        model: null,
        scale: 1,
        positionDelta: new Vector3(0, 0.5, 0)
    },
    Grass: {
        modelName: 'grass.glb',
        model: null,
        scale: 5,
        positionDelta: new Vector3(0, -0.5, 0)
    },
    Sheep: {
        modelName: 'sheep.glb',
        model: null,
        scale: 1,
        positionDelta: new Vector3(0, 0.42, 0)
    }
};
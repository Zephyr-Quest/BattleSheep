import { Vector3 } from 'three';

/* -------------------------------------------------------------------------- */
/*                         List all displayed elements                        */
/* -------------------------------------------------------------------------- */
export const Elements = [
    { type: 'Map', position: new Vector3(0, 0, 0) },
    { type: 'Fence', position: new Vector3(2, 0, 0) },
    { type: 'Grass', position: new Vector3(0, 0, 0) },
    { type: 'Sheep', position: new Vector3(-2.5, 0, 0), rotation: new Vector3(0, Math.PI, 0) },
]
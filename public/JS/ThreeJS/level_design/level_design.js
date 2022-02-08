import { Vector3 } from 'three';

/* -------------------------------------------------------------------------- */
/*                         List all displayed elements                        */
/* -------------------------------------------------------------------------- */
const tmpElements = [
    { type: 'Map' , name: 'Map0', position: new Vector3(0, 0, 0) }
];

// Add fences
const fenceLocations = [
    new Vector3(-6, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(6, 0, 0),
];
for (let i = 0; i < fenceLocations.length; i++)
    tmpElements.push({ type: 'Fence', name: 'Fence' + i, position: fenceLocations[i] });

// Add grass and 2 sheeps
let grassCounter, sheepCounter;
grassCounter = sheepCounter = 0;
for (let k = 0; k < 2; k++)
    for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++) {
            tmpElements.push({ type: 'Grass', name: 'Grass' + grassCounter, position: new Vector3(i * 2.5 - 10, 0, j * 2.5 + 2 - (k * 27)) });
            grassCounter++;
        }
            // if ((i != 5 || j != 5) && (i != 6 || j != 5)) {
            // }

function addSheep(id, position) {
    tmpElements.push({
        type: 'Sheep',
        name: 'Sheep' + id,
        position,
        rotation: new Vector3(0, Math.random() * (Math.PI * 2), 0)
    });
}

export const Elements = tmpElements;
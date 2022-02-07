import { Vector3 } from 'three';

/* -------------------------------------------------------------------------- */
/*                         List all displayed elements                        */
/* -------------------------------------------------------------------------- */
const tmpElements = [
    { type: 'Map', position: new Vector3(0, 0, 0) }
]

// Add fences
const fenceLocations = [
    new Vector3(-6, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(6, 0, 0),
]
for (const loc of fenceLocations)
    tmpElements.push({ type: 'Fence', position: loc });

// Add grass and 2 sheeps
for (let k = 0; k < 2; k++)
    for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++)
            if ((i != 5 || j != 5) && (i != 6 || j != 5))
                tmpElements.push({ type: 'Grass', position: new Vector3(i * 2.5 - 10, 0, j * 2.5 + 2 - (k * 27)) });
            else
                addSheep(new Vector3(i * 2.5 - 10, 0, j * 2.5 + 2 - (k * 27)));

function addSheep(position) {
    tmpElements.push({
        type: 'Sheep',
        position,
        rotation: new Vector3(0, Math.random() * (Math.PI * 2), 0)
    })
}

export const Elements = tmpElements;
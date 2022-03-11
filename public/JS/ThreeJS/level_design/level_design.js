import { Vector2, Vector3 } from 'three';

/* -------------------------------------------------------------------------- */
/*                         List all displayed elements                        */
/* -------------------------------------------------------------------------- */
const tmpElements = [
    { type: 'Map', name: 'Map0', position: new Vector3(0, 0, 0) },
    
    // Side 1
    { type: 'RedFarm', name: 'RedFarm0', position: new Vector3(-23, 0, -20), rotation: new Vector3(0, Math.PI / 2 + 0.3, 0) },
    { type: 'Tree', name: 'Tree0', position: new Vector3(-14, 0, -30) },
    { type: 'Bush', name: 'Bush0', position: new Vector3(15, 0, -33), rotation: new Vector3(0, Math.PI, 0) },
    { type: 'Bush', name: 'Bush1', position: new Vector3(15, 0, -28), rotation: new Vector3(0, -0.5, 0) },
    
    // Side 0
    { type: 'BlueFarm', name: 'BlueFarm0', position: new Vector3(23, 0, 20), rotation: new Vector3(0, -Math.PI / 2 + 0.3, 0) },
    { type: 'Tree', name: 'Tree1', position: new Vector3(14, 0, 30) },
    { type: 'Tree', name: 'Tree2', position: new Vector3(6, 0, 31), rotation: new Vector3(0, -0.5, 0) },
    { type: 'Bush', name: 'Bush2', position: new Vector3(25, 0, 10), rotation: new Vector3(0, 1, 0) },

];

/* --------------------------------- Fences --------------------------------- */

const fenceLocations = [
    new Vector3(-6, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(6, 0, 0),
];
for (let i = 0; i < fenceLocations.length; i++)
    tmpElements.push({ type: 'Fence', name: 'Fence' + i, position: fenceLocations[i] });

/* ---------------------------------- Grid ---------------------------------- */

// Init counter
let grassCounter, sheepCounter, targetCounter, crossCounter;
grassCounter = sheepCounter = targetCounter = crossCounter = 0;

// Add all grass
for (let playerId = 0; playerId < 2; playerId++)
    for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++) {
            const currentPos = new Vector2(i, j)
            tmpElements.push(createGrass(currentPos, playerId));
        }

/**
 * Generate a grass level design object
 * @param {THREE.Vector2} pos The 2D position
 * @param {Number} playerId The grid id
 * @returns The grass data
 */
function createGrass(pos, playerId) {
    const grass = {
        type: 'Grass',
        name: 'Grass' + grassCounter,
        position: getPositionFromPlayerId(pos, playerId),
        rotation: getRandomRotationY()
    };
    grassCounter++;
    return grass;
}

/**
 * Generate a target level design object
 * @param {THREE.Vector2} pos The 2D position
 * @param {Number} y The y position
 * @param {Number} playerId The grid id
 * @returns The target data
 */
function createTarget(pos, y, playerId) {
    // Set position
    let position = getPositionFromPlayerId(pos, playerId);
    position.y += y;

    // Create the target object
    const target = {
        type: 'Target',
        name: 'Target' + targetCounter,
        position
    };
    targetCounter++;
    
    return target;
}

/**
 * Generate a cross level design object
 * @param {THREE.Vector2} pos The 2D position
 * @param {Number} y The y position
 * @param {Number} playerId The grid id
 * @returns The cross data
 */
function createCross(pos, y, playerId) {
    // Set position
    let position = getPositionFromPlayerId(pos, playerId);
    position.y += y;

    // Create the target object
    const target = {
        type: 'Cross',
        name: 'Cross' + crossCounter,
        position
    };
    crossCounter++;

    return target;
}

/**
 * Generate a sheep level design object
 * @param {THREE.Vector2} pos The 2D position
 * @param {Number} playerId The grid id
 * @param {boolean} isShorn If the sheep must be shorn or not
 * @returns The sheep data
 */
function createSheep(pos, playerId, isShorn = false) {
    const sheep = {
        type: (isShorn ? 'Shorn' : '') + 'Sheep',
        name: (isShorn ? 'Shorn' : '') + 'Sheep' + sheepCounter,
        position: getPositionFromPlayerId(pos, playerId),
        rotation: getRandomRotationY()
    };
    sheepCounter++;
    return sheep;
}

/**
 * Generate a random rotation vector
 * @returns The random rotation vector
 */
function getRandomRotationY() {
    return new Vector3(0, Math.random() * (Math.PI * 2), 0);
}

/**
 * Convert the position with the player id
 * @param {THREE.Vector2} pos The position to convert
 * @param {Number} playerId The player id
 * @returns The position Vector3
 */
function getPositionFromPlayerId(pos, playerId) {
    if (playerId === 0)
        return new Vector3(pos.x * 2.5 - 10, 0, pos.y * 2.5 + 2);
    else
        return new Vector3(pos.x * (-2.5) + 12.5, 0, pos.y * (-2.5) - 2.5);
}

/* --------------------------------- Exports -------------------------------- */

export {
    tmpElements as Elements,
    createGrass,
    createSheep,
    createTarget,
    createCross
};
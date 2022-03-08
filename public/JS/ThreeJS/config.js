import { Vector3, Color } from 'three';

/* -------------------------------------------------------------------------- */
/*                             All of config data                             */
/* -------------------------------------------------------------------------- */
export const Config = {
    modelsPath: '../models/',
    texturesPath: '../img/textures/',
    lightPosition: new Vector3(-170, 80, 25),
    cameraPositions: {
        "q": new Vector3(0, 23, 36),
        "s": new Vector3(0, 45, 0),
        "d": new Vector3(0, 23, -36)
    },
    backgroundColor: new Color(0x0099ff),
    light: {
        color: 0xF1E6B7,
        intensity: 2
    },
    capillotractom: {
        scale: 10,
        startPositions: [
            new Vector3(17, 4, 9),
            new Vector3(-17, 4, -9)
        ],
        speed: 0.2
    }
};
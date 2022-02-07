import { Vector3 } from 'three';

/* -------------------------------------------------------------------------- */
/*                             All of config data                             */
/* -------------------------------------------------------------------------- */
export const Config = {
    modelsPath: '../models/',
    skyboxPath: '../img/skybox/skybox_',
    lightPosition: new Vector3(-170, 80, 25),
    cameraPositions: {
        "q": new Vector3(0, 19, 36),
        "s": new Vector3(0, 39, 0),
        "d": new Vector3(0, 19, -36)
    }
};
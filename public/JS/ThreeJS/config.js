import { Vector3 } from 'three';

/* -------------------------------------------------------------------------- */
/*                             All of config data                             */
/* -------------------------------------------------------------------------- */
export const Config = {
    modelsPath: '../models/',
    skyboxPath: '../img/skybox/skybox_',
    positionDelta: new Vector3(-12, -0.55, -13),
    cameraPositions: {
        "q": new Vector3(0, 8, 15),
        "d": new Vector3(0, 8, -15)
    }
};
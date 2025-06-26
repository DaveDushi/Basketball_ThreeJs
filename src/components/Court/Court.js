import { createMeshes } from "./meshes.js";

class Court extends THREE.Group {
    constructor() {
        super();

        this.meshes = createMeshes();

        const threePointCurveCopy = this.meshes.threePointCurve.clone();
        threePointCurveCopy.scale.x = -1;

        this.add(
            this.meshes.court,
            this.meshes.centerLine,
            this.meshes.circle,
            this.meshes.threePointCurve,
            threePointCurveCopy
        )

    }

    tick(delta) {


    }
}

export { Court };
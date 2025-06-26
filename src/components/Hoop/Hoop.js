import { createMeshes } from "./meshes.js";

class Hoop extends THREE.Group {
    constructor() {
        super();

        this.meshes = createMeshes();

        this.add(
          this.meshes.hoop,
          this.meshes.base,
        )

    }

    tick(delta) {


    }
}

export { Hoop };
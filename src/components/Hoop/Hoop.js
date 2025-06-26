import { Group } from "three";
import { createMeshes } from "./meshes";

class Hoop extends Group {
    constructor() {
        super();

        this.meshes = createMeshes();

        this.add(
        //   this.meshes.backboard,
          this.meshes.hoop,
        //   this.meshes.uprightPole
        )

    }

    tick(delta) {


    }
}

export { Hoop };
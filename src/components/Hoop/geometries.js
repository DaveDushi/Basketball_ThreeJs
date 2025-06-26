import {
    BoxGeometry,
    CylinderGeometry,
    RingGeometry
}
from 'three';
import { TorusGeometry } from 'three/webgpu';

function createGeometries() {
  
    const pole = new BoxGeometry(.3, 1, .3);

    const backboard = new BoxGeometry(1.83, 1.22, .05);

    const connector = new BoxGeometry(0.05, 0.02, 0.05)

    const rim = new TorusGeometry(0.23, 0.015, 64, 64)

    const net = new CylinderGeometry(0.23, 0.15, 0.4, 50, 4, true)

    return {
        pole,
        backboard,
        connector,
        rim,
        net,
    }
}

export { createGeometries}
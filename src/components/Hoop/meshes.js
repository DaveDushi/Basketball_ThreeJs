import { createGeometries } from "./geometries.js";
import { createMaterials } from "./materials.js";
function createMeshes() {
    const geometries = createGeometries();
    const materials = createMaterials();
    
    // Create the Hoop
    const hoop = new THREE.Group();

    const backboard = new THREE.Mesh(geometries.backboard, materials.glass);

    const rim = new THREE.Group();
    const rimConnector = new THREE.Mesh(geometries.connector, materials.orangeMetal);
    rimConnector.position.z = 0.05;

    const rimCircle = new THREE.Mesh(geometries.rim, materials.orangeMetal);
    rimCircle.rotation.x = Math.PI / 2;
    rimCircle.position.z = 0.3;

    const net = new THREE.Mesh(geometries.net, materials.net);
    net.position.z = 0.3;
    net.position.y = -0.2;

    rim.add(rimCircle, rimConnector, net);
    rim.position.y = -0.305;

    hoop.add(backboard, rim);
    hoop.position.y = 3.34;

    // Create the base 
    const base = new THREE.Group();

    const pole = new THREE.Mesh(geometries.pole, materials.base);
    const baseBottom = new THREE.Mesh(geometries.base, materials.base);

    const mount = new THREE.Mesh(geometries.mount, materials.base);
    mount.position.y = 3 + 0.2285;
    mount.rotation.x = -(Math.PI / 2);
    mount.position.z = 1.68;

    const uprightPole = pole.clone();
    uprightPole.scale.y = 3.23;
    uprightPole.position.y = 3.23 / 2;

    const horizontalPole = pole.clone();
    horizontalPole.scale.y = 1.55;
    horizontalPole.rotation.x = Math.PI / 2;
    horizontalPole.position.y = 3.23;
    horizontalPole.position.z = 0.675;

    const slantedPole = pole.clone();
    slantedPole.scale.y = 2;
    slantedPole.rotation.x = 0.8;
    slantedPole.position.y = 2.5;
    slantedPole.position.z = 0.7;

    base.add(baseBottom, mount, horizontalPole, uprightPole, slantedPole);
    base.position.z = -1.7192;

    return {
        hoop,
        base,
    };
}

export { createMeshes };

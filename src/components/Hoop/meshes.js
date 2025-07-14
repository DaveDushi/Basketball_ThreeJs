import { createGeometries } from "./geometries.js";
import { createMaterials } from "./materials.js";
function createMeshes() {
    const geometries = createGeometries();
    const materials = createMaterials();
    
    // Create the Hoop
    const hoop = new THREE.Group();
    hoop.name = 'hoopAssembly';

    const backboard = new THREE.Mesh(geometries.backboard, materials.glass);
    backboard.name = 'backboard';

    const rim = new THREE.Group();
    rim.name = 'rimAssembly';

    const rimConnector = new THREE.Mesh(geometries.connector, materials.orangeMetal);
    rimConnector.position.z = 0.05;
    rimConnector.name = 'rimConnector';

    const rimCircle = new THREE.Mesh(geometries.rim, materials.orangeMetal);
    rimCircle.rotation.x = Math.PI / 2;
    rimCircle.position.z = 0.3;
    rimCircle.name = 'rimCircle';

    const net = new THREE.Mesh(geometries.net, materials.net);
    net.position.z = 0.3;
    net.position.y = -0.2;
    net.name = 'basketballNet';

    rim.add(rimCircle, rimConnector, net);
    rim.position.y = -0.305;

    hoop.add(backboard, rim);
    hoop.position.y = 3.34;

    // Create the base 
    const base = new THREE.Group();
    base.name = 'hoopBase';

    const pole = new THREE.Mesh(geometries.pole, materials.base);
    pole.name = 'basePole';

    const baseBottom = new THREE.Mesh(geometries.base, materials.base);
    baseBottom.name = 'baseBottom';

    const mount = new THREE.Mesh(geometries.mount, materials.base);
    mount.position.y = 3 + 0.2285;
    mount.rotation.x = -(Math.PI / 2);
    mount.position.z = 1.68;
    mount.name = 'backboardMount';

    const uprightPole = pole.clone();
    uprightPole.scale.y = 3.23;
    uprightPole.position.y = 3.23 / 2;
    uprightPole.name = 'uprightPole';

    const horizontalPole = pole.clone();
    horizontalPole.scale.y = 1.55;
    horizontalPole.rotation.x = Math.PI / 2;
    horizontalPole.position.y = 3.23;
    horizontalPole.position.z = 0.675;
    horizontalPole.name = 'horizontalPole';

    const slantedPole = pole.clone();
    slantedPole.scale.y = 2;
    slantedPole.rotation.x = 0.8;
    slantedPole.position.y = 2.5;
    slantedPole.position.z = 0.7;
    slantedPole.name = 'slantedPole';

    base.add(baseBottom, mount, horizontalPole, uprightPole, slantedPole);
    base.position.z = -1.7192;

    return {
        hoop,
        base,
    };
}

export { createMeshes };

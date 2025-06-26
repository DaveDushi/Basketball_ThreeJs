import { Mesh, Line, Group } from 'three';

import { createGeometries } from './geometries';
import { createMaterials } from './materials';

function createMeshes() {
    const geometries = createGeometries();
    const materials = createMaterials();
    
    const pole = new Mesh(geometries.pole, materials.base)

    const uprightPole = pole.clone()
    uprightPole.scale.y = 3.68
    uprightPole.position.y = 1.84

    const hoop = new Group()

    const backboard = new Mesh(geometries.backboard, materials.glass)

    const rim = new Group()
    const rimConnector = new Mesh(geometries.connector, materials.orangeMetal)
    rimConnector.position.z = .05;

    const rimCircle = new Mesh(geometries.rim, materials.orangeMetal);
    rimCircle.rotation.x = Math.PI / 2
    rimCircle.position.z = 0.3

    const net = new Mesh(geometries.net, materials.net)
    net.position.z = 0.3;
    net.position.y = -.2;

    rim.add(rimCircle, rimConnector, net)

    rim.position.y = -0.305;

    hoop.add(backboard, rim)

    hoop.position.y = 3.07


    

    return {
       uprightPole,
       hoop
    }
}

export { createMeshes };
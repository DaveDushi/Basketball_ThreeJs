import { createGeometries } from './geometries.js';
import { createMaterials } from './materials.js';

function createMeshes() {
    const geometries = createGeometries();
    const materials = createMaterials();

    const court = new THREE.Mesh(geometries.court, materials.floor);
    court.receiveShadow = true;
   
    const line = new THREE.Mesh( geometries.line, materials.paint);

    const centerLine = line.clone();
    centerLine.scale.y = 50
    centerLine.rotation.x = (Math.PI / 2);
    

    const threePointCurve = new THREE.Group()
    const leftLine = line.clone();
    leftLine.scale.y = 14;
    leftLine.rotation.z = (Math.PI / 2)
    leftLine.rotation.x = (Math.PI / 2)
    leftLine.position.z = -6.7056
    leftLine.position.x = 12.192

    const rightLine = line.clone();
    rightLine.scale.y = 14;
    rightLine.rotation.z = (Math.PI / 2)
    rightLine.rotation.x = (Math.PI / 2)
    rightLine.position.z = 6.7056
    rightLine.position.x = 12.192

    const arc = new THREE.Mesh(geometries.threePointArc, materials.paint)
    arc.position.y = 0.15
    arc.rotation.x = (Math.PI / 2)
    arc.rotation.z = (Math.PI / 1.577)
    arc.position.x = 13.1064;

    threePointCurve.add(leftLine, rightLine, arc)


    const circle = new THREE.Mesh(geometries.circle, materials.paint)
    circle.position.y = 0.15
    circle.rotation.x = (Math.PI / 2)


    const ball = new THREE.Mesh(geometries.ball, materials.grip)
    ball.position.y = 0.1143 + .22

    return {
       court,
       centerLine,
       circle,
       threePointCurve,
       ball
    }
}

export { createMeshes };
function createGeometries() {
  
    const pole = new THREE.BoxGeometry(.2, 1, .2);

    const backboard = new THREE.BoxGeometry(1.83, 1.22, .05);

    const connector = new THREE.BoxGeometry(0.05, 0.02, 0.05);

    const rim = new THREE.TorusGeometry(0.23, 0.015, 64, 64);

    const net = new THREE.CylinderGeometry(0.23, 0.13, 0.4, 18, 4, true);

    const base = new THREE.BufferGeometry();

    // Vertices for a slanted 3D trapezoid
    const vertices = new Float32Array([
        -0.5, 0, -0.5,
        0.5, 0, -0.5,
        0.5, 0,  0.5,
        -0.5, 0,  0.5,
        -0.1, .75, -0.1,
        0.1, .75, -0.1,
        0.1, .75,  0.1,
        -0.1, .75,  0.1
    ]);

    const indices = [
        0, 1, 2, 0, 2, 3,
        4, 6, 5, 4, 7, 6,
        0, 5, 1, 0, 4, 5,
        1, 6, 2, 1, 5, 6,
        2, 7, 3, 2, 6, 7,
        3, 4, 0, 3, 7, 4
    ];

    base.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    base.setIndex(indices);
    base.computeVertexNormals();

    const mount = new THREE.BufferGeometry();

    const mountVertices = new Float32Array([
        -0.305, 0, -0.2285,
        0.305, 0, -0.2285,
        0.305, 0,  0.2285,
        -0.305, 0,  0.2285,
        -0.1, .25, -0.1,
        0.1, .25, -0.1,
        0.1, .25,  0.1,
        -0.1, .25,  0.1
    ]);

    const mountIndices = [
        0, 1, 2, 0, 2, 3,
        4, 6, 5, 4, 7, 6,
        0, 5, 1, 0, 4, 5,
        1, 6, 2, 1, 5, 6,
        2, 7, 3, 2, 6, 7,
        3, 4, 0, 3, 7, 4
    ];

    mount.setAttribute('position', new THREE.BufferAttribute(mountVertices, 3));
    mount.setIndex(mountIndices);
    mount.computeVertexNormals();

    return {
        pole,
        backboard,
        connector,
        rim,
        net,
        base,
        mount
    };
}

export { createGeometries };

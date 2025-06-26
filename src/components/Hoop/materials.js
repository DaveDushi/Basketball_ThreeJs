function createMaterials() {
    const base = new THREE.MeshStandardMaterial({
        color: 0x4F5050,
        metalness: true,
        roughness: 0.6
    });

    const glass = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });

    const orangeMetal = new THREE.MeshStandardMaterial({
        color: 0xEC6F02,
        metalness: true,
        roughness: 0.6,
        side: THREE.DoubleSide
    });

    const net = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true
    });

    return { 
        base,
        glass,
        orangeMetal,
        net
    };
}

export { createMaterials };

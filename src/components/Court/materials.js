function createMaterials() {
    const textureLoader = new THREE.TextureLoader();
    const knicksFloor = textureLoader.load('src/assets/woodfloor.jpg');
    const gripTexture = textureLoader.load('src/assets/basketball_texture2.png');
    const gripNormalMap = textureLoader.load('src/assets/basketball_normal_map.png');

    const floor = new THREE.MeshPhongMaterial({ 
        shininess: 50,
        map: knicksFloor
    })

    const paint = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });

    const grip = new THREE.MeshStandardMaterial({
        map: gripTexture,
        normalMap: gripNormalMap

    })

    const sideLines = new THREE.MeshPhongMaterial({
        color: 0xB2E4FE,
        shininess: 50
    })

    return { 
        floor, 
        paint,
        grip,
        sideLines
     };
}

export { createMaterials };
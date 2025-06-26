function createMaterials() {
    const textureLoader = new THREE.TextureLoader();
    const knicksFloor = textureLoader.load('src/assets/woodfloor.jpg');

    const floor = new THREE.MeshPhongMaterial({ 
        shininess: 50,
        map: knicksFloor
    })

    const paint = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });

    return { 
        floor, 
        paint
     };
}

export { createMaterials };
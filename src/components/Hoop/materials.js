import { 
    MeshStandardMaterial, 
    MeshPhongMaterial, 
    TextureLoader, 
    LineBasicMaterial, 
    DoubleSide
} from "three";
import { or } from "three/tsl";

function createMaterials() {
    const base = new MeshPhongMaterial({
        color: 0x4F5050,
        shininess: 60,
    })

    const glass = new MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    })

    const orangeMetal = new MeshStandardMaterial({
        color: 0xEC6F02,
        metalness: true,
        roughness: 0.6,
        side: DoubleSide
        
    })

    const net = new MeshStandardMaterial({
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
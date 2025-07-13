import { createMeshes } from "./meshes.js";

class Court extends THREE.Group {
    constructor() {
        super();

        this.meshes = createMeshes();

        const threePointCurveCopy = this.meshes.threePointCurve.clone();
        threePointCurveCopy.scale.x = -1;

        this.add(
            this.meshes.court,
            this.meshes.centerLine,
            this.meshes.circle,
            this.meshes.threePointCurve,
            threePointCurveCopy,
            this.meshes.ball,
            this.meshes.leftHoop,
            this.meshes.rightHoop,
            this.meshes.sideLines
        )
        
        // ball physics
        this.shooting = false;
        this.velocity = new THREE.Vector3(); // x, y, z velocity
        this.gravity = -9.8; // meters/second^2

    }

    tick(delta, keysPressed) {
        // --- Shooting physics ---
        if (this.shooting) {
            this.velocity.y += this.gravity * delta;
            this.meshes.ball.position.addScaledVector(this.velocity, delta);

            const groundY = 0.3343;
            if (this.meshes.ball.position.y <= groundY) {
            this.meshes.ball.position.y = groundY;
            this.velocity.set(0, 0, 0);
            this.shooting = false;
            }
        } else {
             // --- Dribbling ---
            this.dribble(delta, keysPressed)
        }
    }


    dribble(delta, keysPressed) {
        // this.meshes.ball.position.y = Math.sin(Date.now() * 0.008) * 0.5 + .8; // Simple bouncing effect

        const speed = 5;
        const move = this.meshes.ball.position;

        if (keysPressed.has("ArrowLeft"))  move.x -= speed * delta;
        if (keysPressed.has("ArrowRight")) move.x += speed * delta;
        if (keysPressed.has("ArrowUp"))    move.z -= speed * delta;
        if (keysPressed.has("ArrowDown"))  move.z += speed * delta;
    }

    shoot(power, angleDegrees) {
        if (this.shooting) return; // Prevent double-shoot

        this.shooting = true;

        const angle = THREE.MathUtils.degToRad(angleDegrees);
        // Initial velocity
        const speed = power; // e.g., 15
        this.velocity.z = 0;  // shooting straight forward for now
        this.velocity.x = Math.cos(angle) * speed; // toward hoop
        this.velocity.y = Math.sin(angle) * speed;  // upward
    }

}

export { Court };
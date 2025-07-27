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
        this.spinRate = 0; // Rotation rate in radians per second

        // Add box helpers
        this.ballBoxHelper = new THREE.BoxHelper(this.meshes.ball, 0xff0000); // Red for ball
        
        // Backboard box helpers (green)
        this.leftBackboardBoxHelper = new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("backboard"), 0x00ff00);
        this.rightBackboardBoxHelper = new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("backboard"), 0x00ff00);
        
        // Left hoop base components (different blue shades for visibility)
        this.leftBaseHelpers = {
            baseBottom: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("baseBottom"), 0x0000ff),
            basePole: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("basePole"), 0x00ffff),
            backboardMount: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("backboardMount"), 0x4444ff),
            uprightPole: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("uprightPole"), 0x8888ff),
            horizontalPole: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("horizontalPole"), 0xaaaaff),
            slantedPole: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("slantedPole"), 0xccccff)
        };

        // Right hoop base components
        this.rightBaseHelpers = {
            baseBottom: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("baseBottom"), 0x0000ff),
            basePole: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("basePole"), 0x00ffff),
            backboardMount: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("backboardMount"), 0x4444ff),
            uprightPole: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("uprightPole"), 0x8888ff),
            horizontalPole: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("horizontalPole"), 0xaaaaff),
            slantedPole: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("slantedPole"), 0xccccff)
        };

        this.leftRimBoxHelper =  {
            rim: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("rimCircle"), 0xffff00),
            connector: new THREE.BoxHelper(this.meshes.leftHoop.getObjectByName("rimConnector"), 0xffff00)
        }
        
        this.rightRimBoxHelper =  {
            rim: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("rimCircle"), 0xffff00),
            connector: new THREE.BoxHelper(this.meshes.rightHoop.getObjectByName("rimConnector"), 0xffff00)
        }

        // Add box helpers to the scene
        this.add(
            this.ballBoxHelper,
            this.leftBackboardBoxHelper,
            this.rightBackboardBoxHelper,
            ...Object.values(this.leftBaseHelpers),
            ...Object.values(this.rightBaseHelpers),
            ...Object.values(this.leftRimBoxHelper),
            ...Object.values(this.rightRimBoxHelper)
        );
    }

    tick(delta, keysPressed) {
        // --- Shooting physics ---
        if (this.shooting) {
            this.launch(delta);

        } else {
             // --- Dribbling ---
            this.dribble(delta, keysPressed)
        }
    }


    dribble(delta, keysPressed) {
        const speed = 5;
        const move = this.meshes.ball.position;

        let isMoving = false;

        // Court dimensions (half-width and half-depth since 0,0 is center)
        const courtHalfWidth = 28.65 / 2;
        const courtHalfDepth = 15.24 / 2;

        // Calculate new position
        let newX = move.x;
        let newZ = move.z;

        if (keysPressed.has("ArrowLeft"))  { newX -= speed * delta; isMoving = true; }
        if (keysPressed.has("ArrowRight")) { newX += speed * delta; isMoving = true; }
        if (keysPressed.has("ArrowUp"))    { newZ -= speed * delta; isMoving = true; }
        if (keysPressed.has("ArrowDown"))  { newZ += speed * delta; isMoving = true; }

        // Clamp position within court boundaries
        move.x = Math.max(-courtHalfWidth, Math.min(courtHalfWidth, newX));
        move.z = Math.max(-courtHalfDepth, Math.min(courtHalfDepth, newZ));

        if (isMoving) {
            // Make it bounce up and down while dribbling
            const time = performance.now() * 0.008; // Adjust speed factor as needed
            const bounceHeight = 1; // How high the bounce goes
            const baseHeight = 0.3343; // Floor height (match your groundY)
            this.meshes.ball.position.y = baseHeight + Math.abs(Math.sin(time)) * bounceHeight;
        } else {
            // Keep ball on the ground when not moving
            this.meshes.ball.position.y = 0.3343;
        }
    }


    shoot(power, angleDegrees) {
        if (this.shooting) return; // Prevent double-shoot

        this.shooting = true;

        const angle = THREE.MathUtils.degToRad(angleDegrees);

        // Determine closest hoop and get its position
        const distToLeft = this.meshes.ball.position.distanceTo(this.meshes.leftHoop.position);
        const distToRight = this.meshes.ball.position.distanceTo(this.meshes.rightHoop.position);
        const targetHoop = distToLeft < distToRight ? this.meshes.leftHoop : this.meshes.rightHoop;
        
        // Get the rim position for more accurate targeting
        const rimAssembly = targetHoop.getObjectByName("rimAssembly");
        const targetPos = new THREE.Vector3();
        rimAssembly.getWorldPosition(targetPos);
        
        // Calculate direction to the hoop
        const ballPos = this.meshes.ball.position.clone();
        const directionToHoop = new THREE.Vector3()
            .subVectors(targetPos, ballPos)
            .normalize();

        // Calculate the horizontal distance to determine shot arc
        const horizontalDist = new THREE.Vector2(
            targetPos.x - ballPos.x,
            targetPos.z - ballPos.z
        ).length();

        // Adjust vertical angle based on distance
        const verticalAngle = angle + (horizontalDist * 0.02); // Increase arc for longer shots
        
        // Calculate velocity components
        const speed = power;
        const horizontalSpeed = Math.cos(verticalAngle) * speed;
        
        // Set velocity components
        this.velocity.set(
            directionToHoop.x * horizontalSpeed,
            Math.sin(verticalAngle) * speed,
            directionToHoop.z * horizontalSpeed
        );

        // --- Spin calculation ---
        const spinAngle = Math.PI / 4; // 45 degrees in radians
        this.spinRate = spinAngle * (power * 1.5); // Adjust spin rate based on power
    }

    launch(delta) {
        this.velocity.y += this.gravity * delta;
        this.meshes.ball.position.addScaledVector(this.velocity, delta);

        // Update box helpers
        this.ballBoxHelper.update();
        this.leftBackboardBoxHelper.update();
        this.rightBackboardBoxHelper.update();


        Object.values(this.leftRimBoxHelper).forEach(helper => helper.update());
        Object.values(this.rightRimBoxHelper).forEach(helper => helper.update());

        
        // Update left base helpers
        Object.values(this.leftBaseHelpers).forEach(helper => helper.update());
        // Update right base helpers
        Object.values(this.rightBaseHelpers).forEach(helper => helper.update());

        // Spin animation
        this.meshes.ball.rotation.z -= this.spinRate * delta;

        // Build ball bounding box
        const ballBox = this.getBoundingBox(this.meshes.ball);

        // Ground bounce
        const groundY = 0.3343;
        const ball = this.meshes.ball;

        if (ball.position.y <= groundY) { 
            ball.position.y = groundY;
            this.velocity.y = -this.velocity.y * 0.5;
            this.velocity.x *= 0.3;
            this.velocity.z *= 0.3;
            if (Math.abs(this.velocity.y) < 1) {
            this.velocity.set(0, 0, 0);
            this.shooting = false;
            }
        }
    }

    getBoundingBox(object) {
        const box = new THREE.Box3();
        box.setFromObject(object);
        return box;
    }


}

export { Court };
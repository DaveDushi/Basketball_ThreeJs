import { createMeshes } from "./meshes.js";

class Court extends THREE.Group {
    constructor() {
        super();

        this.meshes = createMeshes();

        // Track shot state
        this.currentShot = {
            rimContact: false,
            backboardContact: false,
            heightAboveRim: 0,
            targetHoop: null,
            scoringEnabled: false
        };

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
        this.currentShot.rimContact = false;
        this.currentShot.backboardContact = false;
        this.currentShot.scoringEnabled = true;

        // Emit shot attempt event for UI Controller
        const shotEvent = new CustomEvent('shotAttempted', {
            detail: { made: false } // Default to false; updated later if the shot is successful
        });
        window.dispatchEvent(shotEvent);

        const angle = THREE.MathUtils.degToRad(angleDegrees);

        // Determine closest hoop and get its position
        const distToLeft = this.meshes.ball.position.distanceTo(this.meshes.leftHoop.position);
        const distToRight = this.meshes.ball.position.distanceTo(this.meshes.rightHoop.position);
        const targetHoop = distToLeft < distToRight ? this.meshes.leftHoop : this.meshes.rightHoop;
        this.currentShot.targetHoop = targetHoop; // Set the target hoop for scoring detection
        
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
        this.spinRate = spinAngle * (power / 1.5); // Adjust spin rate based on power
    }

    launch(delta) {
        this.velocity.y += this.gravity * delta;
        this.meshes.ball.position.addScaledVector(this.velocity, delta);

        // Ball rotation
        this.meshes.ball.rotation.z -= this.spinRate * delta;

        // Spin animation
        this.meshes.ball.rotation.z -= this.spinRate * delta;

        // Build ball bounding box
        const ballBox = this.getBoundingBox(this.meshes.ball);

        // Check rim collisions
        this.checkRimCollisions(ballBox);

        // Check backboard collisions
        this.checkBackboardCollisions(ballBox);

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
                
                // Emit score event when ball stops moving
                if (this.currentShot.scoringEnabled) {
                    // If we haven't scored by now, it's a miss
                    const scoreEvent = new CustomEvent('basketScored', {
                        detail: {
                            points: 0,
                            made: false
                        }
                    });
                    window.dispatchEvent(scoreEvent);
                    this.currentShot.scoringEnabled = false;
                }
            }
        }
    }

    getBoundingBox(object) {
        const box = new THREE.Box3();
        box.setFromObject(object);
        return box;
    }

    checkRimCollisions(ballBox) {
        // Check left rim
        const leftRim = this.meshes.leftHoop.getObjectByName("rimCircle");
        const leftRimBox = this.getBoundingBox(leftRim);
        
        // Check right rim
        const rightRim = this.meshes.rightHoop.getObjectByName("rimCircle");
        const rightRimBox = this.getBoundingBox(rightRim);

        if (ballBox.intersectsBox(leftRimBox)) {
            this.handleRimCollision(this.meshes.leftHoop, "left");
        } else if (ballBox.intersectsBox(rightRimBox)) {
            this.handleRimCollision(this.meshes.rightHoop, "right");
        }
    }

    checkBackboardCollisions(ballBox) {
        // Check left backboard
        const leftBackboard = this.meshes.leftHoop.getObjectByName("backboard");
        const leftBackboardBox = this.getBoundingBox(leftBackboard);
        
        // Check right backboard
        const rightBackboard = this.meshes.rightHoop.getObjectByName("backboard");
        const rightBackboardBox = this.getBoundingBox(rightBackboard);

        if (ballBox.intersectsBox(leftBackboardBox)) {
            this.handleBackboardCollision(leftBackboard, "left");
        } else if (ballBox.intersectsBox(rightBackboardBox)) {
            this.handleBackboardCollision(rightBackboard, "right");
        }
    }

    handleRimCollision(hoop, side) {
        const rim = hoop.getObjectByName("rimCircle");
        const rimPos = new THREE.Vector3();
        rim.getWorldPosition(rimPos);

        // Get ball position and calculate impact point
        const ballPos = this.meshes.ball.position.clone();
        const impactNormal = new THREE.Vector3().subVectors(ballPos, rimPos).normalize();

        // Check for scoring
        if (this.currentShot.scoringEnabled) {
            this.currentShot.rimContact = true;

            // Update target hoop if not set
            if (!this.currentShot.targetHoop) {
                this.currentShot.targetHoop = hoop;
            }

            // Check if ball is above rim and moving downward
            const heightAboveRim = ballPos.y - rimPos.y;

            // Calculate horizontal distance from rim center
            const horizontalDist = new THREE.Vector2(
                ballPos.x - rimPos.x,
                ballPos.z - rimPos.z
            ).length();

            // Check if ball is in scoring position
            if (heightAboveRim > 0.1 && heightAboveRim < 0.5 && 
                horizontalDist < 0.4 && this.velocity.y < 0) {

                // Let the ball fall through
                this.checkForScore(heightAboveRim);
                return; // Skip collision response
            }
        }

        // If not scoring, handle regular rim collision
        // Add some randomness to make it more realistic
        impactNormal.x += (Math.random() - 0.5) * 0.1; // Reduced randomness for precision
        impactNormal.y += (Math.random() - 0.5) * 0.1;
        impactNormal.z += (Math.random() - 0.5) * 0.1;
        impactNormal.normalize();

        // Reflect velocity with dampening
        const speed = this.velocity.length();
        const dampening = 0.7; // Adjusted dampening for more realistic bounce

        // Calculate reflected velocity
        this.velocity.reflect(impactNormal).multiplyScalar(dampening);

        // Only add upward bounce if hitting rim from below
        if (this.velocity.y < 0) {
            this.velocity.y += 1.5; // Reduced upward force for subtle bounce
        }

        // Prevent ball from sticking to rim
        const pushOutDistance = 0.15; // Slightly reduced push-out distance
        this.meshes.ball.position.addScaledVector(impactNormal, pushOutDistance);
    }

    handleBackboardCollision(backboard, side) {
        // Get backboard normal (facing out from the board)
        const backboardNormal = new THREE.Vector3(0, 0, side === "left" ? 1 : -1);

        // Calculate reflection
        const dampening = 0.8; // Adjusted dampening for realistic backboard bounce

        // Reflect velocity off backboard
        this.velocity.reflect(backboardNormal).multiplyScalar(dampening);

        // Add slight randomness to make it more realistic
        this.velocity.x += (Math.random() - 0.5) * 0.3; // Reduced randomness for precision
        this.velocity.y += (Math.random() - 0.5) * 0.3;

        // Prevent ball from going through backboard
        const pushOutDistance = 0.15; // Slightly reduced push-out distance
        this.meshes.ball.position.addScaledVector(backboardNormal, pushOutDistance);

        // Track backboard contact for scoring
        if (this.currentShot.scoringEnabled) {
            this.currentShot.backboardContact = true;
        }
    }

    checkForScore(heightAboveRim) {
        if (!this.currentShot.scoringEnabled || !this.currentShot.targetHoop) return;

        // Score the basket
        this.scoreBasket();
        
        // Add a slight downward adjustment to the velocity for a natural fall
        this.velocity.y *= 0.8; // Reduce upward velocity
        if (this.velocity.y > -2) { // Ensure some downward movement
            this.velocity.y = -2;
        }
        
        // Reduce horizontal velocities for a more vertical drop
        this.velocity.x *= 0.5;
        this.velocity.z *= 0.5;
    }

    scoreBasket() {
        if (!this.currentShot.scoringEnabled) return;
        
        // Prevent multiple scores for the same shot
        this.currentShot.scoringEnabled = false;

        // Emit a custom event for the UI Controller to handle
        const scoreEvent = new CustomEvent('basketScored', {
            detail: {
                points: 2, // Could implement 3-point detection if needed
                made: true
            }
        });
        window.dispatchEvent(scoreEvent);

        // Create visual feedback
        this.createScoringEffect();
    }

    createScoringEffect() {
        // Flash the rim when scored
        const rim = this.currentShot.targetHoop.getObjectByName("rimCircle");
        if (rim && rim.material) {
            const originalColor = rim.material.color.clone();
            rim.material.color.setHex(0xffff00); // Flash yellow
            
            setTimeout(() => {
                rim.material.color.copy(originalColor);
            }, 200);
        }
    }

    resetBall() {
        // Reset ball position to the center of the court
        this.meshes.ball.position.set(0, 0.3343, 0); // Ground level

        // Reset ball velocity and spin
        this.velocity.set(0, 0, 0);
        this.spinRate = 0;

        // Reset shooting state
        this.shooting = false;
        this.currentShot = {
            rimContact: false,
            backboardContact: false,
            heightAboveRim: 0,
            targetHoop: null,
            scoringEnabled: false
        };

        // Reset ball rotation
        this.meshes.ball.rotation.set(0, 0, 0);

        // Emit an event to reset shot power in the UI
        const resetEvent = new CustomEvent('resetShotPower', {
            detail: { defaultPower: 10 } // Default power is 50%
        });
        window.dispatchEvent(resetEvent);
    }
}

export { Court };
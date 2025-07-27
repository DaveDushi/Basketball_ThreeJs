import {OrbitControls} from '../../OrbitControls.js'

class UIController {
    constructor(court, camera, renderer) {
        this.court = court;
        this.keysPressed = new Set();
        this.shotPower = 10; // default shot power
        this.shotAngle = 45; // default shot angle in degrees

        // Game stats
        this.score = 0;
        this.attempts = 0;
        this.accuracy = 0;

        // Orbit controls setup
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.isOrbitEnabled = true;

        // UI Elements
        this.powerFill = document.getElementById('power-fill');
        this.scoreElement = document.getElementById('score');
        this.attemptsElement = document.getElementById('attempts');
        this.accuracyElement = document.getElementById('accuracy');
        this.statusElement = document.getElementById('status');
        this.angleElement = document.getElementById('angle-display');

        // Bind methods
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        // Initialize UI
        this.updateUI();

        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        // Listen for scoring events
        window.addEventListener('basketScored', (e) => {
            this.score += e.detail.points;
            this.accuracy = ((this.score / 2) / this.attempts) * 100;
            this.updateUI();
            // Show success message
            if (e.detail.made) {
                this.showStatus('SCORE!', '#00ff00');
            } else {
                this.showStatus('MISS!', '#ff0000');
            }
            
        });

        // Listen for shot attempts
        window.addEventListener('shotAttempted', (e) => {
            this.attempts++;
            this.updateUI();
        });

        // Listen for resetShotPower event
        window.addEventListener('resetShotPower', (e) => {
            this.shotPower = e.detail.defaultPower;
            this.score = 0; // Reset score
            this.attempts = 0; // Reset attempts
            this.accuracy = 0; // Reset accuracy
            this.updateUI();
        });
    }

    updateUI() {
        // Update power indicator
        const powerPercentage = (this.shotPower - 5) / (15 - 5) * 100;
        this.powerFill.style.width = `${powerPercentage}%`;

        // Update stats
        this.scoreElement.textContent = this.score;
        this.attemptsElement.textContent = this.attempts;
        this.accuracyElement.textContent = 
            this.attempts > 0 
                ? `${Math.round((this.score / 2 / this.attempts) * 100)}%` 
                : '0%';

        // Update angle display
        if (this.angleElement) {
            this.angleElement.textContent = `${this.shotAngle}°`;
        }
    }

    showStatus(message, color) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.style.color = color;
            this.statusElement.style.opacity = '1';
            
            // Fade out after 2 seconds
            setTimeout(() => {
                this.statusElement.style.opacity = '0';
            }, 2000);
        }
    }

    onKeyDown(event) {
        // Movement keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            this.keysPressed.add(event.key);
        }

        // Shooting controls
        if (event.key === ' ') { // Spacebar for shooting
            this.court.shoot(this.shotPower, this.shotAngle);
            this.showStatus(`Shot! Power: ${Math.round((this.shotPower - 5) / 10 * 100)}%, Angle: ${this.shotAngle}°`, '#ffffff');
            this.updateUI();
        }

        // Power adjustment
        if (event.key === 'w') {
            this.shotPower = Math.min(this.shotPower + .1, 15);
            this.updateUI();
        } else if (event.key === 's') {
            this.shotPower = Math.max(this.shotPower - .1, 5);
            this.updateUI();
        }

        // Angle adjustment
        if (event.key === 'd') {
            this.shotAngle = Math.min(this.shotAngle + 5, 85);
            this.updateUI();
        } else if (event.key === 'a') {
            this.shotAngle = Math.max(this.shotAngle - 5, 15);
            this.updateUI();
        }

        // Orbit controls toggle
        if (event.key === 'o') {
            this.isOrbitEnabled = !this.isOrbitEnabled;
            this.showStatus(this.isOrbitEnabled ? 'Camera Controls: Enabled' : 'Camera Controls: Disabled');
        }

        // Reset ball position
        if (event.key === 'r') {
            if (this.court.resetBall) {
                this.court.resetBall();
                this.showStatus('Ball Reset', '#ffffff');
            }
        }
    }

    onKeyUp(event) {
        this.keysPressed.delete(event.key);
    }

    update(delta) {
        // Update orbit controls
        this.controls.enabled = this.isOrbitEnabled;
        this.controls.update();

        // Pass the current pressed keys to the court for movement
        this.court.tick(delta, this.keysPressed);
    }

    dispose() {
        // Clean up event listeners when no longer needed
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        this.controls.dispose();
    }
}

export { UIController };

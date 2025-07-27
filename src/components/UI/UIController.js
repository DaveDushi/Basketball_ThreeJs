import {OrbitControls} from '../../OrbitControls.js'

class UIController {
    constructor(court, camera, renderer) {
        this.court = court;
        this.keysPressed = new Set();
        this.shotPower = 15; // default shot power
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
    }

    updateUI() {
        // Update power indicator
        const powerPercentage = (this.shotPower - 5) / (15 - 5) * 100;
        this.powerFill.style.width = `${powerPercentage}%`;

        // Update stats
        this.scoreElement.textContent = this.score;
        this.attemptsElement.textContent = this.attempts;
        this.accuracyElement.textContent = this.attempts > 0 
            ? `${Math.round((this.score / this.attempts) * 100)}%` 
            : '0%';
    }

    showStatus(message, duration = 2000) {
        this.statusElement.textContent = message;
        setTimeout(() => {
            this.statusElement.textContent = '';
        }, duration);
    }

    onKeyDown(event) {
        // Movement keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            this.keysPressed.add(event.key);
        }

        // Shooting controls
        if (event.key === ' ') { // Spacebar for shooting
            this.court.shoot(this.shotPower, this.shotAngle);
            this.attempts++;
            this.showStatus(`Shot! Power: ${this.shotPower}, Angle: ${this.shotAngle}°`);
            this.updateUI();
        }

        // Power adjustment
        if (event.key === 'w') {
            this.shotPower = Math.min(this.shotPower + .5, 15);
            this.showStatus(`Shot Power: ${(this.shotPower / 15 * 100)}%`);
            this.updateUI();
        } else if (event.key === 's') {
            this.shotPower = Math.max(this.shotPower - .5, 5);
            this.showStatus(`Shot Power: ${(this.shotPower / 15 * 100)}%`);
            this.updateUI();
        }

        // Angle adjustment
        if (event.key === 'd') {
            this.shotAngle = Math.min(this.shotAngle + 5, 85);
            this.showStatus(`Shot Angle: ${this.shotAngle}°`);
        } else if (event.key === 'a') {
            this.shotAngle = Math.max(this.shotAngle - 5, 15);
            this.showStatus(`Shot Angle: ${this.shotAngle}°`);
        }

        // Orbit controls toggle
        if (event.key === 'o') {
            this.isOrbitEnabled = !this.isOrbitEnabled;
            this.showStatus(this.isOrbitEnabled ? 'Camera Controls: Enabled' : 'Camera Controls: Disabled');
        }

        // Reset ball position
        if (event.key === 'r') {
            // You'll need to implement resetBall in your Court class
            if (this.court.resetBall) {
                this.court.resetBall();
                this.showStatus('Ball Reset');
            }
        }
    }

    onKeyUp(event) {
        this.keysPressed.delete(event.key);
    }

    // Call this when a basket is scored
    incrementScore() {
        this.score++;
        this.showStatus('🏀 Basket Scored!', 3000);
        this.updateUI();
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

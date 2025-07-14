import { Court } from './components/Court/Court.js';
import { UIController } from './components/UI/UIController.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight); 

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); 
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  const court = new Court()
  court.receiveShadow = true;
  scene.add(court);

  return court;
  
  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features
}

// Create all elements
const court = createBasketballCourt();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 12, 15);
camera.applyMatrix4(cameraTranslate);

// Initialize UI Controller with necessary components
const uiController = new UIController(court, camera, renderer);

const clock = new THREE.Clock();

// Animation function
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    
    // Update UI and game state
    uiController.update(delta);

    renderer.render(scene, camera);
}

animate();
# WebGL Basketball Game

## Demo
https://github.com/DaveDushi/Basketball_ThreeJs/assets/demo.mp4

## Group Members
- Ariel Jankelowitz
- David Dusi

## How to Run
1. Clone this repository to your local machine
2. Make sure you have Node.js installed on your system
3. Install dependencies by running:
   ```
   npm install
   ```
4. Start the local web server:
   ```
   node index.js
   ```
5. Open your browser and navigate to http://localhost:8000

## Game Controls
- **Arrow Keys**: Move the basketball around the court
- **W / S**: Adjust shot power
- **A / D**: Adjust shot angle
- **Spacebar**: Shoot
- **R**: Reset ball position to center court
- **O**: Toggle camera view

## Physics System Implementation
The game implements a realistic physics system with the following features:

1. **Ball Movement**
   - Gravity-based trajectory calculations
   - Realistic ball spin during shots
   - Ground friction and bounce dampening
   - Air resistance simulation

2. **Collision Detection**
   - Precise collision detection with rim and backboard
   - Realistic bounce physics off the backboard
   - Dynamic rim interaction with bounce variation
   - Ground collision with energy loss

3. **Scoring System**
   - Accurate shot detection through the hoop
   - Rim and backboard contact tracking
   - Height and position validation for scoring

## Additional Features
1. **Visual Feedback**
   - Dynamic shot power indicator
   - Visual feedback for successful shots
   - Rim flash effect on successful baskets
   - Smooth ball spinning animation

2. **Game Mechanics**
   - Realistic dribbling animation when moving
   - Two functional hoops with proper scoring
   - Shot angle adjustment system
   - Ball reset functionality

## Known Limitations
1. No multiplayer support
2. Limited camera angles/controls
3. Ball can occasionally get stuck in edge cases
4. Simplified physics for performance reasons

## External Assets Used
 - Basketball https://github.com/yusufaf/basketball_court_threejs
 - Court Texture from Google Images I can't find the exact image again.


## Development Notes
- Built using Three.js for 3D rendering
- Uses vanilla JavaScript for game logic
- Node.js backend for serving static files
- Custom physics implementation for basketball mechanics



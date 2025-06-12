# Solar System 3D Simulation

A 3D simulation of the solar system built with Three.js, featuring interactive controls and realistic planetary orbits.

## Features

- 3D visualization of the solar system with the Sun and all 8 planets
- Realistic orbital animations
- Interactive speed controls for each planet
- Pause/Resume functionality
- Dark/Light theme toggle
- Background stars
- Mobile-responsive design
- Camera controls (zoom, pan, rotate)

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solar-system-3d
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:5173`

## Controls

- **Planet Speed**: Use the sliders in the control panel to adjust the orbital speed of each planet
- **Pause/Resume**: Click the button to pause or resume the animation
- **Theme Toggle**: Switch between dark and light themes
- **Camera Controls**:
  - Left click + drag: Rotate the view
  - Right click + drag: Pan the view
  - Scroll: Zoom in/out

## Technologies Used

- Three.js for 3D rendering
- Vite for development and building
- Modern JavaScript (ES6+)

## Browser Support

The application works on all modern browsers that support WebGL:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Project Structure

```
solar-system-3d/
├── index.html          # Main HTML file
├── style.css          # Styles
├── main.js           # Three.js implementation
├── package.json      # Project dependencies
└── README.md         # This file
```

## Performance

The application is optimized for performance with:
- Efficient 3D rendering
- Responsive design
- Smooth animations
- Optimized asset loading

## License

MIT License 
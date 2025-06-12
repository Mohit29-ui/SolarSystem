import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#solar-system'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Raycaster for hover detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.padding = '5px 10px';
tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
tooltip.style.color = 'white';
tooltip.style.borderRadius = '4px';
tooltip.style.fontSize = '14px';
tooltip.style.pointerEvents = 'none';
tooltip.style.display = 'none';
tooltip.style.zIndex = '1000';
document.body.appendChild(tooltip);

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load textures
const textures = {
    sun: textureLoader.load('textures/plannets/sun.jpg'),
    mercury: textureLoader.load('textures/plannets/mercury.jpg'),
    venus: textureLoader.load('textures/plannets/venus.jpg'),
    earth: textureLoader.load('textures/plannets/earth.jpg'),
    mars: textureLoader.load('textures/plannets/mars.jpg'),
    jupiter: textureLoader.load('textures/plannets/jupiter.jpg'),
    saturn: textureLoader.load('textures/plannets/saturn.jpg'),
    uranus: textureLoader.load('textures/plannets/uranus.jpg'),
    neptune: textureLoader.load('textures/plannets/neptune.jpg')
};

// Camera position
camera.position.z = 50;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(sunLight);

// Add additional point lights for better coverage
const pointLight1 = new THREE.PointLight(0xffffff, 1, 200);
pointLight1.position.set(50, 50, 50);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1, 200);
pointLight2.position.set(-50, -50, -50);
scene.add(pointLight2);

// Stars
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Planet data with realistic rotation speeds (in radians per second)
const planetData = [
    { name: 'Mercury', radius: 0.4, distance: 8, speed: 0.04, rotationSpeed: 0.0001, texture: textures.mercury },
    { name: 'Venus', radius: 0.9, distance: 7, speed: 0.015, rotationSpeed: 0.00004, texture: textures.venus },
    { name: 'Earth', radius: 1, distance: 10, speed: 0.01, rotationSpeed: 0.00007, texture: textures.earth },
    { name: 'Mars', radius: 0.5, distance: 13, speed: 0.008, rotationSpeed: 0.00007, texture: textures.mars },
    { name: 'Jupiter', radius: 2.5, distance: 18, speed: 0.002, rotationSpeed: 0.00017, texture: textures.jupiter },
    { name: 'Saturn', radius: 2.2, distance: 23, speed: 0.0009, rotationSpeed: 0.00015, texture: textures.saturn },
    { name: 'Uranus', radius: 1.8, distance: 28, speed: 0.0004, rotationSpeed: 0.0001, texture: textures.uranus },
    { name: 'Neptune', radius: 1.8, distance: 32, speed: 0.0001, rotationSpeed: 0.0001, texture: textures.neptune }
];

// Create planets
const planets = [];
planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        map: data.texture,
        bumpScale: 0.05,
        specular: new THREE.Color('white'),
        shininess: 30,
        emissive: new THREE.Color(0x111111),
        emissiveIntensity: 0.2
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData.name = data.name;
    
    // Create orbit
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    
    planet.position.x = data.distance;
    scene.add(planet);
    planets.push({ mesh: planet, data: data });
});

// Create Sun with enhanced brightness
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    map: textures.sun,
    emissive: 0xffff00,
    emissiveIntensity: 1.0
});

// Add a point light at the sun's position
const sunPointLight = new THREE.PointLight(0xffffff, 2, 300);
sunPointLight.position.set(0, 0, 0);
scene.add(sunPointLight);

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);
sun.userData.name = 'Sun';
scene.add(sun);

// Handle mouse move for tooltip
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Update tooltip position and visibility
function updateTooltip() {
    raycaster.setFromCamera(mouse, camera);
    
    // Check intersections with all planets and sun
    const intersects = raycaster.intersectObjects([sun, ...planets.map(p => p.mesh)]);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        tooltip.textContent = object.userData.name;
        tooltip.style.display = 'block';
        
        // Convert 3D position to screen coordinates
        const vector = object.position.clone();
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;
        
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y - 30}px`; // Position above the planet
    } else {
        tooltip.style.display = 'none';
    }
}

// Animation
let isPaused = false;
const clock = new THREE.Clock();
let speedMultiplier = 1;
let selectedPlanet = 'all';

function animate() {
    requestAnimationFrame(animate);
    
    if (!isPaused) {
        const delta = clock.getDelta();
        
        planets.forEach(planet => {
            // Apply speed multiplier only to selected planet or all planets
            const currentSpeed = selectedPlanet === 'all' || planet.data.name === selectedPlanet 
                ? planet.data.speed * speedMultiplier 
                : planet.data.speed;
            
            // Orbital rotation around the Sun
            const time = clock.getElapsedTime();
            planet.mesh.position.x = Math.cos(currentSpeed * time) * planet.data.distance;
            planet.mesh.position.z = Math.sin(currentSpeed * time) * planet.data.distance;
            
            // Self rotation (around planet's own axis)
            planet.mesh.rotation.y += planet.data.rotationSpeed * speedMultiplier;
        });
    }
    
    updateTooltip();
    controls.update();
    renderer.render(scene, camera);
}

// Create controls
function createControls() {
    const planetSelect = document.getElementById('planet-select');
    const speedMultiplierInput = document.getElementById('speed-multiplier');
    const speedValue = document.getElementById('speed-value');
    
    // Add planet options to select
    planetData.forEach(planet => {
        const option = document.createElement('option');
        option.value = planet.name;
        option.textContent = planet.name;
        planetSelect.appendChild(option);
    });
    
    // Handle planet selection
    planetSelect.addEventListener('change', (e) => {
        selectedPlanet = e.target.value;
    });
    
    // Handle speed multiplier
    speedMultiplierInput.addEventListener('input', (e) => {
        speedMultiplier = parseFloat(e.target.value);
        speedValue.textContent = `${speedMultiplier}x`;
    });
}

// Pause/Resume functionality
const pauseButton = document.getElementById('pause-resume');
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add mouse move event listener
window.addEventListener('mousemove', onMouseMove);

// Initialize
createStars();
createControls();
animate(); 
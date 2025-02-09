const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CELLS = 60;
const WIDTH = 800;
const HEIGHT = 800;

const cellWidth = WIDTH / CELLS;
const cellHeight = HEIGHT / CELLS;

let isDrawing = false;

const particles = [];

// Particle class to handle the falling particles
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = cellWidth; // Make each particle size match the grid cell size
    this.velocityY = 0; // Initial vertical velocity (no speed initially)
    this.gravity = 0.2; // Gravity effect to pull the particle down
    this.color = "yellow"; // Color of the particle
    this.isSettled = false; // Flag to track if particle has settled
  }

  // Update the position of the particle
  update() {
    if (this.isSettled) return; // Don't update if the particle has settled

    this.velocityY += this.gravity; // Apply gravity to velocity
    this.y += this.velocityY; // Update vertical position

    // Prevent particle from falling off the canvas
    if (this.y + this.size > HEIGHT) {
      this.y = HEIGHT - this.size; // Make sure it stays at the bottom
      this.velocityY = 0; // Stop falling once it hits the ground
      this.isSettled = true; // Mark the particle as settled
    }
  }

  // Draw the particle on the canvas
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

// Function to draw the grid
function drawGrid() {
  ctx.beginPath();

  // Draw vertical lines
  for (let i = 0; i <= CELLS; i++) {
    const x = i * cellWidth;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
  }

  // Draw horizontal lines
  for (let i = 0; i <= CELLS; i++) {
    const y = i * cellHeight;
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
  }

  ctx.strokeStyle = "#000"; // Black color for the grid lines
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Function to create particles at the mouse position
function createParticles(x, y) {
  const gridX = Math.floor(x / cellWidth) * cellWidth;
  const gridY = Math.floor(y / cellHeight) * cellHeight;

  // Create a new particle at the clicked position
  particles.push(new Particle(gridX, gridY));
}

// Function to animate and update the particles
function updateParticles() {
  // Clear the canvas for each frame
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw the grid again
  drawGrid();

  // Update and draw each particle
  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });
}

// Mouse event listeners
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  createParticles(e.offsetX, e.offsetY); // Create a particle at the mouse position
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    createParticles(e.offsetX, e.offsetY); // Create more particles as the mouse moves
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseout", () => {
  isDrawing = false;
});

// Animation loop to update particles
function animate() {
  updateParticles();
  requestAnimationFrame(animate); // Continue the animation
}

// Start the animation
animate();

// Draw the grid once initially
drawGrid();

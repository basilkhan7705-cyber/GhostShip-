
// Variables
let ghost;
let score = 0;
let duration = 30;
let startTime;
let state = 'start';

// Road settings
let roadX = 100;
let roadWidth = 280;

// Cars
let cars = [];

// Trees on roadside
let trees = [
  { x: 35, y: 40 },
  { x: 55, y: 130 },
  { x: 30, y: 230 },
  { x: 65, y: 320 },
  { x: 445, y: 70 },
  { x: 425, y: 170 },
  { x: 450, y: 270 }
];

// Setup
function setup() {
  createCanvas(480, 360);

  ghost = {
    x: 240,
    y: 300
  };

  // Create three cars
  for (let i = 0; i < 3; i++) {
    cars.push({
      x: random(roadX + 40, roadX + roadWidth - 40),
      y: -100 - i * 140,
      speed: random(2, 3),
      passed: false,
      colour: random([
        [220, 50, 50],
        [50, 100, 220],
        [240, 180, 30]
      ])
    });
  }
}

// Main game loop
function draw() {

  // Background
  background(190, 175, 135);

  // Draw trees
  for (let i = 0; i < trees.length; i++) {
    drawTree(trees[i].x, trees[i].y);
  }

  // Draw road
  fill(75);
  noStroke();
  rect(roadX, 0, roadWidth, height);

  // Road borders
  stroke(255);
  strokeWeight(4);
  line(roadX + 8, 0, roadX + 8, height);
  line(roadX + roadWidth - 8, 0,
       roadX + roadWidth - 8, height);

  // Road markings
  stroke(255);
  strokeWeight(3);

  for (let i = 10; i < height; i += 50) {
    line(240, i, 240, i + 25);
  }

  noStroke();

  // Start screen
  if (state === 'start') {
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(25);
    text('Ghost Traffic Dodge', width / 2, 130);
    textSize(17);
    text('Move your mouse to avoid cars', width / 2, 175);
    text('Click to start', width / 2, 215);
    return;
  }

  // Game over screen
  if (state === 'over') {
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(26);
    text('Game Over!', width / 2, 140);
    textSize(19);
    text('Final Score: ' + score, width / 2, 180);
    text('Click to play again', width / 2, 220);
    return;
  }

  // Calculate remaining time
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, duration - elapsed);

  // End game
  if (timeLeft <= 0) {
    state = 'over';
    return;
  }

  // Move ghost with mouse
  ghost.x = constrain(mouseX, roadX + 35,
                      roadX + roadWidth - 35);
  ghost.y = constrain(mouseY, 30, height - 30);

  // Move and draw cars
  for (let i = 0; i < cars.length; i++) {

    cars[i].y += cars[i].speed;

    drawCar(cars[i].x, cars[i].y, cars[i].colour);

    // Check collision
    if (
      abs(ghost.x - cars[i].x) < 38 &&
      abs(ghost.y - cars[i].y) < 43
    ) {
      state = 'over';
    }

    // Give point when car is avoided
    if (cars[i].y > height + 30) {
      score++;

      cars[i].y = -50;
      cars[i].x = random(roadX + 40,
                         roadX + roadWidth - 40);
      cars[i].speed = random(2, 3);
      cars[i].colour = random([
        [220, 50, 50],
        [50, 100, 220],
        [240, 180, 30]
      ]);
    }
  }

  // Draw ghost
  drawGhost(ghost.x, ghost.y);

  // Score
  fill(40);
  textSize(16);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 12, 10);

  // Timer
  textAlign(RIGHT, TOP);
  text('Time: ' + ceil(timeLeft), width - 12, 10);
}

// Mouse interaction
function mousePressed() {

  if (state === 'start' || state === 'over') {

    state = 'play';
    score = 0;
    startTime = millis();

    ghost.x = 240;
    ghost.y = 300;

    // Reset cars
    for (let i = 0; i < cars.length; i++) {
      cars[i].x = random(roadX + 40,
                         roadX + roadWidth - 40);
      cars[i].y = -100 - i * 140;
      cars[i].speed = random(2, 3);
    }
  }
}

// Draw a tree
function drawTree(x, y) {

  // Tree trunk
  fill(110, 70, 35);
  rect(x - 5, y + 10, 10, 25);

  // Tree leaves
  fill(35, 120, 50);
  ellipse(x, y, 35, 35);
  ellipse(x - 12, y + 8, 25, 25);
  ellipse(x + 12, y + 8, 25, 25);
}

// Draw car
function drawCar(x, y, carColour) {

  fill(carColour[0], carColour[1], carColour[2]);
  rect(x - 17, y - 28, 34, 56, 7);

  // Windows
  fill(180, 220, 240);
  rect(x - 12, y - 17, 24, 13, 3);
  rect(x - 12, y + 5, 24, 12, 3);

  // Wheels
  fill(20);
  rect(x - 21, y - 18, 5, 13);
  rect(x + 16, y - 18, 5, 13);
  rect(x - 21, y + 10, 5, 13);
  rect(x + 16, y + 10, 5, 13);

  // Headlights
  fill(255, 255, 150);
  rect(x - 12, y - 27, 7, 4);
  rect(x + 5, y - 27, 7, 4);
}

// Draw ghost
function drawGhost(x, y) {

  noStroke();

  fill(255, 170, 70);
  ellipse(x, y, 55, 55);

  // Eyes
  fill(40);
  ellipse(x - 10, y - 5, 8, 10);
  ellipse(x + 10, y - 5, 8, 10);

  // Mouth
  ellipse(x, y + 10, 8, 5);
}

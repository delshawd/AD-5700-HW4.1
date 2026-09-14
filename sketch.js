/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates drawing skeletons on poses for the MoveNet model.
 */

let video;
let bodyPose;
let poses = [];
let connections;
let balls = [];

//*
let startSecond;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function makeBalls() {
  const redC = color(255, 0, 0);
  const greenC = color(0, 255, 0);
  const blueC = color(0, 0, 255);

  balls.push(new Ball(100, 400, 20, redC));
  balls.push(new Ball(700, 400, 20, redC));

  balls.push(new Ball(-700, 400, 20, greenC));
  balls.push(new Ball(-700, 400, 20, greenC));

  balls.push(new Ball(-500, 400, 20, blueC));
  balls.push(new Ball(-700, 400, 20, blueC));
}

function setup() {
  createCanvas(640, 480);
  makeBalls();

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  noLoop();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width, height);
}

function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs);
}

function draw() {
//*
// how long i survived
let elapsed = second() - startSecond;

// when seconds go back to 0
if (elapsed < 0) {
  elapsed += 60;
}


  push();

  scale(-1, 1);
  translate(-width, 0);

  // Draw the webcam video
  image(video, 0, 0, width, height);

  drawWristsAndNose();

  if (balls.length > 0) {
    moveBallAndTest(0, 1);
    moveBallAndTest(2, 3);
    moveBallAndTest(4, 5);
  }
  pop();

  // if all 3 balls are popped i lose
  if (
    balls[0].popped &&
    balls[2].popped &&
    balls[4].popped
  ) {
    background(0);

    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("You Lose", width / 2, height / 2);

    noLoop();
  }
  
  // if i make it 45s i win
  else if (elapsed >= 45) {
    background(0);

    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("You Win", width / 2, height / 2);
    
    noLoop();
  }
}

function moveBallAndTest(index, pair) {
  let b = balls[index];

  b.update();
  b.display();
  b.checkBoundaryCollision();
  b.checkCollisionAndDelete(balls[pair]);
}

function drawWristsAndNose() {
  if (poses.length > 0) {
    let pose = poses[0];

    let nose = pose.keypoints[0];
    let lWrist = pose.keypoints[9];
    let rWrist = pose.keypoints[10];

    drawPoint(1, nose, color(255, 0, 0));
    drawPoint(3, lWrist, color(0, 255, 0));
    drawPoint(5, rWrist, color(0, 0, 255));
  }
}

function drawPoint(i, keypoint, col) {
  balls[i].moveTo(keypoint.x, keypoint.y);
  balls[i].display();
}

//*
function gotPoses(results) {
  poses = results;

  if (startSecond === undefined) {
    startSecond = second();
    loop();
  }
}

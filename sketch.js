let characters = [];
let currentChar = 0;
let currentAction = 'idle';
let x, y;
let frameCounter = 0;
let isMoving = false;
let lastMoveTime = 0;
let bullets = [];
let health = 0;
let affection = 0;
let skill = 0;
let allFull = false;
let bg;

// 定義每個角色的精靈圖資訊
const spriteData = {
  char1: {
    idle: { w: 89.5, h: 61, frames: 10 },
    down: { w: 541/6, h: 86, frames: 6 },
    left: { w: 380/7, h: 79, frames: 7 },
    right: { w: 355/4, h: 86, frames: 4 },
    up: { w: 89.5, h: 95, frames: 10 }
  },
  char2: {
    idle: { w: 289/7, h: 80, frames: 7 },
    down: { w: 73, h: 82, frames: 5 },
    left: { w: 607/9, h: 91, frames: 9 },
    right: { w: 475/8, h: 110, frames: 8 },
    up: { w: 277/6, h: 108, frames: 6 }
  },
  char3: {
    idle: { w: 317/7, h: 81, frames: 7 },
    down: { w: 832/9, h: 57, frames: 9 },
    left: { w: 73, h: 83, frames: 5 },
    right: { w: 457/6, h: 90, frames: 6 },
    up: { w: 301/6, h: 108, frames: 6 }
  }
};
  
function preload() {
  // 載入背景
  bg = loadImage('media/bg.jpg');
  // 載入所有角色的精靈圖
  characters[0] = {
    idle: loadImage('media/c1/c1m3.png'),
    down: loadImage('media/c1/c1m2.png'),
    left: loadImage('media/c1/c1m0.png'),
    right: loadImage('media/c1/c1m1.png'),
    up: loadImage('media/c1/c1m4.png')
  };
  
  characters[1] = {
    idle: loadImage('media/c2/c2m0.png'),
    down: loadImage('media/c2/c2m1.png'),
    left: loadImage('media/c2/c2m3.png'),
    right: loadImage('media/c2/c2m2.png'),
    up: loadImage('media/c2/c2m4.png')
  };
  
  characters[2] = {
    idle: loadImage('media/c3/c3m0.png'),
    down: loadImage('media/c3/c3m2.png'),
    left: loadImage('media/c3/c3m1.png'),
    right: loadImage('media/c3/c3m3.png'),
    up: loadImage('media/c3/c3m4.png')
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  x = windowWidth / 2;
  y = windowHeight / 2;
}

function draw() {
  frameRate(30);
  // 繪製背景，使用 width 和 height 填滿整個畫布
  image(bg, width / 2, height / 2, width, height);

  if (isMoving && millis() - lastMoveTime > 100) {
      isMoving = false;
      currentAction = 'idle';
  }

  let obstacleX = width - 50;
  let obstacleY = height / 2 - 100;
  let obstacleW = 50;
  let obstacleH = 200;
  fill(150);
  rect(obstacleX, obstacleY, obstacleW, obstacleH);

  let currentSprite = characters[currentChar][currentAction];
  let spriteInfo = spriteData[`char${currentChar + 1}`][currentAction];
  let currentFrame = floor(frameCounter / 6) % spriteInfo.frames;
  let sx = currentFrame * spriteInfo.w;
  let sy = 0;
  let sw = spriteInfo.w;
  let sh = spriteInfo.h;
  image(currentSprite, x, y, sw*3, sh*3, sx, sy, sw, sh);
  frameCounter++;

  // 將文字顏色改為白色
  fill(255); // 白色
  textSize(20);
  text(`角色: ${currentChar + 1}`, 20, 30);
  text(`動作: ${currentAction}`, 20, 60);

  textAlign(LEFT);
  textSize(16);
    let instructions = [
      "操作指引：",
      "1-3：切換角色",
      "←→：左右移動",
      "↑：跳起來",
      "↓：蹲下",
      "空格鍵：練習向右發射子彈",
      "無按鍵：待機",
      "目標：持續練習，把子彈打到右邊的障礙物上",
      "練習的過程可能會有挫折，努力到最後會有什麼結果呢？",
      "TKUET 113 01 Program Design"
    ];
    for (let i = 0; i < instructions.length; i++) {
      text(instructions[i], 20, height - 20 - (instructions.length - i) * 20);
  }
  textAlign(LEFT);

  for (let i = bullets.length - 1; i >= 0; i--) {
      let bullet = bullets[i];
      bullet.x += bullet.speed;
      ellipse(bullet.x, bullet.y, bullet.diameter);
      if (bullet.x > width || bulletHitsTarget(bullet)) {
          bullets.splice(i, 1);
          if (bulletHitsTarget(bullet)) {
              let randStat = floor(random(3));
              switch (randStat) {
                  case 0: health = min(100, health + 10); break;
                  case 1: affection = min(100, affection + 10); break;
                  case 2: skill = min(100, skill + 10); break;
              }
          }
      }
  }

  // 調整 Y 軸位置來增加間距
  let startY = 20; // 第一個血量條的起始 Y 軸位置
  let ySpacing = 40; // 血量條之間的間距

  drawStatBar("認知", health, startY);
  drawStatBar("情意", affection, startY + ySpacing);
  drawStatBar("動作技能", skill, startY + 2 * ySpacing);


  if (health === 100 && affection === 100 && skill === 100 && !allFull) {
      allFull = true;
  }

  if(allFull){
      fill(255);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("你真棒！", width / 2, height / 4);
      textAlign(LEFT, BASELINE);
  }
}

function drawStatBar(label, value, yPos) {
  fill(255, 0, 0);
  rect(width - 220, yPos, value * 2, 20);
  fill(0);
  textSize(16);
  text(label, width - 220, yPos + 35); // 微調文字位置
  noFill();
  stroke(255);
  rect(width - 220, yPos, 200, 20);
}

function keyPressed() {
  if (key >= '1' && key <= '3') {
    currentChar = int(key) - 1;
    return;
  }
  
  let moveSpeed = 5;
  isMoving = true;
  lastMoveTime = millis();
  
  if (keyCode === DOWN_ARROW) {
    currentAction = 'down';
  } else if (keyCode === LEFT_ARROW) {
    currentAction = 'left';
    x = constrain(x - moveSpeed, 0, width);
  } else if (keyCode === RIGHT_ARROW) {
    currentAction = 'right';
    x = constrain(x + moveSpeed, 0, width);
  } else if (keyCode === UP_ARROW) {
    currentAction = 'up';
  } else if (key === ' ') {
    bullets.push({x: x, y: y, diameter: 20, speed: 10});
  }
}

function bulletHitsTarget(bullet) {
  let obstacleX = width - 50;
  let obstacleY = height / 2 - 100;
  let obstacleW = 50;
  let obstacleH = 200;
  return bullet.x > obstacleX && bullet.x < obstacleX + obstacleW &&
         bullet.y > obstacleY && bullet.y < obstacleY + obstacleH;
}

function keyReleased() {
  lastMoveTime = millis();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  x = windowWidth / 2;
  y = windowHeight / 2;
}

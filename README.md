# 第二個作業
> 11301coding_homework2_fin</br>

淡江大學教科一A余亮晨製作，為113學年度第一學期程式設計與實習，第二個作業。</br>
note: https://hackmd.io/@riu0206/113coding_01fin</br>

```javascript=
// 11301 program design final homework
// by TKU ET 1 A 413731000 余亮晨


// 定義：設立變數。

let characters = []; // 創建角色圖片空陣列。
let currentChar = 0; // 當前角色：1、2、3，預設為無(0)。
let currentAction = 'idle'; // 預設角色為待機狀態。
let x, y; // 下面程式碼設定為螢幕正中央。
let frameCounter = 0; // 重設並計算幀數。
let isMoving = false; // 預設為未移動
let lastMoveTime = 0; // 紀錄上次最後移動的時刻，預設為0。
let bullets = []; // 創建子彈空陣列。
let health = 0; // 「認知」血量條生命值。
let affection = 0; // 「情意」血量條生命值。
let skill = 0; // 「動作技能」血量條生命值。
let allFull = false; // 偵測「認知」、「情意」、「動作技能」三個血量條是否皆滿。
let bg; // 用於存放背景圖片。


// 定義每個角色的精靈圖資訊。

const spriteData = { // 依序輸入精靈圖的寬(width，w)、高(height，h)、幀數(frames)。
  char1: { // 角色1。
    idle: { w: 89.5, h: 61, frames: 10 }, // 待機中的精靈圖資訊。
    down: { w: 541/6, h: 86, frames: 6 }, // 蹲下閃避的精靈圖資訊。
    left: { w: 380/7, h: 79, frames: 7 }, // 向左移動的精靈圖資訊。
    right: { w: 355/4, h: 86, frames: 4 }, // 向右移動的精靈圖資訊。
    up: { w: 89.5, h: 95, frames: 10 } // 向上跳的精靈圖資訊。
  },
  char2: { // 角色2。
    idle: { w: 289/7, h: 80, frames: 7 }, // 待機中的精靈圖資訊。
    down: { w: 73, h: 82, frames: 5 }, // 蹲下閃避的精靈圖資訊。
    left: { w: 607/9, h: 91, frames: 9 }, // 向左移動的精靈圖資訊。
    right: { w: 475/8, h: 110, frames: 8 }, // 向右移動的精靈圖資訊。
    up: { w: 277/6, h: 108, frames: 6 } // 向上跳的精靈圖資訊。
  },
  char3: { // 角色3。
    idle: { w: 317/7, h: 81, frames: 7 }, // 待機中的精靈圖資訊。
    down: { w: 832/9, h: 57, frames: 9 }, // 蹲下閃避的精靈圖資訊。
    left: { w: 73, h: 83, frames: 5 }, // 向左移動的精靈圖資訊。
    right: { w: 457/6, h: 90, frames: 6 }, // 向右移動的精靈圖資訊。
    up: { w: 301/6, h: 108, frames: 6 } // 向上跳的精靈圖資訊。
  }
};


// 預先載入所有素材。

function preload() { // 預先載入。
  bg = loadImage('media/bg.jpg'); // 載入背景。

  // 載入所有角色的精靈圖。
  characters[0] = { // 載入角色1的精靈圖。
    idle: loadImage('media/c1/c1m3.png'), // 載入角色1待機中的精靈圖。
    down: loadImage('media/c1/c1m2.png'), // 載入角色1蹲下閃避的精靈圖。
    left: loadImage('media/c1/c1m0.png'), // 載入角色1向左移動的精靈圖。
    right: loadImage('media/c1/c1m1.png'), // 載入角色1向右移動的精靈圖。
    up: loadImage('media/c1/c1m4.png') // 載入角色1向上跳的精靈圖。
  };
  characters[1] = { // 載入角色2的精靈圖。
    idle: loadImage('media/c2/c2m0.png'), // 載入角色2待機中的精靈圖。
    down: loadImage('media/c2/c2m1.png'), // 載入角色2蹲下閃避的精靈圖。
    left: loadImage('media/c2/c2m3.png'), // 載入角色2向左移動的精靈圖。
    right: loadImage('media/c2/c2m2.png'), // 載入角色2向右移動的精靈圖。
    up: loadImage('media/c2/c2m4.png') // 載入角色2向上跳的精靈圖。
  };
  characters[2] = { // 載入角色3的精靈圖。
    idle: loadImage('media/c3/c3m0.png'), // 載入角色3待機中的精靈圖。
    down: loadImage('media/c3/c3m2.png'), // 載入角色3蹲下閃避的精靈圖。
    left: loadImage('media/c3/c3m1.png'), // 載入角色3向左移動的精靈圖。
    right: loadImage('media/c3/c3m3.png'), // 載入角色3向右移動的精靈圖。
    up: loadImage('media/c3/c3m4.png') // 載入角色3向上跳的精靈圖。
  };
}


// 預先設定畫面。

function setup() { // 編程製作一開始的畫面。
  createCanvas(windowWidth, windowHeight); // 創建全螢幕畫布。
  imageMode(CENTER); // 圖片顯示將以中央為基準點。
  x = windowWidth / 2; // 令 x 為螢幕寬的一半。
  y = windowHeight / 2; // 令 y 為螢幕高的一半。
}


// 實時繪製畫面。

function draw() { // 預設以 1/60 秒為週期覆蓋繪製。
  frameRate(30); // 將幀率改變為每秒30次。
  image(bg, width / 2, height / 2, width, height); // 繪製背景，使用 width 和 height 填滿整個畫布。

  // 偵測是否移動，未移動時，讓角色待機。
  if (isMoving && millis() - lastMoveTime > 100) { // 若一段時間未移動。
      isMoving = false; // "isMoving" 設為 false 。
      currentAction = 'idle'; // 讓角色進行待機動作。
  }

  // 設定練功牆的相關數值，並進行繪製。
  let obstacleX = width - 50; // 牆壁繪製基準點的 x 值。
  let obstacleY = height / 2 - 100; // 牆壁繪製基準點的 y 值。
  let obstacleW = 50; // 牆壁寬。
  let obstacleH = 200; // 牆壁高。
  fill(150); // 牆面的顏色。
  rect(obstacleX, obstacleY, obstacleW, obstacleH); // 繪製長方形當作練功牆。

  // 切割精靈圖。
  let currentSprite = characters[currentChar][currentAction]; // 設立變數，代表當前角色及動作。
  let spriteInfo = spriteData[`char${currentChar + 1}`][currentAction]; // 讀取 const spriteData ，取得每張精靈圖用於切割的相關數值。
  let currentFrame = floor(frameCounter / 6) % spriteInfo.frames; // 設立變數，為當前顯示精靈圖的幀序號。
    // floor() 用於取整， frameCounter/6 可放慢精靈圖播放速率。
  let sx = currentFrame * spriteInfo.w; // 精靈圖幀切割，基準點（左上角）的 x 值。
  let sy = 0; // 精靈圖幀切割，基準點（左上角）的 y 值。
  let sw = spriteInfo.w; // 擷取精靈圖，每幀的寬度。
  let sh = spriteInfo.h; // 擷取精靈圖，每幀的高度。
  image(currentSprite, x, y, sw*3, sh*3, sx, sy, sw, sh); // 繪製角色於畫面。
    // sw*3 、 sh*3 讓角色放大三倍。

  frameCounter++; // 每執行一次此命令，變數 frameCounter 值增加1。

  // 設定並顯示狀態文字。
  fill(255); // 以白色填滿。
  textSize(20); // 字級20。
  text(`角色: ${currentChar + 1}`, 20, 30); // 以(20,30)為基準點，顯示當前角色代號。
  text(`動作: ${currentAction}`, 20, 60); // 以(20,60)為基準點，顯示當前角色動作狀態。

  // 顯示說明文字。
  textAlign(LEFT); // 文字向左對齊。
  textSize(16); // 字級16。
    let instructions = [ // 創建陣列，內含說明文字。
      "操作指引：", // 標題。
      "1-3：切換角色", // 切換角色操作方式。
      "←→：左右移動", // 移動角色操作方式。
      "↑：跳起來", // 特殊招式操作方式。
      "↓：蹲下", // 特殊招式操作方式。
      "空格鍵：練習向右發射子彈", // 攻擊操作方式。
      "無按鍵：待機", // 恢復待機狀態條件。
      "目標：持續練習，把子彈打到右邊的障礙物上", // 遊戲目標說明。
      "練習的過程可能會有挫折，努力到最後會有什麼結果呢？", // 遊戲引文。
      "TKUET 113 01 Program Design" // 結合課程說明。
    ];
    for (let i = 0; i < instructions.length; i++) { // 以 for 迴圈顯示陣列內容。
      text(instructions[i], 20, height - 20 - (instructions.length - i) * 20); // 顯示陣列內之說明文字。
  }
  textAlign(LEFT); // 文字向左對齊。

  // 將遊戲過程連動進度條。
  for (let i = bullets.length - 1; i >= 0; i--) { // 根據現有的子彈下指令。 
      let bullet = bullets[i]; // 設立變數，值為子彈陣列中序號 i 的值。
      bullet.x += bullet.speed; // 每次執行時，子彈的 x 座標會依據 bullet. speed 的數值增加。
      ellipse(bullet.x, bullet.y, bullet.diameter); // 繪畫圓形作為子彈。
      if (bullet.x > width || bulletHitsTarget(bullet)) { // 若子彈接觸到牆壁，或是超出螢幕邊界。
          bullets.splice(i, 1); // 將該子彈從子彈陣列中移除。
          if (bulletHitsTarget(bullet)) { // 若子彈接觸到牆壁。
              let randStat = floor(random(3)); // 在0、1、2三數中，隨機取一；設立變數，並取此隨機數為變數值。
              switch (randStat) { // 基於 randStat 的值，執行不同的命令。
                  case 0: health = min(100, health + 10); break; // 增加「認知」進度條。
                  case 1: affection = min(100, affection + 10); break; // 增加「情意」進度條。
                  case 2: skill = min(100, skill + 10); break; // 增加「動作技能」進度條。
              }
          }
      }
  }

  // 調整 Y 軸位置來增加間距。
  let startY = 20; // 第一個進度條的起始 Y 軸位置。
  let ySpacing = 40; // 進度條之間的間距。

  // 利用 drawStatBar() 繪製進度條。
  drawStatBar("認知", health, startY); // 繪製「認知」進度條。
  drawStatBar("情意", affection, startY + ySpacing); // 繪製「情意」進度條。
  drawStatBar("動作技能", skill, startY + 2 * ySpacing); // 繪製「動作技能」進度條。

  // 設定遊戲結局。
  if (health === 100 && affection === 100 && skill === 100 && !allFull) { // 若三個進度條都滿了。
      allFull = true; // 將變數 allFull 的狀態變更為 true 。
  }
  if(allFull){ // 若 allFull 成立。
      fill(255); // 文字填滿白色。
      textSize(32); // 字級32。
      textAlign(CENTER, CENTER); // 文字置於正中央。
      text("你真棒！", width / 2, height / 4); // 在(width/2,height/4)的地方，顯示文字「你真棒！」
      textAlign(LEFT, BASELINE); // 文字置於左下角。
  }
}


// 繪製進度條。

function drawStatBar(label, value, yPos) { // 函式 drawStatBar 用於繪製計量條。
    // label 為狀態條， value為當前值， yPos 為位置的 y 座標。
  fill(255, 0, 0); // 進度條填滿紅色。
  rect(width - 220, yPos, value * 2, 20); // 繪製。
  fill(0); // 文字填滿黑色。
  textSize(16); // 字級16。
  text(label, width - 220, yPos + 35); // 微調文字位置。
  noFill(); // 不填滿邊框。
  stroke(255); // 邊框為白色。
  rect(width - 220, yPos, 200, 20); // 繪製邊框。
}


// 處理按鍵訊號並做出回應。

function keyPressed() { // 按下任意按鍵後，就立即執行一次。
  // 更換角色。
  if (key >= '1' && key <= '3') { // 若按下1、2、3其中一個按鍵。
    currentChar = int(key) - 1; // 當下角色(currentChar)切換成指定角色，序號為 key-1 。
    return; // 回傳 currentChar 函數值。
  }

  let moveSpeed = 5; // 預設移動速率為5。
  isMoving = true; // 有在移動，變數 isMoving 成立。
  lastMoveTime = millis(); // 利用 millis() 紀錄從開始執行程式到現在，總共的幀數。
  
  // 角色移動。
  if (keyCode === DOWN_ARROW) { // 若按下向下鍵。
    currentAction = 'down'; // 進行蹲下的動作。
  } else if (keyCode === LEFT_ARROW) { // 若按下向左鍵。
    currentAction = 'left'; // 向左移動。
    x = constrain(x - moveSpeed, 0, width);
  } else if (keyCode === RIGHT_ARROW) { // 若按下向右鍵。
    currentAction = 'right'; // 向右移動。
    x = constrain(x + moveSpeed, 0, width);
  } else if (keyCode === UP_ARROW) { // 若按下向上鍵。
    currentAction = 'up'; // 向上跳。
  } else if (key === ' ') { // 若按下空白鍵(space)。
    bullets.push({x: x, y: y, diameter: 20, speed: 10}); // 將數值輸入陣列 bullets[] 。
  }
}


// 詳細說明「子彈碰到牆壁」是什麼意思。

function bulletHitsTarget(bullet) { // 此函式用於定義「子彈碰到牆壁」這件事。
  let obstacleX = width - 50; // 牆壁繪製基準點的 x 值。
  let obstacleY = height / 2 - 100; // 牆壁繪製基準點的 y 值。
  let obstacleW = 50; // 牆壁寬。
  let obstacleH = 200; // 牆壁高。
  return bullet.x > obstacleX && bullet.x < obstacleX + obstacleW && // 意即 bullet.x = (obstacleX,obstacleX+obstacleW) 。
         bullet.y > obstacleY && bullet.y < obstacleY + obstacleH; // 意即 bullet.y = (obstacleY,obstacleY+obstacleH) 。
}


// 放開按鍵時，記錄停止移動的幀數。

function keyReleased() { // 只要放開任意按鍵一次，就執行一次。
  lastMoveTime = millis(); // 利用 millis() 紀錄從開始執行程式到現在，總共的幀數。
}


// 實時調整畫布大小。

function windowResized() { // 一旦調整整體畫面尺寸，就立刻執行一次。
  resizeCanvas(windowWidth, windowHeight); // 依照當前螢幕尺寸，重新創建全螢幕畫布。
  x = windowWidth / 2; // 將變數 x 校正回螢幕寬的一半，即中央。
  y = windowHeight / 2; // 將變數 x 校正回螢幕寬的一半，即中央。
}
```

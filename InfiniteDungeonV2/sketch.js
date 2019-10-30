function preload() {
  playerFigure = loadImage('assets/player.png');
  ground1 = loadImage('assets/ground.png');
}

let playerPosX = 0;
let playerPosY = 0;
let roomNumX = 0;
let roomNumY = 0;
let monsterPosX = 0;
let monsterPosY = 0;
let monsterAppears = false;
let fireAppears = false;
let health = 10000;
let healthLimit = 10000;
let healthRegen = 0.1;
let living = true;
let monsterKilled = false;
let rightDoorOpens = true;
let leftDoorOpens = true;
let downDoorOpens = true;
let upDoorOpens = true;
let playerSpeed = 3;
let rushSpeed = 0;
let monsterSpeed = 3.5;
let energy = 10000;
let energyLimit = 10000;
let dialogue = true;
let dialogue1 = true;
let dialogue2 = false;
let skipDialogue = true;
let injured = false;
let rushing = false;
let monsterColor = 255;
let shooting = false;
let bulletSpeed = 10;
let bulletPosX = 0;
let bulletPosY = 0;
let bulletAppears = false;
let aiming = false;
let aim = 1;
let gunLine;
let flicker = [0, 1];
let shootingTest = false;
let flickeringAimer;
let pause = false;
let carpetAppears = false;
let monsterHealth = 30;
let glowValue = 0;
let glowingUp = true;

function setup() {
  createCanvas(600, 400);
  noStroke();
  imageMode(CENTER);
  frameRate(30);
  textFont("futura");
  monster1 = new Monster (0, 3, 0, 0, 30, 30, 1, 255, 255, 255, 255, 30, 30);
  monster2 = new Monster (3, 3, 0, 0, 30, 30, 1, 255, 255, 255, 255, 30, 30);
  monster3 = new Monster (5, 0, 0, 0, 30, 30, 1, 255, 255, 255, 255, 30, 30);
  monster4 = new Monster (1, 7, 0, 0, 30, 30, 1, 255, 255, 255, 255, 30, 30);
  monster5 = new Monster (3, 8, 0, 0, 30, 30, 1, 255, 255, 255, 255, 30, 30);
  monster6 = new Monster (5, 7, 0, 0, 30, 30, 1, 255, 255, 255, 255, 30, 30);
  monster7 = new Monster (6, 4, 0, 0, 30, 30, 1, 255, 255, 255, 255, 30, 30);
  blood1 = new Particle (200 + playerPosX, 200 + playerPosY, 10, 10, 12, 0.56, 255, 0, 0, 125);
}

function draw() {
  background(220 - abs(roomNumX * roomNumY) % 3 * 10, 220 - abs(roomNumY - roomNumY) % 5 * 15, 220 - abs(roomNumX + roomNumY) % 5 * 15);
  image(ground1, 200, 200, 400, 400);
  fill(0);
  glow(4);
  move();
  carpet();
  fire();
  environment();
  event();
  energyGen();
  rush();
  laser();
  holdSword();
  player();
  monster();
  shoot();
  injureMonster();
  fill(0);
  rect(400, 0, 200, 400);
  fill(255);
  injury();
  roomNum();
  healthBar();
  energyBar();
  dialogueBar();
  narrator();
  monsters();
}

function player() {
  if (living == true) {
    if (rushing == true && energy >= energyLimit * 0.2) {
      fill(0, 130 + glowValue / 4 * 70, 255)
    } else if (rushing == true && energy < energyLimit * 0.2) {
      fill(0, 70 + glowValue / 4 * 35, 150);
    } else {
      fill(0);
    }
    // ellipse(200 + playerPosX, 200 + playerPosY, 20, 20);
    image(playerFigure, 200 + playerPosX, 200 + playerPosY, 40, 40);
  }
}

class Particle {
  constructor(x, y, w, h, s, d, r, g, b, t) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = s;
    this.direction = d;
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorT = t;
  }
  
  appear() {
    fill(this.colorR, this.colorG, this.colorB, this.colorT);
    translate(this.x, this.y);
    this.x = this.x + this.speed;
    rotate(this.direction);
    ellipse(0, 0, this.w, this.h);
    if(this.x >= 200 + playerPosX + 40) {
      this.x = 200 + playerPosX;
      this.y = 200 + playerPosY;
    }
  }
}

function move() {
  if (living == true && pause == false) {
    if (keyIsDown(87) && playerPosY >= -190) {
      playerPosY -= playerSpeed + rushSpeed;
    }
    if (keyIsDown(83) && playerPosY <= 190) {
      playerPosY += playerSpeed + rushSpeed;
    }
    if (keyIsDown(65) && playerPosX >= -190) {
      playerPosX -= playerSpeed + rushSpeed;
    }
    if (keyIsDown(68) && playerPosX <= 190) {
      playerPosX += playerSpeed + rushSpeed;
    }
  }

  //right door
  if (rightDoorOpens == true && playerPosX >= 190 && playerPosY <= 50 && playerPosY >= -50 && keyIsDown(32)) {
    playerPosX = -180;
    roomNumX += 1;
    // monsterPosX = 180;
    // monsterPosY = 180;
  }


  //left door
  if (leftDoorOpens == true && playerPosX <= -190 && playerPosY <= 50 && playerPosY >= -50 && keyIsDown(32)) {
    playerPosX = 180;
    roomNumX -= 1;
    // monsterPosX = 180;
    // monsterPosY = 180;
  }

  //up door
  if (upDoorOpens == true && playerPosY <= -190 && playerPosX <= 50 && playerPosX >= -50 && keyIsDown(32)) {
    playerPosY = 180;
    roomNumY += 1;
    // monsterPosX = 180;
    // monsterPosY = 180;
  }

  //down door
  if (downDoorOpens == true && playerPosY >= 190 && playerPosX <= 50 && playerPosX >= -50 && keyIsDown(32)) {
    playerPosY = -180;
    roomNumY -= 1;
    // roomNumY -=1;
    // monsterPosX = 180;
    // monsterPosY = 180;
  }
}

function rush() {
  if (keyIsDown(32) && energy > energyLimit * 0.2 && pause == false) {
    rushSpeed = 6;
    energy -= 1;
    rushing = true;
  } else if (keyIsDown(32) && energy > energyLimit * 0.02 && dialogue == false) {
    rushSpeed = 1.5;
    energy -= 1;
    rushing = true;
  } else if (keyIsDown(32) && energy > energyLimit * 0 && dialogue == false) {
    rushSpeed = 0;
    energy -= 1;
    rushing = true;
  } else {
    rushSpeed = 0;
    rushing = false;
  }
}

function energyGen() {
  // if (keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
  //   energy += 0.5;
  // }
  if (living == true) {
    energy += 0.5;
  } else {
    energy = 0;
  }

  if (energy > energyLimit) {
    energy = energyLimit;
  }
  if (energy <= 0) {
    energy = 0;
  }
}

function energyBar() {
  if (shootingTest == true) {
    stroke(255, 195 + glowValue / 4 * 60, 50);
  } else if (rushing == true && energy >= energyLimit * 0.2) {
    stroke(100, 190 + glowValue / 4 * 65, 255);
  } else if (rushing == true && energy < energyLimit * 0.2) {
    stroke(0, 40 + glowValue / 4 * 50, 125);
  } else if (energy < energyLimit * 0.2) {
    stroke(150);
  } else {
    stroke(255);
  }
  fill(255, 0);
  rect(443, 80, 140, 20);
  if (shootingTest == true) {
    fill(255, 195 + glowValue / 4 * 60, 50);
  } else if (rushing == true && energy >= energyLimit * 0.2) {
    fill(100, 190 + glowValue / 4 * 65, 255);
  } else if (rushing == true && energy < energyLimit * 0.2) {
    fill(0, 70 + glowValue / 4 * 3, 150);
  } else if (energy < energyLimit * 0.2) {
    fill(150);
  } else {
    fill(255);
  }
  rect(443, 80, 140 * energy / energyLimit, 20);
  line(443, 80, 443, 100);
  rectMode(CENTER);
  rect(425, 90, 20, 20);
  fill(0);
  noStroke();
  triangle(425, 82, 419, 90, 431, 90);
  triangle(425, 89, 419, 97, 431, 97);
  rectMode(CORNER);
  fill(0);
  if (energy > 4) {
    text(int(energy), 446, 95);
  } else {
    fill(150);
    text("No energy", 448, 95);
    fill(0);
  }
}

function environment() {
  fill(0);
  rect(0, 0, 150, 10);
  rect(0, 0, 10, 150);
  rect(250, 0, 150, 10);
  rect(0, 250, 10, 150);
  rect(0, 390, 150, 10);
  rect(390, 0, 10, 150);
  rect(250, 390, 150, 10);
  rect(390, 250, 10, 150);
  if (rightDoorOpens == false) {
    rect(390, 150, 10, 100);
  }
  if (leftDoorOpens == false) {
    rect(0, 150, 10, 100);
  }
  if (upDoorOpens == false) {
    rect(150, 0, 100, 10);
  }
  if (downDoorOpens == false) {
    rect(150, 390, 100, 10);
  }
  if (rightDoorOpens == true && (abs(roomNumX + 1) + abs(roomNumY)) % 3 == 2 && monsterHealth > 0) {
    push();
    fill(255);
    translate(200, 200);
    rotate(0.5 * PI);
    triangle(-10, -170, 10, -170, 0, -190);
    pop();
  }
  if (leftDoorOpens == true && (abs(roomNumX - 1) + abs(roomNumY)) % 3 == 2 && monsterHealth > 0) {
    push();
    fill(255);
    translate(200, 200);
    rotate(-0.5 * PI);
    triangle(-10, -170, 10, -170, 0, -190);
    pop();
  }
}

function roomNum() {
  textStyle(BOLD);
  textSize(20);
  text("Room " + roomNumX + ", " + roomNumY, 413, 35);
  textStyle(NORMAL);
}

function event() {
  // if ((abs(roomNumX) + abs(roomNumY)) % 3 == 2 && monsterHealth > 0) {
  //   monsterAppears = true;
  // } else {
  //   monsterAppears = false;
  // }

  //right - left - left
  if ((abs(roomNumX) + abs(roomNumY)) % 5 == 3) {
    rightDoorOpens = false;
  } else {
    rightDoorOpens = true;
  }

  if ((abs(roomNumX - 1) + abs(roomNumY)) % 5 == 3) {
    leftDoorOpens = false;
  } else {
    leftDoorOpens = true;
  }

  //up - down - down
  if ((abs(roomNumX) + abs(roomNumY)) % 5 == 4) {
    upDoorOpens = false;
  } else {
    upDoorOpens = true;
  }

  if ((abs(roomNumX) + abs(roomNumY - 1)) % 5 == 4) {
    downDoorOpens = false;
  } else {
    downDoorOpens = true;
  }

  if ((abs(roomNumX) + abs(roomNumY)) % 7 == 5) {
    fireAppears = true;
  } else {
    fireAppears = false;
  }

  if (abs(roomNumX) % 5 == 0 && abs(roomNumY % 5 == 0)) {
    carpetAppears = true;
  } else {
    carpetAppears = false;
  }
}

function carpet() {
  if (carpetAppears == true) {
    fill(0, 20);
    rect(100, 100, 200, 200);
  }
}

class Monster {
  constructor(rx, ry, x, y, hp, hpl, s, r, g, b, t, w, h) {
    this.roomX = rx;
    this.roomY = ry;
    this.alive = true;
    this.health = hp;
    this.healthLimit = hpl;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = s;
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorT = t;
  }
  
  appear() {
    if (this.alive == true && abs(roomNumX) % 12 == this.roomX && abs(roomNumY) % 12 == this.roomY) {
      fill(this.colorR, this.colorG, this.colorB, this.colorT);
      noStroke();
      ellipse(200 + this.x, 200 + this.y, this.w, this.h);
      
      fill(0);
      rect(200 + this.x - 20, 200 + this.y - 30, this.healthLimit / 30 * 40, 6);
      fill(this.colorR, this.colorG, this.colorB, this.colorT);
      rect(200 + this.x - 20, 200 + this.y - 30, this.health / 30 * 40, 6);
    }
  }

  chase() {
    if (this.alive == true && abs(roomNumX) % 12 == this.roomX && abs(roomNumY) % 12 == this.roomY) {
      if (this.x > playerPosX && living == true && pause == false) {
        this.x -= (this.x - playerPosX) / 100 + this.speed;
      }

      if (this.x < playerPosX && living == true && pause == false) {
        this.x += (this.x - playerPosX) / -100 + this.speed;
      }

      if (this.y > playerPosY && living == true && pause == false) {
        this.y -= (this.y - playerPosY) / 100 + this.speed;
      }

      if (this.y < playerPosY && living == true && pause == false) {
        this.y += (this.y - playerPosY) / -100 + this.speed;
      }
    }
  }

  injure() {
    if (this.alive == true && abs(roomNumX) % 12 == this.roomX && abs(roomNumY) % 12 == this.roomY && this.x + 200 <= mouseX + 50 && this.x + 200 >= mouseX - 50 && this.y + 200 <= mouseY + 50 && this.y + 200 >= mouseY - 50 && shootingTest == true) {
      this.colorR = 255;
      this.colorG = glowValue / 4 * 200;
      this.colorB = glowValue / 4 * 200;
      this.health -= 0.5;
    } else {
      this.colorR = 255;
      this.colorG = 255;
      this.colorB = 255;
      this.health = this.health;
    }

    if (this.health <= 0) {
      this.health = 0;
    }
    if (this.health > this.healthLimit) {
      this.health = this.healthLimit;
    }
    if (this.health == 0) {
      this.alive = false;
    }
  }
  
  attack() {
    if (this.alive == true && abs(roomNumX) % 12 == this.roomX && abs(roomNumY) % 12 == this.roomY) {
      if (living == true && this.x <= playerPosX + 20 && this.x >= playerPosX - 20 && this.y <= playerPosY + 20 && this.y >= playerPosY - 20) {
        injured = true;
      } else if (living == true) {
        injured = false;
      }
    }
  }
}

function monster() {
  if (monsterAppears == true) {
    if (monsterPosX > playerPosX && living == true && pause == false) {
      monsterPosX -= (monsterPosX - playerPosX) / 100 + monsterSpeed;
    }

    if (monsterPosX < playerPosX && living == true && pause == false) {
      monsterPosX += (monsterPosX - playerPosX) / -100 + monsterSpeed;
    }

    if (monsterPosY > playerPosY && living == true && pause == false) {
      monsterPosY -= (monsterPosY - playerPosY) / 100 + monsterSpeed;
    }

    if (monsterPosY < playerPosY && living == true && pause == false) {
      monsterPosY += (monsterPosY - playerPosY) / -100 + monsterSpeed;
    }
    if (monsterHealth < 30 && monsterHealth > 0) {
      noStroke();
      fill(255, monsterColor, monsterColor);
      rect(200 + monsterPosX - 20, 200 + monsterPosY - 30, monsterHealth / 30 * 40, 6);
      stroke(0);
      strokeWeight(1);
      fill(0, 0);
      rect(200 + monsterPosX - 20, 200 + monsterPosY - 30, 40, 6);
      noStroke();
    }
    fill(255, monsterColor, monsterColor);
    ellipse(200 + monsterPosX, 200 + monsterPosY, 30, 30);
  } else {
    if (monsterPosX > 0 && living == true && pause == false) {
      monsterPosX -= 5;
    }
    if (monsterPosX < 0 && living == true && pause == false) {
      monsterPosX += 5;
    }
    if (monsterPosY > 0 && living == true && pause == false) {
      monsterPosY -= 5;
    }
    if (monsterPosY < 0 && living == true && pause == false) {
      monsterPosY += 5;
    }
  }
}

function fire() {
  if (fireAppears == true) {
    fill(200, 30, 30);
    rect(10 + (roomNumX % 6) / 6 * 380, (roomNumY % 6) / 6 * 380, 380 / 6, 380 / 6);
    rect(10 + (roomNumX % 11) / 6 * 380, (roomNumY % 11) / 6 * 380, 380 / 6, 380 / 6);
    fill(0);
  }

}

function holdSword() {
  if (pause == false) {
    flickeringAimer = random(30, 40);
    push();
    // stroke(0);
    // strokeWeight(3);
    if (mouseIsPressed && mouseButton == LEFT && energy > 3) {
      energy -= 2;
    }
    if (mouseIsPressed && mouseButton == LEFT && energy > 3) {
      fill(255, 100, 0);
    } else {
      fill(0, 0);
    }
    translate(200 + playerPosX, 200 + playerPosY);
    let v1 = createVector(mouseX - (200 + playerPosX), mouseY - (200 + playerPosY));
    rotate(v1.heading() - 0.5 * PI);
    // line(0, 0, 120, 0);
    // beginShape();
    // vertex(-10, 20);
    // vertex(0, 40);
    // vertex(10, 20);
    // endShape();
    pop();

    push();
    if (mouseIsPressed && mouseButton == LEFT && energy > 3) {
      shootingTest = true;
      stroke(255, 195 + glowValue / 4 * 60, 50);
    } else {
      shootingTest = false;
      stroke(0, 50);
    }
    fill(0, 0);
    strokeWeight(3);
    // fill(255, random(200, 255), 100, 160);
    // line(200 + playerPosX, 200 + playerPosY, mouseX, mouseY);
    // noStroke();
    if (mouseIsPressed && mouseButton == LEFT && energy > 3) {
      ellipse(mouseX, mouseY, flickeringAimer, flickeringAimer);
    } else {
      ellipse(mouseX, mouseY, 25, 25);
    }
    pop();
  }
}

function shoot() {
  // let bulletTargetX = mouseX;
  // let bulletTargetY = mouseY;
  // let bulletStartPosX = playerPosX;
  // let bulletStartPosY = playerPosY;
  // if(mouseIsPressed) {
  //   if(mouseButton === LEFT) {
  //     aiming = true;
  //     bulletAppears = true;
  //     aim = aim + 1;
  //   }
  // }
  // if(aim > 2){
  //   aiming = false;
  //   aim = 1;
  // }
  // if(bulletAppears == true) {
  //   push();
  //   if(aiming == true) {
  //     bulletTargetX = mouseX;
  //     bulletTargetY = mouseY;
  //     bulletStartPosX = playerPosX;
  //     bulletStartPosY = playerPosY;
  //   }
  //   if (aiming == false) {
  //     bulletTargetX = bulletTargetX;
  //     bulletTargetY = bulletTargetY;
  //     bulletStartPosX = bulletStartPosX;
  //     bulletStartPosY = bulletStartPosY;
  //   }
  //   let v1 = createVector(bulletTargetX - (200 + bulletStartPosX), bulletTargetY - (200 + bulletStartPosY));
  //   translate(200 + bulletStartPosX, 200 + bulletStartPosY);
  //   rotate(v1.heading() - 0.25 * PI);
  //   ellipse(bulletPosX, bulletPosY, 10, 10);
  //   bulletPosX += bulletSpeed;
  //   bulletPosY += bulletSpeed;
  //   pop();
  // }
  // if(bulletAppears == false) {
  //   bulletPosX = 0;
  //   bulletPosY = 0;
  // }a
  // if(bulletPosX + 200 + playerPosX > 400 && bulletPosY + 200 + playerPosY > 400) {
  //   bulletAppears = false;
  // }
  // print(aiming);
  // print(aim);
}

function laser() {
  gunLine = random(0, 5);
  if (mouseIsPressed && mouseButton == LEFT && pause == false) {
    if (energy > 4) {
      stroke(255, 195 + glowValue / 4 * 60, 50);
    } else {
      stroke(0, 20);
    }
    if (energy > 4) {
      strokeWeight(random(1, 5));
      line(200 + playerPosX + gunLine / 10 * (mouseX - 200 - playerPosX), 200 + playerPosY + gunLine / 10 * (mouseY - 200 - playerPosY), mouseX + random(-5, 5), mouseY + random(-5, 5));
    } else {
      strokeWeight(4);
      line(200 + playerPosX, 200 + playerPosY, mouseX, mouseY);
    }
    noStroke();
    strokeWeight(1);
  }
}

function injureMonster() {
  // fill(0);
  // stroke(0);
  // push();
  // translate(200 + playerPosX, 200 + playerPosY);
  // let v1 = createVector(mouseX - (200 + playerPosX), mouseY - (200 + playerPosY));
  // rotate(v1.heading() - 0 * PI);
  // if(monsterPosX + 200 <= 10 && monsterPosX + 200 >= -10 && monsterPosY + 200 >= -110 && monsterPosY + 200 <= 0) {
  //   monsterColor = 0;
  // }
  // pop();

  if (monsterPosX + 200 <= mouseX + 50 && monsterPosX + 200 >= mouseX - 50 && monsterPosY + 200 <= mouseY + 50 && monsterPosY + 200 >= mouseY - 50 && shootingTest == true) {
    monsterColor = glowValue / 4 * 200;
    monsterHealth -= 0.5;
  } else {
    monsterColor = 255;
    monsterHealth = monsterHealth;
  }

  if (monsterHealth <= 0) {
    monsterHealth = 0;
  }
  if (monsterHealth > 30) {
    monsterHealth = 30;
  }
  if (monsterHealth == 0) {
    monsterAppears = false;
  }
}

function injury() {
  // if (monsterAppears == true && living == true && monsterPosX <= playerPosX + 10 && monsterPosX >= playerPosX - 20 && monsterPosY <= playerPosY + 20 && monsterPosY >= playerPosY - 20) {
  //   injured = true;
  // }
  if (health > healthLimit) {
    health = healthLimit;
  }
  if (health <= 0) {
    health = 0;
    living = false;
  }
  if (injured == true) {
    health -= 3;
    push();
    blood1.appear();
    pop();
  } else {
    health += 0.2;
    blood1.x = 200 + playerPosX;
    blood1.y = 200 + playerPosY;
  }
}

function healthBar() {
  textSize(13);
  if (injured == true) {
    stroke(255, 0, 0);
  } else {
    stroke(255);
  }
  if (health > -10) {
    fill(255, 0);
    rect(443, 50, 140, 20);
    noStroke();
    if (injured == true) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(443, 50, 140 * health / healthLimit, 20);
    rect(415, 50, 20, 20);
    rectMode(CENTER);
    fill(0);
    rect(425, 60, 13, 5);
    rect(425, 60, 5, 13);
    rectMode(CORNER);
  }
  noStroke();
  if (injured == true && living == true) {
    fill(255, 0, 0);
  } else {
    fill(255);
  }
  fill(0);
  if (living == true) {
    textStyle(BOLD);
    text(int(health), 446, 65);
    textStyle(NORMAL);
  } else {
    fill(255, 0, 0);
    textStyle(BOLD);
    text("You died.", 448, 65);
    textStyle(NORMAL);
  }
}

function dialogueBar() {
  if (dialogue == true) {
    pause = true;
    fill(0, 170);
    rect(0, 300, 400, 100);
    fill(255);
    if (dialogue1 == true) {
      text("Welcome to the infinite doungeon. >>Press 1 to continue", 20, 320, 360, 60);
    }
    if (dialogue2 == true) {
      text("Use WASD & shift to move. >>Press 2 to dismiss", 20, 320, 360, 60);
    }
  } else {
    pause = false;
  }
  // if(key === 32) {
  //   skipDialogue = false;
  // } else {
  //   skipDialogue = true;
  // }
}

function keyPressed() {
  if (dialogue1 == true && keyCode === 49 && skipDialogue == true) {
    dialogue1 = false;
    dialogue2 = true;
  }
  if (dialogue2 == true && keyCode === 50 && skipDialogue == true) {
    dialogue2 = false;
    dialogue = false;
  }
}

function narrator() {
  if (roomNumX == 0 && roomNumY == 0) {
    fill(255);
    text("This is where it all starts...", 415, 200, 180, 200);
  }
}

function glow(glowTime) {
  if (glowValue <= 0) {
    glowingUp = true;
  } else if (glowValue >= glowTime) {
    glowingUp = false;
  }
  if (glowingUp == true) {
    glowValue++;
  } else {
    glowValue--;
  }
}

function monsters() {
  monster1.appear();
  monster1.chase();
  monster1.injure();
  monster1.attack();
  monster2.appear();
  monster2.chase();
  monster2.injure();
  monster2.attack();
  monster3.appear();
  monster3.chase();
  monster3.injure();
  monster3.attack();
  monster4.appear();
  monster4.chase();
  monster4.injure();
  monster4.attack();
  monster5.appear();
  monster5.chase();
  monster5.injure();
  monster5.attack();
  monster6.appear();
  monster6.chase();
  monster6.injure();
  monster6.attack();
  monster7.appear();
  monster7.chase();
  monster7.injure();
  monster7.attack();
}
class Player {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 70; this.h = 50;
    this.health = 100;
    this.speed = BASE_PLAYER_SPEED + (gameMode === "EVASION" ? 3 : 0);
    this.isAccelerating = false;
  }

  update() {
    this.isAccelerating = false;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.speed;
      this.isAccelerating = true;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.y += this.speed;

    this.x = constrain(this.x, this.w / 2, width - this.w / 2);
    this.y = constrain(this.y, this.h / 2, height - this.h / 2);
  }

  display() {
    imageMode(CENTER);
    let img = this.isAccelerating ? assets.playerAccel : assets.player;
    if (img && img.width > 0) {
      image(img, this.x, this.y, this.w, this.h);
    } else {
      fill(0, 255, 100);
      rectMode(CENTER);
      rect(this.x, this.y, this.w, this.h, 5);
    }
  }

  applyPowerUp() {
    score += 50;
    this.health = min(this.health + 20, 100);
  }
}
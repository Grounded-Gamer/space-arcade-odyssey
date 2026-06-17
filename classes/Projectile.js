class Projectile {
  constructor(x, y, speedX, speedY, isEnemy) {
    this.x = x; this.y = y;
    this.w = 32; this.h = 32; 
    this.speedX = speedX; this.speedY = speedY;
    this.isEnemy = isEnemy; 
    this.currentFrame = 0;
    this.animationSpeed = 4; 
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.isEnemy && frameCount % this.animationSpeed === 0 && projectileFrames.length > 0) {
      this.currentFrame = (this.currentFrame + 1) % projectileFrames.length;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    if (this.isEnemy && projectileFrames.length > 0 && projectileFrames[this.currentFrame]) {
      rotate(HALF_PI); 
      imageMode(CENTER);
      image(projectileFrames[this.currentFrame], 0, 0, this.w, this.h);
    } else {
      fill(0, 255, 150);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, 16, 5, 2);
    }
    pop();
  }

  hits(target) {
    return dist(this.x, this.y, target.x, target.y) < (this.w + target.w) / 2.2;
  }

  isOffScreen() {
    return (this.x < -40 || this.x > width + 40 || this.y < -40 || this.y > height + 40);
  }
}
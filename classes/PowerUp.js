class PowerUp {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.w = 32; this.h = 32;
    this.speed = 2;
  }

  update() { this.x -= this.speed; }

  display() {
    fill(0, 180, 255);
    stroke(255);
    strokeWeight(1);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h, 6);
  }

  hits(target) {
    return dist(this.x, this.y, target.x, target.y) < (this.w + target.w) / 2;
  }
}
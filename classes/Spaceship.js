class Spaceship {
  constructor(x, y, type) {
    this.x = x; this.y = y;
    this.w = 60; this.h = 60;
    this.type = type; 
    this.speed = globalEnemySpeed;
  }

  update() {
    this.x -= this.speed;
  }

  display() {
    imageMode(CENTER);
    let selectedImage = assets.shipCircle;
    if (this.type === 'square' && assets.shipSquare && assets.shipSquare.width > 0) selectedImage = assets.shipSquare;
    if (this.type === 'triangle' && assets.shipTriangle && assets.shipTriangle.width > 0) selectedImage = assets.shipTriangle;

    if (selectedImage && selectedImage.width > 0) {
      image(selectedImage, this.x, this.y, this.w, this.h);
    } else {
      fill(240, 50, 50);
      ellipse(this.x, this.y, this.w, this.h);
    }
  }

  hits(target) {
    return dist(this.x, this.y, target.x, target.y) < (this.w + target.w) / 2.3;
  }
}
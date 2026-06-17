class Button {
  constructor(x, y, w, h, textLabel, actionCallback, rowIndex, colIndex) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.label = textLabel;
    this.callback = actionCallback;
    this.rIndex = rowIndex; 
    this.cIndex = colIndex; 
  }

  isMouseOver() {
    return (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h);
  }

  display2D(selectedRow, selectedCol) {
    let hasFocus = (this.rIndex === selectedRow && this.cIndex === selectedCol);
    this.renderRect(hasFocus);
  }

  display1D(selectedRow) {
    let hasFocus = (this.rIndex === selectedRow);
    this.renderRect(hasFocus);
  }

  renderRect(hasFocus) {
    push();
    fill(hasFocus ? color(0, 120, 220) : color(20, 20, 50));
    stroke(hasFocus ? color(0, 255, 255) : color(0, 150, 200));
    strokeWeight(hasFocus ? 2.5 : 1.5);
    rectMode(CORNER);
    rect(this.x, this.y, this.w, this.h, 6);
    
    fill(255);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    pop();
  }

  checkClick(mx, my) {
    if (mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h) {
      this.callback();
    }
  }
}
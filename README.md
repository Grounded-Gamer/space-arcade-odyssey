### ***Space Arcade Odyssey — Adaptive Viewport Edition***

An advanced, retro-inspired infinite space action arcade experience built using **p5.js** and clean object-oriented architecture. Battle hostile alien shapes, balance difficulty configurations dynamically, and select distinct player operational weapon profiles.

---

### ***Game Feature Highlights***

True Adaptive Resolution: **Built with flexible web coordinates. The application seamlessly re-renders and auto-scales calculations instantly to fit desktop browser spaces, mobile screens, or tablet tabs window-for-window.
Modular OOP Class Blueprints:** Fully decoupled ES6 structure. Every game entity behaves as an isolated self-contained class capsule module (`Player`, `Spaceship`, `Projectile`, `PowerUp`, `Button`) loaded sequentially through an organized HTML pipeline.
Unified Dual Input Operations:** High UX support rules. Toggles menu parameters using responsive grid mouse pointers or complete console-style **2D Keyboard Arrow Matrix selectors** seamlessly.

---

### ***Gameplay Profiles***

Tactical Strike Mode: **Engage weapons back at the geometric ships by tapping the `Spacebar` to clear your lane.**
Overdrive Evasion Mode: **Weapons disabled! However, engine performance receives a **+3 Speed Boost** alongside continuous high-maneuverability structural hull benefits when surging forward.**
Threat Matrix Options: **Choose between **Easy**, **Normal**, and **Hard** options to increase entity spawning, damage thresholds, and laser acceleration parameters.**

---

### ***Technical Architecture Breakdown***

Traditional canvas game loops often rely on a single, monolithic file crammed with loose arrays and procedural logic. As entities grow, this approach introduces fragile global state mutations, tight system coupling, and extreme performance degradation. 

This project completely abandons procedural updates in favor of **Decoupled Object Lifecycle Vectors** managed through a strict state machine routing engine (`sketch.js`). 

### ***Component Architecture & State Isolation***
Each game element exists as an independent entity capsule (`classes/`) responsible for its own state computations, rendering parameters, and bounding-box collision detection:

* **State vs. Render Separation:** The central loop orchestrates *when* steps happen, but *how* they happen is delegated directly to the active object instance.
* **Dynamic Matrix Slicing:** Instead of holding redundant copies of images in memory, a centralized spritesheet parser crops a 45-frame asset grid (5 columns, 9 rows) into a localized texture buffer. Individual object instances simply reference a moving index pointer to animate fluidly.


```javascript
// From classes/Projectile.js - Isolated Lifecycle Execution
update() {
  this.x += this.speedX;
  this.y += this.speedY;
  
  // Linear 2D matrix calculation mapped into a 1D index loop
  if (this.isEnemy && frameCount % this.animationSpeed === 0 && projectileFrames.length > 0) {
    this.currentFrame = (this.currentFrame + 1) % projectileFrames.length;
  }
}

//To solve the issue of asset orientation changing across different spritesheets, the architecture abstracts drawing coordinates using canvas transform matrices:

display() {
  push();            // Isolate the global drawing state context
  translate(this.x, this.y); // Translate the canvas origin directly to the object center
  rotate(HALF_PI);   // Standardize orientation uniformly by 90 degrees
  imageMode(CENTER);
  image(projectileFrames[this.currentFrame], 0, 0, this.w, this.h);
  pop();             // Restore original canvas configuration safely
}

By resetting canvas transformations using push() and pop(), individual object transformations are entirely self-contained. This prevents visual artifacts or unintended layout shifts elsewhere in the game.

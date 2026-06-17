Space Arcade Odyssey — Adaptive Viewport Edition

An advanced, retro-inspired infinite space action arcade experience built using **p5.js** and clean object-oriented architecture. Battle hostile alien shapes, balance difficulty configurations dynamically, and select distinct player operational weapon profiles.

---

Game Feature Highlights

True Adaptive Resolution:** Built with flexible web coordinates. The application seamlessly re-renders and auto-scales calculations instantly to fit desktop browser spaces, mobile screens, or tablet tabs window-for-window.
Modular OOP Class Blueprints:** Fully decoupled ES6 structure. Every game entity behaves as an isolated self-contained class capsule module (`Player`, `Spaceship`, `Projectile`, `PowerUp`, `Button`) loaded sequentially through an organized HTML pipeline.
Unified Dual Input Operations:** High UX support rules. Toggles menu parameters using responsive grid mouse pointers or complete console-style **2D Keyboard Arrow Matrix selectors** seamlessly.

---

Gameplay Profiles

Tactical Strike Mode:** Engage weapons back at the geometric ships by tapping the `Spacebar` to clear your lane.
Overdrive Evasion Mode:** Weapons disabled! However, engine performance receives a **+$3 Speed Boost** alongside continuous high-maneuverability structural hull benefits when surging forward.
Threat Matrix Options:** Choose between **Easy**, **Normal**, and **Hard** options to increase entity spawning, damage thresholds, and laser acceleration parameters.

---

Technical Architecture Breakdown

The project abandons traditional hardcoded canvas procedural updates in favor of independent object lifecycle vectors:

```javascript
// Classes are fully component-driven and clean of rendering noise
class Projectile {
  constructor(x, y, speedX, isEnemy) {
    this.x = x;
    this.speedX = speedX;
    this.isEnemy = isEnemy;
  }

  update() {
    this.x += this.speedX;
  }
}
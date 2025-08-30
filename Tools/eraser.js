// class EraserTool {
//   constructor(p, helpers, undoManager, thiccnessSlider) {
//     this.p = p;
//     this.helpers = helpers;
//     this.undoManager = undoManager;
//     this.thiccnessSlider = thiccnessSlider;
//     this.icon = "assets/eraser.png";  // add an icon in your assets folder
//     this.name = "eraser";

//     this.prevX = -1;
//     this.prevY = -1;
//   }

// draw() {
//   if (!this.helpers.mouseOnCanvas()) return;

//   if (this.p.mouseIsPressed) {
//     if (this.prevX === -1) {
//       this.prevX = this.p.mouseX;
//       this.prevY = this.p.mouseY;
//     } else {
//       const w = this.thiccnessSlider.getValue();
      
//       // if erase() exists, use it; otherwise, use destination-out
//       if (typeof this.p.erase === "function" && typeof this.p.noErase === "function") {
//         this.p.erase();
//         this.p.strokeWeight(w);
//         this.p.stroke(255);
//         this.p.line(this.prevX, this.prevY, this.p.mouseX, this.p.mouseY);
//         this.p.noErase();
//       } else {
//         const ctx = this.p.drawingContext;
//         const prevOp = ctx.globalCompositeOperation;
//         ctx.globalCompositeOperation = "destination-out"; // true erasing
//         this.p.strokeWeight(w);
//         this.p.stroke(0, 0, 0, 255); // color ignored in this mode
//         this.p.strokeCap(this.p.ROUND);
//         this.p.strokeJoin(this.p.ROUND);
//         this.p.line(this.prevX, this.prevY, this.p.mouseX, this.p.mouseY);
//         ctx.globalCompositeOperation = prevOp;
//       }

//       this.prevX = this.p.mouseX;
//       this.prevY = this.p.mouseY;
//     }
//   } else {
//     this.prevX = -1;
//     this.prevY = -1;
//   }
// }

// }

class EraserTool {
  constructor(p, helpers, undoManager, thiccnessSlider, overlay) {
    this.p = p;
    this.helpers = helpers;
    this.undoManager = undoManager;
    this.thiccnessSlider = thiccnessSlider;
    this.overlay = overlay;
    this.icon = "assets/eraser.png";
    this.name = "eraser";
    this.prevX = -1;
    this.prevY = -1;
  }

  draw() {
    // preview ring
    if (this.overlay && this.helpers.mouseOnCanvas()) {
      const w = this.thiccnessSlider.getValue();
      this.overlay.push();
      this.overlay.noFill();
      this.overlay.stroke(0);
      this.overlay.strokeWeight(1);
      this.overlay.circle(this.p.mouseX, this.p.mouseY, w);
      this.overlay.pop();
    }

    if (!this.helpers.mouseOnCanvas()) return;

    if (this.p.mouseIsPressed) {
      // ---- take a snapshot ONCE, at the start of the erase stroke ----
      if (this.prevX === -1) {
        if (this.undoManager) this.undoManager.saveState();  // <-- key line
        this.prevX = this.p.mouseX;
        this.prevY = this.p.mouseY;
      } else {
        const w = this.thiccnessSlider.getValue();
        if (typeof this.p.erase === "function" && typeof this.p.noErase === "function") {
          this.p.erase();
          this.p.strokeWeight(w);
          this.p.stroke(255);
          this.p.strokeCap(this.p.ROUND);
          this.p.strokeJoin(this.p.ROUND);
          this.p.line(this.prevX, this.prevY, this.p.mouseX, this.p.mouseY);
          this.p.noErase();
        } else {
          const ctx = this.p.drawingContext;
          const prevOp = ctx.globalCompositeOperation;
          ctx.globalCompositeOperation = "destination-out";
          this.p.strokeWeight(w);
          this.p.stroke(0, 0, 0, 255);
          this.p.strokeCap(this.p.ROUND);
          this.p.strokeJoin(this.p.ROUND);
          this.p.line(this.prevX, this.prevY, this.p.mouseX, this.p.mouseY);
          ctx.globalCompositeOperation = prevOp;
        }
        this.prevX = this.p.mouseX;
        this.prevY = this.p.mouseY;
      }
    } else {
      this.prevX = -1;
      this.prevY = -1;
    }
  }

  // No post-stroke snapshot needed anymore
  mouseReleased() {
    // intentionally empty (or keep the on-canvas guard if you like)
  }
}

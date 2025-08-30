/**
 * Click and drag after selecting shapes to adjust shape and orientation
 */
class FixedShapes {
  constructor(p, helpers, undoManager) {
    this.p = p;
    this.helpers = helpers;
    this.undoManager = undoManager;
    this.icon = "";
    this.name = "fixedShape";
    this.colour = "black";
    this.isDropdown = true;
    this.startMouseX = -1;
    this.startMouseY = -1;
    this.drawing = false;
  }

  setShape(shapeName) {
    this.currentShape = shapeName;
  }
  draw() {
    if (!this.helpers.mouseOnCanvas()) {
      return;
    }
    // let colour;
    if (this.p.mouseIsPressed) {
      if (this.startMouseX == -1) {
        this.startMouseX = this.p.mouseX;
        this.startMouseY = this.p.mouseY;
        this.pos = this.p.createVector(this.p.mouseX, this.p.mouseY);
        this.drawing = true;
        this.p.loadPixels();
      } else {
        this.p.updatePixels();
        this.outerRad = this.p.dist(this.p.mouseX, this.p.mouseY, this.pos.x, this.pos.y);
        this.innerRad = this.outerRad / 2;
        let xDragDist = this.p.mouseX - this.pos.x;
        let yDragDist = this.p.mouseY - this.pos.y;
        let angle = this.p.atan2(yDragDist, xDragDist);
        let distFromClick = this.p.dist(this.pos.x, this.pos.y, this.p.mouseX, this.p.mouseY);
        if (this.currentShape === "Star") {
          this.drawStar(
            this.pos.x,
            this.pos.y,
            this.innerRad,
            this.outerRad,
            angle
          );
        } else if (this.currentShape === "Circle") {
          this.drawCircle(this.pos.x, this.pos.y, distFromClick);
        } else if (this.currentShape === "Triangle") {
          this.drawTriangle(this.pos.x, this.pos.y, distFromClick, angle);
        } else if (this.currentShape === "Square") {
          this.drawSquare(this.pos.x, this.pos.y, distFromClick, angle);
        }
      }
    } else if (this.drawing) {
      this.drawing = false;
      this.startMouseX = -1;
      this.startMouseY = -1;
    }
  }

  drawStar(x, y, innerRad, outerRad, rotation = 0) {
    let angle = this.p.TWO_PI / 5;
    let halfAngle = angle / 2;
    this.p.push();
    this.p.translate(x, y);
    this.p.rotate(rotation);
    this.p.noStroke();
    this.p.beginShape();
    this.p.drawingContext.shadowBlur = 20;
    this.p.drawingContext.shadowColor = "rgba(0, 0, 255)";
    for (let a = 0; a < this.p.TWO_PI; a += angle) {
      let outerPoint = a - this.p.HALF_PI;
      let innerPoint = a + halfAngle - this.p.HALF_PI;
      let cx = this.p.cos(outerPoint) * outerRad;
      let cy = this.p.sin(outerPoint) * outerRad;
      this.p.vertex(cx, cy);
      cx = this.p.cos(innerPoint) * innerRad;
      cy = this.p.sin(innerPoint) * innerRad;
      this.p.vertex(cx, cy);
    }
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
    this.p.drawingContext.shadowBlur = 0;
    this.p.drawingContext.shadowColor = "rgba(0, 0, 0, 0)";
  }

  drawCircle(x, y, rad) {
    this.p.push();
    this.p.noStroke();
    this.p.ellipse(x, y, rad * 2);
    this.p.pop();
  }

  drawTriangle(x, y, rad, rotation = 0) {
    this.p.push();
    this.p.translate(x, y);
    this.p.rotate(rotation);
    this.p.noStroke();
    this.p.beginShape();
    for (let i = 0; i < 3; i++) {
      let angle = (this.p.TWO_PI * i) / 3 - this.p.HALF_PI;
      let vx = this.p.cos(angle) * rad;
      let vy = this.p.sin(angle) * rad;
      this.p.vertex(vx, vy);
    }
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }

  drawSquare(x, y, rad, rotation = 0) {
    this.p.push();
    this.p.translate(x, y);
    this.p.rotate(rotation);
    this.p.rectMode(this.p.CENTER);
    this.p.noStroke();
    this.p.rect(0, 0, rad * 2, rad * 2);
    this.p.pop();
  }

  mouseReleased() {
    if (!this.helpers.mouseOnCanvas()) return; // Ensure we're on canvas

    if (typeof this.undoManager !== "undefined") {
      console.log("🕒 Marking snapshot for next frame");
      this.undoManager.markForSnapshot();
    }
  }
}

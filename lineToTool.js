class LineToTool {
  constructor(p, helpers, undoManager, thiccnessSlider) {
    this.thiccnessSlider = thiccnessSlider;
    this.p = p;
    this.helpers = helpers;
    this.undoManager = undoManager;
    this.icon = "assets/lineTo.jpg";
    this.name = "LineTo";
    this.startMouseX = -1;
    this.startMouseY = -1;
    this.drawing = false;
  }

  draw() {
    if (!this.helpers.mouseOnCanvas()) {
      return;
    }

    if (this.p.mouseIsPressed) {
      this.p.strokeWeight(this.thiccnessSlider.strokeWeight)
      if (this.startMouseX == -1) {
        this.startMouseX = this.p.mouseX;
        this.startMouseY = this.p.mouseY;
        this.drawing = true;
        this.p.loadPixels();
      } else {
        this.p.updatePixels();
        this.p.line(this.startMouseX, this.startMouseY, this.p.mouseX, this.p.mouseY);
      }
    } else if (this.drawing) {
      this.drawing = false;
      this.startMouseX = -1;
      this.startMouseY = -1;
    }
  }
  mouseReleased() {
    if (!this.helpers.mouseOnCanvas()) return; // Ensure we're on canvas

    if (typeof this.undoManager !== "undefined") {
      console.log("🕒 Marking snapshot for next frame");
      this.undoManager.markForSnapshot();
    }
  }
}

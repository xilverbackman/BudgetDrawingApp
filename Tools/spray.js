class SprayCan {
  constructor(p, helpers, undoManager, thiccnessSlider) {
    this.thiccnessSlider = thiccnessSlider;
    this.p = p;
    this.helper = helpers;
    this.undoManager = undoManager;
    this.name = "sprayCanTool";
    this.icon = "assets/sprayCan.jpg";
    this.points = 13;
    this.spread = 10;
    
  }

  draw() {
    const mx = this.p.mouseX;
    const my = this.p.mouseY;
    if (mx < 0 || mx > this.p.width || my < 0 || my > this.p.height) {
      return;
    }
    if (this.p.mouseIsPressed) {
      //if the mouse is pressed paint on the canvas
      //spread describes how far to spread the paint from the mouse pointer
      //points holds how many pixels of paint for each mouse press.
      this.p.strokeWeight(this.thiccnessSlider.strokeWeight)
      for (let i = 0; i < this.points; i++) {
        this.p.point(
          this.p.random(mx - this.spread, mx + this.spread),
          this.p.random(my - this.spread, my + this.spread)
        );
      }
    }
  }

  mouseReleased() {
    if (
      this.p.mouseX < 0 ||
      this.p.mouseX > this.p.width ||
      this.p.mouseY < 0 ||
      this.p.mouseY > this.p.height
    ) {
      return;
    } // Ensure we're on canvas

    if (typeof this.undoManager !== "undefined") {
      console.log("Marking snapshot for next frame");
      this.undoManager.markForSnapshot();
    }
  }
}

class FreehandTool {
  constructor(p, helpers, colourPalette, undoManager, thiccnessSlider) {
    this.thiccnessSlider = thiccnessSlider;
    this.p = p;
    this.helpers = helpers;
    this.colourPalette = colourPalette;
    this.undoManager = undoManager;
    //set an icon and a name for the object
    this.icon = "assets/freehand.jpg";
    this.name = "freehand";

    //to smoothly draw we'll draw a line from the previous mouse location
    //to the current mouse location. The following values store
    //the locations from the last frame. They are -1 to start with because
    //we haven't started drawing yet.
    this.qpreviousMouseX = -1;
    this.qpreviousMouseY = -1;
    this.slider = null;
    this.unselectTool = function () {
      console.log("Freehand tool Unselected");
      const existingSlider = this.p.select(`#${this.name}Slider`);
      // if (existingSlider) existingSlider.remove();
    };
  }

  // setupUI() {
  //   // Find the icon that was inserted by toolbox.js
  //   const sidebarIcon = this.p.select("#freehandsideBarItem"); // matches the id used in toolbox
  //   if (!sidebarIcon) {
  //     console.warn("Freehand tool icon not found");
  //     return;
  //   }

  // }

  draw() {
    // this.p.stroke(this.colourPalette.getCurrentColour());
    // this.p.strokeWeight(this.strokeWeight);
    // this.p.noFill();

    if (
      document.activeElement.tagName === "INPUT" ||
      document.activeElement.tagName === "SELECT" ||
      document.activeElement.tagName === "TEXTAREA"
    ) {
      return;
    }
    const activeTag = document.activeElement.tagName;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(activeTag)) return;
    if (!this.helpers.mouseOnCanvas()) {
      return;
    }

    //if the mouse is pressed
    if (this.p.mouseIsPressed) {
      //check if they previousX and Y are -1. set them to the current
      //mouse X and Y if they are.
      if (this.qpreviousMouseX == -1) {
        this.qpreviousMouseX = this.p.mouseX;
        this.qpreviousMouseY = this.p.mouseY;
      }
      //if we already have values for previousX and Y we can draw a line from
      //there to the current mouse location
      else {
        this.p.strokeWeight(this.thiccnessSlider.getValue());
        this.p.line(
          this.qpreviousMouseX,
          this.qpreviousMouseY,
          this.p.mouseX,
          this.p.mouseY
        );

        this.qpreviousMouseX = this.p.mouseX;
        this.qpreviousMouseY = this.p.mouseY;
      }
    }
    //if the user has released the mouse we want to set the previousMouse values
    //back to -1.
    //try and comment out these lines and see what happens!
    else {
      this.qpreviousMouseX = -1;
      this.qpreviousMouseY = -1;
    }
  }
  mouseReleased() {
    if (!this.helpers.mouseOnCanvas()) return; // Ensure we're on canvas

    if (typeof this.undoManager !== "undefined") {
      console.log("🕒 Marking snapshot for next frame");
      this.undoManager.markForSnapshot();
    } else {
      console.log("No undo manager");
    }
  }

  //This method will be called by this.selectTool() in toolbox.js
  //when this tool is selected
  //It is useful to setup the GUI control for this tool
  populateOptions() {
    console.log("Freehand tool selected");
    if (toolbox.selectedTool.name === this.name) {
      // this.setupUI();
    }
  }

  //This method will be called by this.selectTool() in toolbox.js
  //when this tool is unselected
  //It is useful to remove the GUI control for this tool
}

class mirrorDrawTool {
  constructor(p, helpers, toolbox, overlay, undoManager, thiccnessSlider) {
    this.thiccnessSlider = thiccnessSlider;
    this.undoManager = undoManager;
    this.p = p;
    this.helpers = helpers;
    this.name = "mirrorDraw";
    this.icon = "assets/mirrorDraw.jpg";

    //which axis is being mirrored (x or y) x is default
    this.axis = "x";
    //line of symmetry is halfway across the screen
    this.lineOfSymmetry = this.p.width / 2;

    //this changes in the p5.dom click handler. So storing it as
    //a variable self now means we can still access this in the handler
    var self = this;

    //where was the mouse on the last time draw was called.
    //set it to -1 to begin with
    var previousMouseX = -1;
    var previousMouseY = -1;

    //mouse coordinates for the other side of the Line of symmetry.
    var previousOppositeMouseX = -1;
    var previousOppositeMouseY = -1;

    this.draw = function () {
      const mx = this.p.mouseX;
      const my = this.p.mouseY;
      if (mx < 0 || mx > this.p.width || my < 0 || my > this.p.height) {
        return;
      }

      //display the last save state of pixels
      this.p.updatePixels();

      //do the drawing if the mouse is pressed
      if (this.p.mouseIsPressed) {
        this.p.strokeWeight(this.thiccnessSlider.strokeWeight);
        //if the previous values are -1 set them to the current mouse location
        //and mirrored positions
        if (previousMouseX == -1) {
          previousMouseX = this.p.mouseX;
          previousMouseY = this.p.mouseY;
          previousOppositeMouseX = this.calculateOpposite(this.p.mouseX, "x");
          previousOppositeMouseY = this.calculateOpposite(this.p.mouseY, "y");
        }

        //if there are values in the previous locations
        //draw a line between them and the current positions
        else {
          this.p.line(
            previousMouseX,
            previousMouseY,
            this.p.mouseX,
            this.p.mouseY
          );
          previousMouseX = this.p.mouseX;
          previousMouseY = this.p.mouseY;

          //these are for the mirrored drawing the other side of the
          //line of symmetry
          var oX = this.calculateOpposite(this.p.mouseX, "x");
          var oY = this.calculateOpposite(this.p.mouseY, "y");
          this.p.line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
          previousOppositeMouseX = oX;
          previousOppositeMouseY = oY;
        }
      }

      //if the mouse isn't pressed reset the previous values to -1
      else {
        previousMouseX = -1;
        previousMouseY = -1;

        previousOppositeMouseX = -1;
        previousOppositeMouseY = -1;
      }

      //after the drawing is done save the pixel state. We don't want the
      //line of symmetry to be part of our drawing
      this.p.loadPixels();

      //push the drawing state so that we can set the stroke weight and colour
      // push();
      // strokeWeight(3);
      // stroke("red");
      // //draw the line of symmetry
      // if (this.axis == "x") {
      // 	line(width / 2, 0, width / 2, height);
      // } else {
      // 	line(0, height / 2, width, height / 2);
      // }
      // //return to the original stroke
      // pop();
      if (toolbox.selectedTool.name === "mirrorDraw") {
        overlay.clear(); // Clear previous overlay
        overlay.push();
        overlay.strokeWeight(3);
        overlay.stroke("red");

        if (this.axis == "x") {
          overlay.line(this.p.width / 2, 0, this.p.width / 2, this.p.height);
        } else {
          overlay.line(0, this.p.height / 2, this.p.width, this.p.height / 2);
        }

        overlay.pop();
      }
    };

    /**calculate an opposite coordinate the other side of the
     *symmetry line.
     *@param n number: location for either x or y coordinate
     *@param a [x,y]: the axis of the coordinate (y or y)
     *@return number: the opposite coordinate
     */
    this.calculateOpposite = function (n, a) {
      //if the axis isn't the one being mirrored return the same
      //value
      if (a != this.axis) {
        return n;
      }

      //if n is less than the line of symmetry return a coorindate
      //that is far greater than the line of symmetry by the distance from
      //n to that line.
      if (n < this.lineOfSymmetry) {
        return this.lineOfSymmetry + (this.lineOfSymmetry - n);
      }

      //otherwise a coordinate that is smaller than the line of symmetry
      //by the distance between it and n.
      else {
        return this.lineOfSymmetry - (n - this.lineOfSymmetry);
      }
    };

    //when the tool is deselected update the pixels to just show the drawing and
    //hide the line of symmetry. Also clear options
    this.unselectTool = function () {
      p.updatePixels();
      //clear options
      overlay.clear();
      p.select(".options").html("");
    };

    //adds a button and click handler to the options area. When clicked
    //toggle the line of symmetry between horizonatl to vertical
    this.populateOptions = function () {
      p.select(".options").html(
        "<button id='directionButton'>Make Horizontal</button>"
      );
      // 	//click handler
      p.select("#directionButton").mouseClicked(function () {
        var button = select("#" + this.elt.id);
        if (self.axis == "x") {
          self.axis = "y";
          self.lineOfSymmetry = height / 2;
          button.html("Make Vertical");
        } else {
          self.axis = "x";
          self.lineOfSymmetry = width / 2;
          button.html("Make Horizontal");
        }
      });
    };

    this.mouseReleased = function () {
      if (!helpers.mouseOnCanvas(helpers)) return; // Ensure we're on canvas

      if (typeof this.undoManager !== "undefined") {
        console.log("🕒 Marking snapshot for next frame");
        this.undoManager.markForSnapshot();
      }
    };
  }
}

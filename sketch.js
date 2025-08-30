//global variables that will store the toolbox colour palette
//amnd the helper functions
/**
 * @param {string} id - ID for canvas div
 * @returns {object} A canvas instance
 */
function drawingApp(id) {
  let parent = document.querySelector("#contentBox");
  let div = document.getElementById(`tab${id}`); // Check if it already exists
  if (!div) {
    div = document.createElement("div");
    div.className = "content";
    div.id = `tab${id}`;
    div.style.width = "100%";
    div.style.height = "100%";
    console.log(
      `Creating new tab ${div} with ID: ${div.id} and class: ${div.className}`
    );
    parent.appendChild(div);
  }
  return new p5((p) => {
    let toolboxIsAdded = false,
      toolbox = null,
      colourP = null,
      helpers = null,
      canvas = null,
      slider,
      overlay,
      freehandTool,
      undoManager,
      thiccnessSlider,
      tabButton,
      eraser;

    p.setup = function () {
      //create a canvas to fill the content div from index.html
      const canvasContainer = p.select(`#tab${id}`);
      canvas = p.createCanvas(
        canvasContainer.size().width,
        canvasContainer.size().height
      );
      // Create tab button
      tabButton = p.createButton(`${id}`);
      tabButton.id(`tab${id}`);
      tabButton.parent("tabsContainer");
      tabButton.mousePressed((event) => {
        console.log(`Clicked ID: ${event.target.id}`);
        displayTab(id);
      });

      console.log(`Width: ${canvas.width}, Height: ${canvas.height}`);
      // let canvas = p.createCanvas(800, 600); // or whatever size fits your layout

      canvas.parent(canvasContainer);
      p.background(255);

      // Create overlay for mirror tool to ensure red line don't persist
      overlay = p.createGraphics(p.width, p.height);

      //create helper functions and the colour palette
      if (!helpers) helpers = new HelperFunctions(p, canvas);
      if (!colourP) colourP = new ColourPalette(p, id);
      undoManager = new UndoManager(p);
      //create a toolbox for storing the tools
      if (!toolbox) {
        toolbox = new Toolbox(p, id);
      }
      if (!toolboxIsAdded) {
        thiccnessSlider = new ThiccnessSlider(p, id);

        toolbox.addTool(
          new FreehandTool(p, helpers, colourP, undoManager, thiccnessSlider)
        );
        thiccnessSlider.mount(id);

        toolbox.addTool(
          new LineToTool(p, helpers, undoManager, thiccnessSlider)
        );
        toolbox.addTool(new SprayCan(p, helpers, undoManager, thiccnessSlider));
        toolbox.addTool(
          new mirrorDrawTool(
            p,
            helpers,
            toolbox,
            overlay,
            undoManager,
            thiccnessSlider
          )
        );
        toolbox.addTool(new FixedShapes(p, helpers, undoManager));
        toolbox.addTool(
          new EraserTool(p, helpers, undoManager, thiccnessSlider)
        );
        toolboxIsAdded = true;
      }

      p.background(255);
      // Save the initial blank state
      undoManager.saveState();
      p.select("#undoButton").mouseClicked(() => {
        if (undoManager) {
          undoManager.undo();
        }
      });
      console.log(canvas.size()); // p5.js size (in canvas pixels)
      console.log(canvas.elt.getBoundingClientRect()); // true screen size + offset
    };

    // let firstFrameCaptured = false;
    p.draw = function () {
      if ("draw" in toolbox.selectedTool) {
        toolbox.selectedTool.draw();
      } else {
        alert("it doesn't look like your tool has a draw method!");
      }

      if (toolbox.selectedTool.name !== "mirrorDraw") {
        overlay.clear();
      } else {
        p.image(overlay, 0, 0); // Only show overlay when in mirrorDraw
      }

      if (undoManager?.needsSnapshot) {
        undoManager.saveState();
      }
    };

    p.mousePressed = function () {
      //call mousePressed from the selected tool if
      //the selected tool has a mousePressed() method
      if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
        toolbox.selectedTool.mousePressed();
      }
    };

    p.mouseReleased = function () {
      const tool = toolbox.selectedTool;

      if (tool && typeof tool.mouseReleased === "function") {
        tool.mouseReleased();
      }
    };
  }, `#${id}`);
}

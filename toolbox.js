//container object for storing the tools. Functions to add new tools and select a tool
class Toolbox {
  constructor(p, id) {
    this.p = p;
    this.tools = [];
    this.selectedTool = null;
    this.id = id;
    this.createToolBox();

    var toolbarItemClick = (name) => {
      //remove any existing borders
      // var items = this.p.selectAll(".sideBarItem");
      let items = this.p.selectAll(`#toolbox${this.id}`);
      console.log(items);
      for (var i = 0; i < items.length; i++) {
        items[i].style("border", "0");
      }

      // var toolName = this.id().split("sideBarItem")[0];
      // this.selectTool(toolName);
      // let toolName = name;
      this.selectTool(name);
      console.log(`Toolname ${name}`)
      console.log(this.id);

      //call loadPixels to make sure most recent changes are saved to pixel array
      this.p.loadPixels();
    };

    //add a new tool icon to the html page
    var addToolIcon = (icon, name) => {
      var sideBarItem = this.p.createDiv("<img src='" + icon + "'></div>");
      sideBarItem.class("sideBarItem");
      sideBarItem.id(name + "sideBarItem");
      sideBarItem.parent(`toolbox${this.id}`);
      // console.log(name)
      sideBarItem.mouseClicked(() => toolbarItemClick(name));
    };

    let addDropdownToolIcon = (tool) => {
      let dropdown = this.p.createDiv();
      dropdown.class("dropdown");
      dropdown.parent(`toolbox${this.id}`);

      let shapesButton = this.p.createButton("Shapes");
      shapesButton.class("link");
      shapesButton.id(tool.name + "sideBarItem");
      dropdown.child(shapesButton);

      let menu = this.p.createDiv();
      menu.class("dropdown-menu");
      dropdown.child(menu);

      let shapes = ["Star", "Circle", "Triangle", "Square"];
      shapes.forEach((shape) => {
        let item = this.p.createDiv(shape);
        item.class("dropdown-item");
        menu.child(item);
        item.mousePressed(() => {
          tool.setShape(shape);
          if (this.selectedTool !== tool) {
            this.selectTool(tool.name);
          }
        });
      });
    };
    //add a tool to the tools array
    this.addTool = function (tool) {
      //check that the object tool has an icon and a name
      if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
        alert("make sure your tool has both a name and an icon");
      }
      this.tools.push(tool);
      if (tool.isDropdown) {
        addDropdownToolIcon(tool);
      } else {
        addToolIcon(tool.icon, tool.name);
      }

      //if no tool is selected (ie. none have been added so far)
      //make this tool the selected one.
      if (this.selectedTool == null) {
        this.selectTool(tool.name);
      }
      // console.log(`Toolbox number: ${toolBoxCount}`)
    };

    this.selectTool = function (toolName) {
      //search through the tools for one that's name matches
      //toolName
      for (var i = 0; i < this.tools.length; i++) {
        if (this.tools[i].name == toolName) {
          //if the tool has an unselectTool method run it.
          if (
            this.selectedTool != null &&
            this.selectedTool.hasOwnProperty("unselectTool")
          ) {
            this.selectedTool.unselectTool();
          }
          //select the tool and highlight it on the toolbar
          this.selectedTool = this.tools[i];
          this.p
            .select("#" + toolName + "sideBarItem")
            .style("border", "2px solid blue");

          //if the tool has an options area. Populate it now.
          if (this.selectedTool.hasOwnProperty("populateOptions")) {
            this.selectedTool.populateOptions();
          }
        }
      }
      // console.log("Selected tool:", this.selectedTool.name);
      // console.log("Tool object:", this.selectedTool);
    };
  }
  createToolBox() {
    let toolBoxDiv = this.p.createDiv();
    toolBoxDiv.class("toolbox");
    toolBoxDiv.id(`toolbox${this.id}`);
    toolBoxDiv.parent("#sidebar");
    console.log(`Created toolbox with ID: toolbox${this.id}`);
  }
}

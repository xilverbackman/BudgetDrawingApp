//Displays and handles the colour palette.
class ColourPalette {
  constructor(p, id) {
    this.id = id;
    this.p = p;
    //a list of web colour strings
    this.colours = [
      "black",
      "silver",
      "gray",
      "white",
      "maroon",
      "red",
      "purple",
      "orange",
      "pink",
      "fuchsia",
      "green",
      "lime",
      "olive",
      "yellow",
      "navy",
      "blue",
      "teal",
      "aqua",
    ];
    //make the start colour be black
    this.selectedColour = "black";

    // this.colourClick = (event) => {
    //   //remove the old border
    //   let current = p.select("#" + this.selectedColour + "Swatch");
    //   current.style("border", "0");

    //   //get the new colour from the id of the clicked element
    //   let c = event.target.id.split("Swatch")[0];

    //   //set the selected colour and fill and stroke
    //   this.selectedColour = c;
    //   console.log(`Colour swatch clicked: ${c}`);

    //   this.p.fill(c);
    //   this.p.stroke(c);

    //   //add a new border to the selected colour
    //   this.p.select("#" + c + "Swatch").style("border", "2px solid blue");
    // };
    this.colourClick = (event) => {
      const clickedId = event.target.id;
      const c = clickedId.replace(`Swatch${this.id}`, "");

      // Remove old border from previous swatch
      const currentSwatch = this.p.select(
        `#${this.selectedColour}Swatch${this.id}`
      );
      if (currentSwatch) currentSwatch.style("border", "0");

      this.selectedColour = c;
      console.log(`Colour swatch clicked: ${c}`);

      this.p.fill(c);
      this.p.stroke(c);

      // Add new border to clicked swatch
      const clickedSwatch = this.p.select(`#${c}Swatch${this.id}`);
      if (clickedSwatch) clickedSwatch.style("border", "2px solid blue");
    };

    this.loadColours();
  }
  // var self = this;

  //load in the colours
  loadColours() {
    //set the fill and stroke properties to be black at the start of the programme
    //running
    this.p.fill(this.colours[0]);
    this.p.stroke(this.colours[0]);
    const colourBox = this.p.createDiv();
    colourBox.class("colourBox");
    colourBox.id(`colourBox${id}`);
    if (this.p.select(".colourPalette")) {
      colourBox.parent(this.p.select(".colourPalette"));
    } else {
      console.warn("⚠️ .colourPalette not found!");
    }

    //for each colour create a new div in the html for the colourSwatches
    for (let i = 0; i < this.colours.length; i++) {
      // let colourID = this.colours[i] + "Swatch";

      // //using p5.dom add the swatch to the palette and set its background colour
      // //to be the colour value.
      // let colourSwatch = this.p.createDiv(`${this.colours[i]}`);
      // colourSwatch.class("colourSwatches");
      // colourSwatch.id(colourID);

      // this.p.select(`#colourBox${id}`).child(colourSwatch);
      // this.p.select("#" + colourID).style("background-color", this.colours[i]);
      let colourID = this.colours[i] + "Swatch" + this.id;

      let colourSwatch = this.p.createDiv(this.colours[i]);
      colourSwatch.class("colourSwatches");
      colourSwatch.id(colourID);

      this.p.select(`#colourBox${this.id}`).child(colourSwatch);

      // Correctly target the swatch inside the current colourBox
      const container = this.p.select(`#colourBox${this.id}`);
      const swatch = container.elt.querySelector(`#${colourID}`);
      swatch.style.backgroundColor = this.colours[i];

      colourSwatch.mouseClicked(this.colourClick);
      // console.log(colourID);
    }

    this.p.select(".colourSwatches").style("border", "2px solid blue");
  }
  //call the loadColours function now it is declared
  getCurrentColour() {
    return this.selectedColour;
  }
}

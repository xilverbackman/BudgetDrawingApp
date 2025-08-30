/**
 * Controls thickness of all tools except shapes
 * @param {object} p - P5 instance
 */
class ThiccnessSlider {
  constructor(p) {
    this.p = p;
    this.strokeWeight = 1;
    this.slider = null;
  }

  mount(toolboxId) {
    const parent = this.p.select(`#toolbox${toolboxId}`);
    if (!parent) {
      console.warn(`ThiccnessSlider: parent '${parent}' not found`);
      return;
    }

    this.slider = this.p.createSlider(1, 50, this.strokeWeight);
    this.slider.id("freehandSlider");
    this.slider.style("transform", "rotate(270deg)");
    this.slider.style("width", "100px");
    this.slider.style("margin-left", "10px");
    this.slider.parent(parent); // attach to wrapper

    this.slider.input(() => {
      this.strokeWeight = this.slider.value();
    });
  }

  getValue() {
    return this.slider ? this.slider.value() : this.strokeWeight;
  }
}

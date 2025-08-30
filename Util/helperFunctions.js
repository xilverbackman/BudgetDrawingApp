/**
 * @param {object} p - P5 instance
 * @param {object} canvas - Canvas instance created using createCanvas()
 * @param {object} undoManager - undoManager instance
 * @returns {object}
 */
class HelperFunctions {
  constructor(p, canvas, undoManager) {
    this.p = p;
    this.canvas = canvas;
    this.undoManager = undoManager;

    this.mouseOnCanvas = () => {
      // const bounds = this.canvas.elt.getBoundingClientRect();
      const mx = this.p.mouseX;
      const my = this.p.mouseY;
      const on =
        mx >= 0 && mx <= this.p.width && my >= 0 && my <= this.p.height;
      return on;
    };

    p.select("#clearButton").mouseClicked(() => {
      this.p.background(255);
      this.p.loadPixels();
      if (this.undoManager) this.undoManager.saveState();
    });

    p.select("#saveImageButton").mouseClicked(() => {
      this.p.saveCanvas("myPicture", "jpg");
    });

    const importBtn = p.select("#importImageButton");
    const fileInput = p.select("#importFile");

    if (importBtn && fileInput) {
      importBtn.mouseClicked(() => fileInput.elt.click());

      fileInput.elt.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        this.p.loadImage(url, (img) => {
          // scale to fit canvas while preserving aspect ratio
          const cw = this.p.width,
            ch = this.p.height;
          const scale = Math.min(cw / img.width, ch / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (cw - w) / 2;
          const y = (ch - h) / 2;

          // draw on main canvas, then refresh pixels so tools paint over it
          this.p.image(img, x, y, w, h);
          this.p.loadPixels();

          // optional: snapshot for undo right after import
          if (this.undoManager) this.undoManager.saveState();

          URL.revokeObjectURL(url);
          // reset input so the same file can be re-imported if desired
          e.target.value = "";
        });
      });
    }

    this.canvas.drop((file) => {
      if (file.type !== "image") return;
      this.p.loadImage(file.data, (img) => {
        const cw = this.p.width, ch = this.p.height;
        const scale = Math.min(cw / img.width, ch / img.height);
        const w = img.width * scale, h = img.height * scale;
        const x = (cw - w) / 2, y = (ch - h) / 2;
        this.p.image(img, x, y, w, h);
        this.p.loadPixels();
        if (this.undoManager) this.undoManager.saveState();
      });
    });
  }
}

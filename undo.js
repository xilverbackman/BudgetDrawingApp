/**
 * Manages undo states by storing canvas snapshots.
 * @param {number} limit - Maximunm number of snapshots to retain in the undo stack
 */
class UndoManager {
  constructor(p, limit = 50) {
    this.p = p;
    this.stack = [];
    this.limit = limit;
  }

  markForSnapshot() {
    this.needsSnapshot = true;
  }

  saveState() {
    if (!this.p.canvas) return;
    const snapshot = this.p.get(); // Get full canvas snapshot
    this.stack.push(snapshot);

    // Limit stack size
    if (this.stack.length > this.limit) {
      this.stack.shift();
    }
    this.needsSnapshot = false;
    console.log(`State saved. Stack size: ${this.stack.length}`);
  }

  undo() {
    if (this.stack.length < 2) {
      console.log("No more states to undo.");
      return;
    }

    // Remove the most recent state
    this.stack.pop();

    // Restore previous state
    const previous = this.stack[this.stack.length - 1];
    this.p.clear();
    this.p.image(previous, 0, 0);
    this.p.loadPixels(); // Refresh pixel buffer
    console.log("Undo executed.");
  }
}

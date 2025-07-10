import * as fabric from "fabric";
import { Command } from "../models";

export class TransformObjectCommand implements Command {
  constructor(
    private object: fabric.Object,
    private before: Partial<fabric.Object>,
    private after: Partial<fabric.Object>
  ) {}

  execute() {
    this.applyProps(this.after);
  }

  undo() {
    this.applyProps(this.before);
  }

  private applyProps(props: Partial<fabric.Object>) {
    Object.entries(props).forEach(([key, value]) => {
      (this.object as any)[key] = value;
    });

    if (
      "fontSize" in props &&
      typeof (this.object as any).initDimensions === "function"
    ) {
      (this.object as any).initDimensions();
    }

    this.object.setCoords();

    if (this.object.canvas) {
      this.object.canvas.setActiveObject(this.object);
      this.object.canvas.renderAll();
    }
  }
}

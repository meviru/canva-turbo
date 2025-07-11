import { Command } from "@/shared/models";
import { Canvas, Object as FabricObject } from "fabric";

export class DeleteObjectCommand implements Command {
  private canvas: Canvas;
  private object: FabricObject;
  private objectIndex: number;

  constructor(canvas: Canvas, object: FabricObject) {
    this.canvas = canvas;
    this.object = object;
    this.objectIndex = canvas.getObjects().indexOf(object);
  }

  execute(): void {
    // Store the object's position in the canvas for proper restoration
    this.objectIndex = this.canvas.getObjects().indexOf(this.object);

    // Remove the object from canvas
    this.canvas.remove(this.object);
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  undo(): void {
    // Add the object back to canvas at its original position
    if (
      this.objectIndex >= 0 &&
      this.objectIndex < this.canvas.getObjects().length
    ) {
      this.canvas.insertAt(this.object as any, this.objectIndex as any);
    } else {
      // If index is out of bounds, add to the end
      this.canvas.add(this.object);
    }

    // Restore selection
    this.canvas.setActiveObject(this.object);
    this.canvas.renderAll();
  }
}

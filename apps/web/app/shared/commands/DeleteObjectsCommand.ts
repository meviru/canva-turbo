import { Command } from "@/shared/models";
import { Canvas, Object as FabricObject, ActiveSelection } from "fabric";

export class DeleteObjectsCommand implements Command {
  private canvas: Canvas;
  private objects: FabricObject[];
  private objectIndices: number[];

  constructor(canvas: Canvas, objects: FabricObject[]) {
    this.canvas = canvas;
    this.objects = objects;
    this.objectIndices = objects.map(obj => canvas.getObjects().indexOf(obj));
  }

  execute(): void {
    // Update indices each time we execute (important for redo)
    this.objectIndices = this.objects.map(obj => this.canvas.getObjects().indexOf(obj));
    
    this.objects.forEach(obj => {
      this.canvas.remove(obj);
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  undo(): void {
    this.objects.forEach((obj, i) => {
      const idx = this.objectIndices[i];
      if (idx !== undefined && idx >= 0 && idx <= this.canvas.getObjects().length) {
        this.canvas.insertAt(obj as any, idx as any);
      } else {
        this.canvas.add(obj);
      }
    });
    
    // Restore selection with proper timing
    requestAnimationFrame(() => {
      this.restoreSelection();
      this.canvas.renderAll();
    });
  }

  private restoreSelection(): void {
    // Clear any existing selection first
    this.canvas.discardActiveObject();
    
    if (this.objects.length > 1) {
      const selection = new ActiveSelection(this.objects, { canvas: this.canvas });
      this.canvas.setActiveObject(selection);
    } else if (this.objects.length === 1 && this.objects[0]) {
      this.canvas.setActiveObject(this.objects[0]);
    }
  }
}

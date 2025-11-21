import { Command } from "@/shared/models";
import { Canvas, Object as FabricObject, ActiveSelection } from "fabric";

export class TransformObjectsCommand implements Command {
  private beforeStates: Partial<FabricObject>[];
  private afterStates: Partial<FabricObject>[];
  private objects: FabricObject[];
  private canvas: Canvas;

  constructor(canvas: Canvas, objects: FabricObject[], beforeStates: Partial<FabricObject>[], afterStates: Partial<FabricObject>[]) {
    this.canvas = canvas;
    this.objects = objects;
    this.beforeStates = beforeStates;
    this.afterStates = afterStates;
  }

  execute() {
    // Ensure all objects are on the canvas before transformation
    this.objects.forEach(obj => {
      if (!this.canvas.getObjects().includes(obj)) {
        this.canvas.add(obj);
      }
    });
    
    // Apply transformations
    this.objects.forEach((obj, i) => {
      const afterState = this.afterStates[i];
      if (afterState) {
        Object.entries(afterState).forEach(([key, value]) => {
          (obj as any)[key] = value;
        });
        obj.setCoords();
      }
    });
    
    // Restore selection with a slight delay to ensure proper state
    requestAnimationFrame(() => {
      this.restoreSelection();
      this.canvas.renderAll();
    });
  }

  undo() {
    // Ensure all objects are on the canvas before transformation
    this.objects.forEach(obj => {
      if (!this.canvas.getObjects().includes(obj)) {
        this.canvas.add(obj);
      }
    });
    
    // Apply reverse transformations
    this.objects.forEach((obj, i) => {
      const beforeState = this.beforeStates[i];
      if (beforeState) {
        Object.entries(beforeState).forEach(([key, value]) => {
          (obj as any)[key] = value;
        });
        obj.setCoords();
      }
    });
    
    // Restore selection with a slight delay to ensure proper state
    requestAnimationFrame(() => {
      this.restoreSelection();
      this.canvas.renderAll();
    });
  }

  private restoreSelection() {
    // Clear any existing selection first
    this.canvas.discardActiveObject();
    
    // Filter out any objects that might no longer exist on canvas
    const validObjects = this.objects.filter(obj => 
      this.canvas.getObjects().includes(obj)
    );
    
    if (validObjects.length > 1) {
      const selection = new ActiveSelection(validObjects, { canvas: this.canvas });
      this.canvas.setActiveObject(selection);
    } else if (validObjects.length === 1 && validObjects[0]) {
      this.canvas.setActiveObject(validObjects[0]);
    }
  }
}

import * as fabric from "fabric";
import { Canvas } from "fabric";
import type { Command } from "../models";
import { createObjectWithGlobalHandles } from "../lib/customControlRenderers";

export class AddImageCommand implements Command {
  private imageObj: fabric.Image | null = null;

  constructor(
    private canvas: Canvas,
    private imageUrl: string
  ) {}

  async execute() {
    try {
      const img = await fabric.Image.fromURL(this.imageUrl, {
        crossOrigin: "anonymous",
      });

      img.set({
        left: this.canvas.getWidth() / 2,
        top: this.canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        scaleX: 0.5,
        scaleY: 0.5,
      });

      createObjectWithGlobalHandles(img);
      this.canvas.add(img);
      this.canvas.setActiveObject(img);
      this.canvas.renderAll();

      this.imageObj = img;
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  }

  undo() {
    if (this.imageObj) {
      this.canvas.remove(this.imageObj);
      this.canvas.renderAll();
    }
  }
}

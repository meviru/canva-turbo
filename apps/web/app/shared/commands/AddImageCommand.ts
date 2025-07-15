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

      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      const maxWidth = canvasWidth * 0.7;
      const maxHeight = canvasHeight * 0.7;

      const scaleX = maxWidth / img.width!;
      const scaleY = maxHeight / img.height!;
      const scale = Math.min(scaleX, scaleY, 1);

      img.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
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

import { Canvas, IText } from "fabric";

export interface Command {
  execute(): void;
  undo(): void;
}

export class AddTextCommand implements Command {
  private textObj: IText;

  constructor(
    private canvas: Canvas,
    private text: string,
    private fontSize: number,
    private bold: boolean
  ) {
    this.textObj = new IText(this.text, {
      fontFamily: "Poppins",
      fontSize: this.fontSize,
      fontWeight: this.bold ? "bold" : "normal",
      left: this.canvas.getWidth() / 2,
      top: this.canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
    });
  }

  execute() {
    this.canvas.add(this.textObj);
    this.canvas.setActiveObject(this.textObj);
    this.canvas.renderAll();
  }

  undo() {
    this.canvas.remove(this.textObj);
    this.canvas.renderAll();
  }
}

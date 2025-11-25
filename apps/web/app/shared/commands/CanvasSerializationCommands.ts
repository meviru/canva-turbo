import { Canvas } from "fabric";
import { Command } from "../models";

/**
 * Command to save canvas state to JSON
 */
export class SaveCanvasCommand implements Command {
  private savedData: string | null = null;
  
  constructor(
    private canvas: Canvas,
    private onSave?: (data: string) => Promise<void>
  ) {}

  async execute(): Promise<void> {
    try {
      // Serialize canvas to JSON
      this.savedData = JSON.stringify(this.canvas.toJSON());
      
      // If callback provided, save to external storage (e.g., backend)
      if (this.onSave && this.savedData) {
        await this.onSave(this.savedData);
      }
    } catch (error) {
      console.error("Failed to save canvas:", error);
      throw error;
    }
  }

  async undo(): Promise<void> {
    // Save command is generally not undoable
    // This could be implemented to restore previous save state if needed
  }

  getSavedData(): string | null {
    return this.savedData;
  }
}

/**
 * Command to load canvas state from JSON
 */
export class LoadCanvasCommand implements Command {
  private previousState: string | null = null;
  
  constructor(
    private canvas: Canvas,
    private jsonData: string,
    private onLoad?: () => Promise<void>
  ) {}

  async execute(): Promise<void> {
    try {
      // Save current state for undo
      this.previousState = JSON.stringify(this.canvas.toJSON());
      
      // Clear current canvas
      this.canvas.clear();
      
      // Load new data
      const data = JSON.parse(this.jsonData);
      await this.canvas.loadFromJSON(data);
      
      // Re-render canvas
      this.canvas.renderAll();
      
      // Execute callback if provided
      if (this.onLoad) {
        await this.onLoad();
      }
    } catch (error) {
      console.error("Failed to load canvas:", error);
      throw error;
    }
  }

  async undo(): Promise<void> {
    if (!this.previousState) return;
    
    try {
      // Restore previous state
      this.canvas.clear();
      const data = JSON.parse(this.previousState);
      await this.canvas.loadFromJSON(data);
      this.canvas.renderAll();
    } catch (error) {
      console.error("Failed to undo canvas load:", error);
      throw error;
    }
  }
}

/**
 * Command to export canvas as image
 */
export class ExportCanvasCommand implements Command {
  private exportedData: string | null = null;
  
  constructor(
    private canvas: Canvas,
    private options: {
      format?: 'png' | 'jpeg' | 'svg';
      quality?: number;
      multiplier?: number;
    } = {}
  ) {}

  async execute(): Promise<void> {
    try {
      const { format = 'png', quality = 1, multiplier = 1 } = this.options;
      
      if (format === 'svg') {
        this.exportedData = this.canvas.toSVG();
      } else {
        this.exportedData = this.canvas.toDataURL({
          format,
          quality,
          multiplier,
        });
      }
    } catch (error) {
      console.error("Failed to export canvas:", error);
      throw error;
    }
  }

  async undo(): Promise<void> {
    // Export command is generally not undoable
  }

  getExportedData(): string | null {
    return this.exportedData;
  }
}

/**
 * Command to clear the entire canvas
 */
export class ClearCanvasCommand implements Command {
  private previousState: string | null = null;
  
  constructor(private canvas: Canvas) {}

  async execute(): Promise<void> {
    try {
      // Save current state for undo
      this.previousState = JSON.stringify(this.canvas.toJSON());
      
      // Clear the canvas
      this.canvas.clear();
      this.canvas.renderAll();
    } catch (error) {
      console.error("Failed to clear canvas:", error);
      throw error;
    }
  }

  async undo(): Promise<void> {
    if (!this.previousState) return;
    
    try {
      // Restore previous state
      const data = JSON.parse(this.previousState);
      await this.canvas.loadFromJSON(data);
      this.canvas.renderAll();
    } catch (error) {
      console.error("Failed to undo canvas clear:", error);
      throw error;
    }
  }
}
"use client";
import { Canvas, IText } from "fabric";
import { createContext, useContext, useRef, useState } from "react";

// === Command Pattern ===
interface Command {
    execute(): void;
    undo(): void;
}

// AddTextCommand
class AddTextCommand implements Command {
    private textObj: IText;

    constructor(private canvas: Canvas, private text: string, private fontSize: number, private bold: boolean) {
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


type CanvasContextType = {
    canvas: Canvas | null;
    setCanvas: (canvas: Canvas) => void;
    addText: (text: string, fontSize: number, bold: boolean) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
    const [canvas, setCanvasState] = useState<Canvas | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const undoStack = useRef<Command[]>([]);
    const redoStack = useRef<Command[]>([]);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const updateUndoRedoState = () => {
        setCanUndo(undoStack.current.length > 0);
        setCanRedo(redoStack.current.length > 0);
    };

    const setCanvas = (newCanvas: Canvas) => {
        if (canvasRef.current) {
            canvasRef.current.off();
        }

        canvasRef.current = newCanvas;
        setCanvasState(newCanvas);

        const events = [
            'object:added',
            'object:removed',
            'object:modified',
            'object:moved',
            'object:scaled',
            'object:rotated',
            'object:skewed',
            'path:created',
            'text:changed',
            'selection:cleared',
            'selection:created'
        ];

        events.forEach((event: any) => {
            newCanvas.on(event, () => {
                // Optional: you can track user changes here
            });
        });
    };

    const undo = () => {
        const command = undoStack.current.pop();
        if (command) {
            command.undo();
            redoStack.current.push(command);
            updateUndoRedoState();
        }
    };

    const redo = () => {
        const command = redoStack.current.pop();
        if (command) {
            command.execute();
            undoStack.current.push(command);
            updateUndoRedoState();
        }
    };

    const addText = (text: string, fontSize: number, bold: boolean) => {
        if (!canvasRef.current) return;
        const cmd = new AddTextCommand(canvasRef.current, text, fontSize, bold);
        cmd.execute();
        undoStack.current.push(cmd);
        redoStack.current = [];
        updateUndoRedoState();
    };

    return (
        <CanvasContext.Provider
            value={{
                canvas,
                setCanvas,
                addText,
                undo,
                redo,
                canUndo,
                canRedo
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (!context) throw new Error("useCanvas must be used within CanvasProvider");
    return context;
};

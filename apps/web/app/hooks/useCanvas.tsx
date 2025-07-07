// apps/web/app/context/canvas-context.tsx
"use client";
import { Canvas } from "fabric";
import { createContext, useContext, useRef, useState } from "react";

type CanvasContextType = {
    canvas: Canvas | null;
    setCanvas: (canvas: Canvas) => void;
    undo: () => void;
    redo: () => void;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
    const [canvas, setCanvasState] = useState<Canvas | null>(null);
    const undoStack = useRef<string[]>([]);
    const redoStack = useRef<string[]>([]);

    const setCanvas = (canvas: Canvas) => {
        setCanvasState(canvas);

        // Initialize listener
        canvas.on("object:added", saveState);
        canvas.on("object:modified", saveState);
        canvas.on("object:removed", saveState);

        // Save initial state
        saveState();
    };

    const saveState = () => {
        if (!canvasRef.current) return;
        const json = canvasRef.current.toJSON();
        undoStack.current.push(JSON.stringify(json));
        redoStack.current = []; // Clear redo stack on new action
    };

    const canvasRef = useRef<Canvas | null>(null);

    const undo = () => {
        if (!canvasRef.current || undoStack.current.length < 2) return;

        // Current state goes to redo
        const currentState = undoStack.current.pop()!;
        redoStack.current.push(currentState);

        const prevState = undoStack.current[undoStack.current.length - 1];
        canvasRef.current.loadFromJSON(prevState as string, () => {
            canvasRef.current?.renderAll();
        });
    };

    const redo = () => {
        if (!canvasRef.current || redoStack.current.length === 0) return;

        const nextState = redoStack.current.pop()!;
        undoStack.current.push(nextState);
        canvasRef.current.loadFromJSON(nextState, () => {
            canvasRef.current?.renderAll();
        });
    };

    // Keep ref in sync with state
    canvasRef.current = canvas;

    return (
        <CanvasContext.Provider value={{ canvas, setCanvas, undo, redo }}>
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (!context) throw new Error("useCanvas must be used within CanvasProvider");
    return context;
};

"use client";
import { AddImageCommand } from "@/shared/commands/AddImageCommand";
import { AddTextCommand } from "@/shared/commands/AddTextCommand";
import { DeleteObjectCommand } from "@/shared/commands/DeleteObjectCommand";
import { TransformObjectCommand } from "@/shared/commands/TransformObjectCommand";
import { applyGlobalHandleStyles, createObjectWithGlobalHandles, initializeGlobalImageHandles } from "@/shared/lib/customControlRenderers";
import { ExtendedCanvas } from "@/shared/lib/fabric-extended";
import type { Command, FabricCanvas, FabricObject } from "@/shared/models";
import * as fabric from "fabric";
import { Canvas } from "fabric";
import {
    createContext,
    useCallback, 
    useContext,
    useEffect,
    useRef,
    useState,
    useMemo
} from "react";

type CanvasContextType = {
    canvas: ExtendedCanvas | null;
    setCanvas: (canvas: ExtendedCanvas) => void;
    addText: (text: string, fontSize: number, bold: boolean) => void;
    addImage: (imageUrl: string) => Promise<void>;
    deleteObject: (obj: FabricObject) => void;
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
    const originalProps = useRef<Partial<FabricObject> | null>(null);
    const [isHandlesInitialized, setIsHandlesInitialized] = useState(false);

    // Initialize global image handles once when component mounts
    useEffect(() => {
        let isMounted = true;
        
        const initHandles = async () => {
            if (!isHandlesInitialized && isMounted) {
                try {
                    await initializeGlobalImageHandles(fabric);
                    if (isMounted) {
                        setIsHandlesInitialized(true);
                        console.log('Global image handles initialized');
                    }
                } catch (error) {
                    console.error('Failed to initialize global image handles:', error);
                }
            }
        };

        initHandles();
        
        return () => {
            isMounted = false;
        };
    }, []); // Remove isHandlesInitialized from dependencies

    const updateUndoRedoState = () => {
        setCanUndo(undoStack.current.length > 0);
        setCanRedo(redoStack.current.length > 0);
    };

    const deleteObject = useCallback((obj: fabric.Object) => {
        if (!canvasRef.current) return;

        const command = new DeleteObjectCommand(canvasRef.current, obj);
        command.execute();

        undoStack.current.push(command);
        redoStack.current = [];
        updateUndoRedoState();
    }, []);

    // Define helper functions first before setCanvas
    const fixCanvasDimensions = useCallback((canvas: Canvas) => {
        const canvasElement = canvas.getElement();
        const container = canvasElement.parentElement;

        if (container) {
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight;

            // Update CSS dimensions
            canvasElement.style.width = `${containerWidth}px`;
            canvasElement.style.height = `${containerHeight}px`;

            // Re-render the canvas
            canvas.renderAll();
        }
    }, []);

    const resizeText = useCallback((newCanvas: Canvas) => (e: any) => {
        const obj = e.target;
        if (!obj || !(obj instanceof fabric.IText)) return;

        const initialFontSize = obj.fontSize || 16;
        const scale = (obj.scaleX + obj.scaleY) / 2;
        const newFontSize = Math.max(4, initialFontSize * scale);

        obj.set({
            fontSize: newFontSize,
            scaleX: 1,
            scaleY: 1,
            originX: 'center',
            originY: 'center'
        });

        obj.setCoords();
        newCanvas.renderAll();
    }, []);

    const captureOriginal = useCallback((e: any) => {
        const obj = e.target;
        if (!obj || originalProps.current) return;

        originalProps.current = {
            left: obj.left,
            top: obj.top,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            angle: obj.angle,
            skewX: obj.skewX,
            skewY: obj.skewY,
            originX: obj.originX,
            originY: obj.originY,
            flipX: obj.flipX,
            flipY: obj.flipY,
            fontSize: (obj as any).fontSize,
            ...(obj instanceof fabric.IText && { fontSize: obj.fontSize }),
        };
    }, []);

    const commitTransform = useCallback((e: any) => {
        const obj = e.target;
        if (!obj || !originalProps.current) return;

        const afterProps: Partial<fabric.Object> = {
            left: obj.left,
            top: obj.top,
            scaleX: obj.scaleX,
            scaleY: obj.scaleY,
            angle: obj.angle,
            skewX: obj.skewX,
            skewY: obj.skewY,
            originX: obj.originX,
            originY: obj.originY,
            flipX: obj.flipX,
            flipY: obj.flipY,
            fontSize: (obj as any).fontSize,
            ...(obj instanceof fabric.IText && { fontSize: obj.fontSize }),
        };

        const command = new TransformObjectCommand(obj, originalProps.current, afterProps);

        undoStack.current.push(command);
        redoStack.current = [];
        originalProps.current = null;

        updateUndoRedoState();
    }, []);

    const setCanvas = useCallback((newCanvas: Canvas) => {
        if (canvasRef.current) canvasRef.current.off();

        // Fix canvas dimensions first
        fixCanvasDimensions(newCanvas);

        canvasRef.current = newCanvas;
        setCanvasState(newCanvas);

        // Apply global canvas selection styles
        newCanvas.selectionColor = 'rgba(139, 61, 255, 0.1)';
        newCanvas.selectionBorderColor = '#8b3dff';
        newCanvas.selectionLineWidth = 1;

        // Add custom delete handler to canvas
        (newCanvas as any).onDeleteObject = deleteObject;

        // Set up event listeners
        newCanvas.on("object:scaling", captureOriginal);
        newCanvas.on("object:scaling", resizeText(newCanvas));
        newCanvas.on("object:moving", captureOriginal);
        newCanvas.on("object:rotating", captureOriginal);
        newCanvas.on("object:modified", commitTransform);

        // Apply global handle styles to any existing objects
        applyGlobalHandleStyles(newCanvas);

        // Listen for object additions to apply handle styles
        newCanvas.on("object:added", (e) => {
            const obj = e.target;
            if (obj && isHandlesInitialized) {
                createObjectWithGlobalHandles(obj);
            }
        });

        updateUndoRedoState();
    }, [deleteObject, isHandlesInitialized, fixCanvasDimensions, resizeText, captureOriginal, commitTransform]);

    const addText = (text: string, fontSize: number, bold: boolean) => {
        if (!canvasRef.current) return;

        const command = new AddTextCommand(canvasRef.current, text, fontSize, bold);
        command.execute();

        undoStack.current.push(command);
        redoStack.current = [];
        updateUndoRedoState();
    };

    const addImage = async (imageUrl: string) => {
        if (!canvas) return;

        const command = new AddImageCommand(canvas, imageUrl);
        await command.execute();

        undoStack.current.push(command);
        redoStack.current = [];
        updateUndoRedoState();
    };

    const undo = useCallback(() => {
        const cmd = undoStack.current.pop();
        if (cmd) {
            cmd.undo();
            redoStack.current.push(cmd);
            updateUndoRedoState();
        }
    }, []);

    const redo = useCallback(() => {
        const cmd = redoStack.current.pop();
        if (cmd) {
            cmd.execute();
            undoStack.current.push(cmd);
            updateUndoRedoState();
        }
    }, []);

    return (
        <CanvasContext.Provider
            value={{
                canvas,
                setCanvas,
                addText,
                addImage,
                deleteObject,
                undo,
                redo,
                canUndo,
                canRedo,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error("useCanvas must be used within CanvasProvider");
    }
    return context;
};
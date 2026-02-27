"use client";
import { AddImageCommand } from "@/shared/commands/AddImageCommand";
import { AddTextCommand } from "@/shared/commands/AddTextCommand";
import { ClearCanvasCommand, ExportCanvasCommand, LoadCanvasCommand, SaveCanvasCommand } from "@/shared/commands/CanvasSerializationCommands";
import { DeleteObjectCommand } from "@/shared/commands/DeleteObjectCommand";
import { DeleteObjectsCommand } from "@/shared/commands/DeleteObjectsCommand";
import { TransformObjectCommand } from "@/shared/commands/TransformObjectCommand";
import { TransformObjectsCommand } from "@/shared/commands/TransformObjectsCommand";
import { applyGlobalHandleStyles, createObjectWithGlobalHandles, initializeGlobalImageHandles } from "@/shared/lib/customControlRenderers";
import { ExtendedCanvas } from "@/shared/lib/fabric-extended";
import type { FabricObject } from "@/shared/models";
import { UndoManager, UndoManagerState } from "@/shared/undo/UndoManager";
import { setCanvasReady, setUndoRedoState } from "@/store/slices/canvasSlice";
import * as fabric from "fabric";
import { Canvas } from "fabric";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import { useAppDispatch, useCanvasState } from "./useRedux";

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
    // Serialization methods
    saveCanvas: () => Promise<string>;
    loadCanvas: (jsonData: string) => Promise<void>;
    exportCanvas: (format?: 'png' | 'jpeg' | 'svg', quality?: number) => Promise<string>;
    clearCanvas: () => Promise<void>;
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
    const [canvas, setCanvasState] = useState<Canvas | null>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const undoManagerRef = useRef<UndoManager | null>(null);
    const originalProps = useRef<Partial<FabricObject> | null>(null);
    const groupOriginalProps = useRef<Partial<FabricObject>[]>([]);
    const [isHandlesInitialized, setIsHandlesInitialized] = useState(false);
    
    // Redux integration
    const dispatch = useAppDispatch();
    const canvasState = useCanvasState();

    // Initialize UndoManager
    useEffect(() => {
        if (!undoManagerRef.current) {
            undoManagerRef.current = new UndoManager({
                maxHistorySize: 50,
                enablePersistence: false,
            });
            
            // Subscribe to undo manager state changes
            undoManagerRef.current.subscribe((state: UndoManagerState) => {
                dispatch(setUndoRedoState({
                    canUndo: state.canUndo,
                    canRedo: state.canRedo,
                    historySize: state.historySize,
                }));
            });
        }
    }, [dispatch]);

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

    const deleteObject = useCallback(async (obj: fabric.Object) => {
        if (!canvasRef.current || !undoManagerRef.current) return;

        // If the object is an active selection, delete all contained objects
        if (obj && obj.type === 'activeSelection' && (obj as any)._objects) {
            const objects = (obj as any)._objects.slice();
            const command = new DeleteObjectsCommand(canvasRef.current, objects);
            await undoManagerRef.current.execute(command);
        } else {
            const command = new DeleteObjectCommand(canvasRef.current, obj);
            await undoManagerRef.current.execute(command);
        }
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
        if (!obj) return;
        if (obj.type === 'activeSelection' && (obj as any)._objects) {
            if (groupOriginalProps.current.length) return;

            // Capture all objects' original props once per transform interaction
            groupOriginalProps.current = (obj as any)._objects.map((o: any) => ({
                left: o.left,
                top: o.top,
                scaleX: o.scaleX,
                scaleY: o.scaleY,
                angle: o.angle,
                skewX: o.skewX,
                skewY: o.skewY,
                originX: o.originX,
                originY: o.originY,
                flipX: o.flipX,
                flipY: o.flipY,
                fontSize: (o as any).fontSize,
                ...(o instanceof fabric.IText && { fontSize: o.fontSize }),
            }));
        } else if (!originalProps.current) {
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
        }
    }, []);

    const commitTransform = useCallback((e: any) => {
        const obj = e.target;
        if (!obj) return;

        if (obj.type === 'activeSelection' && (obj as any)._objects && groupOriginalProps.current.length) {
            // Group transform
            const objects = (obj as any)._objects.slice(); // Create a copy to avoid reference issues
            const afterStates = objects.map((o: any) => ({
                left: o.left,
                top: o.top,
                scaleX: o.scaleX,
                scaleY: o.scaleY,
                angle: o.angle,
                skewX: o.skewX,
                skewY: o.skewY,
                originX: o.originX,
                originY: o.originY,
                flipX: o.flipX,
                flipY: o.flipY,
                fontSize: (o as any).fontSize,
                ...(o instanceof fabric.IText && { fontSize: o.fontSize }),
            }));
            const command = new TransformObjectsCommand(canvasRef.current!, objects, groupOriginalProps.current.slice(), afterStates);
            if (undoManagerRef.current) {
                undoManagerRef.current.execute(command).catch(error => {
                    console.error('Failed to execute group transform command:', error);
                });
            }
            groupOriginalProps.current = [];
            return;
        }

        if (!originalProps.current) return;

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
        
        if (undoManagerRef.current) {
            undoManagerRef.current.execute(command).catch(error => {
                console.error('Failed to execute transform command:', error);
            });
        }
        originalProps.current = null;
    }, []);

    const setCanvas = useCallback((newCanvas: Canvas) => {
        if (canvasRef.current) canvasRef.current.off();

        // Fix canvas dimensions first
        fixCanvasDimensions(newCanvas);

        canvasRef.current = newCanvas;
        setCanvasState(newCanvas);
        originalProps.current = null;
        groupOriginalProps.current = [];

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
        
        // Mark canvas as ready
        dispatch(setCanvasReady(true));
    }, [deleteObject, isHandlesInitialized, fixCanvasDimensions, resizeText, captureOriginal, commitTransform, dispatch]);

    const addText = useCallback(async (text: string, fontSize: number, bold: boolean) => {
        if (!canvasRef.current || !undoManagerRef.current) return;

        const command = new AddTextCommand(canvasRef.current, text, fontSize, bold);
        await undoManagerRef.current.execute(command);
    }, []);

    const addImage = async (imageUrl: string) => {
        if (!canvas || !undoManagerRef.current) return;

        const command = new AddImageCommand(canvas, imageUrl);
        await undoManagerRef.current.execute(command);
    };


    const undo = useCallback(async () => {
        if (!undoManagerRef.current) return;
        
        try {
            await undoManagerRef.current.undo();
            
            // Additional delay for complex selection restoration
            setTimeout(() => {
                if (canvasRef.current) {
                    canvasRef.current.renderAll();
                }
            }, 10);
        } catch (error) {
            console.error('Failed to undo:', error);
        }
    }, []);

    const redo = useCallback(async () => {
        if (!undoManagerRef.current) return;
        
        try {
            await undoManagerRef.current.redo();
            
            // Additional delay for complex selection restoration
            setTimeout(() => {
                if (canvasRef.current) {
                    canvasRef.current.renderAll();
                }
            }, 10);
        } catch (error) {
            console.error('Failed to redo:', error);
        }
    }, []);

    // Serialization methods
    const saveCanvas = useCallback(async (): Promise<string> => {
        if (!canvas || !undoManagerRef.current) return '';
        
        const command = new SaveCanvasCommand(canvas);
        await undoManagerRef.current.execute(command);
        return command.getSavedData() || '';
    }, [canvas]);

    const loadCanvas = useCallback(async (jsonData: string): Promise<void> => {
        if (!canvas || !undoManagerRef.current) return;
        
        const command = new LoadCanvasCommand(canvas, jsonData);
        await undoManagerRef.current.execute(command);
    }, [canvas]);

    const exportCanvas = useCallback(async (
        format: 'png' | 'jpeg' | 'svg' = 'png',
        quality: number = 1
    ): Promise<string> => {
        if (!canvas) return '';
        
        const command = new ExportCanvasCommand(canvas, { format, quality });
        await command.execute();
        return command.getExportedData() || '';
    }, [canvas]);

    const clearCanvas = useCallback(async (): Promise<void> => {
        if (!canvas || !undoManagerRef.current) return;
        
        const command = new ClearCanvasCommand(canvas);
        await undoManagerRef.current.execute(command);
    }, [canvas]);

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
                canUndo: canvasState.canUndo,
                canRedo: canvasState.canRedo,
                saveCanvas,
                loadCanvas,
                exportCanvas,
                clearCanvas,
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
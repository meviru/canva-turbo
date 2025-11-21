"use client";
import { useCanvas } from "@/hooks/useCanvas";
import type { Design, DesignerMode } from "@/shared/models";
import { Canvas } from "fabric";
import { useCallback, useEffect, useRef, useMemo } from "react";

interface CanvasEditorProps {
    designInfo: Design | null;
    designerMode: DesignerMode;
}

const CanvasEditor = ({ designInfo, designerMode }: CanvasEditorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { canvas, setCanvas } = useCanvas();
    const canvasInstanceRef = useRef<Canvas | null>(null);

    // Memoize canvas configuration to prevent unnecessary recreations
    const canvasConfig = useMemo(() => {
        if (!designInfo) return null;
        
        const scaleFactor = window.devicePixelRatio || 1;
        return {
            width: designInfo.width * scaleFactor,
            height: designInfo.height * scaleFactor,
            scale: 1 / scaleFactor,
            backgroundColor: designInfo.backgroundColor || "#fff",
        };
    }, [designInfo]);

    // Initialize canvas with proper cleanup
    useEffect(() => {
        if (!canvasRef.current || !canvasConfig) return;

        // Cleanup previous canvas instance
        if (canvasInstanceRef.current) {
            canvasInstanceRef.current.dispose();
            canvasInstanceRef.current = null;
        }

        const initCanvas = new Canvas(canvasRef.current, {
            width: canvasConfig.width,
            height: canvasConfig.height,
            backgroundColor: canvasConfig.backgroundColor,
        });

        // Set high resolution for sharp rendering
        initCanvas.set({
            scale: canvasConfig.scale,
        });

        initCanvas.renderAll();
        canvasInstanceRef.current = initCanvas;
        setCanvas(initCanvas);

        // Cleanup function
        return () => {
            if (canvasInstanceRef.current) {
                canvasInstanceRef.current.dispose();
                canvasInstanceRef.current = null;
            }
        };
    }, [canvasConfig, setCanvas]); // Add setCanvas back but ensure it's stable

    // Memoize readonly state configuration using ref to avoid dependencies
    const updateCanvasInteractivity = useCallback(() => {
        if (!canvas) return;

        const isReadOnly = designerMode.name === "Viewing" || designerMode.name === "Commenting";

        // Batch canvas property updates
        canvas.set({
            selection: !isReadOnly,
            skipTargetFind: isReadOnly,
        });

        // Update all objects in batch
        canvas.forEachObject((obj) => {
            obj.set({
                selectable: !isReadOnly,
                evented: !isReadOnly,
                hasControls: !isReadOnly,
                lockMovementX: isReadOnly,
                lockMovementY: isReadOnly,
            });
        });

        canvas.renderAll();
    }, [canvas, designerMode.name]); // Keep both dependencies but manage carefully

    // Apply interactivity changes when mode or canvas changes
    useEffect(() => {
        updateCanvasInteractivity();
    }, [designerMode.name, canvas]); // Simplified dependencies

    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-full">
            <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
    );
};

export default CanvasEditor;

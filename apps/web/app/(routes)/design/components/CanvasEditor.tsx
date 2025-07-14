"use client";
import { useCanvas } from "@/hooks/useCanvas";
import { Canvas } from "fabric";
import { useEffect, useRef } from "react";

const CanvasEditor = ({ designInfo, designerMode }: { designInfo: any, designerMode: any }) => {
    const canvasRef = useRef<any>(null);
    const { canvas, setCanvas } = useCanvas();

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current && designInfo) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: designInfo?.width,
                height: designInfo?.height,
                backgroundColor: "#fff",
            });

            // Set High Resolution Canvas
            const scaleFactor = window.devicePixelRatio || 1;
            initCanvas.set({
                width: designInfo?.width * scaleFactor,
                height: designInfo?.height * scaleFactor,
                scale: 1 / scaleFactor,
            });

            initCanvas.renderAll();
            setCanvas(initCanvas);

            return () => {
                initCanvas.dispose();
            }
        }
    }, [designInfo]);

    // Disable canvas interaction when designerMode is "Viewing" or "Commenting"
    useEffect(() => {
        if (!canvas) return;

        const isReadOnly = designerMode.name === "Viewing" || designerMode.name === "Commenting";

        // Disable canvas interaction
        canvas.selection = !isReadOnly;
        canvas.skipTargetFind = isReadOnly;
        canvas.forEachObject((obj) => {
            obj.selectable = !isReadOnly;
            obj.evented = !isReadOnly;
            obj.hasControls = !isReadOnly;
            obj.lockMovementX = isReadOnly;
            obj.lockMovementY = isReadOnly;
            obj.lockScalingX = isReadOnly;
            obj.lockScalingY = isReadOnly;
            obj.lockRotation = isReadOnly;
        });

        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }, [designerMode, canvas]);

    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-full">
            <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
    );
};

export default CanvasEditor;

"use client";
import { Canvas } from "fabric";
import { useEffect, useRef, useState } from "react";

const CanvasEditor = ({ designInfo }: { designInfo: any }) => {
    const canvasRef = useRef<any>(null);
    const [canvas, setCanvas] = useState(null);
    /**
     * Initialize Canvas with default values
     */
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

            return () => {
                initCanvas.dispose();
            }
        }
    }, [designInfo]);
    return (
        <div className="p-10 flex flex-col items-center justify-center min-h-full">
            <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
    );
};

export default CanvasEditor;

import { Canvas } from "fabric";

// Add this function to your useCanvas.tsx file for debugging
export const debugCanvasInfo = (canvas: Canvas) => {
  console.log("=== CANVAS DEBUG INFO ===");

  // Canvas dimensions
  console.log("Canvas Dimensions:", {
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    zoom: canvas.getZoom(),
  });

  // HTML element dimensions
  const canvasElement = canvas.getElement();
  console.log("Canvas Element:", {
    offsetWidth: canvasElement.offsetWidth,
    offsetHeight: canvasElement.offsetHeight,
    clientWidth: canvasElement.clientWidth,
    clientHeight: canvasElement.clientHeight,
    getBoundingClientRect: canvasElement.getBoundingClientRect(),
  });

  // Container dimensions
  const container = canvasElement.parentElement;
  if (container) {
    console.log("Container:", {
      offsetWidth: container.offsetWidth,
      offsetHeight: container.offsetHeight,
      clientWidth: container.clientWidth,
      clientHeight: container.clientHeight,
      getBoundingClientRect: container.getBoundingClientRect(),
    });
  }

  // Viewport transform
  console.log("Viewport Transform:", canvas.viewportTransform);

  // Calculated center
  const centerX = canvas.getWidth() / 2;
  const centerY = canvas.getHeight() / 2;
  console.log("Calculated Center:", { centerX, centerY });

  console.log("=== END DEBUG INFO ===");
};

// Call this function in your setCanvas method like this:
// debugCanvasInfo(newCanvas);

let handleImages: any = {
  corner: null,
  rotation: null,
  middleTop: null,
  middleBottom: null,
  middleLeft: null,
  middleRight: null,
};

// Configuration for handle sizes
const HANDLE_CONFIG = {
  corner: { size: 16, hitArea: 16 },
  middle: { size: 20, hitArea: 20 },
  rotation: { size: 30, hitArea: 30 },
  rotationOffset: 45,
};

// Initialize global image handles
export const initializeGlobalImageHandles = async (fabric: any) => {
  try {
    await loadHandleImagesFromFiles();

    // Override the global control rendering for all fabric objects
    fabric.Object.prototype.drawControls = function (ctx: any) {
      if (!this.hasControls || !this.visible) return this;

      const wh = this._calculateCurrentDimensions();
      const width = wh.x;
      const height = wh.y;
      const zoom = this.canvas ? this.canvas.getZoom() : 1;

      // Calculate positions based on object bounds
      const left = -width / 2;
      const top = -height / 2;
      const right = width / 2;
      const bottom = height / 2;
      const centerX = 0;
      const centerY = 0;

      ctx.save();

      // Adjust for zoom to keep handles consistent size
      const scaleFactor = 1 / zoom;
      ctx.scale(scaleFactor, scaleFactor);

      // Draw corner controls
      this._drawImageControl(
        ctx,
        "tl",
        left * zoom,
        top * zoom,
        handleImages.corner,
        HANDLE_CONFIG.corner.size
      );
      this._drawImageControl(
        ctx,
        "tr",
        right * zoom,
        top * zoom,
        handleImages.corner,
        HANDLE_CONFIG.corner.size
      );
      this._drawImageControl(
        ctx,
        "bl",
        left * zoom,
        bottom * zoom,
        handleImages.corner,
        HANDLE_CONFIG.corner.size
      );
      this._drawImageControl(
        ctx,
        "br",
        right * zoom,
        bottom * zoom,
        handleImages.corner,
        HANDLE_CONFIG.corner.size
      );

      if (!this.get("lockUniScaling")) {
        this._drawImageControl(
          ctx,
          "mt",
          centerX * zoom,
          top * zoom,
          handleImages.middleTop,
          HANDLE_CONFIG.middle.size
        );
        this._drawImageControl(
          ctx,
          "mb",
          centerX * zoom,
          bottom * zoom,
          handleImages.middleBottom,
          HANDLE_CONFIG.middle.size
        );
        this._drawImageControl(
          ctx,
          "ml",
          left * zoom,
          centerY * zoom,
          handleImages.middleLeft,
          HANDLE_CONFIG.middle.size
        );
        this._drawImageControl(
          ctx,
          "mr",
          right * zoom,
          centerY * zoom,
          handleImages.middleRight,
          HANDLE_CONFIG.middle.size
        );
      }

      if (this.hasRotatingPoint) {
        this._drawImageControl(
          ctx,
          "mtr",
          centerX * zoom,
          (top - HANDLE_CONFIG.rotationOffset) * zoom,
          handleImages.rotation,
          HANDLE_CONFIG.rotation.size
        );
      }

      ctx.restore();
      return this;
    };

    // Custom image control drawing method with transparent background
    fabric.Object.prototype._drawImageControl = function (
      ctx: any,
      control: string,
      x: number,
      y: number,
      image: any,
      size: number
    ) {
      if (!image) return;

      ctx.save();
      ctx.translate(x, y);
      ctx.drawImage(image, -size / 2, -size / 2, size, size);

      ctx.restore();
    };

    // Override the control positioning to match our custom rendering
    fabric.Object.prototype._getControlsTransform = function () {
      return {
        x: this.left,
        y: this.top,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        angle: this.angle,
        flipX: this.flipX,
        flipY: this.flipY,
      };
    };

    // Set global default properties for all objects
    fabric.Object.prototype.set({
      cornerSize: HANDLE_CONFIG.corner.hitArea,
      transparentCorners: false,
      borderColor: "#8b3dff",
      borderScaleFactor: 1,
      rotatingPointOffset: HANDLE_CONFIG.rotationOffset,
      hasRotatingPoint: true,
    });

    // Also set canvas selection styles
    fabric.Canvas.prototype.selectionColor = "rgba(139, 61, 255, 0.1)";
    fabric.Canvas.prototype.selectionBorderColor = "#8b3dff";
    fabric.Canvas.prototype.selectionLineWidth = 1;

    console.log("Global image handles initialized successfully");
  } catch (error) {
    console.error("Failed to initialize global image handles:", error);
    // Fallback to default handles
    fabric.Object.prototype.set({
      cornerStyle: "circle",
      cornerColor: "white",
      cornerStrokeColor: "#B8B8B8",
      cornerSize: 12,
      transparentCorners: false,
      borderColor: "#B8B8B8",
    });
  }
};

// Function to apply handle styles to existing objects
export const applyGlobalHandleStyles = (canvas: any) => {
  if (!canvas) return;

  canvas.getObjects().forEach((obj: any) => {
    obj.set({
      cornerSize: HANDLE_CONFIG.corner.hitArea,
      transparentCorners: false,
      borderColor: "#8b3dff",
      borderScaleFactor: 1,
      rotatingPointOffset: HANDLE_CONFIG.rotationOffset,
      hasRotatingPoint: true,
    });
  });

  canvas.renderAll();
};

// Function to create a custom object with global handle styles
export const createObjectWithGlobalHandles = (fabricObject: any) => {
  return fabricObject.set({
    cornerSize: HANDLE_CONFIG.corner.hitArea,
    transparentCorners: false,
    borderColor: "#8b3dff",
    borderScaleFactor: 1,
    rotatingPointOffset: HANDLE_CONFIG.rotationOffset,
    hasRotatingPoint: true,
  });
};

// Load from actual image files
const loadHandleImagesFromFiles = async () => {
  const cornerImg = new Image();
  const rotationImg = new Image();
  const middleTopBottomImg = new Image();
  const middleLeftRightImg = new Image();

  cornerImg.src = "/icons/corner-handle.svg";
  rotationImg.src = "/icons/rotate-handle.svg";
  middleTopBottomImg.src = "/icons/top-bottom-handle.svg";
  middleLeftRightImg.src = "/icons/left-right-handle.svg";

  return new Promise((resolve, reject) => {
    let loaded = 0;
    const total = 4;

    const checkLoaded = (): any => {
      loaded++;
      if (loaded === total) {
        handleImages = {
          corner: cornerImg,
          rotation: rotationImg,
          middleTop: middleTopBottomImg,
          middleBottom: middleTopBottomImg,
          middleLeft: middleLeftRightImg,
          middleRight: middleLeftRightImg,
        };
        resolve(handleImages);
      }
    };

    const handleError = (error: any) => {
      console.error("Error loading handle image:", error);
      reject(error);
    };

    cornerImg.onload = checkLoaded;
    cornerImg.onerror = handleError;

    rotationImg.onload = checkLoaded;
    rotationImg.onerror = handleError;

    middleTopBottomImg.onload = checkLoaded;
    middleTopBottomImg.onerror = handleError;

    middleLeftRightImg.onload = checkLoaded;
    middleLeftRightImg.onerror = handleError;
  });
};

// Optional: Function to update handle sizes dynamically
export const updateHandleSizes = (
  cornerSize: number,
  middleSize: number,
  rotationSize: number
) => {
  HANDLE_CONFIG.corner.size = cornerSize;
  HANDLE_CONFIG.corner.hitArea = cornerSize;
  HANDLE_CONFIG.middle.size = middleSize;
  HANDLE_CONFIG.middle.hitArea = middleSize;
  HANDLE_CONFIG.rotation.size = rotationSize;
  HANDLE_CONFIG.rotation.hitArea = rotationSize;
};

// Optional: Function to update rotation offset
export const updateRotationOffset = (offset: number) => {
  HANDLE_CONFIG.rotationOffset = offset;
};

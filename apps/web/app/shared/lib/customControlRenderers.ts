import * as fabric from "fabric";
import { ExtendedCanvas } from "./fabric-extended";

let handleImages: any = {
  corner: null,
  rotation: null,
  middleTop: null,
  middleBottom: null,
  middleLeft: null,
  middleRight: null,
  delete: null,
};

const HANDLE_CONFIG = {
  corner: { size: 16, hitArea: 16 },
  middle: { size: 20, hitArea: 20 },
  rotation: { size: 30, hitArea: 30 },
  delete: { size: 30, hitArea: 30 },
  rotationOffset: 45,
  deleteOffset: 45,
};

export const initializeGlobalImageHandles = async (fabric: any) => {
  try {
    await loadHandleImagesFromFiles();

    // Override drawControls to include custom icons
    fabric.Object.prototype.drawControls = function (ctx: any) {
      if (!this.hasControls || !this.visible) return this;

      const zoom = this.canvas ? this.canvas.getZoom() : 1;
      const wh = this._calculateCurrentDimensions();
      const width = wh.x;
      const height = wh.y;

      const left = -width / 2;
      const top = -height / 2;
      const right = width / 2;
      const bottom = height / 2;
      const centerX = 0;
      const centerY = 0;

      ctx.save();

      const scaled = (value: number) => value;
      const scaledSize = (size: number) => size / zoom;

      // Corners
      this._drawImageControl(
        ctx,
        "tl",
        scaled(left),
        scaled(top),
        handleImages.corner,
        scaledSize(HANDLE_CONFIG.corner.size)
      );
      this._drawImageControl(
        ctx,
        "tr",
        scaled(right),
        scaled(top),
        handleImages.corner,
        scaledSize(HANDLE_CONFIG.corner.size)
      );
      this._drawImageControl(
        ctx,
        "bl",
        scaled(left),
        scaled(bottom),
        handleImages.corner,
        scaledSize(HANDLE_CONFIG.corner.size)
      );
      this._drawImageControl(
        ctx,
        "br",
        scaled(right),
        scaled(bottom),
        handleImages.corner,
        scaledSize(HANDLE_CONFIG.corner.size)
      );

      // Middles
      if (!this.get("lockUniScaling")) {
        this._drawImageControl(
          ctx,
          "mt",
          scaled(centerX),
          scaled(top),
          handleImages.middleTop,
          scaledSize(HANDLE_CONFIG.middle.size)
        );
        this._drawImageControl(
          ctx,
          "mb",
          scaled(centerX),
          scaled(bottom),
          handleImages.middleBottom,
          scaledSize(HANDLE_CONFIG.middle.size)
        );
        this._drawImageControl(
          ctx,
          "ml",
          scaled(left),
          scaled(centerY),
          handleImages.middleLeft,
          scaledSize(HANDLE_CONFIG.middle.size)
        );
        this._drawImageControl(
          ctx,
          "mr",
          scaled(right),
          scaled(centerY),
          handleImages.middleRight,
          scaledSize(HANDLE_CONFIG.middle.size)
        );
      }

      // Rotate - matches the mtr control definition
      if (this.hasRotatingPoint) {
        this._drawImageControl(
          ctx,
          "mtr",
          scaled(centerX - 15),
          scaled(top - HANDLE_CONFIG.rotationOffset),
          handleImages.rotation,
          scaledSize(HANDLE_CONFIG.rotation.size)
        );
      }

      // Delete - matches the delete control definition
      this._drawImageControl(
        ctx,
        "delete",
        scaled(centerX + 15),
        scaled(top - HANDLE_CONFIG.deleteOffset),
        handleImages.delete,
        scaledSize(HANDLE_CONFIG.delete.size)
      );

      ctx.restore();
      return this;
    };

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

    fabric.Object.prototype._drawBorders = function (
      ctx: any,
      styleOverride: any
    ) {
      if (!this.hasBorders) return this;

      ctx.save();
      ctx.strokeStyle = styleOverride?.borderColor || this.borderColor;
      ctx.lineWidth =
        (styleOverride?.borderScaleFactor || this.borderScaleFactor) /
        (this.canvas ? this.canvas.getZoom() : 1);

      const wh = this._calculateCurrentDimensions();
      ctx.strokeRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);

      ctx.restore();
      return this;
    };

    fabric.Object.prototype.set({
      cornerSize: HANDLE_CONFIG.corner.hitArea,
      transparentCorners: false,
      borderColor: "#8b3dff",
      borderScaleFactor: 1,
      rotatingPointOffset: HANDLE_CONFIG.rotationOffset,
      hasRotatingPoint: true,
    });

    fabric.Canvas.prototype.selectionColor = "rgba(139, 61, 255, 0.1)";
    fabric.Canvas.prototype.selectionBorderColor = "#8b3dff";
    fabric.Canvas.prototype.selectionLineWidth = 1;

    console.log("Global image handles initialized successfully");
  } catch (error) {
    console.error("Failed to initialize global image handles:", error);
  }
};

export const applyGlobalHandleStyles = (canvas: any) => {
  if (!canvas) return;
  canvas.getObjects().forEach((obj: any) => {
    createObjectWithGlobalHandles(obj);
  });
  canvas.renderAll();
};

export const createObjectWithGlobalHandles = (fabricObject: any) => {
  fabricObject.controls = {
    ...fabricObject.controls,
    // Rotation control - matches centerX - 15 position
    mtr: new fabric.Control({
      x: 0, // Start from center
      y: -0.5, // Top edge
      offsetX: -15, // Matches your -15px from center
      offsetY: -HANDLE_CONFIG.rotationOffset,
      cursorStyle: "grab",
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
      actionName: "rotate",
      render: function (ctx, left, top) {
        const image = handleImages.rotation;
        const size = HANDLE_CONFIG.rotation.size;

        if (!image) return;
        const zoom = fabricObject.canvas?.getZoom() || 1;
        const scaledSize = size / zoom;

        ctx.save();
        ctx.translate(left, top);
        ctx.drawImage(
          image,
          -scaledSize / 2,
          -scaledSize / 2,
          scaledSize,
          scaledSize
        );
        ctx.restore();
      },
      touchSizeX: HANDLE_CONFIG.rotation.hitArea,
      touchSizeY: HANDLE_CONFIG.rotation.hitArea,
    }),
    // Delete control - matches centerX + 15 position
    delete: new fabric.Control({
      x: 0, // Start from center
      y: -0.5, // Top edge
      offsetX: 15, // Matches your +15px from center
      offsetY: -HANDLE_CONFIG.deleteOffset,
      cursorStyle: "pointer",
      render: function (ctx, left, top) {
        const image = handleImages.delete;
        const size = HANDLE_CONFIG.delete.size;

        if (!image) return;
        const zoom = fabricObject.canvas?.getZoom() || 1;
        const scaledSize = size / zoom;

        ctx.save();
        ctx.translate(left, top);
        ctx.drawImage(
          image,
          -scaledSize / 2,
          -scaledSize / 2,
          scaledSize,
          scaledSize
        );
        ctx.restore();
      },
      mouseUpHandler: function (_, transform) {
        const target = transform.target;
        const canvas = target.canvas as ExtendedCanvas;

        if (canvas?.onDeleteObject) {
          canvas.onDeleteObject(target);
        } else {
          canvas?.remove(target);
        }

        canvas?.requestRenderAll();
        return true;
      },
      touchSizeX: HANDLE_CONFIG.delete.hitArea,
      touchSizeY: HANDLE_CONFIG.delete.hitArea,
    }),
  };

  return fabricObject.set({
    cornerSize: HANDLE_CONFIG.corner.hitArea,
    transparentCorners: false,
    borderColor: "#8b3dff",
    borderScaleFactor: 1,
    rotatingPointOffset: HANDLE_CONFIG.rotationOffset,
    hasRotatingPoint: true,
  });
};

const loadHandleImagesFromFiles = async () => {
  const cornerImg = new Image();
  const rotationImg = new Image();
  const middleTopBottomImg = new Image();
  const middleLeftRightImg = new Image();
  const deleteImg = new Image();

  cornerImg.src = "/icons/corner-handle.svg";
  rotationImg.src = "/icons/rotate-handle.svg";
  middleTopBottomImg.src = "/icons/top-bottom-handle.svg";
  middleLeftRightImg.src = "/icons/left-right-handle.svg";
  deleteImg.src = "/icons/delete-handle.svg";

  return new Promise((resolve, reject) => {
    let loaded = 0;
    const total = 5;

    const checkLoaded = () => {
      loaded++;
      if (loaded === total) {
        handleImages = {
          corner: cornerImg,
          rotation: rotationImg,
          middleTop: middleTopBottomImg,
          middleBottom: middleTopBottomImg,
          middleLeft: middleLeftRightImg,
          middleRight: middleLeftRightImg,
          delete: deleteImg,
        };
        resolve(handleImages);
      }
    };

    const handleError = (error: any) => {
      console.error("Error loading handle image:", error);
      reject(error);
    };

    cornerImg.onload = checkLoaded;
    rotationImg.onload = checkLoaded;
    middleTopBottomImg.onload = checkLoaded;
    middleLeftRightImg.onload = checkLoaded;
    deleteImg.onload = checkLoaded;

    cornerImg.onerror = handleError;
    rotationImg.onerror = handleError;
    middleTopBottomImg.onerror = handleError;
    middleLeftRightImg.onerror = handleError;
    deleteImg.onerror = handleError;
  });
};

export const updateHandleSizes = (
  cornerSize: number,
  middleSize: number,
  rotationSize: number,
  deleteSize?: number
) => {
  HANDLE_CONFIG.corner.size = cornerSize;
  HANDLE_CONFIG.corner.hitArea = cornerSize;
  HANDLE_CONFIG.middle.size = middleSize;
  HANDLE_CONFIG.middle.hitArea = middleSize;
  HANDLE_CONFIG.rotation.size = rotationSize;
  HANDLE_CONFIG.rotation.hitArea = rotationSize;

  if (deleteSize) {
    HANDLE_CONFIG.delete.size = deleteSize;
    HANDLE_CONFIG.delete.hitArea = deleteSize;
  }
};

export const updateRotationOffset = (offset: number) => {
  HANDLE_CONFIG.rotationOffset = offset;
};

export const updateDeleteOffset = (offset: number) => {
  HANDLE_CONFIG.deleteOffset = offset;
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CanvasState {
  // Canvas state management
  isCanvasReady: boolean;
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
  
  // Selection state
  selectedObjectIds: string[];
  hasSelection: boolean;
  
  // Tool state
  currentTool: string;
  
  // Canvas properties
  zoom: number;
  panX: number;
  panY: number;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Design properties
  designId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
}

const initialState: CanvasState = {
  isCanvasReady: false,
  canUndo: false,
  canRedo: false,
  historySize: 0,
  selectedObjectIds: [],
  hasSelection: false,
  currentTool: "select",
  zoom: 1,
  panX: 0,
  panY: 0,
  isLoading: false,
  error: null,
  designId: null,
  canvasWidth: 800,
  canvasHeight: 600,
  backgroundColor: "#ffffff",
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    // Canvas lifecycle actions
    setCanvasReady: (state, action: PayloadAction<boolean>) => {
      state.isCanvasReady = action.payload;
    },
    
    setCanvasLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setCanvasError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Undo/Redo state management
    setUndoRedoState: (
      state,
      action: PayloadAction<{ canUndo: boolean; canRedo: boolean; historySize: number }>
    ) => {
      state.canUndo = action.payload.canUndo;
      state.canRedo = action.payload.canRedo;
      state.historySize = action.payload.historySize;
    },

    // Selection management
    setSelectedObjects: (state, action: PayloadAction<string[]>) => {
      state.selectedObjectIds = action.payload;
      state.hasSelection = action.payload.length > 0;
    },
    
    clearSelection: (state) => {
      state.selectedObjectIds = [];
      state.hasSelection = false;
    },
    
    addToSelection: (state, action: PayloadAction<string>) => {
      if (!state.selectedObjectIds.includes(action.payload)) {
        state.selectedObjectIds.push(action.payload);
        state.hasSelection = true;
      }
    },
    
    removeFromSelection: (state, action: PayloadAction<string>) => {
      state.selectedObjectIds = state.selectedObjectIds.filter(
        (id) => id !== action.payload
      );
      state.hasSelection = state.selectedObjectIds.length > 0;
    },

    // Tool management
    setCurrentTool: (state, action: PayloadAction<string>) => {
      state.currentTool = action.payload;
    },

    // Canvas view management
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(5, action.payload)); // Clamp between 0.1x and 5x
    },
    
    setPan: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.panX = action.payload.x;
      state.panY = action.payload.y;
    },
    
    resetView: (state) => {
      state.zoom = 1;
      state.panX = 0;
      state.panY = 0;
    },

    // Design properties
    setDesignId: (state, action: PayloadAction<string | null>) => {
      state.designId = action.payload;
    },
    
    setCanvasDimensions: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.canvasWidth = action.payload.width;
      state.canvasHeight = action.payload.height;
    },
    
    setBackgroundColor: (state, action: PayloadAction<string>) => {
      state.backgroundColor = action.payload;
    },

    // Reset actions
    resetCanvas: (state) => {
      return {
        ...initialState,
        designId: state.designId, // Preserve design ID
      };
    },
  },
});

export const {
  setCanvasReady,
  setCanvasLoading,
  setCanvasError,
  setUndoRedoState,
  setSelectedObjects,
  clearSelection,
  addToSelection,
  removeFromSelection,
  setCurrentTool,
  setZoom,
  setPan,
  resetView,
  setDesignId,
  setCanvasDimensions,
  setBackgroundColor,
  resetCanvas,
} = canvasSlice.actions;

export default canvasSlice.reducer;

// Selectors
export const selectCanvasState = (state: { canvas: CanvasState }) => state.canvas;
export const selectCanUndo = (state: { canvas: CanvasState }) => state.canvas.canUndo;
export const selectCanRedo = (state: { canvas: CanvasState }) => state.canvas.canRedo;
export const selectSelectedObjects = (state: { canvas: CanvasState }) => state.canvas.selectedObjectIds;
export const selectHasSelection = (state: { canvas: CanvasState }) => state.canvas.hasSelection;
export const selectCurrentTool = (state: { canvas: CanvasState }) => state.canvas.currentTool;
export const selectZoom = (state: { canvas: CanvasState }) => state.canvas.zoom;
export const selectCanvasDimensions = (state: { canvas: CanvasState }) => ({
  width: state.canvas.canvasWidth,
  height: state.canvas.canvasHeight,
});
export const selectIsCanvasReady = (state: { canvas: CanvasState }) => state.canvas.isCanvasReady;
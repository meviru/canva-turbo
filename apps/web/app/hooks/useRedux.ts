import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector(selector);

// Canvas-specific hooks for convenience
export const useCanvasState = () => {
  return useAppSelector((state) => state.canvas);
};

export const useUndoRedoState = () => {
  return useAppSelector((state) => ({
    canUndo: state.canvas.canUndo,
    canRedo: state.canvas.canRedo,
    historySize: state.canvas.historySize,
  }));
};

export const useCanvasSelection = () => {
  return useAppSelector((state) => ({
    selectedObjectIds: state.canvas.selectedObjectIds,
    hasSelection: state.canvas.hasSelection,
  }));
};

export const useCanvasTools = () => {
  return useAppSelector((state) => ({
    currentTool: state.canvas.currentTool,
    zoom: state.canvas.zoom,
    panX: state.canvas.panX,
    panY: state.canvas.panY,
  }));
};
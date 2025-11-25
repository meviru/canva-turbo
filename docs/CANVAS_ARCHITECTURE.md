# Canvas Architecture Improvements

This document outlines the major improvements made to the canvas architecture in the canva-turbo project.

## 🎯 Overview

The canvas architecture has been refactored to provide a more robust, scalable, and maintainable foundation for the design editor. Key improvements include:

1. **Advanced UndoManager** - Centralized command execution and history management
2. **Redux Integration** - Canvas state now properly integrated with Redux store
3. **Command Grouping** - Support for atomic multi-step operations
4. **Serialization Support** - Commands for saving/loading canvas state
5. **Improved Memory Management** - Better cleanup and history size limits

## 🏗️ Architecture Components

### UndoManager (`shared/undo/UndoManager.ts`)

**Features:**
- Command execution with history tracking
- Command grouping for atomic operations
- Configurable history size limits
- Optional persistence support
- Subscribe to state changes
- Memory-conscious cleanup

**Usage:**
```typescript
const undoManager = new UndoManager({
  maxHistorySize: 50,
  enablePersistence: false,
});

// Execute single command
await undoManager.execute(command);

// Group multiple commands
undoManager.startGroup();
await undoManager.execute(command1);
await undoManager.execute(command2);
await undoManager.endGroup(); // Creates CompositeCommand
```

### CompositeCommand (`shared/commands/CompositeCommand.ts`)

**Purpose:** Groups multiple commands into a single undo/redo operation.

**Features:**
- Execute commands in order
- Undo commands in reverse order
- Utility methods for command inspection
- Empty command detection

### Canvas Redux Slice (`store/slices/canvasSlice.ts`)

**State Management:**
```typescript
interface CanvasState {
  // History management
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
  
  // Selection tracking
  selectedObjectIds: string[];
  hasSelection: boolean;
  
  // Tool state
  currentTool: string;
  
  // View state
  zoom: number;
  panX: number;
  panY: number;
  
  // Canvas properties
  designId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
}
```

**Actions:**
- `setUndoRedoState` - Update history state
- `setSelectedObjects` - Manage selection
- `setCurrentTool` - Tool switching
- `setZoom`, `setPan` - View management
- `setCanvasDimensions` - Canvas sizing

### Serialization Commands (`shared/commands/CanvasSerializationCommands.ts`)

**Commands:**
- `SaveCanvasCommand` - Serialize canvas to JSON
- `LoadCanvasCommand` - Load canvas from JSON with undo support
- `ExportCanvasCommand` - Export canvas as image (PNG/JPEG/SVG)
- `ClearCanvasCommand` - Clear canvas with undo support

### Typed Redux Hooks (`hooks/useRedux.ts`)

**Utility Hooks:**
- `useAppDispatch` - Typed dispatch hook
- `useAppSelector` - Typed selector hook
- `useCanvasState` - Canvas-specific state
- `useUndoRedoState` - History state
- `useCanvasSelection` - Selection state
- `useCanvasTools` - Tool and view state

## 🔄 Refactored useCanvas Hook

**Key Changes:**
1. **UndoManager Integration** - Replaced simple stacks with UndoManager
2. **Redux State** - Canvas state synchronized with Redux store
3. **Async Commands** - Proper async/await support for commands
4. **Error Handling** - Improved error handling for command execution

**API Remains Consistent:**
```typescript
const { 
  canvas, 
  setCanvas, 
  addText, 
  addImage, 
  deleteObject, 
  undo, 
  redo, 
  canUndo, 
  canRedo 
} = useCanvas();
```

## 🚀 Command Grouping Examples

### Simple Grouped Operation
```typescript
// Group multiple transforms into single undo action
undoManager.startGroup();
await undoManager.execute(new TransformObjectCommand(obj1, before1, after1));
await undoManager.execute(new TransformObjectCommand(obj2, before2, after2));
await undoManager.endGroup();
```

### Complex Styled Text Addition
```typescript
const command = new AddTextWithStyleCommand(
  canvas,
  "Hello World",
  100, 100,    // position
  24,          // fontSize
  "#ff0000",   // color
  undoManager
);
await command.execute(); // Adds text and applies styling atomically
```

### Bulk Operations
```typescript
const bulkDelete = new BulkDeleteCommand(canvas, objectIds, undoManager);
await bulkDelete.execute(); // Deletes multiple objects as single operation
```

## 📊 Memory Management

**Improvements:**
- Configurable history size limits (default: 50 commands)
- Automatic cleanup of old commands
- Reduced memory leaks through proper cleanup
- Optional persistence with localStorage

**Configuration:**
```typescript
const undoManager = new UndoManager({
  maxHistorySize: 100,           // Increase for more history
  enablePersistence: true,       // Enable localStorage
  persistenceKey: "canvas-history"
});
```

## 🔧 Integration Guide

### For New Features
1. Create command classes implementing `Command` interface
2. Use UndoManager for execution: `await undoManager.execute(command)`
3. Use command grouping for complex operations
4. Update Redux state as needed via dispatch

### For Existing Components
1. Import typed hooks: `import { useCanvasState } from '@/hooks/useRedux'`
2. Use Redux state instead of local state where applicable
3. Leverage canvas state selectors for better performance

### For Canvas Operations
1. All canvas mutations should go through commands
2. Use UndoManager for automatic history management
3. Group related operations with `startGroup()`/`endGroup()`
4. Handle async operations properly with try/catch

## 🎯 Benefits Achieved

1. **Consistency** - All canvas operations follow command pattern
2. **Scalability** - Easy to add new operations and features
3. **Maintainability** - Clear separation of concerns
4. **Performance** - Redux integration enables efficient re-renders
5. **User Experience** - Robust undo/redo with grouping support
6. **Memory Efficiency** - Configurable limits and cleanup
7. **Type Safety** - Full TypeScript support throughout

## 🔮 Future Enhancements

**Potential Additions:**
1. Command serialization for session persistence
2. Real-time collaboration support
3. Advanced selection tools integration
4. Batch operation optimizations
5. Visual history timeline
6. Command performance analytics

## 📁 File Structure

```
apps/web/app/
├── hooks/
│   ├── useCanvas.tsx        # Main canvas hook (refactored)
│   └── useRedux.ts          # Typed Redux hooks
├── shared/
│   ├── commands/
│   │   ├── CompositeCommand.ts           # Command grouping
│   │   ├── CanvasSerializationCommands.ts # Save/load/export
│   │   ├── GroupedCommandExamples.ts     # Usage examples
│   │   └── [existing commands]
│   └── undo/
│       └── UndoManager.ts   # Advanced undo management
└── store/
    ├── index.tsx            # Updated store config
    └── slices/
        └── canvasSlice.ts   # Canvas Redux state
```

This architecture provides a solid foundation for building advanced design editor features while maintaining excellent performance and user experience.
import { UndoManager } from "../undo/UndoManager";

/**
 * Utility functions for common canvas operations using command grouping
 * These are actual utility functions that can be used in the application
 */

/**
 * Execute multiple commands as a single undoable operation
 */
export const executeCommandGroup = async (
  undoManager: UndoManager,
  commands: (() => Promise<void>)[]
): Promise<void> => {
  if (commands.length === 0) return;
  
  undoManager.startGroup();
  try {
    for (const commandFn of commands) {
      await commandFn();
    }
  } finally {
    await undoManager.endGroup();
  }
};

/**
 * Example usage:
 * 
 * const { canvas } = useCanvas();
 * const undoManagerRef = useRef<UndoManager>(new UndoManager());
 * 
 * // Group multiple operations
 * await executeCommandGroup(undoManagerRef.current, [
 *   () => undoManagerRef.current!.execute(new AddTextCommand(canvas, "Hello", 16, false)),
 *   () => undoManagerRef.current!.execute(new AddImageCommand(canvas, "image.jpg")),
 * ]);
 */
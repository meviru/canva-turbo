import React from "react";
import { Command } from "../models";

export interface UndoManagerConfig {
  maxHistorySize?: number;
  enablePersistence?: boolean;
  persistenceKey?: string;
}

export interface UndoManagerState {
  canUndo: boolean;
  canRedo: boolean;
  historySize: number;
}

/**
 * Advanced UndoManager for handling command execution, grouping, and history management
 * Supports command grouping for complex operations and memory management
 */
export class UndoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private isGrouping = false;
  private currentGroup: Command[] = [];
  private listeners = new Set<(state: UndoManagerState) => void>();
  private config: Required<UndoManagerConfig>;

  constructor(
    config: UndoManagerConfig = {},
    private persistenceKey = "canvas-history"
  ) {
    this.config = {
      maxHistorySize: 50,
      enablePersistence: false,
      persistenceKey: "canvas-history",
      ...config,
    };

    if (this.config.enablePersistence) {
      this.loadHistory();
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: UndoManagerState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current state
   */
  getState(): UndoManagerState {
    return {
      canUndo: this.undoStack.length > 0,
      canRedo: this.redoStack.length > 0,
      historySize: this.undoStack.length,
    };
  }

  /**
   * Execute a command and add it to history
   */
  async execute(command: Command): Promise<void> {
    try {
      await command.execute();
      
      if (this.isGrouping) {
        this.currentGroup.push(command);
      } else {
        this.addToHistory(command);
      }
    } catch (error) {
      console.error("Failed to execute command:", error);
      throw error;
    }
  }

  /**
   * Undo the last command
   */
  async undo(): Promise<void> {
    if (this.undoStack.length === 0) return;

    try {
      const command = this.undoStack.pop()!;
      await command.undo();
      this.redoStack.push(command);
      this.notifyListeners();
      
      if (this.config.enablePersistence) {
        this.saveHistory();
      }
    } catch (error) {
      console.error("Failed to undo command:", error);
      throw error;
    }
  }

  /**
   * Redo the next command
   */
  async redo(): Promise<void> {
    if (this.redoStack.length === 0) return;

    try {
      const command = this.redoStack.pop()!;
      await command.execute();
      this.undoStack.push(command);
      this.notifyListeners();
      
      if (this.config.enablePersistence) {
        this.saveHistory();
      }
    } catch (error) {
      console.error("Failed to redo command:", error);
      throw error;
    }
  }

  /**
   * Start a command group for batching operations
   */
  startGroup(): void {
    this.isGrouping = true;
    this.currentGroup = [];
  }

  /**
   * End the current command group and add it to history
   */
  async endGroup(): Promise<void> {
    if (!this.isGrouping) return;

    this.isGrouping = false;
    
    if (this.currentGroup.length > 0) {
      // Dynamic import to avoid circular dependency
      const { CompositeCommand } = await import("../commands/CompositeCommand");
      const composite = new CompositeCommand(this.currentGroup);
      this.addToHistory(composite);
    }
    
    this.currentGroup = [];
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.currentGroup = [];
    this.isGrouping = false;
    this.notifyListeners();
    
    if (this.config.enablePersistence) {
      this.clearPersistedHistory();
    }
  }

  /**
   * Get history size
   */
  getHistorySize(): number {
    return this.undoStack.length;
  }

  private addToHistory(command: Command): void {
    this.undoStack.push(command);
    this.redoStack = []; // Clear redo stack when new command is added
    this.trimHistory();
    this.notifyListeners();
    
    if (this.config.enablePersistence) {
      this.saveHistory();
    }
  }

  private trimHistory(): void {
    if (this.undoStack.length > this.config.maxHistorySize) {
      this.undoStack.shift(); // Remove oldest command
    }
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }

  private saveHistory(): void {
    try {
      const serializedHistory = {
        undoStackSize: this.undoStack.length,
        redoStackSize: this.redoStack.length,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(
        `${this.persistenceKey}_meta`,
        JSON.stringify(serializedHistory)
      );
    } catch (error) {
      console.warn("Failed to save history to localStorage:", error);
    }
  }

  private loadHistory(): void {
    try {
      const stored = localStorage.getItem(`${this.persistenceKey}_meta`);
      if (stored) {
        const meta = JSON.parse(stored);
        console.log("Loaded history metadata:", meta);
        // Note: Actual command restoration would require command serialization
        // which is complex and beyond scope of this implementation
      }
    } catch (error) {
      console.warn("Failed to load history from localStorage:", error);
    }
  }

  private clearPersistedHistory(): void {
    try {
      localStorage.removeItem(`${this.persistenceKey}_meta`);
    } catch (error) {
      console.warn("Failed to clear persisted history:", error);
    }
  }
}

/**
 * Hook for using UndoManager in React components
 */
export const useUndoManager = (config?: UndoManagerConfig) => {
  const managerRef = React.useRef<UndoManager | null>(null);
  const [state, setState] = React.useState<UndoManagerState>({
    canUndo: false,
    canRedo: false,
    historySize: 0,
  });

  React.useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new UndoManager(config);
    }

    const unsubscribe = managerRef.current.subscribe(setState);
    setState(managerRef.current.getState());

    return unsubscribe;
  }, [config]); // Add config as dependency

  return {
    undoManager: managerRef.current,
    ...state,
  };
};
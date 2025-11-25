import { Command } from "../models";

/**
 * CompositeCommand groups multiple commands into a single operation
 * Useful for complex operations that need to be undone/redone as a unit
 */
export class CompositeCommand implements Command {
  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = [...commands]; // Create a copy to avoid external modifications
  }

  /**
   * Execute all commands in order
   */
  async execute(): Promise<void> {
    for (const command of this.commands) {
      await command.execute();
    }
  }

  /**
   * Undo all commands in reverse order
   */
  async undo(): Promise<void> {
    // Undo in reverse order to maintain proper state consistency
    for (let i = this.commands.length - 1; i >= 0; i--) {
      const command = this.commands[i];
      if (command) {
        await command.undo();
      }
    }
  }

  /**
   * Get the number of commands in this composite
   */
  getCommandCount(): number {
    return this.commands.length;
  }

  /**
   * Get all commands (readonly)
   */
  getCommands(): readonly Command[] {
    return this.commands;
  }

  /**
   * Check if composite has any commands
   */
  isEmpty(): boolean {
    return this.commands.length === 0;
  }
}
// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: Apache-2.0

import { slugify } from '../../utils/utlities.js';
import { ParseResult } from '../interfaces/IParser.js';
import {
  BaseCommandDefinition,
  CommandDefinition,
} from './BaseCommandDefinition.js';

export type CommandDict = Record<string, CommandDefinition>;
export type CommandDirectory = Record<string, CommandDict>;

function injectSlugifiedToolName(command: CommandDefinition) {
  const injectedCommand = { ...command };
  injectedCommand.toolName = slugify(injectedCommand.command);
  return injectedCommand;
}

export class CommandRegistry {
  commandHandlers: BaseCommandDefinition[] = [];
  commandDirectory: CommandDirectory = {};

  registerHandler(handler: BaseCommandDefinition, handlerKey: string) {
    this.commandHandlers.push(handler);

    let commandDict = {};
    handler.definitions.forEach((command) => {
      commandDict[command.command] = injectSlugifiedToolName(command);
    });
    this.commandDirectory[handlerKey] = commandDict;
  }

  parseInstruction(text: string): ParseResult {
    for (const handler of this.commandHandlers) {
      const result = handler.parseCommand(text);
      if (result) {
        return result;
      }
    }

    throw new Error(
      `Could not understand the instruction: ${text}. commandHandlers: ${this.commandHandlers}`
    );
  }

  async getSupportedCommands(): Promise<
    Array<{
      command: string;
      description: string;
      requiredParameters: string[];
      optionalParameters: string[];
    }>
  > {
    return this.commandHandlers
      .flatMap((handler) => handler.getDefinitions())
      .map((definition) => ({
        command: definition.command,
        description: definition.description,
        requiredParameters: definition.requiredParameters,
        optionalParameters: definition.optionalParameters,
      }));
  }

  async suggestCompletions(partialText: string): Promise<string[]> {
    const normalizedPartial = partialText.trim().toLowerCase();

    if (!normalizedPartial) {
      return [
        'create session',
        'list simulators',
        'install app',
        'launch app',
        'terminate session',
      ];
    }

    const suggestions = new Set<string>();

    for (const handler of this.commandHandlers) {
      for (const definition of handler.getDefinitions()) {
        if (definition.command.toLowerCase().includes(normalizedPartial)) {
          suggestions.add(definition.command);
        }

        for (const example of definition.examples) {
          if (example.toLowerCase().includes(normalizedPartial)) {
            suggestions.add(example);
          }
        }
      }
    }

    return Array.from(suggestions).slice(0, 5);
  }

  mapToolCallToCommand(toolCall: string) {
    const commandList = this.commandHandlers.flatMap(
      (handler) => handler.definitions
    );
    const command = commandList.find(
      (command) => command.toolName === toolCall
    );
    // Look for exact match
    if (command) {
      return command.commandType;
    }

    // If no match found, throw error
    throw new Error(
      `mapToolCallToCommand: Could not map command "${toolCall}" to a CommandType`
    );
  }
}

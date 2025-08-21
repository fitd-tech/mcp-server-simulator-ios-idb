// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: Apache-2.0

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

// Export implementations
import { IDBManager } from '../idb/IDBManager.js';
import { NLParser } from '../parser/NLParser.js';
import { MCPOrchestrator } from '../orchestrator/MCPOrchestrator.js';
import { CommandResult } from '../orchestrator/interfaces/IOrchestratorCommand.js';
import { logToFile, slugify } from '../utils/utlities.js';
import { CommandDefinition } from '../parser/commands/BaseCommandDefinition.js';

interface Response {
  content: [
    {
      type: string;
      text: string;
    },
  ];
  isError?: boolean;
  // These two lines are required by the setRequestHandler callback return, but not sure the the type yet
  tools?: Tool[];
  [x: string]: unknown;
}

interface ToolInputProperty {
  type: string;
  description: string;
  enum?: string[];
}

function generateResponse(
  responseMessage: CommandResult | Error | string,
  isError?: boolean
) {
  const responseText = isError
    ? `Error: ${responseMessage instanceof Error ? responseMessage.message : String(responseMessage)}`
    : JSON.stringify(responseMessage);
  const response: Response = {
    content: [
      {
        type: 'text',
        text: responseText,
      },
    ],
  };
  if (isError) {
    response.isError = true;
  }
  return response;
}

/**
 * Create a complete MCP Server instance
 * @returns Object with all necessary instances
 */
export function createMCPServer() {
  // Create instances
  const idbManager = new IDBManager();
  const parser = new NLParser();
  const orchestrator = new MCPOrchestrator(parser, idbManager);

  return {
    idbManager,
    parser,
    orchestrator,
  };
}

/**
 * MCP Server implementation for iOS simulator
 */
class MCPSimulatorServer {
  private server: Server;
  private orchestrator: ReturnType<typeof createMCPServer>['orchestrator'];
  private parser: ReturnType<typeof createMCPServer>['parser'];
  private commandList: CommandDefinition[];

  constructor() {
    // Create component instances
    const { orchestrator, parser } = createMCPServer();

    this.orchestrator = orchestrator;
    this.parser = parser;
    this.commandList = parser.commandRegistry.commandHandlers
      .flatMap((command) => command.definitions)
      .map((command) => {
        command.toolName = slugify(command.command);
        return command;
      })
      .filter((command) => command.commandType);

    // Create MCP server
    this.server = new Server(
      {
        name: 'iOS Simulator MCP Server',
        version: '1.0.1',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // Register tools
    this.registerResourceHandlers();
    this.registerToolHandlers();

    // Handle errors
    this.server.onerror = (error) => {
      logToFile(`MCP server error: ${error}`, 'error');
    };

    // Handle termination signals
    process.on('SIGINT', async () => {
      await this.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.close();
      process.exit(0);
    });
  }

  generateToolSchema(command: CommandDefinition) {
    function generateInputSchemaPoperties(
      requiredParameters,
      optionalParameters
    ) {
      const parameters = [...requiredParameters, ...optionalParameters];

      let properties: Record<string, ToolInputProperty> = {};
      if (!parameters.length) {
        properties.instruction = {
          type: 'string',
          description:
            'This is a placeholder property for schema purposes. This tool has no properties.',
        };
      }

      parameters.forEach((parameter) => {
        const parameterType = command.parameterTypes?.[parameter];
        const parameterDescription = command.parameterDescriptions?.[parameter]

        if (Array.isArray(parameterType)) {
          properties[parameter] = {
            type: 'string',
            description: 'Choose the relevant value.',
            enum: parameterType as unknown as string[],
          };
        }

        switch (parameterType) {
          case 'string':
            properties[parameter] = {
              type: 'string',
              description: parameterDescription || 'Provide the relevant value.',
            };
            break;
          case 'number':
            properties[parameter] = {
              type: 'number',
              description: parameterDescription || 'Provide the relevant value.',
            };
            break;
          case 'number-array':
            properties[parameter] = {
              type: 'array',
              description: parameterDescription || 'Provide an array of numbers.',
            };
            break;
          case 'string-array':
            properties[parameter] = {
              type: 'array',
              description: parameterDescription || 'Provide an array of strings.',
            };
            break;
          case 'time-string':
            properties[parameter] = {
              type: 'string',
              description:
                parameterDescription || 'Provide a time string such as: 1m (1 minute), or 30s (30 seconds).',
            };
            break;
          case 'boolean':
            properties[parameter] = {
              type: 'boolean',
              description: parameterDescription || 'Provide the relevant value in lowercase.',
            };
            break;
          default:
            properties[parameter] = {
              type: 'string',
              description:
                parameterDescription || 'Report this to the user. This is a bug in the MCP tools definition.',
            };
        }
      });

      return properties;
    }

    return (
      command && {
        name: slugify(command.command),
        title: command.command,
        description: command.description,
        inputSchema: {
          type: 'object',
          properties: generateInputSchemaPoperties(
            command.requiredParameters,
            command.optionalParameters
          ),
          required: command.requiredParameters,
        },
      }
    );
  }

  /**
   * Register MCP server tools and resources
   */

  private registerResourceHandlers() {
    this.server.setRequestHandler(
      ListResourcesRequestSchema,
      async (request) => {
        return {
          resources: [
            {
              uri: 'https://fbidb.io/docs/commands',
              name: 'idb-command-documentation',
              title: 'idb Command Documentation',
              description:
                'These idb commands are used by the MCP server to interact with the simulator.',
              mimeType: 'text/html',
            },
          ],
        };
      }
    );

    this.server.setRequestHandler(ListToolsRequestSchema, async (request) => ({
      uri: 'https://fbidb.io/docs/commands',
      name: 'idb-command-documentation',
      title: 'idb Command Documentation',
      mimeType: 'text/html',
    }));
  }

  private registerToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async (request) => {
      return {
        tools: [
          ...this.commandList.map((command) =>
            this.generateToolSchema(command)
          ),
        ],
      };
    });

    // Main tool for processing MCP tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const result = await this.orchestrator.processAgentToolCall(
          this.parser,
          request.params
        );

        return generateResponse(result);
      } catch (error) {
        const _error = error as unknown as string | Error;
        logToFile(`Error processing instruction: ${error}`, 'error');

        return generateResponse(_error, true);
      }
    });
  }

  /**
   * Start the MCP server with stdio transport
   */
  async start() {
    logToFile('Starting MCP server with stdio transport');

    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      logToFile('MCP server started successfully');
    } catch (error) {
      logToFile(`Error starting MCP server: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Close the MCP server
   */
  async close() {
    logToFile('Closing MCP server');

    try {
      await this.server.close();
      logToFile('MCP server closed successfully');
    } catch (error) {
      logToFile(`Error closing MCP server: ${error}`, 'error');
    }
  }
}

// Export a server instance
export default new MCPSimulatorServer();

// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: Apache-2.0

import { CommandType } from '../../orchestrator/interfaces/IOrchestratorCommand.js';
import {
  BaseCommandDefinition,
  CommandDefinition,
} from './BaseCommandDefinition.js';

export class SimulatorCommands extends BaseCommandDefinition {
  definitions: CommandDefinition[] = [
    {
      command: 'create session',
      commandType: CommandType.CREATE_SIMULATOR_SESSION,
      patterns: [
        /crear\s+(una\s+)?sesión(\s+de\s+simulador)?(\s+con\s+(?<deviceName>[^,]+))?/i,
        /iniciar\s+(un\s+)?simulador(\s+(?<deviceName>[^,]+))?/i,
        /create\s+(a\s+)?session(\s+with\s+(?<deviceName>[^,]+))?/i,
        /start\s+(a\s+)?simulator(\s+(?<deviceName>[^,]+))?/i,
        /launch\s+(a\s+)?simulator(\s+(?<deviceName>[^,]+))?/i,
      ],
      description: 'Creates a new simulator session',
      requiredParameters: [],
      optionalParameters: ['deviceName', 'platformVersion', 'autoboot'],
      examples: [
        'crear sesión',
        'crear una sesión de simulador',
        'iniciar simulador iPhone 12',
        'create session with iPhone 12',
        'start simulator iPhone 13',
      ],
      parameterExtractors: {
        deviceName: (match) => match.groups?.deviceName?.trim(),
      },
      parameterTypes: {
        deviceName: 'string', // DEV: This could be an enum with discrete device names, but this works for now
        platformVersion: 'string',
        autoboot: 'boolean',
      },
    },
    {
      command: 'end session',
      commandType: CommandType.TERMINATE_SIMULATOR_SESSION,
      patterns: [
        /terminar\s+(la\s+)?sesión/i,
        /cerrar\s+(el\s+)?simulador/i,
        /end\s+(the\s+)?session/i,
        /close\s+(the\s+)?simulator/i,
        /terminate\s+(the\s+)?session/i,
      ],
      description: 'Ends the current simulator session',
      requiredParameters: [],
      optionalParameters: ['sessionId'],
      examples: [
        'terminar sesión',
        'cerrar simulador',
        'end session',
        'close simulator',
        'terminate session',
      ],
      parameterExtractors: {},
      parameterTypes: {
        sessionId: 'string',
      },
    },
    {
      command: 'list simulators',
      commandType: CommandType.LIST_AVAILABLE_SIMULATORS,
      patterns: [
        /listar\s+(los\s+)?simuladores/i,
        /mostrar\s+(los\s+)?simuladores/i,
        /qué\s+simuladores\s+(hay|están\s+disponibles)/i,
        /list\s+(all\s+)?simulators/i,
        /show\s+(all\s+)?simulators/i,
        /display\s+(all\s+)?simulators/i,
      ],
      description: 'Lists available simulators',
      requiredParameters: [],
      optionalParameters: [],
      examples: [
        'listar simuladores',
        'mostrar simuladores',
        'qué simuladores hay',
        'list simulators',
        'show all simulators',
        'display simulators',
      ],
      parameterExtractors: {},
    },
    {
      command: 'list booted simulators',
      commandType: CommandType.LIST_BOOTED_SIMULATORS,
      patterns: [
        /listar\s+(los\s+)?simuladores\s+arrancados/i,
        /mostrar\s+(los\s+)?simuladores\s+arrancados/i,
        /qué\s+simuladores\s+están\s+arrancados/i,
        /list\s+(all\s+)?booted\s+simulators/i,
        /show\s+running\s+simulators/i,
        /display\s+active\s+simulators/i,
      ],
      description: 'Lists booted simulators',
      requiredParameters: [],
      optionalParameters: [],
      examples: [
        'listar simuladores arrancados',
        'mostrar simuladores arrancados',
        'qué simuladores están arrancados',
        'list booted simulators',
        'show running simulators',
        'display active simulators',
      ],
      parameterExtractors: {},
    },
    {
      command: 'boot simulator',
      commandType: CommandType.BOOT_SIMULATOR,
      patterns: [
        /arrancar\s+(el\s+)?simulador\s+(?<udid>[a-zA-Z0-9-]+)/i,
        /bootear\s+(el\s+)?simulador\s+(?<udid>[a-zA-Z0-9-]+)/i,
        /boot\s+(the\s+)?simulator\s+(?<udid>[a-zA-Z0-9-]+)/i,
        /start\s+(the\s+)?simulator\s+(?<udid>[a-zA-Z0-9-]+)/i,
      ],
      description: 'Boots a simulator by its UDID',
      requiredParameters: ['udid'],
      optionalParameters: [],
      examples: [
        'arrancar simulador 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
        'bootear simulador 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
        'boot simulator 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
        'start simulator 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
      ],
      parameterExtractors: {
        udid: (match) => match.groups?.udid?.trim(),
      },
      parameterTypes: {
        udid: 'string',
      },
    },
    {
      command: 'shutdown simulator',
      commandType: CommandType.SHUTDOWN_SIMULATOR,
      patterns: [
        /apagar\s+(el\s+)?simulador\s+(?<udid>[a-zA-Z0-9-]+)/i,
        /shutdown\s+(el\s+)?simulador\s+(?<udid>[a-zA-Z0-9-]+)/i,
        /shutdown\s+(the\s+)?simulator\s+(?<udid>[a-zA-Z0-9-]+)/i,
        /turn\s+off\s+(the\s+)?simulator\s+(?<udid>[a-zA-Z0-9-]+)/i,
      ],
      description: 'Shuts down a simulator by its UDID',
      requiredParameters: ['udid'],
      optionalParameters: [],
      examples: [
        'apagar simulador 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
        'shutdown simulador 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
        'shutdown simulator 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
        'turn off simulator 5A321B8F-4D85-4267-9F79-2F5C91D142C2',
      ],
      parameterExtractors: {
        udid: (match) => match.groups?.udid?.trim(),
      },
      parameterTypes: {
        udid: 'string',
      },
    },
    {
      command: 'focus simulator',
      commandType: CommandType.FOCUS_SIMULATOR,
      patterns: [
        /enfocar\s+(el\s+)?simulador/i,
        /focus\s+(el\s+)?simulador/i,
        /traer\s+(el\s+)?simulador\s+al\s+frente/i,
        /focus\s+(the\s+)?simulator/i,
        /bring\s+(the\s+)?simulator\s+to\s+front/i,
      ],
      description: 'Focuses the simulator window',
      requiredParameters: [],
      optionalParameters: ['sessionId'],
      examples: [
        'enfocar simulador',
        'focus simulador',
        'traer simulador al frente',
        'focus simulator',
        'bring simulator to front',
      ],
      parameterExtractors: {},
      parameterTypes: {
        sessionId: 'string',
      },
    },
    {
      command: 'is simulator booted',
      commandType: CommandType.IS_SIMULATOR_BOOTED,
      patterns: [],
      description: 'Checks if a simulator is booted',
      requiredParameters: [],
      optionalParameters: ['sessionId'],
      examples: [],
      parameterExtractors: {},
      parameterTypes: {
        sessionId: 'string',
      },
    },
  ];
}

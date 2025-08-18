// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: Apache-2.0

import { CommandType } from '../../orchestrator/interfaces/IOrchestratorCommand.js';
import {
  BaseCommandDefinition,
  CommandDefinition,
} from './BaseCommandDefinition.js';

export class AppCommands extends BaseCommandDefinition {
  definitions: CommandDefinition[] = [
    {
      command: 'install app',
      commandType: CommandType.INSTALL_APP,
      patterns: [
        /instalar\s+(la\s+)?app(\s+en\s+la\s+ruta)?\s+(?<appPath>[^\s,]+)/i,
        /instalar\s+(la\s+)?aplicación(\s+en\s+la\s+ruta)?\s+(?<appPath>[^\s,]+)/i,
        /install\s+(the\s+)?app(\s+at)?\s+(?<appPath>[^\s,]+)/i,
        /install\s+(the\s+)?application(\s+at)?\s+(?<appPath>[^\s,]+)/i,
      ],
      description: 'Installs an application on the simulator',
      requiredParameters: ['appPath'],
      optionalParameters: ['sessionId'],
      examples: [
        'instalar app /ruta/a/la/app.ipa',
        'instalar la aplicación /ruta/a/la/app.app',
        'install app /path/to/app.ipa',
        'install application /path/to/app.app',
      ],
      parameterExtractors: {
        appPath: (match) => match.groups?.appPath?.trim(),
      },
      parameterTypes: {
        appPath: 'string',
        sessionId: 'string',
      },
    },
    {
      command: 'launch app',
      commandType: CommandType.LAUNCH_APP,
      patterns: [
        /lanzar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /abrir\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /iniciar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /launch\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /open\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /start\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
      ],
      description: 'Launches an application on the simulator',
      requiredParameters: ['bundleId'],
      optionalParameters: ['sessionId'],
      examples: [
        'lanzar app com.example.app',
        'abrir app com.apple.mobilesafari',
        'launch app com.example.app',
        'open app com.apple.mobilesafari',
      ],
      parameterExtractors: {
        bundleId: (match) => match.groups?.bundleId?.trim(),
      },
      parameterTypes: {
        bundleId: 'string',
        sessionId: 'string',
      },
    },
    {
      command: 'terminate app',
      commandType: CommandType.TERMINATE_APP,
      patterns: [
        /terminar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /cerrar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /matar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /terminate\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /close\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /kill\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
      ],
      description: 'Terminates a running application',
      requiredParameters: ['bundleId'],
      optionalParameters: ['sessionId'],
      examples: [
        'terminar app com.example.app',
        'cerrar app com.apple.mobilesafari',
        'matar app com.example.app',
        'terminate app com.example.app',
        'close app com.apple.mobilesafari',
        'kill app com.example.app',
      ],
      parameterExtractors: {
        bundleId: (match) => match.groups?.bundleId?.trim(),
      },
      parameterTypes: {
        bundleId: 'string',
        sessionId: 'string',
      },
    },
    {
      command: 'uninstall app',
      commandType: CommandType.UNINSTALL_APP,
      patterns: [
        /desinstalar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /eliminar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /borrar\s+(la\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /uninstall\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /remove\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
        /delete\s+(the\s+)?app\s+(?<bundleId>[^\s,]+)/i,
      ],
      description: 'Uninstalls an application',
      requiredParameters: ['bundleId'],
      optionalParameters: ['sessionId'],
      examples: [
        'desinstalar app com.example.app',
        'eliminar app com.apple.mobilesafari',
        'borrar app com.example.app',
        'uninstall app com.example.app',
        'remove app com.apple.mobilesafari',
        'delete app com.example.app',
      ],
      parameterExtractors: {
        bundleId: (match) => match.groups?.bundleId?.trim(),
      },
      parameterTypes: {
        bundleId: 'string',
        sessionId: 'string',
      },
    },
    {
      command: 'list apps',
      commandType: CommandType.LIST_APPS,
      patterns: [
        /listar\s+(las\s+)?apps/i,
        /mostrar\s+(las\s+)?apps/i,
        /qué\s+apps\s+(hay|están\s+instaladas)/i,
        /list\s+(the\s+)?apps/i,
        /show\s+(the\s+)?apps/i,
        /what\s+apps\s+(are\s+there|are\s+installed)/i,
      ],
      description: 'Lists installed applications',
      requiredParameters: [],
      optionalParameters: ['sessionId'],
      examples: [
        'listar apps',
        'mostrar apps',
        'qué apps hay',
        'list apps',
        'show apps',
        'what apps are installed',
      ],
      parameterExtractors: {},
      parameterTypes: {
        sessionId: 'string',
      },
    },
    {
      command: 'is app installed',
      commandType: CommandType.IS_APP_INSTALLED,
      patterns: [],
      description: 'Checks if an app is installed',
      requiredParameters: ['bundleId'],
      optionalParameters: ['sessionId'],
      examples: [],
      parameterExtractors: {
        bundleId: (match) => match.groups?.bundleId?.trim(),
      },
      parameterTypes: {
        bundleId: 'string',
        sessionId: 'string',
      },
    },
  ];
}

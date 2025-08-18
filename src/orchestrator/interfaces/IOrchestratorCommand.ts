// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: Apache-2.0

/**
 * IOrchestratorCommand - Interface for orchestrator commands
 *
 * This interface defines the structure of commands that the orchestrator
 * can handle and execute through the IDBManager.
 */

// DEV: Remove tools from the MCP tool list by setting enum values to an empty string here.
export enum CommandType {
  // Accessbility commands
  DESCRIBE_ELEMENTS = '', // 'describeElements',
  DESCRIBE_POINT = '', // 'describePoint',

  // Application management commands
  INSTALL_APP = 'installApp',
  LAUNCH_APP = 'launchApp',
  TERMINATE_APP = 'terminateApp',
  UNINSTALL_APP = '', // 'uninstallApp',
  LIST_APPS = 'listApps',
  IS_APP_INSTALLED = 'isAppInstalled',

  // Capture and logging commands
  TAKE_SCREENSHOT = 'takeScreenshot',
  RECORD_VIDEO = '', // 'recordVideo',
  STOP_RECORDING = '', // 'stopRecording',
  GET_SYSTEM_LOGS = 'getSystemLogs',
  GET_APP_LOGS = 'getAppLogs',

  // Debug commands
  START_DEBUG = '', // 'startDebug',
  STOP_DEBUG = '', // 'stopDebug',
  DEBUG_STATUS = 'debugStatus',
  LIST_CRASH_LOGS = 'listCrashLogs',
  SHOW_CRASH_LOG = 'showCrashLog',
  DELETE_CRASH_LOGS = 'deleteCrashLogs',

  // Simulator management commands
  CREATE_SIMULATOR_SESSION = 'createSimulatorSession',
  TERMINATE_SIMULATOR_SESSION = 'terminateSimulatorSession',
  LIST_AVAILABLE_SIMULATORS = 'listAvailableSimulators',
  LIST_BOOTED_SIMULATORS = 'listBootedSimulators',
  BOOT_SIMULATOR = 'bootSimulator',
  SHUTDOWN_SIMULATOR = 'shutdownSimulator',
  FOCUS_SIMULATOR = 'focusSimulator',
  IS_SIMULATOR_BOOTED = 'isSimulatorBooted',

  // UI interaction commands
  TAP = 'tap',
  SWIPE = 'swipe',
  PRESS_DEVICE_BUTTON = 'pressDeviceButton',
  INPUT_TEXT = 'inputText',
  PRESS_KEY = 'pressKey',
  PRESS_KEY_SEQUENCE = 'pressKeySequence',

  // Misc commands
  INSTALL_DYLIB = 'installDylib',
  OPEN_URL = 'openUrl',
  CLEAR_KEYCHAIN = 'clearKeychain',
  SET_LOCATION = 'setLocation',
  ADD_MEDIA = 'addMedia',
  APPROVE_PERMISSIONS = 'approvePermissions',
  UPDATE_CONTACTS = 'updateContacts',

  // Composite commands
  SEQUENCE = 'sequence',
  CONDITIONAL = 'conditional',
}

export interface CommandResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
}

export interface CommandContext {
  sessionId?: string;
  previousResults?: Record<string, CommandResult>;
  variables?: Record<string, any>;
}

export interface IOrchestratorCommand {
  /**
   * Command type
   */
  type: CommandType;

  /**
   * Command-specific parameters
   */
  parameters: Record<string, any>;

  /**
   * Unique command ID
   */
  id: string;

  /**
   * Human-readable command description
   */
  description?: string;

  /**
   * Maximum execution time in milliseconds
   */
  timeout?: number;

  /**
   * Number of retries in case of failure
   */
  retries?: number;

  /**
   * Parameter validation function
   */
  validate?: (context: CommandContext) => Promise<boolean>;

  /**
   * Parameter transformation function before execution
   */
  transformParameters?: (
    context: CommandContext
  ) => Promise<Record<string, any>>;

  /**
   * Custom error handling function
   */
  onError?: (error: Error, context: CommandContext) => Promise<CommandResult>;
}

/**
 * Sequence command that executes multiple commands in order
 */
export interface SequenceCommand extends IOrchestratorCommand {
  type: CommandType.SEQUENCE;
  parameters: {
    commands: IOrchestratorCommand[];
    stopOnError?: boolean;
  };
}

/**
 * Conditional command that executes one command or another based on a condition
 */
export interface ConditionalCommand extends IOrchestratorCommand {
  type: CommandType.CONDITIONAL;
  parameters: {
    condition: (context: CommandContext) => Promise<boolean>;
    ifTrue: IOrchestratorCommand;
    ifFalse?: IOrchestratorCommand;
  };
}

/**
 * Command factory to create IOrchestratorCommand instances
 */
export interface CommandFactory {
  createCommand(
    type: CommandType,
    parameters: Record<string, any>,
    description?: string
  ): IOrchestratorCommand;
  createSequence(
    commands: IOrchestratorCommand[],
    stopOnError?: boolean
  ): SequenceCommand;
  createConditional(
    condition: (context: CommandContext) => Promise<boolean>,
    ifTrue: IOrchestratorCommand,
    ifFalse?: IOrchestratorCommand
  ): ConditionalCommand;
}

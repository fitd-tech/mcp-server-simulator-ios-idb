// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: Apache-2.0

import {
  CommandType,
  IOrchestratorCommand,
  CommandResult,
} from '../orchestrator/interfaces/IOrchestratorCommand.js';
import { IIDBManager } from '../idb/interfaces/IIDBManager.js';

/**
 * Adapter that converts orchestrator commands into IDBManager calls
 */
export class OrchestratorToIDB {
  private idbManager: IIDBManager;

  /**
   * Constructor
   * @param idbManager IDBManager instance to execute commands
   */
  constructor(idbManager: IIDBManager) {
    this.idbManager = idbManager;
  }

  /**
   * Executes an orchestrator command using IDBManager
   * @param command Command to execute
   * @param sessionId Simulator session ID (optional)
   * @returns Execution result
   */
  public async executeCommand(
    command: IOrchestratorCommand,
    sessionId?: string
  ): Promise<CommandResult> {
    try {
      const startTime = Date.now();
      let result: any;

      // Execute command based on its type
      switch (command.type) {
        // Accessibility commands
        case CommandType.DESCRIBE_ELEMENTS:
          result = await this.idbManager.describeAllElements?.(
            command.parameters.sessionId || sessionId || '',
          );
          break;

        case CommandType.DESCRIBE_POINT:
          await this.idbManager.describePointElement?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.x,
            command.parameters.y
          );
          result = { bundleId: command.parameters.bundleId };
          break;

        // Application management commands
        case CommandType.INSTALL_APP:
          result = await this.idbManager.installApp(
            command.parameters.sessionId || sessionId || '',
            command.parameters.appPath
          );
          break;

        case CommandType.LAUNCH_APP:
          await this.idbManager.launchApp(
            command.parameters.sessionId || sessionId || '',
            command.parameters.bundleId
          );
          result = { bundleId: command.parameters.bundleId };
          break;

        case CommandType.TERMINATE_APP:
          await this.idbManager.terminateApp(
            command.parameters.sessionId || sessionId || '',
            command.parameters.bundleId
          );
          result = { bundleId: command.parameters.bundleId };
          break;

        case CommandType.LIST_APPS:
          result = await this.idbManager.listApps?.(
            // TODO: TS linter says these methods could be undefined - look closer at IIDBManager
            command.parameters.sessionId || sessionId || ''
          );
          break;

        case CommandType.IS_APP_INSTALLED:
          result = await this.idbManager.isAppInstalled(
            command.parameters.sessionId || sessionId || '',
            command.parameters.bundleId
          );
          break;

        // Capture and logging commands
        case CommandType.TAKE_SCREENSHOT:
          result = await this.idbManager.takeScreenshot(
            command.parameters.sessionId || sessionId || '',
            command.parameters.outputPath
          );
          break;

        case CommandType.GET_SYSTEM_LOGS:
          result = await this.idbManager.getSystemLogs(
            command.parameters.sessionId || sessionId || '',
            undefined,
            command.parameters.timeout
          );
          break;

        case CommandType.GET_APP_LOGS:
          result = await this.idbManager.getAppLogs(
            command.parameters.sessionId || sessionId || '',
            command.parameters.bundleId,
            command.parameters.timeout
          );
          break;

        // Debug commands
        case CommandType.DEBUG_STATUS:
          result = await this.idbManager.getDebugServerStatus?.(
            command.parameters.sessionId || sessionId || ''
          );
          break;

        case CommandType.LIST_CRASH_LOGS:
          result = await this.idbManager.listCrashLogs?.(
            command.parameters.sessionId || sessionId || '',
            { bundleId: command.parameters.bundleId }
          );
          break;

        case CommandType.SHOW_CRASH_LOG:
          result = await this.idbManager.getCrashLog?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.crashName
          );
          break;

        case CommandType.DELETE_CRASH_LOGS:
          result = await this.idbManager.deleteCrashLogs?.(
            command.parameters.sessionId || sessionId || '',
            {
              bundleId: command.parameters.bundleId,
              all: command.parameters.all,
            }
          );
          break;

        // Simulator management commands
        case CommandType.CREATE_SIMULATOR_SESSION:
          result = await this.idbManager.createSimulatorSession(
            command.parameters
          );
          break;

        case CommandType.TERMINATE_SIMULATOR_SESSION:
          await this.idbManager.terminateSimulatorSession(
            command.parameters.sessionId || sessionId || ''
          );
          result = { sessionId: command.parameters.sessionId || sessionId };
          break;

        case CommandType.LIST_AVAILABLE_SIMULATORS:
          result = await this.idbManager.listAvailableSimulators();
          break;

        case CommandType.LIST_BOOTED_SIMULATORS:
          result = await this.idbManager.listBootedSimulators();
          break;

        case CommandType.BOOT_SIMULATOR:
          await this.idbManager.bootSimulatorByUDID(command.parameters.udid);
          result = { udid: command.parameters.udid };
          break;

        case CommandType.SHUTDOWN_SIMULATOR:
          if (command.parameters.udid) {
            await this.idbManager.shutdownSimulatorByUDID(
              command.parameters.udid
            );
            result = { udid: command.parameters.udid };
          } else {
            await this.idbManager.shutdownSimulator(
              command.parameters.sessionId || sessionId || ''
            );
            result = { sessionId: command.parameters.sessionId || sessionId };
          }
          break;

        case CommandType.FOCUS_SIMULATOR:
          await this.idbManager.focusSimulator?.(
            command.parameters.sessionId || sessionId || ''
          );
          result = { sessionId: command.parameters.sessionId || sessionId };
          break;

        case CommandType.IS_SIMULATOR_BOOTED:
          result = await this.idbManager.isSimulatorBooted(
            command.parameters.sessionId || sessionId || ''
          );
          break;

        // UI interaction commands
        case CommandType.TAP:
          await this.idbManager.tap(
            command.parameters.sessionId || sessionId || '',
            command.parameters.x,
            command.parameters.y
          );
          result = { x: command.parameters.x, y: command.parameters.y };
          break;

        case CommandType.SWIPE:
          await this.idbManager.swipe(
            command.parameters.sessionId || sessionId || '',
            command.parameters.startX,
            command.parameters.startY,
            command.parameters.endX,
            command.parameters.endY
            // command.parameters.duration
          );
          result = {
            startX: command.parameters.startX,
            startY: command.parameters.startY,
            endX: command.parameters.endX,
            endY: command.parameters.endY,
          };
          break;

        case CommandType.PRESS_DEVICE_BUTTON:
          await this.idbManager.pressButton?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.button,
            command.parameters.duration
          );
          result = {
            button: command.parameters.button,
            duration: command.parameters.duration,
          };
          break;

        case CommandType.INPUT_TEXT:
          await this.idbManager.inputText?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.text
          );
          result = { text: command.parameters.text };
          break;

        case CommandType.PRESS_KEY:
          await this.idbManager.pressKey?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.keyCode,
            command.parameters.duration
          );
          result = {
            keyCode: command.parameters.keyCode,
            duration: command.parameters.duration,
          };
          break;

        case CommandType.PRESS_KEY_SEQUENCE:
          await this.idbManager.pressKeySequence?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.keyCodes
          );
          result = { keyCodes: command.parameters.keyCodes };
          break;

        // Misc commands
        case CommandType.INSTALL_DYLIB:
          await this.idbManager.inputText?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.dylibPath
          );
          result = { dylibPath: command.parameters.dylibPath };
          break;

        case CommandType.OPEN_URL:
          await this.idbManager.openUrl?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.url
          );
          result = { url: command.parameters.url };
          break;

        case CommandType.CLEAR_KEYCHAIN:
          await this.idbManager.clearKeychain?.(
            command.parameters.sessionId || sessionId || ''
          );
          result = { sessionId: command.parameters.sessionId };
          break;

        case CommandType.SET_LOCATION:
          await this.idbManager.setLocation?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.latitude,
            command.parameters.longitude
          );
          result = {
            latitude: command.parameters.latitude,
            longitude: command.parameters.longitude,
          };
          break;

        case CommandType.ADD_MEDIA:
          await this.idbManager.addMedia?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.mediaPaths
          );
          result = { mediaPaths: command.parameters.mediaPaths };
          break;

        case CommandType.APPROVE_PERMISSIONS:
          await this.idbManager.approvePermissions?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.bundleId,
            command.parameters.permissions
          );
          result = {
            bundleId: command.parameters.bundleId,
            permissions: command.parameters.permissions,
          };
          break;

        case CommandType.UPDATE_CONTACTS:
          await this.idbManager.updateContacts?.(
            command.parameters.sessionId || sessionId || '',
            command.parameters.dbPath
          );
          result = { dbPath: command.parameters.dbPath };
          break;

        default:
          throw new Error(`Unsupported command type: ${command.type}`);
      }

      // Create and return the result
      return {
        success: true,
        data: result,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      // Handle errors
      console.error(`Error executing command ${command.type}:`, error);

      // If there's a custom error handler, use it
      if (command.onError) {
        return command.onError(error, { sessionId });
      }

      // Return error result
      return {
        success: false,
        error: error.message || 'Unknown error',
        timestamp: Date.now(),
      };
    }
  }
}

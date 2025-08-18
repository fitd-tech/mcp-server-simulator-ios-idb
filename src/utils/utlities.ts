import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Log configuration
// Get the directory name using ESM approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up two levels from the src/mcp directory to the project root
const logsDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Function to write logs to file without using console
export const logToFile = (message: string, level: string = 'info') => {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(path.join(logsDir, 'mcp-server.log'), logMessage);
  } catch (error) {
    // Not much we can do if logging fails
  }
};

export function slugify(text: string) {
  const newText = text.replaceAll(' ', '-');
  return newText;
}

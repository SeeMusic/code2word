const fs = require('fs');
const path = require('path');

/**
 * 创建日志记录器
 * @param {Object} options - 日志选项
 * @param {string} options.logDir - 日志目录
 * @param {boolean} options.enableConsole - 是否同时输出到控制台
 * @returns {Object} 日志记录器对象
 */
function createLogger({ logDir = 'logs', enableConsole = true } = {}) {
  // 确保日志目录存在
  const logPath = path.resolve(process.cwd(), logDir);
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }

  const logFile = path.join(logPath, `${new Date().toISOString().split('T')[0]}.log`);

  /**
   * 写入日志
   * @param {string} level - 日志级别
   * @param {string} message - 日志消息
   * @param {Error} [error] - 错误对象
   */
  function writeLog(level, message, error = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${level}: ${message}`;

    if (error) {
      logMessage += `\n  ${error.stack || error.message}`;
    }

    logMessage += '\n';

    // 写入文件
    fs.appendFileSync(logFile, logMessage);

    // 输出到控制台
    if (enableConsole) {
      const consoleMessage = `${level}: ${message}`;
      switch (level) {
        case 'ERROR':
          console.error(consoleMessage);
          break;
        case 'WARN':
          console.warn(consoleMessage);
          break;
        default:
          console.log(consoleMessage);
      }
    }
  }

  return {
    info: (message) => writeLog('INFO', message),
    warn: (message) => writeLog('WARN', message),
    error: (message, error) => writeLog('ERROR', message, error),
    debug: (message) => writeLog('DEBUG', message),
  };
}

module.exports = createLogger;

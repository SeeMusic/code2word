const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const getIgnoreConfig = require('./config/ignore');

/**
 * 创建基于 cloc 的代码统计器
 */
function createCounter() {
  // 优先使用本地安装的 cloc
  let clocCommand;
  const localClocPath = path.join(__dirname, '..', 'node_modules', '.bin', 'cloc');

  if (fs.existsSync(localClocPath)) {
    clocCommand = localClocPath;
  } else if (commandExists('cloc')) {
    // 如果本地没有安装，尝试使用全局安装的版本
    clocCommand = 'cloc';
  } else {
    throw new Error('未找到 cloc 命令，请确保已在项目中安装依赖');
  }

  /**
   * 检查命令是否存在
   * @param {string} cmd
   * @returns {boolean}
   */
  function commandExists(cmd) {
    try {
      execSync(process.platform === 'win32' ? 'where ' + cmd : 'which ' + cmd, { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 统计代码行数
   * @param {string} filePath - 要统计的目录路径
   * @returns {Object} 统计结果
   * @throws {Error} 当执行出错时抛出异常
   */
  function countLinesSync(filePath) {
    // 验证路径是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`路径不存在: ${filePath}`);
    }

    // 获取绝对路径
    const absolutePath = path.resolve(filePath);
    const { excludeDir, excludeExt } = getIgnoreConfig();

    try {
      // 处理路径中的空格
      const normalizedPath = process.platform === 'win32' ?
        `"${absolutePath}"` : // Windows 需要引号
        absolutePath.replace(/ /g, '\\ '); // Unix 使用反斜杠转义空格

      // 构建 cloc 命令
      const command = [
        clocCommand,
        normalizedPath,
        '--json',           // 输出 JSON 格式
        '--vcs=git',        // 使用 git 忽略规则
        '--by-file',        // 按文件统计
        `--exclude-dir=${excludeDir}`,  // excludeDir 已经是逗号分隔的字符串
        `--exclude-ext=${excludeExt}`,  // excludeExt 已经是逗号分隔的字符串
        '--quiet',          // 不显示进度
      ].join(' ');

      // 执行命令
      const output = execSync(command, {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10, // 10MB
      });

      // 解析 JSON 输出
      const result = JSON.parse(output);

      // 删除 header 和 SUM 字段
      delete result.header;
      delete result.SUM;

      // 转换结果格式
      const files = [];
      for (const [filePath, stats] of Object.entries(result)) {
        files.push({
          path: filePath,
          code: stats.code || 0,
          comment: stats.comment || 0,
          blank: stats.blank || 0,
        });
      }

      return files;
    } catch (err) {
      if (err.status === 1 && err.stdout) {
        // cloc 返回状态码 1 但有输出，说明是空目录
        return [];
      }
      throw new Error(`执行 cloc 命令失败: ${err.message}`);
    }
  }

  return countLinesSync;
}

// 创建计数器实例
const counter = createCounter();

/**
 * 获取指定路径的代码统计信息
 * @param {string} directoryPath - 要统计的目录路径
 * @returns {Array} 统计结果数组
 */
function getStatsByPath(directoryPath) {
  return counter(directoryPath);
}

module.exports = {
  getStatsByPath,
};

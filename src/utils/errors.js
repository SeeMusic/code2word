/**
 * 创建自定义错误
 * @param {string} name - 错误类型名称
 * @param {string} message - 错误信息
 * @param {Object} [options] - 额外选项
 * @param {string} [options.code] - 错误代码
 * @param {string} [options.solution] - 解决建议
 * @returns {Error} 错误对象
 */
function createError(name, message, options = {}) {
  const error = new Error(message);
  error.name = name;
  error.code = options.code;
  error.solution = options.solution;
  return error;
}

// 创建特定类型的错误
const createConfigError = (message, options = {}) =>
  createError('ConfigError', message, {
    code: 'CONFIG_' + (options.code || 'ERROR'),
    solution: options.solution || '请检查配置文件格式是否正确，确保所有必需字段都已设置。'
  });

const createFileSystemError = (message, options = {}) =>
  createError('FileSystemError', message, {
    code: 'FS_' + (options.code || 'ERROR'),
    solution: options.solution || '请检查文件路径是否正确，确保有足够的访问权限。'
  });

const createCountError = (message, options = {}) =>
  createError('CountError', message, {
    code: 'COUNT_' + (options.code || 'ERROR'),
    solution: options.solution || '请检查目标目录是否包含有效的源代码文件，以及是否安装了 cloc 工具。'
  });

const createDocError = (message, options = {}) =>
  createError('DocError', message, {
    code: 'DOC_' + (options.code || 'ERROR'),
    solution: options.solution || '请检查是否有足够的磁盘空间，以及输出目录的写入权限。'
  });

/**
 * 格式化错误信息
 * @param {Error} err - 错误对象
 * @returns {string} 格式化后的错误信息
 */
function formatError(err) {
  const errorCode = err.code ? `[${err.code}] ` : '';
  const solution = err.solution ? `\n解决建议：${err.solution}` : '';

  switch (err.name) {
    case 'ConfigError':
      return `配置错误 ${errorCode}${err.message}${solution}`;
    case 'FileSystemError':
      return `文件系统错误 ${errorCode}${err.message}${solution}`;
    case 'CountError':
      return `代码统计错误 ${errorCode}${err.message}${solution}`;
    case 'DocError':
      return `文档生成错误 ${errorCode}${err.message}${solution}`;
    default:
      return `未知错误 ${errorCode}${err.message}${solution}`;
  }
}

module.exports = {
  createConfigError,
  createFileSystemError,
  createCountError,
  createDocError,
  formatError,
};

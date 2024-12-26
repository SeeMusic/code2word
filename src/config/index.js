const path = require('path');
const fs = require('fs');
const defaultConfig = require('./default');
const getDefaultIgnoreConfig = require('./ignore');

function validateConfig(config) {
  if (!config.document?.creator) {
    console.error('\n错误：必须在配置文件中设置文档创建者（document.creator）');
    console.log('请复制 config/config.template.js 为 config/config.js 并设置创建者信息\n');
    process.exit(1);
  }
}

/**
 * 加载用户配置文件
 * @param {string} [configPath] - 自定义配置文件路径
 * @returns {Object} 用户配置对象
 */
function loadUserConfig(configPath) {
  // 如果指定了配置文件路径，优先使用
  if (configPath) {
    const customConfigPath = path.resolve(process.cwd(), configPath);
    try {
      if (fs.existsSync(customConfigPath)) {
        return require(customConfigPath);
      } else {
        console.error(`\n错误：指定的配置文件不存在: ${customConfigPath}\n`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`\n加载自定义配置文件失败: ${error.message}\n`);
      process.exit(1);
    }
  }

  // 默认配置文件路径
  const userConfigPath = path.join(process.cwd(), 'config', 'config.js');
  const templatePath = path.join(process.cwd(), 'config', 'config.template.js');

  try {
    if (fs.existsSync(userConfigPath)) {
      return require(userConfigPath);
    } else if (fs.existsSync(templatePath)) {
      console.log('\n提示：当前使用默认配置运行');
      console.log('建议复制 config/config.template.js 为 config/config.js 并根据需要修改配置\n');
    }
  } catch (error) {
    console.warn('加载用户配置文件失败，将使用默认配置');
    console.warn(error.message);
  }

  return {};
}

function mergeConfig(defaultConfig, userConfig) {
  const config = {
    ...defaultConfig,
    ...userConfig,
    // 深度合并特定配置
    document: {
      ...defaultConfig.document,
      ...userConfig.document,
    },
    performance: {
      ...defaultConfig.performance,
      ...userConfig.performance,
    },
  };

  validateConfig(config);
  return config;
}

// 获取最终配置
function getConfig(configPath) {
  const userConfig = loadUserConfig(configPath);
  return mergeConfig(defaultConfig, userConfig);
}

// 获取忽略规则
function getIgnoreConfig() {
  const userConfig = loadUserConfig();
  const defaultIgnore = getDefaultIgnoreConfig();

  // 如果用户配置了忽略规则，合并它们
  if (userConfig.ignore) {
    return {
      excludeDir: [
        ...new Set([
          ...(defaultIgnore.excludeDir || '').split(','),
          ...(userConfig.ignore.excludeDir || []),
        ])
      ].join(','),
      excludeExt: [
        ...new Set([
          ...(defaultIgnore.excludeExt || '').split(','),
          ...(userConfig.ignore.excludeExt || []),
        ])
      ].join(','),
    };
  }

  return defaultIgnore;
}

module.exports = {
  getConfig,
  getIgnoreConfig,
};

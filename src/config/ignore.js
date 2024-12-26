// Description: 忽略文件配置
// excludeDir: 忽略文件夹
// excludeExt: 忽略文件后缀

const path = require('path');
const fs = require('fs');

const defaultIgnoreConfig = {
  excludeDir: [
    // 版本控制
    '.git',
    '.svn',
    '.hg',

    // IDE 和编辑器
    '.idea',
    '.vscode',
    '.fleet',
    '.eclipse',
    '.settings',

    // 构建和缓存
    'build',
    'dist',
    'target',
    'out',
    'output',
    'coverage',
    '.nyc_output',

    // 依赖
    'node_modules',
    'vendor',
    'venv',
    '.env',

    // 测试
    'test',
    'tests',
    'testing',
    '__tests__',
    'testdata',
    'mocks',
    'cypress',
    'e2e',

    // 资源文件
    'assets',
    'static',
    'public',
    'images',
    'img',
    'fonts',
    'resources',
    'META-INF',
    'WEB-INF',

    // 文档和示例
    'docs',
    'examples',

    // 国际化
    'locales',
    'i18n',

    // 其他
    'temp',
    'tmp',
    'log',
    'logs',
    'migrations',
    'fixtures',
    'generated',
    'gen',
  ],
  excludeExt: [
    // 锁文件
    'lock',

    // 日志文件
    'log',

    // 文档
    'md',
    'txt',
    'pdf',
    'doc',
    'docx',

    // 配置文件
    'editorconfig',
    'prettierrc',
    'eslintrc',
    'eslintignore',
    'gitignore',
    'dockerignore',
    'properties',
    'xml',
    'yml',
    'yaml',
    'toml',
    'ini',
    'cfg',
    'conf',
    'config.js',
    'config.ts',

    // 类型声明
    'd.ts',

    // HTML 相关
    'html',
    'htm',

    // 资源文件
    'svg',
    'png',
    'jpg',
    'jpeg',
    'gif',
    'ico',
    'woff',
    'woff2',
    'ttf',
    'eot',

    // 编译文件
    'pyc',
    'pyo',
    'pyd',
    'class',
    'jar',
    'war',
    'ear',

    // 工具文件
    'mod',
    'sum',
    'gradle',
    'gradlew',
    'bat',
    'pb.go',
    'bindata.go',
    'generated.go',

    // 其他
    'zip',
    'tar',
    'gz',
    'rar',
    'iml',
    'project',
    'classpath',
    'whl',
    'egg',
    'requirements.txt',
    'Pipfile',
    'poetry.lock',
    'ipynb',
    'coverage',
    'sqlite3',
    'db',
    'xsd'
  ],
};

// 获取用户配置
function getUserConfig() {
  try {
    const userConfigPath = path.join(process.cwd(), 'config', 'config.js');
    if (fs.existsSync(userConfigPath)) {
      return require(userConfigPath);
    }
  } catch (error) {
    console.warn('加载用户配置文件失败，将使用默认配置');
    console.warn(error.message);
  }
  return {};
}

const getIgnoreConfig = () => {
  const userConfig = getUserConfig();
  const userIgnore = userConfig.ignore || {};

  // 合并默认配置和用户配置
  const merged = {
    excludeDir: [
      ...new Set([
        ...defaultIgnoreConfig.excludeDir,
        ...(userIgnore.excludeDir || []),
      ])
    ],
    excludeExt: [
      ...new Set([
        ...defaultIgnoreConfig.excludeExt,
        ...(userIgnore.excludeExt || []),
      ])
    ],
  };

  return {
    excludeDir: merged.excludeDir.join(','),
    excludeExt: merged.excludeExt.join(','),
  };
};

module.exports = getIgnoreConfig;

// 用户配置文件模板
// 将此文件复制为 config.js 并根据需要修改

/**
 * 默认已内置以下忽略规则：
 *
 * 忽略的目录包括：
 * - 版本控制: .git, .svn, .hg
 * - IDE和编辑器: .idea, .vscode, .fleet, .eclipse
 * - 构建和缓存: build, dist, target, out, coverage
 * - 依赖: node_modules, vendor, venv
 * - 测试: test, tests, __tests__, cypress, e2e
 * - 资源: assets, static, public, images, fonts
 * - 文档: docs, examples
 * - 其他: temp, logs, generated
 *
 * 忽略的文件类型包括：
 * - 文档: md, txt, pdf, doc
 * - 配置: json, yaml, xml, ini, config.js
 * - 资源: html, svg, png, jpg, ico, ttf
 * - 编译: class, jar, pyc, pyo
 * - 其他: log, lock, zip, tar
 *
 * 完整的内置规则请查看 src/config/ignore.js
 */

const config = {
  // 默认需要的代码行数，如果设置会覆盖命令行参数
  // minLines: 3000,

  // 文档配置
  document: {
    // 文档创建者，在此填写你的名字
    creator: '',
  },

  // 忽略规则配置（这里的规则会与内置规则合并）
  ignore: {
    // 要额外忽略的目录，例如：
    // excludeDir: [
    //   'my-test',
    //   'local-docs',
    // ]
    excludeDir: [
    ],
    // 要额外忽略的文件类型，例如：
    // excludeExt: [
    //   'local',
    //   'bak',
    // ]
    excludeExt: [
    ],
  },

  // 性能配置
  performance: {
    // 是否显示进度
    showProgress: true,
  },
};

module.exports = config;

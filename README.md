# Code2Word

一个智能的代码提取工具，帮助你从代码仓库中选择并提取代码，生成格式化的 Word 文档。

## 功能特点

- 🔍 智能选择代码文件
- 📊 自动统计代码行数
- 📝 生成格式化的 Word 文档
- 🎯 支持多种文件类型
- ⚙️ 高度可配置
- 🚀 基于 git 的高效处理

## 环境要求

- Node.js >= 20.10.0
- npm 或 pnpm
- Git（推荐，可以提高处理效率）

## 快速开始

### 安装

```bash
# 克隆仓库
git clone [仓库地址]
cd code2word

# 安装依赖
pnpm install  # 或 npm install
```

### 使用

```bash
# 基本用法（处理当前目录，生成至少 3000 行代码的文档）
node main.js

# 处理指定目录（必须是一个 git 仓库的根目录）
node main.js -r /path/to/project

# 预览模式（只显示将会选择的文件，不生成文档）
node main.js -d
```

## 命令参数

| 参数 | 说明 | 默认值 | 示例 |
|------|------|--------|------|
| --root, -r | 代码仓库根目录（必须是一个 git 仓库） | 当前目录 | --root=/path/to/project |
| --dry, -d | 预览模式，只打印将要选择的文件 | false | --dry |
| --config, -c | 指定配置文件路径 | config/config.js | --config=./my-config.js |
| --output, -o | 输出文件路径 | output.docx | --output=result.docx |

## 配置说明

### 配置文件

项目使用两级配置：
1. 默认配置（内置，包含常见的忽略规则和默认行数限制）
2. 用户配置（`config/config.js`）

你可以复制 `config/config.template.js` 为 `config/config.js` 并根据需要修改。

### 配置项

#### 代码行数配置
```javascript
// 默认需要的代码行数
minLines: 3000,
```

#### 文档配置
```javascript
document: {
  // 文档创建者
  creator: '你的名字',
}
```

#### 忽略规则配置
```javascript
ignore: {
  // 要额外忽略的目录
  excludeDir: [
    'my-test',
    'local-docs',
  ],
  // 要额外忽略的文件类型
  excludeExt: [
    'local',
    'bak',
  ],
}
```

#### 性能配置
```javascript
performance: {
  // 是否显示进度
  showProgress: true,
}
```

### 内置忽略规则

工具已内置了常见的忽略规则，包括：

#### 忽略的目录
- 版本控制: .git, .svn, .hg
- IDE和编辑器: .idea, .vscode, .fleet, .eclipse
- 构建和缓存: build, dist, target, out, coverage
- 依赖: node_modules, vendor, venv
- 测试: test, tests, __tests__, cypress, e2e
- 资源: assets, static, public, images, fonts
- 文档: docs, examples
- 其他: temp, logs, generated

#### 忽略的文件类型
- 文档: md, txt, pdf, doc
- 配置: json, yaml, xml, ini, config.js
- 资源: html, svg, png, jpg, ico, ttf
- 编译: class, jar, pyc, pyo
- 其他: log, lock, zip, tar

完整的内置规则请查看 `src/config/ignore.js`。

### 配置优先级

1. 命令行参数（最高优先级）
2. 用户配置文件 (`config/config.js`)
3. 默认配置（内置规则）

## 使用提示

- 建议在使用前备份重要文件
- 生成的文档默认保存为 `output.docx`
- 大型仓库处理可能需要较长时间
- 用户配置的忽略规则会与内置规则合并
- 工具使用 git 来提高处理效率，请确保目标目录是一个有效的 git 仓库
- 如果目标目录包含多个 git 仓库，请分别处理每个仓库

## 常见问题

### 文档生成失败
- 检查目录权限
- 确保目标目录存在
- 验证文件编码格式

### 代码统计不准确
- 检查忽略规则配置
- 确认文件是否被正确识别
- 确保目标目录是一个有效的 git 仓库

### 目录不是 git 仓库
- 确保在正确的目录运行命令
- 检查是否已初始化 git 仓库
- 如果目标目录包含多个仓库，请分别处理每个仓库 
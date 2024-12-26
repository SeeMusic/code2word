const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { getStatsByPath } = require('./src/lineCounter');
const findClosestFiles = require('./src/pickLines');
const createWordDocument = require('./src/generateDoc');
const { getConfig, getIgnoreConfig } = require('./src/config');
const { createFileSystemError, createCountError, createDocError, formatError } = require('./src/utils/errors');
const createLogger = require('./src/utils/logger');
const pkg = require('./package.json');

// 创建日志记录器
const logger = createLogger();

// 配置命令行选项
program
  .name('code2word')
  .description('从代码仓库中提取代码并生成 Word 文档')
  .version(pkg.version)
  .option('-r, --root <path>', '代码仓库根目录', '.')
  .option('-d, --dry', '预览模式，只显示选中的文件，不生成文档', false)
  .option('-c, --config <path>', '指定配置文件路径')
  .option('-o, --output <path>', '输出文件路径')
  .addHelpText('after', `
示例:
  $ code2word                          # 处理当前目录，生成文档
  $ code2word -r /path/to/project      # 处理指定目录
  $ code2word -d                       # 预览模式，只显示将会选择的文件
  $ code2word -c ./my-config.js        # 使用自定义配置文件
  $ code2word -o output.docx           # 指定输出文件名
  `);

program.parse();

// 获取最终配置
function getFinalConfig() {
  const options = program.opts();
  const config = getConfig(options.config);  // 传入配置文件路径
  const ignoreConfig = getIgnoreConfig();  // 获取忽略规则

  return {
    targetDirectory: path.resolve(options.root),
    minLines: config.minLines,  // 直接使用配置中的值(已经在 getConfig 中合并了默认值)
    dry: options.dry,
    outputFile: options.output || config.outputFile,
    document: config.document,
    performance: config.performance,
    ignore: ignoreConfig,  // 添加忽略规则到配置中
  };
}

// 打印统计信息
function printStats(result) {
  console.log('\n📊 统计信息：');
  console.log('----------------------------------------');
  result.selectedFiles.forEach(file => {
    console.log(`- ${file.path}`);
    console.log(`  代码：${file.code} 行, 注释：${file.comment} 行, 空行：${file.blank} 行`);
    console.log('');
  });
  console.log('📊 总计：');
  console.log(`  文件数：${result.selectedFiles.length} 个`);
  console.log(`  代码行：${result.totalCode} 行`);
  console.log(`  注释行：${result.totalComment} 行`);
  console.log(`  空行数：${result.totalBlank} 行`);
  console.log(`  预计文件行数：${result.totalCode + result.totalComment} 行`);
  console.log('----------------------------------------');
}

async function main() {
  const config = getFinalConfig();
  const directoryPath = config.targetDirectory;

  console.log('开始处理目录:', directoryPath);

  // 检查目录是否存在
  try {
    await fs.promises.access(directoryPath, fs.constants.F_OK);
    console.log('目录存在，开始统计代码...');
  } catch (err) {
    const error = createFileSystemError(`目录不存在: ${directoryPath}`);
    logger.error('访问目录失败', error);
    throw error;
  }

  // 获取代码统计信息
  let stats;
  try {
    stats = getStatsByPath(directoryPath);
    console.log('代码统计完成，找到文件数:', stats.length);
  } catch (err) {
    // 检查是否是 git 仓库错误
    if (err.message.includes('不是 git 仓库')) {
      console.error(formatError(err));
      process.exit(1);
    }
    const error = createCountError(`统计代码失败: ${err.message}`);
    logger.error('代码统计失败', error);
    throw error;
  }

  // 如果没有找到任何文件，提前退出
  if (stats.length === 0) {
    console.log('未找到任何代码文件，请检查目录和配置。');
    process.exit(0);
  }

  const result = findClosestFiles(stats, config.minLines);
  console.log('文件选择完成');

  // 打印统计信息
  printStats(result);

  // 检查总行数是否满足要求
  if (result.totalCode < config.minLines) {
    console.log('\n⚠️  警告：找到的代码行数不足');
    console.log('----------------------------------------');
    console.log(`目标行数：${config.minLines} 行`);
    console.log(`实际行数：${result.totalCode} 行`);
    console.log('----------------------------------------');
    console.log('请调整目标行数或检查代码仓库。');
    process.exit(0);
  }

  if (config.dry) {
    console.log('');
    logger.info('预览模式完成');
    return;
  }

  try {
    const message = await createWordDocument(result.selectedFiles, directoryPath);
    console.log('');  // 添加空行
    logger.info(message);
    console.log('\n⚠️  请检查这些文件是否包含敏感信息（如密码、密钥、IP等）');
  } catch (err) {
    const error = createDocError(`生成文档失败: ${err.message}`);
    logger.error('文档生成失败', error);
    throw error;
  }
}

// 运行主程序
main().catch(err => {
  console.error(formatError(err));
  process.exit(1);
});

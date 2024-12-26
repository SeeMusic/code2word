const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph } = require('docx');
const { getConfig } = require('./config');

/**
 * 处理特殊字符
 * @param {string} text - 输入文本
 * @returns {string} 处理后的文本
 */
function sanitizeText(text) {
  return text
    // 移除 BOM
    .replace(/^\uFEFF/, '')
    // 移除控制字符（除了换行和制表符）
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // 统一换行符为 \n
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * 读取文件内容
 * @param {string} filePath - 文件路径
 * @param {string} rootDir - 根目录路径
 * @returns {string[]} 非空行数组
 */
function readFileContent(filePath, rootDir) {
  const absolutePath = path.resolve(rootDir, filePath);
  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    const sanitizedContent = sanitizeText(content);
    // 分割成行并过滤掉空行
    return sanitizedContent.split('\n')
      .filter(line => line.trim().length > 0);
  } catch (error) {
    throw new Error(`读取文件失败 (${filePath}): ${error.message}`);
  }
}

/**
 * 生成 Word 文档
 * @param {Array} files - 文件信息数组
 * @param {string} rootDir - 代码仓库根目录
 * @returns {Promise<string>} 成功消息
 */
async function createWordDocument(files, rootDir) {
  const config = getConfig();

  // 收集所有段落
  const paragraphs = [];

  // 添加文件内容
  for (const file of files) {
    try {
      const lines = readFileContent(file.path, rootDir);
      // 直接添加行内容，不添加额外的空行
      paragraphs.push(...lines.map(line => new Paragraph({ text: line })));
    } catch (error) {
      console.error(`处理文件 ${file.path} 时出错:`, error.message);
      // 继续处理下一个文件
      continue;
    }
  }

  // 创建文档，直接使用收集到的段落
  const doc = new Document({
    creator: config.document.creator,
    sections: [{
      children: paragraphs
    }]
  });

  // 生成文档
  const outputPath = path.join(process.cwd(), 'output.docx');
  await Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
  });

  return 'Word 文档已生成。';
}

module.exports = createWordDocument;

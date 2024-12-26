/**
 * 使用动态规划算法选择最接近目标代码行数的文件组合
 * 只考虑实际代码行数（不包括注释和空行）
 *
 * @param {Array} files - 文件统计信息数组
 * @param {number} targetLines - 目标代码行数
 * @returns {Object} 选择结果，包含选中的文件列表和统计信息
 */
function findClosestFiles(files, targetLines) {
  // 过滤并排序文件
  const validFiles = files
    .filter(file => file.code > 0)  // 排除空文件
    .sort((a, b) => b.code - a.code);  // 按代码行数降序排序，优先考虑大文件

  const n = validFiles.length;
  if (n === 0) {
    return {
      selectedFiles: [],
      totalLines: 0,
      totalBlank: 0,
      totalComment: 0,
      totalCode: 0
    };
  }

  // 计算所有文件的总代码行数
  const totalPossibleLines = validFiles.reduce((sum, file) => sum + file.code, 0);
  if (totalPossibleLines < targetLines) {
    // 如果所有文件加起来都不够，就全部选择
    return {
      selectedFiles: validFiles,
      totalLines: validFiles.reduce((sum, file) => sum + file.blank + file.comment + file.code, 0),
      totalBlank: validFiles.reduce((sum, file) => sum + file.blank, 0),
      totalComment: validFiles.reduce((sum, file) => sum + file.comment, 0),
      totalCode: totalPossibleLines
    };
  }

  // 使用贪心算法：优先选择大文件，直到达到或超过目标行数
  const selectedFiles = [];
  let currentCode = 0;
  let i = 0;

  while (i < n && currentCode < targetLines) {
    const file = validFiles[i];
    selectedFiles.push(file);
    currentCode += file.code;
    i++;
  }

  // 计算总计信息
  const totalLines = selectedFiles.reduce((sum, file) => sum + file.blank + file.comment + file.code, 0);
  const totalBlank = selectedFiles.reduce((sum, file) => sum + file.blank, 0);
  const totalComment = selectedFiles.reduce((sum, file) => sum + file.comment, 0);
  const totalCode = selectedFiles.reduce((sum, file) => sum + file.code, 0);

  return {
    selectedFiles,
    totalLines,
    totalBlank,
    totalComment,
    totalCode
  };
}

module.exports = findClosestFiles;

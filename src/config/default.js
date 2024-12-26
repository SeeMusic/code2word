// 默认配置文件
const defaultConfig = {
  // 默认需要的代码行数
  minLines: 3000,

  // 输出文件名
  outputFile: 'output.docx',

  // 文档配置
  document: {
    // 文档创建者
    creator: '',
  },

  // 性能相关配置
  performance: {
    // 是否显示进度
    showProgress: true,
  },
};

module.exports = defaultConfig;

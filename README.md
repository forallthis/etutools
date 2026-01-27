# EtuTools Chrome Extension

> 🚀 Easy-to-use tools - 38个开发者实用工具，集成在您的浏览器中

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Tools](https://img.shields.io/badge/tools-38-green.svg)
![Size](https://img.shields.io/badge/size-295KB-orange.svg)

## ✨ 特性

- 🎨 **美观的白色主题** - 清新简洁的界面设计
- 📱 **响应式布局** - 支持Popup和Side Panel两种模式
- ⚡ **快速响应** - 即时处理，无需等待服务器
- 🔒 **完全本地** - 所有数据在本地处理，保护隐私
- 🛠️ **丰富功能** - 38个实用工具，涵盖开发、文本、时间、图片等多个领域

## 📦 工具分类

### 🔨 开发工具 (14个)

- **JSON Formatter** - 格式化和美化JSON
- **Regex Tester** - 正则表达式测试和调试
- **Hash Calculator** - 计算文件和文本的哈希值 (MD5, SHA-1, SHA-256)
- **Color Converter** - 颜色格式转换 (HEX, RGB, HSV, HSL)
- **JWT Decoder** - 解码和查看JWT Token
- **JWT Generator** - 生成自定义JWT Token
- **Cron Parser** - 解析和预览Cron表达式
- **Cron Builder** - 可视化生成Cron表达式 ⭐
- **Binary Converter** - 进制转换 (二进制/八进制/十进制/十六进制)
- **JSON Diff** - 对比两个JSON对象的差异 ⭐
- **SQL Formatter** - 格式化SQL语句 ⭐
- **XML Formatter** - 格式化XML文档 ⭐
- **YAML Converter** - YAML和JSON互转 ⭐
- **Color Picker** - 交互式颜色选择器 ⭐

### 📝 文本工具 (13个)

- **Base64** - Base64编码和解码
- **Case Converter** - 大小写转换 (大写、小写、标题格式等)
- **Text Dedup** - 文本去重和排序
- **Line Counter** - 统计行数、字符数、单词数
- **Character Frequency** - 字符和词频统计 ⭐
- **HTML Entities** - HTML实体编码和解码 ⭐
- **CSV to JSON** - CSV格式转JSON ⭐
- **Markdown Preview** - Markdown实时预览 ⭐
- **Text Diff** - 文本差异比对 ⭐
- **Number to Chinese** - 数字转中文 (含金额大写) ⭐
- **URL Tool** - URL编码和解码
- **Lorem Ipsum** - 占位文本生成器

### ⏰ 时间工具 (2个)

- **Timestamp** - Unix时间戳转换
- **Batch Timestamp** - 批量时间戳转换 ⭐

### 🖼️ 图片工具 (3个)

- **QR Code Generator** - 二维码生成器
- **QR Code Reader** - 二维码识别器 ⭐
- **Image Base64** - 图片和Base64互转

### 🔧 实用工具 (6个)

- **Password Generator** - 强密码生成器
- **UUID Generator** - UUID生成器
- **IP Converter** - IP地址和整数互转 ⭐
- **URL Parser** - URL解析器
- **MIME Type Lookup** - MIME类型查询 ⭐
- **User-Agent Parser** - 浏览器UA解析 ⭐

### 🔐 加密工具 (1个)

- **AES Encrypt/Decrypt** - AES加密和解密

## 🚀 快速开始

### 安装扩展

1. 克隆或下载此项目
2. 安装依赖: `npm install`
3. 构建项目: `npm run build`
4. 打开Chrome浏览器访问 `chrome://extensions/`
5. 开启"开发者模式"
6. 点击"加载已解压的扩展程序"
7. 选择项目的 `dist` 文件夹

详细说明请查看: [LOADING_GUIDE.md](LOADING_GUIDE.md)

### 使用扩展

- **Popup模式**: 点击浏览器工具栏的EtuTools图标
- **Side Panel模式** (Chrome 114+): 右键点击图标 → "在侧边栏中打开"

## 🧪 测试

完整的测试指南请查看: [TESTING.md](TESTING.md)

### 快速测试

1. **JSON格式化测试**
   ```
   输入: {"name":"John","age":30}
   输出: 格式化的JSON
   ```

2. **Base64编码测试**
   ```
   输入: Hello World
   输出: SGVsbG8gV29ybGQ=
   ```

3. **密码生成测试**
   ```
   点击"生成密码"按钮
   输出: 16位强密码
   ```

## 🛠️ 开发

### 项目结构

```
etutools/
├── src/
│   ├── popup/           # Popup界面
│   ├── sidepanel/       # Side Panel界面
│   ├── tools/           # 工具实现
│   │   ├── developer/    # 开发工具
│   │   ├── text/         # 文本工具
│   │   ├── time/         # 时间工具
│   │   ├── image/        # 图片工具
│   │   ├── utilities/    # 实用工具
│   │   └── encryption/   # 加密工具
│   └── utils/           # 工具函数
├── assets/              # 图标和资源
├── dist/                # 构建输出
└── manifest.json        # 扩展配置
```

### 可用命令

```bash
# 安装依赖
npm install

# 开发模式 (热重载)
npm run dev

# 构建生产版本
npm run build

# 添加新工具
npm run create-tool
```

### 添加新工具

1. 在 `src/tools/` 相应分类下创建新文件
2. 实现 `Tool` 接口
3. 在 `src/tools/index.ts` 中注册工具
4. 运行 `npm run build` 构建

## 📊 统计

- **总工具数**: 38个
- **代码行数**: ~10,000行
- **构建大小**: 295.53 kB (gzip: 87.70 kB)
- **依赖数**: 最小化依赖

## 🎯 路线图

- [ ] 添加更多实用工具
- [ ] 支持自定义主题
- [ ] 添加搜索功能
- [ ] 支持工具收藏
- [ ] 添加使用历史
- [ ] 支持导出/导入配置
- [ ] 发布到Chrome Web Store

## 🤝 贡献

欢迎提交Issue和Pull Request!

## 📄 许可证

MIT License

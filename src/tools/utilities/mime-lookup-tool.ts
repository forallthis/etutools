import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const MIMELookupTool: Tool = {
  id: 'mime-lookup',
  name: 'MIME Type Lookup',
  category: 'utilities',
  description: 'Lookup MIME types for file extensions',
  icon: '📁',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 常用MIME类型数据库
    const mimeDB: { [key: string]: string } = {
      'html': 'text/html',
      'htm': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      'txt': 'text/plain',
      'pdf': 'application/pdf',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'webp': 'image/webp',
      'bmp': 'image/bmp',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'odt': 'application/vnd.oasis.opendocument.text',
      'ods': 'application/vnd.oasis.opendocument.spreadsheet',
      'odp': 'application/vnd.oasis.opendocument.presentation',
      'exe': 'application/x-msdownload',
      'dll': 'application/x-msdownload',
      'iso': 'application/x-iso9660-image',
      'dmg': 'application/x-apple-diskimage',
      'apk': 'application/vnd.android.package-archive',
      'ipa': 'application/octet-stream',
      'deb': 'application/vnd.debian.binary-package',
      'rpm': 'application/x-rpm',
      'ttf': 'font/ttf',
      'otf': 'font/otf',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'eot': 'application/vnd.ms-fontobject',
      'csv': 'text/csv',
      'rtf': 'application/rtf',
      'md': 'text/markdown',
      'yaml': 'application/x-yaml',
      'yml': 'application/x-yaml',
      'toml': 'application/toml',
      'ini': 'text/plain',
      'conf': 'text/plain',
      'log': 'text/plain',
      'sql': 'application/sql',
      'sh': 'application/x-sh',
      'bash': 'application/x-sh',
      'php': 'application/x-httpd-php',
      'py': 'text/x-python',
      'rb': 'text/x-ruby',
      'java': 'text/x-java-source',
      'class': 'application/java-vm',
      'jar': 'application/java-archive',
      'war': 'application/java-archive',
      'c': 'text/x-c',
      'h': 'text/x-c',
      'cpp': 'text/x-c++',
      'hpp': 'text/x-c++',
      'cs': 'text/x-csharp',
      'swift': 'text/x-swift',
      'kt': 'text/x-kotlin',
      'go': 'text/x-go',
      'rs': 'text/x-rust',
      'ts': 'application/typescript',
      'tsx': 'application/typescript',
      'jsx': 'text/jsx',
      'vue': 'text/x-vue',
      'wasm': 'application/wasm',
      'graphql': 'application/graphql',
      'graphqls': 'application/graphql',
      'gql': 'application/graphql',
      'proto': 'application/x-protobuf',
      'thrift': 'application/x-thrift',
      'avro': 'application/avro'
    };

    // 搜索区域
    const searchGroup = document.createElement('div');
    searchGroup.className = 'input-output-group';

    const searchLabel = document.createElement('label');
    searchLabel.className = 'tool-label';
    searchLabel.textContent = '搜索文件扩展名:';
    searchGroup.appendChild(searchLabel);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'tool-textarea';
    searchInput.style.minHeight = 'auto';
    searchInput.placeholder = '例如: pdf, jpg, json';
    searchGroup.appendChild(searchInput);

    wrapper.appendChild(searchGroup);

    // 按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const searchBtn = document.createElement('button');
    searchBtn.className = 'btn-primary';
    searchBtn.textContent = '🔍 查找 MIME 类型';
    buttonGroup.appendChild(searchBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    clearBtn.onclick = () => {
      searchInput.value = '';
      resultDiv.innerHTML = '';
    };
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '查找结果:';
    resultGroup.appendChild(resultLabel);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'info-display';
    resultDiv.style.display = 'block';
    resultDiv.style.marginTop = '12px';
    resultDiv.style.maxHeight = '400px';
    resultDiv.style.overflow = 'auto';
    resultGroup.appendChild(resultDiv);

    wrapper.appendChild(resultGroup);

    // 常用类型展示
    const commonGroup = document.createElement('div');
    commonGroup.className = 'input-output-group';

    const commonLabel = document.createElement('label');
    commonLabel.className = 'tool-label';
    commonLabel.textContent = '常用文件类型:';
    commonGroup.appendChild(commonLabel);

    const commonList = document.createElement('div');
    commonList.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 8px; margin-top: 8px;';

    const commonTypes = [
      { ext: 'jpg', mime: 'image/jpeg' },
      { ext: 'png', mime: 'image/png' },
      { ext: 'pdf', mime: 'application/pdf' },
      { ext: 'json', mime: 'application/json' },
      { ext: 'html', mime: 'text/html' },
      { ext: 'css', mime: 'text/css' },
      { ext: 'js', mime: 'application/javascript' },
      { ext: 'zip', mime: 'application/zip' },
      { ext: 'mp4', mime: 'video/mp4' },
      { ext: 'mp3', mime: 'audio/mpeg' },
      { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    ];

    commonTypes.forEach(type => {
      const item = document.createElement('div');
      item.className = 'info-row';
      item.style.cssText = 'padding: 6px 8px; background: #f8f9fa; border-radius: 4px; cursor: pointer;';
      item.onclick = () => {
        searchInput.value = type.ext;
        search(type.ext);
      };
      
      const ext = document.createElement('span');
      ext.className = 'info-label';
      ext.textContent = '.' + type.ext;
      
      const mime = document.createElement('span');
      mime.className = 'info-value';
      mime.textContent = type.mime;
      
      item.appendChild(ext);
      item.appendChild(mime);
      commonList.appendChild(item);
    });

    commonGroup.appendChild(commonList);
    wrapper.appendChild(commonGroup);

    container.appendChild(wrapper);

    function search(ext: string) {
      errorDiv.style.display = 'none';
      resultDiv.innerHTML = '';

      const inputExt = ext.trim().toLowerCase().replace(/^\./, '');

      if (!inputExt) {
        errorDiv.textContent = '❌ 请输入文件扩展名';
        errorDiv.style.display = 'block';
        return;
      }

      const mime = mimeDB[inputExt];

      if (!mime) {
        const errorRow = document.createElement('div');
        errorRow.className = 'info-row';
        const errorValue = document.createElement('span');
        errorValue.className = 'info-value';
        errorValue.style.color = '#dc3545';
        errorValue.textContent = `❌ 未找到扩展名 ".${inputExt}" 的 MIME 类型`;
        errorRow.appendChild(errorValue);
        resultDiv.appendChild(errorRow);

        const suggestion = document.createElement('div');
        suggestion.style.cssText = 'margin-top: 12px; padding: 8px; background: #fff3cd; border-radius: 6px; font-size: 12px; color: #856404;';
        suggestion.textContent = '💡 提示: 未知类型通常使用 "application/octet-stream"';
        resultDiv.appendChild(suggestion);
        return;
      }

      // 显示结果
      const row = document.createElement('div');
      row.className = 'info-row';
      row.style.cssText = 'padding: 12px; background: #e8f4f8; border-radius: 6px;';

      const extLabel = document.createElement('span');
      extLabel.className = 'info-label';
      extLabel.textContent = '.' + inputExt;
      extLabel.style.cssText = 'font-size: 16px; font-weight: 600; color: #007acc;';

      const mimeValue = document.createElement('span');
      mimeValue.className = 'info-value';
      mimeValue.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';

      const mimeText = document.createElement('span');
      mimeText.textContent = mime;
      mimeText.style.cssText = 'font-size: 16px; font-weight: 600; color: #007acc;';
      mimeValue.appendChild(mimeText);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-secondary';
      copyBtn.style.cssText = 'padding: 6px 12px;';
      copyBtn.textContent = '📋 复制';
      copyBtn.onclick = async () => {
        await copyToClipboard(mime);
        showCopyFeedback(copyBtn);
      };
      mimeValue.appendChild(copyBtn);

      row.appendChild(extLabel);
      row.appendChild(mimeValue);
      resultDiv.appendChild(row);
    }

    searchBtn.onclick = () => {
      search(searchInput.value);
    };

    // 回车搜索
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        search(searchInput.value);
      }
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default MIMELookupTool;

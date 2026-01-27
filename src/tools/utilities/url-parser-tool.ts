import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const URLParserTool: Tool = {
  id: 'url-parser',
  name: 'URL Parser',
  category: 'utilities',
  description: 'Parse and analyze URLs',
  icon: '🔗',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入 URL:';
    inputGroup.appendChild(inputLabel);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tool-textarea';
    input.style.minHeight = 'auto';
    input.placeholder = '例如: https://www.example.com/path?query=value#hash';
    inputGroup.appendChild(input);

    wrapper.appendChild(inputGroup);

    // 解析按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const parseBtn = document.createElement('button');
    parseBtn.className = 'btn-primary';
    parseBtn.textContent = '🔄 解析 URL';
    buttonGroup.appendChild(parseBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 解析结果显示
    const resultDiv = document.createElement('div');
    resultDiv.className = 'info-display';
    resultDiv.style.display = 'none';
    resultDiv.style.marginTop = '12px';
    wrapper.appendChild(resultDiv);

    container.appendChild(wrapper);

    // 解析函数
    function parseURL() {
      errorDiv.style.display = 'none';
      resultDiv.style.display = 'none';
      resultDiv.textContent = '';

      const urlStr = input.value.trim();

      if (!urlStr) {
        errorDiv.textContent = '❌ 请输入 URL';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        const url = new URL(urlStr);

        resultDiv.style.display = 'block';

        const parts = [
          { label: '协议 (Protocol):', value: url.protocol },
          { label: '主机 (Host):', value: url.host },
          { label: '主机名 (Hostname):', value: url.hostname },
          { label: '端口 (Port):', value: url.port || '(默认)' },
          { label: '路径 (Path):', value: url.pathname || '/' },
          { label: '查询参数 (Query):', value: url.search || '(无)' },
          { label: '哈希 (Hash):', value: url.hash || '(无)' }
        ];

        parts.forEach(part => {
          const row = document.createElement('div');
          row.className = 'info-row';

          const label = document.createElement('span');
          label.className = 'info-label';
          label.textContent = part.label;

          const value = document.createElement('span');
          value.className = 'info-value';
          value.textContent = part.value;
          value.style.wordBreak = 'break-all';

          row.appendChild(label);
          row.appendChild(value);
          resultDiv.appendChild(row);
        });

        // 解析查询参数
        if (url.search) {
          const params = new URLSearchParams(url.search);
          if (params.toString()) {
            const paramsTitle = document.createElement('div');
            paramsTitle.style.cssText = 'font-weight: 600; margin-top: 16px; margin-bottom: 8px; color: #333;';
            paramsTitle.textContent = '查询参数详情:';
            resultDiv.appendChild(paramsTitle);

            params.forEach((paramValue, paramKey) => {
              const paramRow = document.createElement('div');
              paramRow.className = 'info-row';
              paramRow.style.cssText = 'background: #f0f7ff; padding: 8px; margin: 4px 0; border-radius: 4px;';

              const key = document.createElement('span');
              key.className = 'info-label';
              key.textContent = paramKey + ':';

              const val = document.createElement('span');
              val.className = 'info-value';
              val.textContent = paramValue;
              val.style.wordBreak = 'break-all';

              paramRow.appendChild(key);
              paramRow.appendChild(val);
              resultDiv.appendChild(paramRow);
            });
          }
        }

      } catch (err) {
        errorDiv.textContent = '❌ 无效的 URL: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    parseBtn.onclick = parseURL;

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        parseURL();
      }
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default URLParserTool;

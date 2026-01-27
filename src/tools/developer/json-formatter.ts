import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const JSONFormatterTool: Tool = {
  id: 'json-formatter',
  name: 'JSON Formatter',
  category: 'developer',
  description: 'Format and prettify JSON data',
  icon: '📋',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入 JSON:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '粘贴你的 JSON 数据...';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const formatBtn = document.createElement('button');
    formatBtn.className = 'btn-primary';
    formatBtn.textContent = '✨ 格式化';
    buttonGroup.appendChild(formatBtn);

    const minifyBtn = document.createElement('button');
    minifyBtn.className = 'btn-secondary';
    minifyBtn.textContent = '🗜️ 压缩';
    buttonGroup.appendChild(minifyBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 输出区域
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.textContent = '格式化结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '格式化的 JSON 将显示在这里...';
    outputWrapper.appendChild(output);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-copy';
    copyBtn.textContent = '📋 复制';
    copyBtn.onclick = async () => {
      if (output.value) {
        await copyToClipboard(output.value);
        showCopyFeedback(copyBtn);
      }
    };
    outputWrapper.appendChild(copyBtn);

    outputGroup.appendChild(outputWrapper);
    wrapper.appendChild(outputGroup);

    container.appendChild(wrapper);

    // 格式化功能
    formatBtn.onclick = () => {
      errorDiv.style.display = 'none';
      try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, 2);
      } catch (err) {
        errorDiv.textContent = '❌ JSON 格式错误: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    };

    // 压缩功能
    minifyBtn.onclick = () => {
      errorDiv.style.display = 'none';
      try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed);
      } catch (err) {
        errorDiv.textContent = '❌ JSON 格式错误: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    };

    // 清空功能
    clearBtn.onclick = () => {
      input.value = '';
      output.value = '';
      errorDiv.style.display = 'none';
    };
  },

  process(input: string, options?: { indent?: number }): string {
    const parsed = JSON.parse(input);
    const indent = options?.indent || 2;
    return JSON.stringify(parsed, null, indent);
  },

  async copyResult() {
    // 由 UI 处理
  }
};

export default JSONFormatterTool;

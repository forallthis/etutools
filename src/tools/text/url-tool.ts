import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const URLTool: Tool = {
  id: 'url-encode',
  name: 'URL Encode/Decode',
  category: 'text',
  description: 'Encode and decode URL components',
  icon: '🔗',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 模式切换
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';

    const encodeBtn = document.createElement('button');
    encodeBtn.className = 'toggle-button active';
    encodeBtn.textContent = '编码';
    toggleGroup.appendChild(encodeBtn);

    const decodeBtn = document.createElement('button');
    decodeBtn.className = 'toggle-button';
    decodeBtn.textContent = '解码';
    toggleGroup.appendChild(decodeBtn);

    wrapper.appendChild(toggleGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入 URL/文本:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '输入要编码的 URL 或文本...';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        convert(); // 自动转换
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

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn-primary';
    convertBtn.textContent = '🔄 转换';
    buttonGroup.appendChild(convertBtn);

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
    outputLabel.textContent = '转换结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '转换结果将显示在这里...';
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

    let mode: 'encode' | 'decode' = 'encode';

    // 转换功能
    function convert() {
      errorDiv.style.display = 'none';
      try {
        if (mode === 'encode') {
          output.value = encodeURIComponent(input.value);
        } else {
          output.value = decodeURIComponent(input.value);
        }
      } catch (err) {
        errorDiv.textContent = '❌ 转换失败: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    // 模式切换
    encodeBtn.onclick = () => {
      mode = 'encode';
      encodeBtn.classList.add('active');
      decodeBtn.classList.remove('active');
      input.placeholder = '输入要编码的 URL 或文本...';
      output.placeholder = '编码结果将显示在这里...';
      if (input.value) convert();
    };

    decodeBtn.onclick = () => {
      mode = 'decode';
      decodeBtn.classList.add('active');
      encodeBtn.classList.remove('active');
      input.placeholder = '输入要解码的 URL 编码文本...';
      output.placeholder = '解码结果将显示在这里...';
      if (input.value) convert();
    };

    // 转换按钮
    convertBtn.onclick = convert;

    // 实时转换
    input.addEventListener('input', convert);

    // 清空按钮
    clearBtn.onclick = () => {
      input.value = '';
      output.value = '';
      errorDiv.style.display = 'none';
    };
  },

  process(input: string, options?: { mode?: 'encode' | 'decode' }) {
    const mode = options?.mode || 'encode';
    return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
  },

  async copyResult() {}
};

export default URLTool;

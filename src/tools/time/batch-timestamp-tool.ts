import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const BatchTimestampTool: Tool = {
  id: 'batch-timestamp',
  name: 'Batch Timestamp Converter',
  category: 'time',
  description: 'Convert multiple timestamps at once',
  icon: '⏰',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 当前时间戳显示
    const currentInfo = document.createElement('div');
    currentInfo.className = 'info-display';
    currentInfo.style.cssText = 'display: block; margin-bottom: 12px;';

    const updateCurrentTime = () => {
      const now = Date.now();
      currentInfo.innerHTML = `
        <div class="info-row">
          <span class="info-label">当前时间戳:</span>
          <span class="info-value" style="color: #007acc; font-weight: 600;">${now}</span>
        </div>
        <div class="info-row">
          <span class="info-label">当前时间:</span>
          <span class="info-value">${new Date().toLocaleString('zh-CN')}</span>
        </div>
      `;
    };

    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    wrapper.appendChild(currentInfo);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入时间戳 (每行一个):';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '1704067200000\n1704067200\n2024-01-01 00:00:00';
    input.style.minHeight = '120px';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        convert();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-copy';
    clearBtn.textContent = '🗑️ 清空';
    clearBtn.style.marginLeft = '4px';
    clearBtn.onclick = () => {
      input.value = '';
      output.value = '';
    };
    inputWrapper.appendChild(clearBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn-primary';
    convertBtn.textContent = '🔄 批量转换';
    buttonGroup.appendChild(convertBtn);

    wrapper.appendChild(buttonGroup);

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
    output.style.minHeight = '150px';
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

    // 转换函数
    function convert() {
      const lines = input.value.split('\n').filter(line => line.trim() !== '');
      const results: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // 检测是否为纯数字时间戳
        if (/^\d+$/.test(trimmed)) {
          const timestamp = parseInt(trimmed, 10);

          // 检测是秒还是毫秒
          let date: Date;
          if (timestamp < 10000000000) {
            // 秒级时间戳
            date = new Date(timestamp * 1000);
            results.push(`${timestamp} (秒) | ${date.toLocaleString('zh-CN')}`);
          } else {
            // 毫秒级时间戳
            date = new Date(timestamp);
            results.push(`${timestamp} (毫秒) | ${date.toLocaleString('zh-CN')}`);
          }
        } else {
          // 尝试解析日期字符串
          try {
            const date = new Date(trimmed);
            if (!isNaN(date.getTime())) {
              const seconds = Math.floor(date.getTime() / 1000);
              const milliseconds = date.getTime();
              results.push(`${trimmed} | ${milliseconds} (毫秒) | ${seconds} (秒)`);
            } else {
              results.push(`${trimmed} | ❌ 无法解析`);
            }
          } catch (e) {
            results.push(`${trimmed} | ❌ 解析失败`);
          }
        }
      }

      output.value = results.join('\n');
    }

    convertBtn.onclick = convert;

    // 支持实时转换
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        convert();
      }
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default BatchTimestampTool;

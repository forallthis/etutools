import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const LineCounterTool: Tool = {
  id: 'line-counter',
  name: 'Line Counter',
  category: 'text',
  description: 'Count lines, characters, and words',
  icon: '📊',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入文本:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '输入要统计的文本...';
    input.style.minHeight = '150px';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        updateStats();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 统计结果
    const statsDiv = document.createElement('div');
    statsDiv.className = 'info-display';
    statsDiv.style.display = 'block';
    wrapper.appendChild(statsDiv);

    container.appendChild(wrapper);

    // 更新统计
    function updateStats() {
      const text = input.value;
      const lines = text.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, '').length;
      const words = text.trim().split(/\s+/).filter(w => w.length > 0);

      statsDiv.textContent = '';

      const stats = [
        { label: '总行数:', value: lines.length.toString() },
        { label: '非空行数:', value: nonEmptyLines.length.toString() },
        { label: '字符数:', value: chars.toString() },
        { label: '字符数 (不含空格):', value: charsNoSpaces.toString() },
        { label: '单词数:', value: words.length.toString() },
        { label: '段落:', value: text.split(/\n\n+/).filter(p => p.trim()).length.toString() }
      ];

      stats.forEach(stat => {
        const row = document.createElement('div');
        row.className = 'info-row';

        const label = document.createElement('span');
        label.className = 'info-label';
        label.textContent = stat.label;

        const value = document.createElement('span');
        value.className = 'info-value';
        value.textContent = stat.value;

        row.appendChild(label);
        row.appendChild(value);
        statsDiv.appendChild(row);
      });
    }

    input.addEventListener('input', updateStats);
    updateStats();
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default LineCounterTool;

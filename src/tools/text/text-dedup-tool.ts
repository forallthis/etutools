import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const TextDedupTool: Tool = {
  id: 'text-dedup',
  name: 'Text Dedup & Sort',
  category: 'text',
  description: 'Remove duplicates and sort text lines',
  icon: '📝',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入文本 (每行一条):';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '输入文本，每行一条...\napple\nbanana\napple';
    input.style.minHeight = '120px';
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

    // 选项
    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'input-output-group';

    const optionsLabel = document.createElement('label');
    optionsLabel.className = 'tool-label';
    optionsLabel.textContent = '排序:';
    optionsGroup.appendChild(optionsLabel);

    const sortOptions = document.createElement('div');
    sortOptions.className = 'toggle-group';

    const sortTypes = [
      { label: '不排序', value: 'none', active: true },
      { label: '升序', value: 'asc' },
      { label: '降序', value: 'desc' }
    ];

    let currentSort = 'none';

    sortTypes.forEach(sort => {
      const btn = document.createElement('button');
      btn.className = 'toggle-button';
      if (sort.active) btn.classList.add('active');
      btn.textContent = sort.label;
      btn.onclick = () => {
        sortTypes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = sort.value;
        process();
      };
      sortOptions.appendChild(btn);
    });

    optionsGroup.appendChild(sortOptions);
    wrapper.appendChild(optionsGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const dedupBtn = document.createElement('button');
    dedupBtn.className = 'btn-primary';
    dedupBtn.textContent = '🔄 去重处理';
    buttonGroup.appendChild(dedupBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 统计信息
    const statsDiv = document.createElement('div');
    statsDiv.className = 'info-display';
    statsDiv.style.marginBottom = '12px';
    wrapper.appendChild(statsDiv);

    // 输出区域
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.textContent = '处理结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '处理结果将显示在这里...';
    output.style.minHeight = '120px';
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

    // 处理函数
    function process() {
      const lines = input.value.split('\n').filter(line => line.trim() !== '');

      if (lines.length === 0) {
        output.value = '';
        updateStats(0, 0);
        return;
      }

      // 去重
      const unique = [...new Set(lines)];

      // 排序
      let sorted = unique;
      if (currentSort === 'asc') {
        sorted = unique.sort((a, b) => a.localeCompare(b));
      } else if (currentSort === 'desc') {
        sorted = unique.sort((a, b) => b.localeCompare(a));
      }

      output.value = sorted.join('\n');
      updateStats(lines.length, unique.length);
    }

    function updateStats(original: number, unique: number) {
      statsDiv.textContent = '';

      const row1 = document.createElement('div');
      row1.className = 'info-row';
      const label1 = document.createElement('span');
      label1.className = 'info-label';
      label1.textContent = '原始行数:';
      const value1 = document.createElement('span');
      value1.className = 'info-value';
      value1.textContent = original.toString();
      row1.appendChild(label1);
      row1.appendChild(value1);
      statsDiv.appendChild(row1);

      const row2 = document.createElement('div');
      row2.className = 'info-row';
      const label2 = document.createElement('span');
      label2.className = 'info-label';
      label2.textContent = '去重后:';
      const value2 = document.createElement('span');
      value2.className = 'info-value';
      value2.textContent = unique.toString();
      row2.appendChild(label2);
      row2.appendChild(value2);
      statsDiv.appendChild(row2);

      if (original > unique) {
        const row3 = document.createElement('div');
        row3.className = 'info-row';
        const label3 = document.createElement('span');
        label3.className = 'info-label';
        label3.textContent = '已移除:';
        const value3 = document.createElement('span');
        value3.className = 'info-value';
        value3.textContent = (original - unique).toString();
        row3.appendChild(label3);
        row3.appendChild(value3);
        statsDiv.appendChild(row3);
      }
    }

    dedupBtn.onclick = process;

    clearBtn.onclick = () => {
      input.value = '';
      output.value = '';
      updateStats(0, 0);
    };

    // 初始统计
    input.addEventListener('input', () => {
      const lines = input.value.split('\n');
      updateStats(lines.length, lines.length);
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default TextDedupTool;

import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const CharacterFrequencyTool: Tool = {
  id: 'character-frequency',
  name: 'Character Frequency',
  category: 'text',
  description: 'Count character and word frequency in text',
  icon: '📊',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 模式切换
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';

    const charBtn = document.createElement('button');
    charBtn.className = 'toggle-button active';
    charBtn.textContent = '字符频率';
    toggleGroup.appendChild(charBtn);

    const wordBtn = document.createElement('button');
    wordBtn.className = 'toggle-button';
    wordBtn.textContent = '单词频率';
    toggleGroup.appendChild(wordBtn);

    wrapper.appendChild(toggleGroup);

    // 选项
    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'display: flex; gap: 16px; margin: 12px 0;';

    const caseSensitive = document.createElement('label');
    caseSensitive.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const caseCheckbox = document.createElement('input');
    caseCheckbox.type = 'checkbox';
    caseCheckbox.style.cursor = 'pointer';
    caseSensitive.appendChild(caseCheckbox);
    const caseText = document.createElement('span');
    caseText.textContent = '区分大小写';
    caseSensitive.appendChild(caseText);
    optionsGroup.appendChild(caseSensitive);

    const ignoreSpaces = document.createElement('label');
    ignoreSpaces.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const spaceCheckbox = document.createElement('input');
    spaceCheckbox.type = 'checkbox';
    spaceCheckbox.checked = true;
    spaceCheckbox.style.cursor = 'pointer';
    ignoreSpaces.appendChild(spaceCheckbox);
    const spaceText = document.createElement('span');
    spaceText.textContent = '忽略空格';
    ignoreSpaces.appendChild(spaceText);
    optionsGroup.appendChild(ignoreSpaces);

    const ignorePunctuation = document.createElement('label');
    ignorePunctuation.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const punctCheckbox = document.createElement('input');
    punctCheckbox.type = 'checkbox';
    punctCheckbox.checked = true;
    punctCheckbox.style.cursor = 'pointer';
    ignorePunctuation.appendChild(punctCheckbox);
    const punctText = document.createElement('span');
    punctText.textContent = '忽略标点';
    ignorePunctuation.appendChild(punctText);
    optionsGroup.appendChild(ignorePunctuation);

    wrapper.appendChild(optionsGroup);

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
    input.placeholder = '输入要分析的文本...';
    input.style.minHeight = '120px';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        analyze();
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
      resultDiv.textContent = '';
    };
    inputWrapper.appendChild(clearBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const analyzeBtn = document.createElement('button');
    analyzeBtn.className = 'btn-primary';
    analyzeBtn.textContent = '📊 分析';
    buttonGroup.appendChild(analyzeBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '统计结果:';
    resultGroup.appendChild(resultLabel);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'info-display';
    resultDiv.style.display = 'block';
    resultDiv.style.marginTop = '12px';
    resultDiv.style.maxHeight = '400px';
    resultDiv.style.overflow = 'auto';
    resultGroup.appendChild(resultDiv);

    wrapper.appendChild(resultGroup);

    container.appendChild(wrapper);

    let mode: 'char' | 'word' = 'char';

    // 分析函数
    function analyze() {
      resultDiv.textContent = '';

      const text = input.value;

      if (!text) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'info-row';
        const emptyValue = document.createElement('span');
        emptyValue.className = 'info-value';
        emptyValue.textContent = '请输入要分析的文本';
        emptyRow.appendChild(emptyValue);
        resultDiv.appendChild(emptyRow);
        return;
      }

      const isCaseSensitive = caseCheckbox.checked;
      const shouldIgnoreSpaces = spaceCheckbox.checked;
      const shouldIgnorePunctuation = punctCheckbox.checked;

      let frequency: Map<string, number>;

      if (mode === 'char') {
        frequency = new Map<string, number>();

        for (const char of text) {
          let key = char;

          if (!isCaseSensitive) {
            key = key.toLowerCase();
          }

          if (shouldIgnoreSpaces && /\s/.test(key)) {
            continue;
          }

          if (shouldIgnorePunctuation && /[^\w\s]/.test(key)) {
            continue;
          }

          frequency.set(key, (frequency.get(key) || 0) + 1);
        }
      } else {
        frequency = new Map<string, number>();

        let words = text.split(/\s+/);

        for (let word of words) {
          if (!word) continue;

          if (!isCaseSensitive) {
            word = word.toLowerCase();
          }

          if (shouldIgnorePunctuation) {
            word = word.replace(/[^\w]/g, '');
          }

          if (word) {
            frequency.set(word, (frequency.get(word) || 0) + 1);
          }
        }
      }

      if (frequency.size === 0) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'info-row';
        const emptyValue = document.createElement('span');
        emptyValue.className = 'info-value';
        emptyValue.textContent = '没有找到有效内容';
        emptyRow.appendChild(emptyValue);
        resultDiv.appendChild(emptyRow);
        return;
      }

      // 排序
      const sorted = Array.from(frequency.entries())
        .sort((a, b) => b[1] - a[1]);

      // 统计信息
      const summary = document.createElement('div');
      summary.style.cssText = 'display: flex; gap: 16px; margin-bottom: 12px; padding: 8px; background: #f8f9fa; border-radius: 6px;';

      const totalCount = sorted.reduce((sum, [, count]) => sum + count, 0);
      const uniqueCount = sorted.length;

      const totalSpan = document.createElement('span');
      totalSpan.style.cssText = 'color: #007acc; font-weight: 600;';
      totalSpan.textContent = `总数: ${totalCount}`;
      summary.appendChild(totalSpan);

      const uniqueSpan = document.createElement('span');
      uniqueSpan.style.cssText = 'color: #007acc; font-weight: 600;';
      uniqueSpan.textContent = `唯一: ${uniqueCount}`;
      summary.appendChild(uniqueSpan);

      resultDiv.appendChild(summary);

      // 显示结果
      sorted.forEach(([item, count]) => {
        const row = document.createElement('div');
        row.className = 'info-row';

        const label = document.createElement('span');
        label.className = 'info-label';
        label.textContent = item === ' ' ? '(空格)' : item === '\n' ? '(换行)' : item === '\t' ? '(制表符)' : item;

        const countSpan = document.createElement('span');
        countSpan.className = 'info-value';
        countSpan.style.cssText = 'color: #007acc; font-weight: 600;';

        const percentage = ((count / totalCount) * 100).toFixed(1);
        countSpan.textContent = `${count} (${percentage}%)`;

        row.appendChild(label);
        row.appendChild(countSpan);
        resultDiv.appendChild(row);
      });
    }

    analyzeBtn.onclick = analyze;

    // 实时分析
    input.addEventListener('input', () => {
      analyze();
    });

    // 模式切换
    charBtn.onclick = () => {
      mode = 'char';
      charBtn.classList.add('active');
      wordBtn.classList.remove('active');
      analyze();
    };

    wordBtn.onclick = () => {
      mode = 'word';
      wordBtn.classList.add('active');
      charBtn.classList.remove('active');
      analyze();
    };

    // 选项变化时重新分析
    caseCheckbox.addEventListener('change', analyze);
    spaceCheckbox.addEventListener('change', analyze);
    punctCheckbox.addEventListener('change', analyze);
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default CharacterFrequencyTool;

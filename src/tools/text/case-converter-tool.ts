import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const CaseConverterTool: Tool = {
  id: 'case-converter',
  name: 'Case Converter',
  category: 'text',
  description: 'Convert text between different cases',
  icon: '🔤',

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
    input.placeholder = '输入要转换大小写的文本...';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        convertAll();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 转换按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const cases = [
      { label: '大写', value: 'UPPER' },
      { label: '小写', value: 'lower' },
      { label: '首字母大写', value: 'CAPITALIZE' },
      { label: '单词首字母大写', value: 'TITLE' },
      { label: '切换大小写', value: 'TOGGLE' },
      { label: '驼峰命名', value: 'CAMEL' }
    ];

    cases.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'btn-secondary';
      btn.textContent = c.label;
      btn.onclick = () => convert(c.value);
      buttonGroup.appendChild(btn);
    });

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
    function convert(caseType: string) {
      const text = input.value;
      let result = '';

      switch (caseType) {
        case 'UPPER':
          result = text.toUpperCase();
          break;
        case 'lower':
          result = text.toLowerCase();
          break;
        case 'CAPITALIZE':
          result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
          break;
        case 'TITLE':
          result = text.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
          break;
        case 'TOGGLE':
          result = text.split('').map(char =>
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          ).join('');
          break;
        case 'CAMEL':
          result = text.replace(/[-_\s]+(.)?/g, (_, c) =>
            c ? c.toUpperCase() : ''
          );
          result = result.charAt(0).toLowerCase() + result.slice(1);
          break;
      }

      output.value = result;
    }

    // 显示所有转换结果
    function convertAll() {
      if (!input.value) return;
      convert('lower'); // 默认显示小写
    }

    // 实时转换
    input.addEventListener('input', convertAll);
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default CaseConverterTool;

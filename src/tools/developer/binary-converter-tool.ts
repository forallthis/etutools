import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const BinaryConverterTool: Tool = {
  id: 'binary-converter',
  name: 'Binary Converter',
  category: 'developer',
  description: 'Convert between binary, octal, decimal, hex',
  icon: '💻',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入数值:';
    inputGroup.appendChild(inputLabel);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tool-textarea';
    input.style.minHeight = 'auto';
    input.placeholder = '例如: 42, 0b101010, 0o52, 0x2A';
    inputGroup.appendChild(input);

    wrapper.appendChild(inputGroup);

    // 转换按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const conversions = [
      { label: '→ 二进制', to: 'binary' },
      { label: '→ 八进制', to: 'octal' },
      { label: '→ 十进制', to: 'decimal' },
      { label: '→ 十六进制', to: 'hex' }
    ];

    conversions.forEach(conv => {
      const btn = document.createElement('button');
      btn.className = 'btn-secondary';
      btn.textContent = conv.label;
      btn.onclick = () => convert(conv.to);
      buttonGroup.appendChild(btn);
    });

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultDiv = document.createElement('div');
    resultDiv.className = 'info-display';
    resultDiv.style.display = 'block';
    resultDiv.style.marginTop = '12px';
    wrapper.appendChild(resultDiv);

    container.appendChild(wrapper);

    function convert(toFormat: string) {
      const inputStr = input.value.trim();

      if (!inputStr) {
        resultDiv.textContent = '请输入数值';
        return;
      }

      resultDiv.textContent = '';

      let decimalValue = 0;

      // 检测输入格式并转换为十进制
      if (inputStr.startsWith('0b') || inputStr.startsWith('0B')) {
        decimalValue = parseInt(inputStr.slice(2), 2);
      } else if (inputStr.startsWith('0o') || inputStr.startsWith('0O')) {
        decimalValue = parseInt(inputStr.slice(2), 8);
      } else if (inputStr.startsWith('0x') || inputStr.startsWith('0X')) {
        decimalValue = parseInt(inputStr.slice(2), 16);
      } else {
        decimalValue = parseInt(inputStr, 10);
      }

      if (isNaN(decimalValue)) {
        resultDiv.textContent = '❌ 无效的数值';
        return;
      }

      // 转换为目标格式
      const results = [
        { label: '二进制 (BIN):', value: '0b' + decimalValue.toString(2) },
        { label: '八进制 (OCT):', value: '0o' + decimalValue.toString(8) },
        { label: '十进制 (DEC):', value: decimalValue.toString(10) },
        { label: '十六进制 (HEX):', value: '0x' + decimalValue.toString(16).toUpperCase() }
      ];

      results.forEach(result => {
        const row = document.createElement('div');
        row.className = 'info-row';

        const label = document.createElement('span');
        label.className = 'info-label';
        label.textContent = result.label;

        const valueDiv = document.createElement('div');
        valueDiv.style.cssText = 'display: flex; align-items: center; gap: 8px;';

        const value = document.createElement('span');
        value.className = 'info-value';
        value.textContent = result.value;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-secondary';
        copyBtn.style.cssText = 'padding: 4px 10px; font-size: 11px; white-space: nowrap;';
        copyBtn.textContent = '📋';
        copyBtn.onclick = async () => {
          await copyToClipboard(result.value);
          showCopyFeedback(copyBtn);
        };

        valueDiv.appendChild(value);
        valueDiv.appendChild(copyBtn);
        row.appendChild(label);
        row.appendChild(valueDiv);
        resultDiv.appendChild(row);
      });
    }

    // 支持回车转换
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        convert('decimal');
      }
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default BinaryConverterTool;

import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const PasswordGeneratorTool: Tool = {
  id: 'password-generator',
  name: 'Password Generator',
  category: 'utilities',
  description: 'Generate secure random passwords',
  icon: '🔑',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 密码长度
    const lengthGroup = document.createElement('div');
    lengthGroup.className = 'input-output-group';

    const lengthLabel = document.createElement('label');
    lengthLabel.className = 'tool-label';
    lengthLabel.textContent = `密码长度: 16`;
    lengthGroup.appendChild(lengthLabel);

    const lengthSlider = document.createElement('input');
    lengthSlider.type = 'range';
    lengthSlider.min = '8';
    lengthSlider.max = '64';
    lengthSlider.value = '16';
    lengthSlider.style.cssText = 'width: 100%; cursor: pointer;';
    lengthGroup.appendChild(lengthSlider);

    wrapper.appendChild(lengthGroup);

    // 字符选项
    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'input-output-group';

    const optionsLabel = document.createElement('label');
    optionsLabel.className = 'tool-label';
    optionsLabel.textContent = '字符类型:';
    optionsGroup.appendChild(optionsLabel);

    const options = [
      { id: 'uppercase', label: '大写字母 (A-Z)', checked: true },
      { id: 'lowercase', label: '小写字母 (a-z)', checked: true },
      { id: 'numbers', label: '数字 (0-9)', checked: true },
      { id: 'symbols', label: '特殊符号 (!@#$%)', checked: true }
    ];

    options.forEach(opt => {
      const optWrapper = document.createElement('div');
      optWrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 6px 0;';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = opt.id;
      checkbox.checked = opt.checked;
      checkbox.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';

      const label = document.createElement('label');
      label.htmlFor = opt.id;
      label.textContent = opt.label;
      label.style.cssText = 'flex: 1; cursor: pointer; font-size: 13px;';

      checkbox.addEventListener('change', generatePassword);
      optWrapper.appendChild(checkbox);
      optWrapper.appendChild(label);
      optionsGroup.appendChild(optWrapper);
    });

    wrapper.appendChild(optionsGroup);

    // 生成按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const generateBtn = document.createElement('button');
    generateBtn.className = 'btn-primary';
    generateBtn.textContent = '🔄 生成密码';
    buttonGroup.appendChild(generateBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '生成的密码:';
    resultGroup.appendChild(resultLabel);

    const resultWrapper = document.createElement('div');
    resultWrapper.className = 'textarea-wrapper';

    const result = document.createElement('input');
    result.type = 'text';
    result.className = 'tool-textarea';
    result.style.minHeight = 'auto';
    result.readOnly = true;
    result.style.fontFamily = 'monospace';
    result.style.fontSize = '14px';
    resultWrapper.appendChild(result);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-copy';
    copyBtn.textContent = '📋 复制';
    copyBtn.onclick = async () => {
      if (result.value) {
        await copyToClipboard(result.value);
        showCopyFeedback(copyBtn);
      }
    };
    resultWrapper.appendChild(copyBtn);

    resultGroup.appendChild(resultWrapper);
    wrapper.appendChild(resultGroup);

    container.appendChild(wrapper);

    // 生成密码
    function generatePassword() {
      const length = parseInt(lengthSlider.value);
      const useUppercase = (document.getElementById('uppercase') as HTMLInputElement).checked;
      const useLowercase = (document.getElementById('lowercase') as HTMLInputElement).checked;
      const useNumbers = (document.getElementById('numbers') as HTMLInputElement).checked;
      const useSymbols = (document.getElementById('symbols') as HTMLInputElement).checked;

      // 更新长度显示
      lengthLabel.textContent = `密码长度: ${length}`;

      let chars = '';
      if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (useNumbers) chars += '0123456789';
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (chars === '') {
        result.value = '请至少选择一种字符类型';
        return;
      }

      let password = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);

      for (let i = 0; i < length; i++) {
        password += chars[array[i] % chars.length];
      }

      result.value = password;
    }

    generateBtn.onclick = generatePassword;

    lengthSlider.addEventListener('input', () => {
      lengthLabel.textContent = `密码长度: ${lengthSlider.value}`;
      generatePassword();
    });

    // 初始生成
    generatePassword();
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default PasswordGeneratorTool;

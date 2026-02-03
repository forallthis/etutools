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
      { id: 'symbols', label: '特殊符号 (!@#$%^&*)', checked: true }
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

      optWrapper.appendChild(checkbox);
      optWrapper.appendChild(label);
      optionsGroup.appendChild(optWrapper);
    });

    wrapper.appendChild(optionsGroup);

    // 排除易混淆字符选项
    const excludeAmbiguousGroup = document.createElement('div');
    excludeAmbiguousGroup.className = 'input-output-group';

    const excludeAmbiguousWrapper = document.createElement('div');
    excludeAmbiguousWrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 6px 0;';

    const excludeCheckbox = document.createElement('input');
    excludeCheckbox.type = 'checkbox';
    excludeCheckbox.id = 'exclude-ambiguous';
    excludeCheckbox.checked = true;
    excludeCheckbox.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';

    const excludeLabel = document.createElement('label');
    excludeLabel.htmlFor = 'exclude-ambiguous';
    excludeLabel.textContent = '排除易混淆字符 (iIl1o0O)';
    excludeLabel.style.cssText = 'flex: 1; cursor: pointer; font-size: 13px;';

    excludeAmbiguousWrapper.appendChild(excludeCheckbox);
    excludeAmbiguousWrapper.appendChild(excludeLabel);
    excludeAmbiguousGroup.appendChild(excludeAmbiguousWrapper);

    wrapper.appendChild(excludeAmbiguousGroup);

    // 生成数量
    const countGroup = document.createElement('div');
    countGroup.className = 'input-output-group';

    const countLabel = document.createElement('label');
    countLabel.className = 'tool-label';
    countLabel.textContent = '生成数量: 1';
    countGroup.appendChild(countLabel);

    const countSlider = document.createElement('input');
    countSlider.type = 'range';
    countSlider.min = '1';
    countSlider.max = '20';
    countSlider.value = '1';
    countSlider.style.cssText = 'width: 100%; cursor: pointer;';
    countGroup.appendChild(countSlider);

    wrapper.appendChild(countGroup);

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
    resultWrapper.appendChild(copyBtn);

    resultGroup.appendChild(resultWrapper);
    wrapper.appendChild(resultGroup);

    container.appendChild(wrapper);

    // 构建字符集函数
    function buildCharSet(
      useUppercase: boolean,
      useLowercase: boolean,
      useNumbers: boolean,
      useSymbols: boolean,
      excludeAmbiguous: boolean
    ): string {
      let chars = '';

      // 基础字符集
      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*'; // 精简后的特殊字符

      // 根据选项添加字符
      if (useUppercase) chars += uppercase;
      if (useLowercase) chars += lowercase;
      if (useNumbers) chars += numbers;
      if (useSymbols) chars += symbols;

      // 排除易混淆字符
      if (excludeAmbiguous) {
        const ambiguous = ['i', 'I', 'l', '1', 'o', '0', 'O'];
        ambiguous.forEach(char => {
          chars = chars.split(char).join('');
        });
      }

      return chars;
    }

    // 单个密码生成函数
    function generateSinglePassword(length: number, charSet: string): string {
      if (charSet === '') {
        return '';
      }

      let password = '';
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);

      for (let i = 0; i < length; i++) {
        password += charSet[array[i] % charSet.length];
      }

      return password;
    }

    // 批量生成函数
    function generateMultiplePasswords(
      length: number,
      charSet: string,
      count: number
    ): string[] {
      const passwords: string[] = [];
      for (let i = 0; i < count; i++) {
        passwords.push(generateSinglePassword(length, charSet));
      }
      return passwords;
    }

    // 显示单个密码
    function displaySinglePassword(password: string) {
      // 确保 result 元素可见
      result.style.display = 'block';
      result.value = password;

      // 更新复制按钮
      copyBtn.onclick = async () => {
        if (result.value) {
          await copyToClipboard(result.value);
          showCopyFeedback(copyBtn);
        }
      };
    }

    // 显示批量密码
    function displayMultiplePasswords(passwords: string[]) {
      // 隐藏单个密码输入框
      result.style.display = 'none';

      // 清空结果区域,除了 label 和 wrapper
      const existingList = resultGroup.querySelector('.password-list-container');
      if (existingList) {
        existingList.remove();
      }

      // 创建列表容器
      const listContainer = document.createElement('div');
      listContainer.className = 'password-list-container';
      listContainer.style.cssText = 'max-height: 400px; overflow-y: auto;';

      passwords.forEach((pwd, index) => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #eee;';

        // 序号
        const indexLabel = document.createElement('span');
        indexLabel.textContent = `${index + 1}.`;
        indexLabel.style.cssText = 'color: #666; font-weight: bold; min-width: 30px;';

        // 密码文本
        const pwdInput = document.createElement('input');
        pwdInput.type = 'text';
        pwdInput.value = pwd;
        pwdInput.readOnly = true;
        pwdInput.style.cssText = 'flex: 1; font-family: monospace; font-size: 14px; padding: 6px; border: 1px solid #ddd; border-radius: 4px;';

        // 复制按钮
        const itemCopyBtn = document.createElement('button');
        itemCopyBtn.className = 'btn-copy';
        itemCopyBtn.textContent = '📋 复制';
        itemCopyBtn.onclick = async () => {
          await copyToClipboard(pwd);
          showCopyFeedback(itemCopyBtn);
        };

        item.appendChild(indexLabel);
        item.appendChild(pwdInput);
        item.appendChild(itemCopyBtn);
        listContainer.appendChild(item);
      });

      resultGroup.appendChild(listContainer);
    }

    // 生成密码主函数
    function generatePassword() {
      const length = parseInt(lengthSlider.value);
      const count = parseInt(countSlider.value);
      const useUppercase = (document.getElementById('uppercase') as HTMLInputElement).checked;
      const useLowercase = (document.getElementById('lowercase') as HTMLInputElement).checked;
      const useNumbers = (document.getElementById('numbers') as HTMLInputElement).checked;
      const useSymbols = (document.getElementById('symbols') as HTMLInputElement).checked;
      const excludeAmbiguous = (document.getElementById('exclude-ambiguous') as HTMLInputElement).checked;

      // 更新标签显示
      lengthLabel.textContent = `密码长度: ${length}`;
      countLabel.textContent = `生成数量: ${count}`;

      // 构建字符集
      const charSet = buildCharSet(
        useUppercase,
        useLowercase,
        useNumbers,
        useSymbols,
        excludeAmbiguous
      );

      // 验证字符集
      if (charSet === '') {
        result.style.display = 'block';
        result.value = '请至少选择一种字符类型';
        const existingList = resultGroup.querySelector('.password-list-container');
        if (existingList) {
          existingList.remove();
        }
        return;
      }

      if (charSet.length === 0) {
        result.style.display = 'block';
        result.value = '排除易混淆字符后没有可用字符,请调整选项';
        const existingList = resultGroup.querySelector('.password-list-container');
        if (existingList) {
          existingList.remove();
        }
        return;
      }

      // 生成密码
      const passwords = generateMultiplePasswords(length, charSet, count);

      // 显示结果
      if (count === 1) {
        const existingList = resultGroup.querySelector('.password-list-container');
        if (existingList) {
          existingList.remove();
        }
        displaySinglePassword(passwords[0]);
      } else {
        displayMultiplePasswords(passwords);
      }
    }

    // 事件监听器
    generateBtn.onclick = generatePassword;

    lengthSlider.addEventListener('input', generatePassword);
    countSlider.addEventListener('input', generatePassword);

    // 为所有复选框添加事件监听
    const checkboxes = ['uppercase', 'lowercase', 'numbers', 'symbols', 'exclude-ambiguous'];
    checkboxes.forEach(id => {
      const checkbox = document.getElementById(id) as HTMLInputElement;
      if (checkbox) {
        checkbox.addEventListener('change', generatePassword);
      }
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

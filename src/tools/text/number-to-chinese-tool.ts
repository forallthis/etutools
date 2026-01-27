import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const NumberToChineseTool: Tool = {
  id: 'number-to-chinese',
  name: 'Number to Chinese',
  category: 'text',
  description: 'Convert numbers to Chinese characters',
  icon: '🔢',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 模式切换
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';

    const normalBtn = document.createElement('button');
    normalBtn.className = 'toggle-button active';
    normalBtn.textContent = '普通数字';
    toggleGroup.appendChild(normalBtn);

    const moneyBtn = document.createElement('button');
    moneyBtn.className = 'toggle-button';
    moneyBtn.textContent = '金额大写';
    toggleGroup.appendChild(moneyBtn);

    wrapper.appendChild(toggleGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.id = 'inputLabel';
    inputLabel.textContent = '输入数字:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tool-textarea';
    input.style.minHeight = 'auto';
    input.placeholder = '例如: 12345.67';
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

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn-primary';
    convertBtn.textContent = '🔄 转换';
    buttonGroup.appendChild(convertBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '转换结果:';
    resultGroup.appendChild(resultLabel);

    const resultOutput = document.createElement('textarea');
    resultOutput.className = 'tool-textarea';
    resultOutput.readOnly = true;
    resultOutput.placeholder = '中文结果将显示在这里...';
    resultOutput.style.minHeight = '100px';
    resultGroup.appendChild(resultOutput);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-secondary';
    copyBtn.style.marginTop = '8px';
    copyBtn.textContent = '📋 复制';
    copyBtn.onclick = async () => {
      if (resultOutput.value) {
        await copyToClipboard(resultOutput.value);
        showCopyFeedback(copyBtn);
      }
    };
    resultGroup.appendChild(copyBtn);

    wrapper.appendChild(resultGroup);

    // 参考信息
    const infoGroup = document.createElement('div');
    infoGroup.className = 'info-display';
    infoGroup.style.display = 'block';
    infoGroup.style.marginTop = '12px';

    const infoTitle = document.createElement('div');
    infoTitle.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #007acc;';
    infoTitle.textContent = '数字对照:';
    infoGroup.appendChild(infoTitle);

    const digits = document.createElement('div');
    digits.style.cssText = 'display: grid; grid-template-columns: repeat(10, 1fr); gap: 8px; font-size: 12px; text-align: center;';
    const digitChars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    digitChars.forEach((char, i) => {
      const span = document.createElement('span');
      span.style.cssText = 'padding: 4px; background: #f8f9fa; border-radius: 4px;';
      span.textContent = `${i} → ${char}`;
      digits.appendChild(span);
    });
    infoGroup.appendChild(digits);

    const units = document.createElement('div');
    units.style.cssText = 'margin-top: 8px; font-size: 12px; color: #666;';
    units.textContent = '单位: 十、百、千、万、十万、百万、千万、亿、十亿、百亿、千亿';
    infoGroup.appendChild(units);

    wrapper.appendChild(infoGroup);

    container.appendChild(wrapper);

    let mode: 'normal' | 'money' = 'normal';

    // 普通数字转中文
    function numberToChinese(num: number): string {
      const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆'];

      if (num === 0) return '零';

      const str = Math.floor(num).toString();
      let result = '';
      let zeroCount = 0;

      for (let i = 0; i < str.length; i++) {
        const digit = parseInt(str[i]);
        const unit = units[str.length - i - 1];

        if (digit === 0) {
          zeroCount++;
          if (unit === '万' || unit === '亿' || unit === '兆') {
            result += unit;
            zeroCount = 0;
          }
        } else {
          if (zeroCount > 0) {
            result += '零';
            zeroCount = 0;
          }
          result += digits[digit] + unit;
        }
      }

      // 处理"一十"特殊 case
      result = result.replace(/^一十/, '十');

      return result || '零';
    }

    // 小数部分转中文
    function decimalToChinese(decimal: string): string {
      const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      let result = '';
      for (let i = 0; i < decimal.length; i++) {
        result += digits[parseInt(decimal[i])];
      }
      return result;
    }

    // 金额转大写
    function moneyToChinese(num: number): string {
      const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
      const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '兆'];
      const decimalUnits = ['角', '分'];

      if (num === 0) return '零元整';

      const [integerPart, decimalPart] = num.toString().split('.');
      let result = '';

      // 处理整数部分
      if (integerPart === '0') {
        result = '零元';
      } else {
        const integerNum = parseInt(integerPart);
        let integerStr = '';
        let zeroCount = 0;

        for (let i = 0; i < integerPart.length; i++) {
          const digit = parseInt(integerPart[i]);
          const unit = units[integerPart.length - i - 1];

          if (digit === 0) {
            zeroCount++;
            if (unit === '万' || unit === '亿' || unit === '兆') {
              integerStr += unit;
              zeroCount = 0;
            }
          } else {
            if (zeroCount > 0) {
              integerStr += '零';
              zeroCount = 0;
            }
            integerStr += digits[digit] + unit;
          }
        }

        result = integerStr + '元';
      }

      // 处理小数部分
      if (decimalPart) {
        for (let i = 0; i < Math.min(2, decimalPart.length); i++) {
          const digit = parseInt(decimalPart[i]);
          if (digit !== 0) {
            result += digits[digit] + decimalUnits[i];
          }
        }
        if (decimalPart.length === 1 || parseInt(decimalPart[1]) === 0) {
          result += '整';
        }
      } else {
        result += '整';
      }

      return result;
    }

    function convert() {
      resultOutput.value = '';

      const numStr = input.value.trim();

      if (!numStr) {
        resultOutput.value = '请输入数字';
        return;
      }

      const num = parseFloat(numStr);

      if (isNaN(num)) {
        resultOutput.value = '无效的数字';
        return;
      }

      try {
        if (mode === 'normal') {
          // 普通数字转换
          const [integerPart, decimalPart] = numStr.split('.');
          let result = numberToChinese(num);

          if (decimalPart) {
            result += '点' + decimalToChinese(decimalPart);
          }

          resultOutput.value = result;
        } else {
          // 金额转换
          resultOutput.value = moneyToChinese(num);
        }
      } catch (err) {
        resultOutput.value = '转换失败: ' + (err as Error).message;
      }
    }

    convertBtn.onclick = convert;

    // 回车转换
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        convert();
      }
    });

    // 模式切换
    normalBtn.onclick = () => {
      mode = 'normal';
      normalBtn.classList.add('active');
      moneyBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入数字:';
      input.placeholder = '例如: 12345.67';
      infoGroup.style.display = 'block';
    };

    moneyBtn.onclick = () => {
      mode = 'money';
      moneyBtn.classList.add('active');
      normalBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入金额:';
      input.placeholder = '例如: 12345.67';
      infoGroup.style.display = 'none';
    };
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default NumberToChineseTool;

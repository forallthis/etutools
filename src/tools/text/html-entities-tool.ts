import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const HTMLEntitiesTool: Tool = {
  id: 'html-entities',
  name: 'HTML Entities',
  category: 'text',
  description: 'Encode and decode HTML entities',
  icon: '🔤',

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

    // 编码选项
    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'display: flex; gap: 16px; margin: 12px 0;';

    const encodeAllOption = document.createElement('label');
    encodeAllOption.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const encodeAllCheckbox = document.createElement('input');
    encodeAllCheckbox.type = 'checkbox';
    encodeAllCheckbox.style.cursor = 'pointer';
    encodeAllOption.appendChild(encodeAllCheckbox);
    const encodeAllText = document.createElement('span');
    encodeAllText.textContent = '编码所有字符';
    encodeAllOption.appendChild(encodeAllText);
    optionsGroup.appendChild(encodeAllOption);

    const useNamedOption = document.createElement('label');
    useNamedOption.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const useNamedCheckbox = document.createElement('input');
    useNamedCheckbox.type = 'checkbox';
    useNamedCheckbox.checked = true;
    useNamedCheckbox.style.cursor = 'pointer';
    useNamedOption.appendChild(useNamedCheckbox);
    const useNamedText = document.createElement('span');
    useNamedText.textContent = '优先使用命名实体';
    useNamedOption.appendChild(useNamedText);
    optionsGroup.appendChild(useNamedOption);

    wrapper.appendChild(optionsGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.id = 'inputLabel';
    inputLabel.textContent = '输入文本:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '<div class="test">Hello & welcome!</div>';
    input.style.minHeight = '100px';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        process();
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

    const processBtn = document.createElement('button');
    processBtn.className = 'btn-primary';
    processBtn.textContent = '🔄 转换';
    buttonGroup.appendChild(processBtn);

    wrapper.appendChild(buttonGroup);

    // 输出区域
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.id = 'outputLabel';
    outputLabel.textContent = '编码结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '转换结果将显示在这里...';
    output.style.minHeight = '100px';
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

    // 常用 HTML 命名实体
    const namedEntities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;',
      '©': '&copy;',
      '®': '&reg;',
      '™': '&trade;',
      '€': '&euro;',
      '£': '&pound;',
      '¥': '&yen;',
      '¢': '&cent;',
      '§': '&sect;',
      '¶': '&para;',
      '°': '&deg;',
      '±': '&plusmn;',
      '×': '&times;',
      '÷': '&divide;',
      '¬': '&not;',
      '√': '&radic;',
      '∞': '&infin;',
      'α': '&alpha;',
      'β': '&beta;',
      'γ': '&gamma;',
      'δ': '&delta;',
      'ε': '&epsilon;',
      'π': '&pi;',
      'θ': '&theta;',
      'σ': '&sigma;',
      'φ': '&phi;',
      'ψ': '&psi;',
      'ω': '&omega;'
    };

    // 编码函数
    function encode(str: string): string {
      const encodeAll = encodeAllCheckbox.checked;
      const useNamed = useNamedCheckbox.checked;
      let result = '';

      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const code = str.charCodeAt(i);

        if (useNamed && namedEntities[char]) {
          result += namedEntities[char];
        } else if (encodeAll || code < 32 || code > 126) {
          result += `&#${code};`;
        } else if (char === '&' || char === '<' || char === '>' || char === '"' || char === "'") {
          // 始终编码这些特殊字符
          if (char === '&') result += '&amp;';
          else if (char === '<') result += '&lt;';
          else if (char === '>') result += '&gt;';
          else if (char === '"') result += '&quot;';
          else if (char === "'") result += '&apos;';
        } else {
          result += char;
        }
      }

      return result;
    }

    // 解码函数
    function decode(str: string): string {
      let result = str;

      // 解码数字实体 (&#123; 和 &#x1F600;)
      result = result.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
      result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

      // 解码命名实体
      Object.entries(namedEntities).forEach(([char, entity]) => {
        const regex = new RegExp(entity.replace(/;/g, '\\;?'), 'g');
        result = result.replace(regex, char);
      });

      return result;
    }

    function process() {
      const text = input.value;

      if (!text) {
        output.value = '';
        return;
      }

      if (mode === 'encode') {
        output.value = encode(text);
      } else {
        output.value = decode(text);
      }
    }

    processBtn.onclick = process;

    // 模式切换
    encodeBtn.onclick = () => {
      mode = 'encode';
      encodeBtn.classList.add('active');
      decodeBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入文本:';
      document.getElementById('outputLabel')!.textContent = '编码结果:';
      input.placeholder = '<div class="test">Hello & welcome!</div>';
      optionsGroup.style.display = 'flex';
    };

    decodeBtn.onclick = () => {
      mode = 'decode';
      decodeBtn.classList.add('active');
      encodeBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入 HTML 实体:';
      document.getElementById('outputLabel')!.textContent = '解码结果:';
      input.placeholder = '&lt;div class=&quot;test&quot;&gt;Hello &amp; welcome!&lt;/div&gt;';
      optionsGroup.style.display = 'none';
    };
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default HTMLEntitiesTool;

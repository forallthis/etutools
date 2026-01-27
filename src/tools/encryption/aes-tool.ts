import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';

const AESTool: Tool = {
  id: 'aes-encrypt',
  name: 'AES Encrypt/Decrypt',
  category: 'encryption',
  description: 'AES-256 encryption and decryption',
  icon: '🔐',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 模式切换
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';

    const encryptBtn = document.createElement('button');
    encryptBtn.className = 'toggle-button active';
    encryptBtn.textContent = '加密';
    toggleGroup.appendChild(encryptBtn);

    const decryptBtn = document.createElement('button');
    decryptBtn.className = 'toggle-button';
    decryptBtn.textContent = '解密';
    toggleGroup.appendChild(decryptBtn);

    wrapper.appendChild(toggleGroup);

    // 密钥输入
    const keyGroup = document.createElement('div');
    keyGroup.className = 'input-output-group';

    const keyLabel = document.createElement('label');
    keyLabel.className = 'tool-label';
    keyLabel.textContent = '密钥 (Key):';
    keyGroup.appendChild(keyLabel);

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'tool-textarea';
    keyInput.style.minHeight = 'auto';
    keyInput.placeholder = '输入加密/解密密钥...';
    keyGroup.appendChild(keyInput);

    wrapper.appendChild(keyGroup);

    // 文本输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const modeLabel = document.createElement('label');
    modeLabel.className = 'tool-label';
    modeLabel.id = 'modeLabel';
    modeLabel.textContent = '输入明文:';
    inputGroup.appendChild(modeLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '输入要加密的明文...';
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

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const processBtn = document.createElement('button');
    processBtn.className = 'btn-primary';
    processBtn.textContent = '🔄 处理';
    buttonGroup.appendChild(processBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 输出区域
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.id = 'outputLabel';
    outputLabel.textContent = '加密结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '处理结果将显示在这里...';
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

    let mode: 'encrypt' | 'decrypt' = 'encrypt';

    // 处理函数
    function process() {
      errorDiv.style.display = 'none';
      output.value = '';

      const key = keyInput.value.trim();
      const text = input.value;

      if (!key) {
        errorDiv.textContent = '❌ 请输入密钥';
        errorDiv.style.display = 'block';
        return;
      }

      if (!text) {
        return;
      }

      try {
        if (mode === 'encrypt') {
          const encrypted = AES.encrypt(text, key).toString();
          output.value = encrypted;
        } else {
          const decrypted = AES.decrypt(text, key);
          output.value = decrypted.toString(CryptoJS.enc.Utf8);
        }
      } catch (err) {
        errorDiv.textContent = '❌ ' + (mode === 'encrypt' ? '加密' : '解密') + '失败: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    processBtn.onclick = process;

    // 模式切换
    encryptBtn.onclick = () => {
      mode = 'encrypt';
      encryptBtn.classList.add('active');
      decryptBtn.classList.remove('active');
      document.getElementById('modeLabel')!.textContent = '输入明文:';
      document.getElementById('outputLabel')!.textContent = '加密结果:';
      input.placeholder = '输入要加密的明文...';
    };

    decryptBtn.onclick = () => {
      mode = 'decrypt';
      decryptBtn.classList.add('active');
      encryptBtn.classList.remove('active');
      document.getElementById('modeLabel')!.textContent = '输入密文:';
      document.getElementById('outputLabel')!.textContent = '解密结果:';
      input.placeholder = '输入要解密的密文...';
    };
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default AESTool;

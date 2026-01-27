import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const JWTGeneratorTool: Tool = {
  id: 'jwt-generator',
  name: 'JWT Generator',
  category: 'developer',
  description: 'Generate JWT tokens with custom payload',
  icon: '🔑',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 算法选择
    const algoGroup = document.createElement('div');
    algoGroup.className = 'input-output-group';

    const algoLabel = document.createElement('label');
    algoLabel.className = 'tool-label';
    algoLabel.textContent = '算法:';
    algoGroup.appendChild(algoLabel);

    const algoSelect = document.createElement('select');
    algoSelect.className = 'btn-secondary';
    algoSelect.style.cssText = 'width: 100%; padding: 8px;';
    
    const algorithms = [
      { value: 'HS256', label: 'HS256 (HMAC-SHA256)' },
      { value: 'HS384', label: 'HS384 (HMAC-SHA384)' },
      { value: 'HS512', label: 'HS512 (HMAC-SHA512)' },
      { value: 'none', label: 'None (无签名)' }
    ];

    algorithms.forEach(algo => {
      const option = document.createElement('option');
      option.value = algo.value;
      option.textContent = algo.label;
      algoSelect.appendChild(option);
    });

    algoGroup.appendChild(algoSelect);
    wrapper.appendChild(algoGroup);

    // 密钥输入
    const keyGroup = document.createElement('div');
    keyGroup.className = 'input-output-group';

    const keyLabel = document.createElement('label');
    keyLabel.className = 'tool-label';
    keyLabel.textContent = '密钥 (Secret Key):';
    keyGroup.appendChild(keyLabel);

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'tool-textarea';
    keyInput.style.minHeight = 'auto';
    keyInput.placeholder = '输入您的密钥...';
    keyInput.value = 'your-secret-key';
    keyGroup.appendChild(keyInput);

    wrapper.appendChild(keyGroup);

    // Payload 输入
    const payloadGroup = document.createElement('div');
    payloadGroup.className = 'input-output-group';

    const payloadLabel = document.createElement('label');
    payloadLabel.className = 'tool-label';
    payloadLabel.textContent = 'Payload (JSON):';
    payloadGroup.appendChild(payloadLabel);

    const payloadWrapper = document.createElement('div');
    payloadWrapper.className = 'textarea-wrapper';

    const payloadInput = document.createElement('textarea');
    payloadInput.className = 'tool-textarea';
    payloadInput.placeholder = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}';
    payloadInput.style.minHeight = '120px';
    payloadInput.style.fontFamily = 'monospace';
    payloadInput.style.fontSize = '13px';
    payloadInput.value = JSON.stringify({
      sub: '1234567890',
      name: 'John Doe',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }, null, 2);
    payloadWrapper.appendChild(payloadInput);

    const formatBtn = document.createElement('button');
    formatBtn.className = 'btn-copy';
    formatBtn.textContent = '✨ 格式化';
    formatBtn.onclick = () => {
      try {
        const json = JSON.parse(payloadInput.value);
        payloadInput.value = JSON.stringify(json, null, 2);
      } catch (e) {
        alert('无效的 JSON 格式');
      }
    };
    payloadWrapper.appendChild(formatBtn);

    payloadGroup.appendChild(payloadWrapper);
    wrapper.appendChild(payloadGroup);

    // 按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const generateBtn = document.createElement('button');
    generateBtn.className = 'btn-primary';
    generateBtn.textContent = '🔐 生成 JWT';
    buttonGroup.appendChild(generateBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '生成的 Token:';
    resultGroup.appendChild(resultLabel);

    const resultWrapper = document.createElement('div');
    resultWrapper.className = 'textarea-wrapper';

    const resultOutput = document.createElement('textarea');
    resultOutput.className = 'tool-textarea';
    resultOutput.readOnly = true;
    resultOutput.placeholder = 'JWT Token 将显示在这里...';
    resultOutput.style.minHeight = '100px';
    resultOutput.style.fontFamily = 'monospace';
    resultOutput.style.fontSize = '12px';
    resultOutput.style.wordBreak = 'break-all';
    resultWrapper.appendChild(resultOutput);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-copy';
    copyBtn.textContent = '📋 复制';
    copyBtn.onclick = async () => {
      if (resultOutput.value) {
        await copyToClipboard(resultOutput.value);
        showCopyFeedback(copyBtn);
      }
    };
    resultWrapper.appendChild(copyBtn);

    resultGroup.appendChild(resultWrapper);
    wrapper.appendChild(resultGroup);

    // Token 解析显示
    const debugGroup = document.createElement('div');
    debugGroup.className = 'input-output-group';

    const debugLabel = document.createElement('label');
    debugLabel.className = 'tool-label';
    debugLabel.textContent = 'Token 结构:';
    debugGroup.appendChild(debugLabel);

    const debugOutput = document.createElement('div');
    debugOutput.className = 'info-display';
    debugOutput.style.display = 'block';
    debugOutput.style.marginTop = '12px';
    debugGroup.appendChild(debugOutput);

    wrapper.appendChild(debugGroup);

    container.appendChild(wrapper);

    function base64UrlEncode(str: string): string {
      return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }

    async function hmacSha256(message: string, secret: string): Promise<string> {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }

    async function hmacSha384(message: string, secret: string): Promise<string> {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-384' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }

    async function hmacSha512(message: string, secret: string): Promise<string> {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-512' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    }

    async function generate() {
      errorDiv.style.display = 'none';
      resultOutput.value = '';
      debugOutput.textContent = '';

      const algorithm = algoSelect.value;
      const secret = keyInput.value.trim();
      const payloadStr = payloadInput.value.trim();

      if (!payloadStr) {
        errorDiv.textContent = '❌ 请输入 Payload';
        errorDiv.style.display = 'block';
        return;
      }

      let payload: any;
      try {
        payload = JSON.parse(payloadStr);
      } catch (e) {
        errorDiv.textContent = '❌ 无效的 JSON 格式: ' + (e as Error).message;
        errorDiv.style.display = 'block';
        return;
      }

      try {
        // Header
        const header = {
          alg: algorithm,
          typ: 'JWT'
        };

        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));
        const data = `${encodedHeader}.${encodedPayload}`;

        let signature = '';
        if (algorithm === 'HS256') {
          signature = await hmacSha256(data, secret);
        } else if (algorithm === 'HS384') {
          signature = await hmacSha384(data, secret);
        } else if (algorithm === 'HS512') {
          signature = await hmacSha512(data, secret);
        } else if (algorithm === 'none') {
          signature = '';
        }

        const token = signature ? `${data}.${signature}` : data;
        resultOutput.value = token;

        // 显示 Token 结构
        const headerRow = document.createElement('div');
        headerRow.className = 'info-row';
        headerRow.innerHTML = `<span class="info-label">Header:</span><span class="info-value" style="font-family: monospace; font-size: 11px;">${encodedHeader}</span>`;
        debugOutput.appendChild(headerRow);

        const payloadRow = document.createElement('div');
        payloadRow.className = 'info-row';
        payloadRow.innerHTML = `<span class="info-label">Payload:</span><span class="info-value" style="font-family: monospace; font-size: 11px;">${encodedPayload}</span>`;
        debugOutput.appendChild(payloadRow);

        if (signature) {
          const sigRow = document.createElement('div');
          sigRow.className = 'info-row';
          sigRow.innerHTML = `<span class="info-label">Signature:</span><span class="info-value" style="font-family: monospace; font-size: 11px;">${signature}</span>`;
          debugOutput.appendChild(sigRow);
        }

      } catch (err) {
        errorDiv.textContent = '❌ 生成失败: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    generateBtn.onclick = generate;
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default JWTGeneratorTool;

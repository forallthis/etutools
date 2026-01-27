import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const JWTDecoderTool: Tool = {
  id: 'jwt-decoder',
  name: 'JWT Decoder',
  category: 'developer',
  description: 'Decode and inspect JWT tokens',
  icon: '🔐',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // JWT 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = 'JWT Token:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '粘贴 JWT Token (例如: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)';
    input.style.minHeight = '100px';
    input.style.fontFamily = 'monospace';
    input.style.fontSize = '11px';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        decodeJWT();
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

    const decodeBtn = document.createElement('button');
    decodeBtn.className = 'btn-primary';
    decodeBtn.textContent = '🔄 解码 JWT';
    buttonGroup.appendChild(decodeBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 结果显示区域
    const resultDiv = document.createElement('div');
    resultDiv.style.display = 'none';
    wrapper.appendChild(resultDiv);

    container.appendChild(wrapper);

    // 解码 JWT
    function decodeJWT() {
      errorDiv.style.display = 'none';
      resultDiv.style.display = 'none';
      resultDiv.textContent = '';

      const token = input.value.trim();

      if (!token) {
        errorDiv.textContent = '❌ 请输入 JWT Token';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        const parts = token.split('.');

        if (parts.length !== 3) {
          throw new Error('JWT 格式错误：应该包含3个部分（header.payload.signature）');
        }

        // 解码 Header
        const headerRaw = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        const header = JSON.parse(headerRaw);

        // 解码 Payload
        const payloadRaw = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadRaw);

        // Signature
        const signature = parts[2];

        // 显示结果
        resultDiv.style.display = 'block';

        // Header 部分
        const headerSection = createSection('Header (头部)', header);
        resultDiv.appendChild(headerSection);

        // Payload 部分
        const payloadSection = createSection('Payload (负载)', payload);
        resultDiv.appendChild(payloadSection);

        // Signature 部分
        const sigSection = document.createElement('div');
        sigSection.className = 'input-output-group';
        sigSection.style.marginTop = '12px';

        const sigLabel = document.createElement('label');
        sigLabel.className = 'tool-label';
        sigLabel.textContent = 'Signature (签名):';
        sigSection.appendChild(sigLabel);

        const sigDisplay = document.createElement('div');
        sigDisplay.className = 'info-display';
        sigDisplay.style.wordBreak = 'break-all';
        sigDisplay.style.fontFamily = 'monospace';
        sigDisplay.style.fontSize = '11px';
        sigDisplay.textContent = signature;
        sigSection.appendChild(sigDisplay);

        const sigCopyBtn = document.createElement('button');
        sigCopyBtn.className = 'btn-secondary';
        sigCopyBtn.style.marginTop = '8px';
        sigCopyBtn.textContent = '📋 复制签名';
        sigCopyBtn.onclick = async () => {
          await copyToClipboard(signature);
          showCopyFeedback(sigCopyBtn);
        };
        sigSection.appendChild(sigCopyBtn);

        resultDiv.appendChild(sigSection);

        // Token 信息
        const infoSection = document.createElement('div');
        infoSection.className = 'info-display';
        infoSection.style.marginTop = '12px';

        const infoTitle = document.createElement('div');
        infoTitle.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #333;';
        infoTitle.textContent = 'Token 信息:';
        infoSection.appendChild(infoTitle);

        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          const expRow = document.createElement('div');
          expRow.className = 'info-row';
          const expLabel = document.createElement('span');
          expLabel.className = 'info-label';
          expLabel.textContent = '过期时间:';
          const expValue = document.createElement('span');
          expValue.className = 'info-value';
          expValue.textContent = expDate.toLocaleString('zh-CN');
          expRow.appendChild(expLabel);
          expRow.appendChild(expValue);
          infoSection.appendChild(expRow);

          const now = Math.floor(Date.now() / 1000);
          const isExpired = payload.exp < now;
          const statusRow = document.createElement('div');
          statusRow.className = 'info-row';
          const statusLabel = document.createElement('span');
          statusLabel.className = 'info-label';
          statusLabel.textContent = '状态:';
          const statusValue = document.createElement('span');
          statusValue.className = 'info-value';
          statusValue.style.color = isExpired ? '#c33' : '#28a745';
          statusValue.textContent = isExpired ? '❌ 已过期' : '✓ 有效';
          statusRow.appendChild(statusLabel);
          statusRow.appendChild(statusValue);
          infoSection.appendChild(statusRow);
        }

        if (payload.iat) {
          const iatDate = new Date(payload.iat * 1000);
          const iatRow = document.createElement('div');
          iatRow.className = 'info-row';
          const iatLabel = document.createElement('span');
          iatLabel.className = 'info-label';
          iatLabel.textContent = '签发时间:';
          const iatValue = document.createElement('span');
          iatValue.className = 'info-value';
          iatValue.textContent = iatDate.toLocaleString('zh-CN');
          iatRow.appendChild(iatLabel);
          iatRow.appendChild(iatValue);
          infoSection.appendChild(iatRow);
        }

        if (payload.iss) {
          const issRow = document.createElement('div');
          issRow.className = 'info-row';
          const issLabel = document.createElement('span');
          issLabel.className = 'info-label';
          issLabel.textContent = '签发者:';
          const issValue = document.createElement('span');
          issValue.className = 'info-value';
          issValue.textContent = payload.iss;
          issRow.appendChild(issLabel);
          issRow.appendChild(issValue);
          infoSection.appendChild(issRow);
        }

        resultDiv.appendChild(infoSection);

      } catch (err) {
        errorDiv.textContent = '❌ JWT 解码失败: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    function createSection(title: string, data: any): HTMLElement {
      const section = document.createElement('div');
      section.className = 'input-output-group';
      section.style.marginTop = '12px';

      const label = document.createElement('label');
      label.className = 'tool-label';
      label.textContent = title;
      section.appendChild(label);

      const display = document.createElement('div');
      display.className = 'info-display';
      display.style.maxHeight = '200px';
      display.style.overflowY = 'auto';

      const jsonStr = JSON.stringify(data, null, 2);
      display.textContent = jsonStr;

      section.appendChild(display);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-secondary';
      copyBtn.style.marginTop = '8px';
      copyBtn.textContent = '📋 复制 JSON';
      copyBtn.onclick = async () => {
        await copyToClipboard(jsonStr);
        showCopyFeedback(copyBtn);
      };
      section.appendChild(copyBtn);

      return section;
    }

    // 解码按钮
    decodeBtn.onclick = decodeJWT;

    // 实时解码
    input.addEventListener('input', decodeJWT);

    // 清空按钮
    clearBtn.onclick = () => {
      input.value = '';
      errorDiv.style.display = 'none';
      resultDiv.style.display = 'none';
    };
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default JWTDecoderTool;

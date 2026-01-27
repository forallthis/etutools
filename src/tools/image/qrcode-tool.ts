import type { Tool } from '../../types/tool.js';
import QRCode from 'qrcode';

const QRCodeTool: Tool = {
  id: 'qrcode',
  name: 'QR Code Generator',
  category: 'image',
  description: 'Generate QR codes',
  icon: '📱',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入内容:';
    inputGroup.appendChild(inputLabel);

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '输入要生成二维码的文本或 URL...';
    inputGroup.appendChild(input);

    wrapper.appendChild(inputGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const generateBtn = document.createElement('button');
    generateBtn.className = 'btn-primary';
    generateBtn.textContent = '🔄 生成二维码';
    buttonGroup.appendChild(generateBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 二维码显示区域
    const qrcodeWrapper = document.createElement('div');
    qrcodeWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px; background: #f5f5f5; border-radius: 6px;';

    const qrcodeCanvas = document.createElement('canvas');
    qrcodeCanvas.id = 'qrcode-canvas';
    qrcodeWrapper.appendChild(qrcodeCanvas);

    const downloadLink = document.createElement('a');
    downloadLink.className = 'btn-secondary';
    downloadLink.textContent = '💾 下载二维码';
    downloadLink.style.display = 'none';
    downloadLink.style.cursor = 'pointer';
    downloadLink.style.textDecoration = 'none';
    qrcodeWrapper.appendChild(downloadLink);

    wrapper.appendChild(qrcodeWrapper);

    container.appendChild(wrapper);

    // 生成二维码
    generateBtn.onclick = async () => {
      const text = input.value.trim();
      if (!text) {
        return;
      }

      try {
        await QRCode.toCanvas(qrcodeCanvas, text, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        // 设置下载链接
        qrcodeCanvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = 'qrcode.png';
            downloadLink.style.display = 'inline-block';
          }
        });
      } catch (err) {
        console.error('Failed to generate QR code:', err);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = '❌ 生成二维码失败: ' + (err as Error).message;
        qrcodeWrapper.insertBefore(errorDiv, qrcodeCanvas);

        // 3秒后移除错误提示
        setTimeout(() => {
          errorDiv.remove();
        }, 3000);
      }
    };

    // 清空按钮
    clearBtn.onclick = () => {
      input.value = '';
      const ctx = qrcodeCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, qrcodeCanvas.width, qrcodeCanvas.height);
      }
      downloadLink.style.display = 'none';

      // 移除任何错误提示
      const errorMsg = qrcodeWrapper.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
    };

    // 回车生成
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateBtn.click();
      }
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default QRCodeTool;

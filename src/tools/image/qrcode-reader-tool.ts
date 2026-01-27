import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const QRCodeReaderTool: Tool = {
  id: 'qrcode-reader',
  name: 'QR Code Reader',
  category: 'image',
  description: 'Read and decode QR codes from images',
  icon: '📷',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 文件上传区域
    const fileGroup = document.createElement('div');
    fileGroup.className = 'input-output-group';

    const fileLabel = document.createElement('label');
    fileLabel.className = 'tool-label';
    fileLabel.textContent = '选择图片:';
    fileGroup.appendChild(fileLabel);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 6px; background: #f8f9fa; cursor: pointer;';
    fileGroup.appendChild(fileInput);

    wrapper.appendChild(fileGroup);

    // 预览区域
    const previewGroup = document.createElement('div');
    previewGroup.className = 'input-output-group';

    const previewLabel = document.createElement('label');
    previewLabel.className = 'tool-label';
    previewLabel.textContent = '图片预览:';
    previewGroup.appendChild(previewLabel);

    const imgPreview = document.createElement('img');
    imgPreview.id = 'imagePreview';
    imgPreview.style.cssText = 'max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #e0e0e0; display: none;';
    previewGroup.appendChild(imgPreview);

    wrapper.appendChild(previewGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '识别结果:';
    resultGroup.appendChild(resultLabel);

    const resultOutput = document.createElement('textarea');
    resultOutput.className = 'tool-textarea';
    resultOutput.readOnly = true;
    resultOutput.placeholder = '二维码内容将显示在这里...';
    resultOutput.style.minHeight = '100px';
    resultGroup.appendChild(resultOutput);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-secondary';
    copyBtn.style.marginTop = '8px';
    copyBtn.textContent = '📋 复制内容';
    copyBtn.onclick = async () => {
      if (resultOutput.value) {
        await copyToClipboard(resultOutput.value);
        showCopyFeedback(copyBtn);
      }
    };
    resultGroup.appendChild(copyBtn);

    wrapper.appendChild(resultGroup);

    container.appendChild(wrapper);

    // 加载 jsqr 库
    fileInput.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imgUrl = event.target?.result as string;
        imgPreview.src = imgUrl;
        imgPreview.style.display = 'block';
        resultOutput.value = '';

        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          try {
            const jsqr = await import('jsqr');
            const code = jsqr.default(imageData.data, imageData.width, imageData.height);

            if (code) {
              resultOutput.value = code.data;
            } else {
              resultOutput.value = '未检测到二维码';
            }
          } catch (err) {
            resultOutput.value = '二维码识别失败: ' + (err as Error).message;
          }
        };
        img.src = imgUrl;
      };
      reader.readAsDataURL(file);
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default QRCodeReaderTool;

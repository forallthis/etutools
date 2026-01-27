import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const ImageBase64Tool: Tool = {
  id: 'image-base64',
  name: 'Image to Base64',
  category: 'image',
  description: 'Convert images to Base64 and vice versa',
  icon: '🖼️',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 模式切换
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';

    const toBase64Btn = document.createElement('button');
    toBase64Btn.className = 'toggle-button active';
    toBase64Btn.textContent = '图片 → Base64';
    toggleGroup.appendChild(toBase64Btn);

    const toImageBtn = document.createElement('button');
    toImageBtn.className = 'toggle-button';
    toImageBtn.textContent = 'Base64 → 图片';
    toggleGroup.appendChild(toImageBtn);

    wrapper.appendChild(toggleGroup);

    // 图片转Base64 区域
    const imgToBase64Div = document.createElement('div');
    imgToBase64Div.id = 'imgToBase64Section';

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

    // 预览和结果
    const previewGroup = document.createElement('div');
    previewGroup.className = 'input-output-group';

    const previewLabel = document.createElement('label');
    previewLabel.className = 'tool-label';
    previewLabel.textContent = '预览和结果:';
    previewGroup.appendChild(previewLabel);

    const previewArea = document.createElement('div');
    previewArea.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

    const imgPreview = document.createElement('img');
    imgPreview.id = 'imagePreview';
    imgPreview.style.cssText = 'max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid #e0e0e0; display: none;';
    previewArea.appendChild(imgPreview);

    const base64Output = document.createElement('textarea');
    base64Output.id = 'base64Output';
    base64Output.className = 'tool-textarea';
    base64Output.readOnly = true;
    base64Output.placeholder = 'Base64 字符串将显示在这里...';
    base64Output.style.minHeight = '80px';
    base64Output.style.fontFamily = 'monospace';
    base64Output.style.fontSize = '11px';
    previewArea.appendChild(base64Output);

    const copyBase64Btn = document.createElement('button');
    copyBase64Btn.className = 'btn-secondary';
    copyBase64Btn.style.marginTop = '8px';
    copyBase64Btn.textContent = '📋 复制 Base64';
    copyBase64Btn.onclick = async () => {
      if (base64Output.value) {
        await copyToClipboard(base64Output.value);
        showCopyFeedback(copyBase64Btn);
      }
    };
    previewArea.appendChild(copyBase64Btn);

    previewGroup.appendChild(previewArea);
    imgToBase64Div.appendChild(previewGroup);

    wrapper.appendChild(imgToBase64Div);

    // Base64转图片区域
    const base64ToImgDiv = document.createElement('div');
    base64ToImgDiv.id = 'base64ToImgSection';
    base64ToImgDiv.style.display = 'none';

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入 Base64 字符串:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const base64Input = document.createElement('textarea');
    base64Input.className = 'tool-textarea';
    base64Input.placeholder = '粘贴图片的 Base64 字符串...';
    base64Input.style.minHeight = '100px';
    base64Input.style.fontFamily = 'monospace';
    base64Input.style.fontSize = '11px';
    inputWrapper.appendChild(base64Input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        base64Input.value = text;
        convertBase64ToImage();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    inputGroup.appendChild(inputWrapper);
    base64ToImgDiv.appendChild(inputGroup);

    const convertBtnGroup = document.createElement('div');
    convertBtnGroup.className = 'button-group';

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn-primary';
    convertBtn.textContent = '🔄 转换为图片';
    convertBtnGroup.appendChild(convertBtn);

    base64ToImgDiv.appendChild(convertBtnGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '转换结果:';
    resultGroup.appendChild(resultLabel);

    const resultImg = document.createElement('img');
    resultImg.id = 'base64ImageResult';
    resultImg.style.cssText = 'max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #e0e0e0; display: none;';
    resultGroup.appendChild(resultImg);

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'btn-secondary';
    downloadBtn.style.marginTop = '8px';
    downloadBtn.style.display = 'none';
    downloadBtn.textContent = '💾 下载图片';
    resultGroup.appendChild(downloadBtn);

    base64ToImgDiv.appendChild(resultGroup);

    wrapper.appendChild(base64ToImgDiv);

    container.appendChild(wrapper);

    // 图片转Base64
    fileInput.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        imgPreview.src = base64;
        imgPreview.style.display = 'block';
        base64Output.value = base64;
      };
      reader.readAsDataURL(file);
    });

    // Base64转图片
    function convertBase64ToImage() {
      const base64 = base64Input.value.trim();

      if (!base64) {
        resultImg.style.display = 'none';
        downloadBtn.style.display = 'none';
        return;
      }

      try {
        resultImg.src = base64;
        resultImg.style.display = 'block';
        downloadBtn.style.display = 'inline-block';

        downloadBtn.onclick = () => {
          const link = document.createElement('a');
          link.href = base64;
          link.download = 'image.png';
          link.click();
        };
      } catch (err) {
        alert('无效的 Base64 字符串');
      }
    }

    convertBtn.onclick = convertBase64ToImage;

    // 模式切换
    toBase64Btn.onclick = () => {
      toBase64Btn.classList.add('active');
      toImageBtn.classList.remove('active');
      imgToBase64Div.style.display = 'block';
      base64ToImgDiv.style.display = 'none';
    };

    toImageBtn.onclick = () => {
      toImageBtn.classList.add('active');
      toBase64Btn.classList.remove('active');
      imgToBase64Div.style.display = 'none';
      base64ToImgDiv.style.display = 'block';
    };
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default ImageBase64Tool;

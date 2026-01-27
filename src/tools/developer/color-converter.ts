import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const ColorConverterTool: Tool = {
  id: 'color-converter',
  name: 'Color Converter',
  category: 'developer',
  description: 'Convert between HEX, RGB, HSL color formats',
  icon: '🎨',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 颜色选择器
    const pickerGroup = document.createElement('div');
    pickerGroup.className = 'input-output-group';

    const pickerLabel = document.createElement('label');
    pickerLabel.className = 'tool-label';
    pickerLabel.textContent = '选择颜色:';
    pickerGroup.appendChild(pickerLabel);

    const pickerWrapper = document.createElement('div');
    pickerWrapper.style.cssText = 'display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border-radius: 8px;';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.cssText = 'width: 60px; height: 40px; border: none; border-radius: 4px; cursor: pointer;';
    pickerWrapper.appendChild(colorInput);

    const hexDisplay = document.createElement('div');
    hexDisplay.style.cssText = 'flex: 1; font-family: monospace; font-size: 14px; color: #333;';
    hexDisplay.textContent = '#000000';
    pickerWrapper.appendChild(hexDisplay);

    pickerGroup.appendChild(pickerWrapper);
    wrapper.appendChild(pickerGroup);

    // 存储输入框引用
    const inputs: Record<string, HTMLInputElement> = {};

    // 辅助函数：创建输入组
    function createInputGroup(label: string, placeholder: string, onChange: (value: string) => void) {
      const group = document.createElement('div');
      group.className = 'input-output-group';

      const labelEl = document.createElement('label');
      labelEl.className = 'tool-label';
      labelEl.textContent = label;
      group.appendChild(labelEl);

      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'textarea-wrapper';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'tool-textarea';
      input.style.minHeight = 'auto';
      input.placeholder = placeholder;
      inputWrapper.appendChild(input);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn-copy';
      copyBtn.textContent = '📋 复制';
      copyBtn.onclick = async () => {
        if (input.value) {
          await copyToClipboard(input.value);
          showCopyFeedback(copyBtn);
        }
      };
      inputWrapper.appendChild(copyBtn);

      group.appendChild(inputWrapper);

      input.addEventListener('input', () => {
        onChange(input.value);
      });

      // 存储引用
      inputs[label] = input;

      return group;
    }

    // HEX 输入
    const hexGroup = createInputGroup('HEX 值:', '#', (value) => {
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        colorInput.value = value;
        updateColors(value);
      }
    });
    wrapper.appendChild(hexGroup);

    // RGB 输入
    const rgbGroup = createInputGroup('RGB 值:', 'rgb(0, 0, 0)', (value) => {
      const match = value.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        if (r <= 255 && g <= 255 && b <= 255) {
          const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
          colorInput.value = hex;
          updateColors(hex);
        }
      }
    });
    wrapper.appendChild(rgbGroup);

    // HSL 输入
    const hslGroup = createInputGroup('HSL 值:', 'hsl(0, 0%, 0%)', (value) => {
      const match = value.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/);
      if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        if (h <= 360 && s <= 100 && l <= 100) {
          const hex = hslToHex(h, s, l);
          colorInput.value = hex;
          updateColors(hex);
        }
      }
    });
    wrapper.appendChild(hslGroup);

    // 颜色预览
    const previewGroup = document.createElement('div');
    previewGroup.className = 'input-output-group';

    const previewLabel = document.createElement('label');
    previewLabel.className = 'tool-label';
    previewLabel.textContent = '颜色预览:';
    previewGroup.appendChild(previewLabel);

    const previewBox = document.createElement('div');
    previewBox.style.cssText = 'height: 80px; border-radius: 8px; border: 2px solid #e0e0e0; transition: background 0.2s;';
    previewBox.style.background = '#000000';
    previewGroup.appendChild(previewBox);

    wrapper.appendChild(previewGroup);

    container.appendChild(wrapper);

    // 更新颜色值
    function updateColors(hex: string) {
      // 更新显示
      hexDisplay.textContent = hex.toUpperCase();
      previewBox.style.background = hex;

      // 更新 RGB
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const rgbValue = `rgb(${r}, ${g}, ${b})`;
      inputs['RGB 值:'].value = rgbValue;

      // 更新 HSL
      const [h, s, l] = rgbToHsl(r, g, b);
      const hslValue = `hsl(${h}, ${s}%, ${l}%)`;
      inputs['HSL 值:'].value = hslValue;
    }

    // 颜色选择器变化
    colorInput.addEventListener('input', () => {
      updateColors(colorInput.value);
    });

    // 初始化
    updateColors('#000000');
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

// 辅助函数：RGB 转 HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// 辅助函数：HSL 转 HEX
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export default ColorConverterTool;

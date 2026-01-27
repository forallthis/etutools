import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const ColorPickerTool: Tool = {
  id: 'color-picker',
  name: 'Color Picker',
  category: 'developer',
  description: 'Interactive color picker with format conversion',
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
    pickerWrapper.style.cssText = 'display: flex; gap: 16px; align-items: center;';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.cssText = 'width: 100px; height: 60px; cursor: pointer; border: 2px solid #e0e0e0; border-radius: 8px;';
    pickerWrapper.appendChild(colorInput);

    const preview = document.createElement('div');
    preview.style.cssText = 'flex: 1; height: 60px; border-radius: 8px; border: 2px solid #e0e0e0; transition: background 0.3s;';
    preview.style.backgroundColor = '#007acc';
    pickerWrapper.appendChild(preview);

    pickerGroup.appendChild(pickerWrapper);
    wrapper.appendChild(pickerGroup);

    // 颜色值显示
    const valuesGroup = document.createElement('div');
    valuesGroup.className = 'info-display';
    valuesGroup.style.display = 'block';
    valuesGroup.style.marginTop = '12px';

    const valuesTitle = document.createElement('div');
    valuesTitle.style.cssText = 'font-weight: 600; margin-bottom: 12px; color: #007acc;';
    valuesTitle.textContent = '颜色值:';
    valuesGroup.appendChild(valuesTitle);

    wrapper.appendChild(valuesGroup);

    // 更新颜色值
    function updateColors(hexColor: string) {
      // 更新预览
      preview.style.backgroundColor = hexColor;

      // 清空旧值
      while (valuesGroup.children.length > 1) {
        valuesGroup.removeChild(valuesGroup.lastChild!);
      }

      // HEX
      const hexRow = document.createElement('div');
      hexRow.className = 'info-row';
      const hexLabel = document.createElement('span');
      hexLabel.className = 'info-label';
      hexLabel.textContent = 'HEX:';
      const hexValue = document.createElement('span');
      hexValue.className = 'info-value';
      hexValue.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
      const hexText = document.createElement('span');
      hexText.textContent = hexColor.toUpperCase();
      hexValue.appendChild(hexText);
      const hexCopy = document.createElement('button');
      hexCopy.className = 'btn-secondary';
      hexCopy.style.cssText = 'padding: 4px 10px; font-size: 11px;';
      hexCopy.textContent = '📋';
      hexCopy.onclick = async () => {
        await copyToClipboard(hexColor.toUpperCase());
        showCopyFeedback(hexCopy);
      };
      hexValue.appendChild(hexCopy);
      hexRow.appendChild(hexLabel);
      hexRow.appendChild(hexValue);
      valuesGroup.appendChild(hexRow);

      // RGB
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const rgb = `rgb(${r}, ${g}, ${b})`;
      
      const rgbRow = document.createElement('div');
      rgbRow.className = 'info-row';
      const rgbLabel = document.createElement('span');
      rgbLabel.className = 'info-label';
      rgbLabel.textContent = 'RGB:';
      const rgbValue = document.createElement('span');
      rgbValue.className = 'info-value';
      rgbValue.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
      const rgbText = document.createElement('span');
      rgbText.textContent = rgb;
      rgbValue.appendChild(rgbText);
      const rgbCopy = document.createElement('button');
      rgbCopy.className = 'btn-secondary';
      rgbCopy.style.cssText = 'padding: 4px 10px; font-size: 11px;';
      rgbCopy.textContent = '📋';
      rgbCopy.onclick = async () => {
        await copyToClipboard(rgb);
        showCopyFeedback(rgbCopy);
      };
      rgbValue.appendChild(rgbCopy);
      rgbRow.appendChild(rgbLabel);
      rgbRow.appendChild(rgbValue);
      valuesGroup.appendChild(rgbRow);

      // RGBA
      const rgba = `rgba(${r}, ${g}, ${b}, 1)`;
      
      const rgbaRow = document.createElement('div');
      rgbaRow.className = 'info-row';
      const rgbaLabel = document.createElement('span');
      rgbaLabel.className = 'info-label';
      rgbaLabel.textContent = 'RGBA:';
      const rgbaValue = document.createElement('span');
      rgbaValue.className = 'info-value';
      rgbaValue.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
      const rgbaText = document.createElement('span');
      rgbaText.textContent = rgba;
      rgbaValue.appendChild(rgbaText);
      const rgbaCopy = document.createElement('button');
      rgbaCopy.className = 'btn-secondary';
      rgbaCopy.style.cssText = 'padding: 4px 10px; font-size: 11px;';
      rgbaCopy.textContent = '📋';
      rgbaCopy.onclick = async () => {
        await copyToClipboard(rgba);
        showCopyFeedback(rgbaCopy);
      };
      rgbaValue.appendChild(rgbaCopy);
      rgbaRow.appendChild(rgbaLabel);
      rgbaRow.appendChild(rgbaValue);
      valuesGroup.appendChild(rgbaRow);

      // HSL
      const { h, s, l } = rgbToHsl(r, g, b);
      const hsl = `hsl(${h}, ${s}%, ${l}%)`;
      
      const hslRow = document.createElement('div');
      hslRow.className = 'info-row';
      const hslLabel = document.createElement('span');
      hslLabel.className = 'info-label';
      hslLabel.textContent = 'HSL:';
      const hslValue = document.createElement('span');
      hslValue.className = 'info-value';
      hslValue.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
      const hslText = document.createElement('span');
      hslText.textContent = hsl;
      hslValue.appendChild(hslText);
      const hslCopy = document.createElement('button');
      hslCopy.className = 'btn-secondary';
      hslCopy.style.cssText = 'padding: 4px 10px; font-size: 11px;';
      hslCopy.textContent = '📋';
      hslCopy.onclick = async () => {
        await copyToClipboard(hsl);
        showCopyFeedback(hslCopy);
      };
      hslValue.appendChild(hslCopy);
      hslRow.appendChild(hslLabel);
      hslRow.appendChild(hslValue);
      valuesGroup.appendChild(hslRow);

      // HSV
      const { h: hsvH, s: hsvS, v: hsvV } = rgbToHsv(r, g, b);
      const hsv = `hsv(${hsvH}, ${hsvS}%, ${hsvV}%)`;
      
      const hsvRow = document.createElement('div');
      hsvRow.className = 'info-row';
      const hsvLabel = document.createElement('span');
      hsvLabel.className = 'info-label';
      hsvLabel.textContent = 'HSV:';
      const hsvValue = document.createElement('span');
      hsvValue.className = 'info-value';
      hsvValue.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1;';
      const hsvText = document.createElement('span');
      hsvText.textContent = hsv;
      hsvValue.appendChild(hsvText);
      const hsvCopy = document.createElement('button');
      hsvCopy.className = 'btn-secondary';
      hsvCopy.style.cssText = 'padding: 4px 10px; font-size: 11px;';
      hsvCopy.textContent = '📋';
      hsvCopy.onclick = async () => {
        await copyToClipboard(hsv);
        showCopyFeedback(hsvCopy);
      };
      hsvValue.appendChild(hsvCopy);
      hsvRow.appendChild(hsvLabel);
      hsvRow.appendChild(hsvValue);
      valuesGroup.appendChild(hsvRow);
    }

    // RGB转HSL
    function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
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

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }

    // RGB转HSV
    function rgbToHsv(r: number, g: number, b: number): { h: number, s: number, v: number } {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      const v = max;
      const d = max - min;
      const s = max === 0 ? 0 : d / max;

      if (max !== min) {
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

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
      };
    }

    // 初始化
    updateColors('#007acc');

    // 监听颜色变化
    colorInput.addEventListener('input', () => {
      updateColors(colorInput.value);
    });

    container.appendChild(wrapper);
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default ColorPickerTool;

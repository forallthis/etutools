import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const UserAgentParserTool: Tool = {
  id: 'user-agent-parser',
  name: 'User-Agent Parser',
  category: 'utilities',
  description: 'Parse browser User-Agent strings',
  icon: '🌐',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = 'User-Agent 字符串:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '粘贴 User-Agent 字符串...';
    input.style.minHeight = '100px';
    input.style.fontFamily = 'monospace';
    input.style.fontSize = '12px';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        parse();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    const sampleBtn = document.createElement('button');
    sampleBtn.className = 'btn-copy';
    sampleBtn.textContent = '📝 示例';
    sampleBtn.style.marginLeft = '4px';
    sampleBtn.onclick = () => {
      input.value = navigator.userAgent;
      parse();
    };
    inputWrapper.appendChild(sampleBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const parseBtn = document.createElement('button');
    parseBtn.className = 'btn-primary';
    parseBtn.textContent = '🔍 解析';
    buttonGroup.appendChild(parseBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    clearBtn.onclick = () => {
      input.value = '';
      resultDiv.innerHTML = '';
    };
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '解析结果:';
    resultGroup.appendChild(resultLabel);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'info-display';
    resultDiv.style.display = 'block';
    resultDiv.style.marginTop = '12px';
    resultDiv.style.maxHeight = '400px';
    resultDiv.style.overflow = 'auto';
    resultGroup.appendChild(resultDiv);

    wrapper.appendChild(resultGroup);

    container.appendChild(wrapper);

    function parse() {
      resultDiv.innerHTML = '';

      const ua = input.value.trim();

      if (!ua) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'info-row';
        const emptyValue = document.createElement('span');
        emptyValue.className = 'info-value';
        emptyValue.textContent = '请输入 User-Agent 字符串';
        emptyRow.appendChild(emptyValue);
        resultDiv.appendChild(emptyRow);
        return;
      }

      const info: { label: string, value: string }[] = [];

      // 浏览器识别
      if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
        const match = ua.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/);
        if (match) {
          info.push({ label: '浏览器:', value: 'Google Chrome ' + match[1] });
        }
      } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
        const match = ua.match(/Version\/(\d+\.\d+)/);
        if (match) {
          info.push({ label: '浏览器:', value: 'Safari ' + match[1] });
        }
      } else if (ua.includes('Firefox/')) {
        const match = ua.match(/Firefox\/(\d+\.\d+)/);
        if (match) {
          info.push({ label: '浏览器:', value: 'Firefox ' + match[1] });
        }
      } else if (ua.includes('Edg/')) {
        const match = ua.match(/Edg\/(\d+\.\d+\.\d+\.\d+)/);
        if (match) {
          info.push({ label: '浏览器:', value: 'Microsoft Edge ' + match[1] });
        }
      } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
        const match = ua.match(/(OPR|Opera)\/(\d+\.\d+\.\d+\.\d+)/);
        if (match) {
          info.push({ label: '浏览器:', value: 'Opera ' + match[2] });
        }
      }

      // 操作系统识别
      if (ua.includes('Windows NT')) {
        const match = ua.match(/Windows NT (\d+\.\d+)/);
        if (match) {
          const winVersions: { [key: string]: string } = {
            '10.0': 'Windows 10/11',
            '6.3': 'Windows 8.1',
            '6.2': 'Windows 8',
            '6.1': 'Windows 7',
            '6.0': 'Windows Vista',
            '5.1': 'Windows XP'
          };
          const version = winVersions[match[1]] || 'Windows ' + match[1];
          info.push({ label: '操作系统:', value: version });
        }
      } else if (ua.includes('Mac OS X')) {
        const match = ua.match(/Mac OS X (\d+[_\.]\d+[_\.]\d+)/);
        if (match) {
          info.push({ label: '操作系统:', value: 'macOS ' + match[1].replace(/_/g, '.') });
        }
      } else if (ua.includes('Android')) {
        const match = ua.match(/Android (\d+\.\d+)/);
        if (match) {
          info.push({ label: '操作系统:', value: 'Android ' + match[1] });
        }
      } else if (ua.includes('iOS') || ua.includes('iPhone OS')) {
        const match = ua.match(/(iOS|iPhone OS) (\d+[_\.]\d+[_\.]\d+)/);
        if (match) {
          info.push({ label: '操作系统:', value: 'iOS ' + match[2].replace(/_/g, '.') });
        }
      } else if (ua.includes('Linux')) {
        info.push({ label: '操作系统:', value: 'Linux' });
      }

      // 架构
      if (ua.includes('WOW64') || ua.includes('Win64')) {
        info.push({ label: '架构:', value: '64-bit' });
      } else if (ua.includes('i686') || ua.includes('i386')) {
        info.push({ label: '架构:', value: '32-bit' });
      } else if (ua.includes('arm')) {
        info.push({ label: '架构:', value: 'ARM' });
      } else if (ua.includes('x86_64') || ua.includes('x64')) {
        info.push({ label: '架构:', value: '64-bit' });
      }

      // 渲染引擎
      if (ua.includes('AppleWebKit/')) {
        const match = ua.match(/AppleWebKit\/(\d+\.\d+)/);
        if (match) {
          info.push({ label: '渲染引擎:', value: 'WebKit ' + match[1] });
        }
      } else if (ua.includes('Gecko/')) {
        const match = ua.match(/Gecko\/(\d+)/);
        if (match) {
          info.push({ label: '渲染引擎:', value: 'Gecko ' + match[1] });
        }
      }

      // 设备类型
      if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) {
        info.push({ label: '设备类型:', value: '移动设备' });
      } else if (ua.includes('Tablet') || ua.includes('iPad')) {
        info.push({ label: '设备类型:', value: '平板设备' });
      } else {
        info.push({ label: '设备类型:', value: '桌面设备' });
      }

      // 显示基本信息
      if (info.length === 0) {
        const unknownRow = document.createElement('div');
        unknownRow.className = 'info-row';
        const unknownValue = document.createElement('span');
        unknownValue.className = 'info-value';
        unknownValue.style.color = '#dc3545';
        unknownValue.textContent = '❌ 无法识别此 User-Agent';
        unknownRow.appendChild(unknownValue);
        resultDiv.appendChild(unknownRow);
        return;
      }

      info.forEach(item => {
        const row = document.createElement('div');
        row.className = 'info-row';
        row.style.cssText = 'padding: 8px; background: #f8f9fa; border-radius: 4px;';

        const label = document.createElement('span');
        label.className = 'info-label';
        label.textContent = item.label;

        const value = document.createElement('span');
        value.className = 'info-value';
        value.textContent = item.value;

        row.appendChild(label);
        row.appendChild(value);
        resultDiv.appendChild(row);
      });

      // 原始信息
      const rawSection = document.createElement('div');
      rawSection.style.cssText = 'margin-top: 16px;';

      const rawLabel = document.createElement('div');
      rawLabel.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #007acc;';
      rawLabel.textContent = '原始信息:';
      rawSection.appendChild(rawLabel);

      const rawValue = document.createElement('div');
      rawValue.style.cssText = 'padding: 8px; background: #f8f9fa; border-radius: 4px; font-family: monospace; font-size: 11px; word-break: break-all; color: #666;';
      rawValue.textContent = ua;
      rawSection.appendChild(rawValue);

      resultDiv.appendChild(rawSection);
    }

    parseBtn.onclick = parse;
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default UserAgentParserTool;

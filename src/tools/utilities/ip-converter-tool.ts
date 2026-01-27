import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const IPConverterTool: Tool = {
  id: 'ip-converter',
  name: 'IP Converter',
  category: 'utilities',
  description: 'Convert between IP address and integer',
  icon: '🌐',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 模式切换
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';

    const ipToIntBtn = document.createElement('button');
    ipToIntBtn.className = 'toggle-button active';
    ipToIntBtn.textContent = 'IP → 整数';
    toggleGroup.appendChild(ipToIntBtn);

    const intToIpBtn = document.createElement('button');
    intToIpBtn.className = 'toggle-button';
    intToIpBtn.textContent = '整数 → IP';
    toggleGroup.appendChild(intToIpBtn);

    wrapper.appendChild(toggleGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.id = 'inputLabel';
    inputLabel.textContent = '输入 IP 地址:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tool-textarea';
    input.style.minHeight = 'auto';
    input.placeholder = '例如: 192.168.1.1';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        convert();
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

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn-primary';
    convertBtn.textContent = '🔄 转换';
    buttonGroup.appendChild(convertBtn);

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
    resultLabel.textContent = '转换结果:';
    resultGroup.appendChild(resultLabel);

    const resultOutput = document.createElement('textarea');
    resultOutput.className = 'tool-textarea';
    resultOutput.readOnly = true;
    resultOutput.placeholder = '转换结果将显示在这里...';
    resultOutput.style.minHeight = '80px';
    resultGroup.appendChild(resultOutput);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-secondary';
    copyBtn.style.marginTop = '8px';
    copyBtn.textContent = '📋 复制';
    copyBtn.onclick = async () => {
      if (resultOutput.value) {
        await copyToClipboard(resultOutput.value);
        showCopyFeedback(copyBtn);
      }
    };
    resultGroup.appendChild(copyBtn);

    wrapper.appendChild(resultGroup);

    // 详细信息
    const detailGroup = document.createElement('div');
    detailGroup.className = 'info-display';
    detailGroup.style.display = 'block';
    detailGroup.style.marginTop = '12px';

    const detailLabel = document.createElement('div');
    detailLabel.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #007acc;';
    detailLabel.textContent = '详细信息:';
    detailGroup.appendChild(detailLabel);

    wrapper.appendChild(detailGroup);

    container.appendChild(wrapper);

    let mode: 'ipToInt' | 'intToIp' = 'ipToInt';

    // IP地址转整数
    function ipToInt(ip: string): number {
      const parts = ip.split('.');
      if (parts.length !== 4) {
        throw new Error('Invalid IP address format');
      }

      let result = 0;
      for (let i = 0; i < 4; i++) {
        const part = parseInt(parts[i]);
        if (isNaN(part) || part < 0 || part > 255) {
          throw new Error('Invalid octet: ' + parts[i]);
        }
        result = (result << 8) + part;
      }

      return result >>> 0; // 确保是无符号32位整数
    }

    // 整数转IP地址
    function intToIp(int: number): string {
      if (int < 0 || int > 0xFFFFFFFF) {
        throw new Error('Integer out of range for IPv4');
      }

      return [
        (int >>> 24) & 0xFF,
        (int >>> 16) & 0xFF,
        (int >>> 8) & 0xFF,
        int & 0xFF
      ].join('.');
    }

    // 获取IP类别信息
    function getIPInfo(ip: string): Array<{label: string, value: string}> {
      const parts = ip.split('.').map(p => parseInt(p));
      const firstOctet = parts[0];

      let type = '';
      let range = '';

      if (firstOctet >= 1 && firstOctet <= 126) {
        type = 'A类地址';
        range = '1.0.0.0 - 126.255.255.255';
      } else if (firstOctet >= 128 && firstOctet <= 191) {
        type = 'B类地址';
        range = '128.0.0.0 - 191.255.255.255';
      } else if (firstOctet >= 192 && firstOctet <= 223) {
        type = 'C类地址';
        range = '192.0.0.0 - 223.255.255.255';
      } else if (firstOctet >= 224 && firstOctet <= 239) {
        type = 'D类地址 (组播)';
        range = '224.0.0.0 - 239.255.255.255';
      } else if (firstOctet >= 240 && firstOctet <= 255) {
        type = 'E类地址 (保留)';
        range = '240.0.0.0 - 255.255.255.255';
      }

      // 特殊地址
      if (ip === '127.0.0.1' || ip.startsWith('127.')) {
        type = '回环地址';
        range = '127.0.0.0/8';
      } else if (ip.startsWith('10.') || 
                 (firstOctet === 172 && parts[1] >= 16 && parts[1] <= 31) ||
                 (firstOctet === 192 && parts[1] === 168)) {
        type = '私有地址';
      }

      // 二进制表示
      const binary = parts.map(p => p.toString(2).padStart(8, '0')).join('.');

      // 十六进制表示
      const hex = parts.map(p => p.toString(16).padStart(2, '0').toUpperCase()).join(':');

      return [
        { label: 'IP类别:', value: type },
        { label: '地址范围:', value: range },
        { label: '二进制:', value: binary },
        { label: '十六进制:', value: hex }
      ];
    }

    function convert() {
      errorDiv.style.display = 'none';
      resultOutput.value = '';

      // 清空详细信息
      while (detailGroup.children.length > 1) {
        detailGroup.removeChild(detailGroup.lastChild!);
      }

      const inputValue = input.value.trim();

      if (!inputValue) {
        errorDiv.textContent = '❌ 请输入内容';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        if (mode === 'ipToInt') {
          // IP 转 整数
          const int = ipToInt(inputValue);
          resultOutput.value = int.toString();

          // 显示详细信息
          const info = getIPInfo(inputValue);
          info.forEach(item => {
            const row = document.createElement('div');
            row.className = 'info-row';
            row.style.cssText = 'padding: 4px 0;';

            const label = document.createElement('span');
            label.className = 'info-label';
            label.textContent = item.label;

            const value = document.createElement('span');
            value.className = 'info-value';
            value.textContent = item.value;

            row.appendChild(label);
            row.appendChild(value);
            detailGroup.appendChild(row);
          });
        } else {
          // 整数 转 IP
          const int = parseInt(inputValue);
          if (isNaN(int)) {
            throw new Error('Invalid integer');
          }
          const ip = intToIp(int);
          resultOutput.value = ip;

          // 显示详细信息
          const info = getIPInfo(ip);
          info.forEach(item => {
            const row = document.createElement('div');
            row.className = 'info-row';
            row.style.cssText = 'padding: 4px 0;';

            const label = document.createElement('span');
            label.className = 'info-label';
            label.textContent = item.label;

            const value = document.createElement('span');
            value.className = 'info-value';
            value.textContent = item.value;

            row.appendChild(label);
            row.appendChild(value);
            detailGroup.appendChild(row);
          });
        }
      } catch (err) {
        errorDiv.textContent = '❌ ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    convertBtn.onclick = convert;

    // 回车转换
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        convert();
      }
    });

    // 模式切换
    ipToIntBtn.onclick = () => {
      mode = 'ipToInt';
      ipToIntBtn.classList.add('active');
      intToIpBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入 IP 地址:';
      input.placeholder = '例如: 192.168.1.1';
    };

    intToIpBtn.onclick = () => {
      mode = 'intToIp';
      intToIpBtn.classList.add('active');
      ipToIntBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入整数:';
      input.placeholder = '例如: 3232235777';
    };
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default IPConverterTool;

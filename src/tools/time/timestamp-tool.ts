import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const TimestampTool: Tool = {
  id: 'timestamp',
  name: 'Unix Timestamp',
  category: 'time',
  description: 'Convert timestamps',
  icon: '⏰',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 当前时间戳
    const currentTimeDiv = document.createElement('div');
    currentTimeDiv.className = 'info-display';

    const updateCurrentTime = () => {
      const now = Math.floor(Date.now() / 1000);
      currentTimeDiv.textContent = '';

      const row1 = document.createElement('div');
      row1.className = 'info-row';
      const label1 = document.createElement('span');
      label1.className = 'info-label';
      label1.textContent = '当前时间戳 (秒):';
      const value1 = document.createElement('span');
      value1.className = 'info-value';
      value1.textContent = now.toString();
      row1.appendChild(label1);
      row1.appendChild(value1);
      currentTimeDiv.appendChild(row1);

      const row2 = document.createElement('div');
      row2.className = 'info-row';
      const label2 = document.createElement('span');
      label2.className = 'info-label';
      label2.textContent = '当前时间戳 (毫秒):';
      const value2 = document.createElement('span');
      value2.className = 'info-value';
      value2.textContent = Date.now().toString();
      row2.appendChild(label2);
      row2.appendChild(value2);
      currentTimeDiv.appendChild(row2);

      const row3 = document.createElement('div');
      row3.className = 'info-row';
      const label3 = document.createElement('span');
      label3.className = 'info-label';
      label3.textContent = '当前日期时间:';
      const value3 = document.createElement('span');
      value3.className = 'info-value';
      value3.textContent = new Date().toLocaleString('zh-CN');
      row3.appendChild(label3);
      row3.appendChild(value3);
      currentTimeDiv.appendChild(row3);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);
    wrapper.appendChild(currentTimeDiv);

    // 转换区域
    const convertGroup = document.createElement('div');
    convertGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入时间戳或日期时间:';
    convertGroup.appendChild(inputLabel);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tool-textarea';
    input.style.minHeight = 'auto';
    input.placeholder = '例如: 1234567890 或 2024-01-01 12:00:00';
    convertGroup.appendChild(input);

    wrapper.appendChild(convertGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn-primary';
    convertBtn.textContent = '🔄 转换';
    buttonGroup.appendChild(convertBtn);

    const nowBtn = document.createElement('button');
    nowBtn.className = 'btn-secondary';
    nowBtn.textContent = '⏰ 当前时间';
    buttonGroup.appendChild(nowBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultDiv = document.createElement('div');
    resultDiv.className = 'info-display';
    resultDiv.style.display = 'none';
    wrapper.appendChild(resultDiv);

    container.appendChild(wrapper);

    // 清理定时器
    container.addEventListener('DOMNodeRemoved', () => {
      clearInterval(intervalId);
    });

    // 转换功能
    convertBtn.onclick = () => {
      resultDiv.style.display = 'none';
      resultDiv.textContent = '';
      const value = input.value.trim();

      if (!value) {
        return;
      }

      // 尝试作为数字（时间戳）
      if (/^\d+$/.test(value)) {
        const timestamp = parseInt(value);
        const date = new Date(value.length > 10 ? timestamp : timestamp * 1000);

        const row1 = document.createElement('div');
        row1.className = 'info-row';
        const label1 = document.createElement('span');
        label1.className = 'info-label';
        label1.textContent = '时间戳 (秒):';
        const value1 = document.createElement('span');
        value1.className = 'info-value';
        value1.textContent = Math.floor(date.getTime() / 1000).toString();
        row1.appendChild(label1);
        row1.appendChild(value1);
        resultDiv.appendChild(row1);

        const row2 = document.createElement('div');
        row2.className = 'info-row';
        const label2 = document.createElement('span');
        label2.className = 'info-label';
        label2.textContent = '时间戳 (毫秒):';
        const value2 = document.createElement('span');
        value2.className = 'info-value';
        value2.textContent = date.getTime().toString();
        row2.appendChild(label2);
        row2.appendChild(value2);
        resultDiv.appendChild(row2);

        const row3 = document.createElement('div');
        row3.className = 'info-row';
        const label3 = document.createElement('span');
        label3.className = 'info-label';
        label3.textContent = '日期时间:';
        const value3 = document.createElement('span');
        value3.className = 'info-value';
        value3.textContent = date.toLocaleString('zh-CN');
        row3.appendChild(label3);
        row3.appendChild(value3);
        resultDiv.appendChild(row3);

        const row4 = document.createElement('div');
        row4.className = 'info-row';
        const label4 = document.createElement('span');
        label4.className = 'info-label';
        label4.textContent = 'ISO 8601:';
        const value4 = document.createElement('span');
        value4.className = 'info-value';
        value4.textContent = date.toISOString();
        row4.appendChild(label4);
        row4.appendChild(value4);
        resultDiv.appendChild(row4);

        const row5 = document.createElement('div');
        row5.className = 'info-row';
        const label5 = document.createElement('span');
        label5.className = 'info-label';
        label5.textContent = 'UTC:';
        const value5 = document.createElement('span');
        value5.className = 'info-value';
        value5.textContent = date.toUTCString();
        row5.appendChild(label5);
        row5.appendChild(value5);
        resultDiv.appendChild(row5);

        // 添加复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-secondary';
        copyBtn.style.marginTop = '8px';
        copyBtn.textContent = '📋 复制结果';
        copyBtn.onclick = async () => {
          const lines: string[] = [];
          resultDiv.querySelectorAll('.info-row').forEach(row => {
            const label = row.querySelector('.info-label')?.textContent || '';
            const value = row.querySelector('.info-value')?.textContent || '';
            lines.push(`${label} ${value}`);
          });
          const text = lines.join('\n');
          await copyToClipboard(text);
          showCopyFeedback(copyBtn);
        };
        resultDiv.appendChild(copyBtn);

        resultDiv.style.display = 'block';
      } else {
        // 尝试作为日期时间字符串
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const row1 = document.createElement('div');
          row1.className = 'info-row';
          const label1 = document.createElement('span');
          label1.className = 'info-label';
          label1.textContent = '时间戳 (秒):';
          const value1 = document.createElement('span');
          value1.className = 'info-value';
          value1.textContent = Math.floor(date.getTime() / 1000).toString();
          row1.appendChild(label1);
          row1.appendChild(value1);
          resultDiv.appendChild(row1);

          const row2 = document.createElement('div');
          row2.className = 'info-row';
          const label2 = document.createElement('span');
          label2.className = 'info-label';
          label2.textContent = '时间戳 (毫秒):';
          const value2 = document.createElement('span');
          value2.className = 'info-value';
          value2.textContent = date.getTime().toString();
          row2.appendChild(label2);
          row2.appendChild(value2);
          resultDiv.appendChild(row2);

          const row3 = document.createElement('div');
          row3.className = 'info-row';
          const label3 = document.createElement('span');
          label3.className = 'info-label';
          label3.textContent = '日期时间:';
          const value3 = document.createElement('span');
          value3.className = 'info-value';
          value3.textContent = date.toLocaleString('zh-CN');
          row3.appendChild(label3);
          row3.appendChild(value3);
          resultDiv.appendChild(row3);

          const row4 = document.createElement('div');
          row4.className = 'info-row';
          const label4 = document.createElement('span');
          label4.className = 'info-label';
          label4.textContent = 'ISO 8601:';
          const value4 = document.createElement('span');
          value4.className = 'info-value';
          value4.textContent = date.toISOString();
          row4.appendChild(label4);
          row4.appendChild(value4);
          resultDiv.appendChild(row4);

          // 添加复制按钮
          const copyBtn = document.createElement('button');
          copyBtn.className = 'btn-secondary';
          copyBtn.style.marginTop = '8px';
          copyBtn.textContent = '📋 复制结果';
          copyBtn.onclick = async () => {
            const lines: string[] = [];
            resultDiv.querySelectorAll('.info-row').forEach(row => {
              const label = row.querySelector('.info-label')?.textContent || '';
              const val = row.querySelector('.info-value')?.textContent || '';
              lines.push(`${label} ${val}`);
            });
            const text = lines.join('\n');
            await copyToClipboard(text);
            showCopyFeedback(copyBtn);
          };
          resultDiv.appendChild(copyBtn);

          resultDiv.style.display = 'block';
        } else {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.textContent = '❌ 无法识别的格式';
          resultDiv.appendChild(errorMsg);
          resultDiv.style.display = 'block';
        }
      }
    };

    // 当前时间按钮
    nowBtn.onclick = () => {
      input.value = Math.floor(Date.now() / 1000).toString();
      convertBtn.click();
    };

    // 回车转换
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        convertBtn.click();
      }
    });
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default TimestampTool;

import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const CSVToJSONTool: Tool = {
  id: 'csv-to-json',
  name: 'CSV to JSON',
  category: 'text',
  description: 'Convert CSV format to JSON',
  icon: '📋',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 选项
    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'display: flex; gap: 16px; margin: 12px 0; flex-wrap: wrap;';

    const delimiterGroup = document.createElement('div');
    delimiterGroup.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    const delimiterLabel = document.createElement('label');
    delimiterLabel.textContent = '分隔符:';
    delimiterLabel.style.cssText = 'font-size: 13px; color: #666;';
    delimiterGroup.appendChild(delimiterLabel);

    const delimiterSelect = document.createElement('select');
    delimiterSelect.className = 'btn-secondary';
    delimiterSelect.style.cssText = 'padding: 4px 8px;';
    const delimiters = [
      { value: ',', label: '逗号 (,)' },
      { value: ';', label: '分号 (;)' },
      { value: '\t', label: '制表符' },
      { value: '|', label: '竖线 (|)' }
    ];
    delimiters.forEach(del => {
      const option = document.createElement('option');
      option.value = del.value;
      option.textContent = del.label;
      delimiterSelect.appendChild(option);
    });
    delimiterGroup.appendChild(delimiterSelect);
    optionsGroup.appendChild(delimiterGroup);

    const headerOption = document.createElement('label');
    headerOption.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const headerCheckbox = document.createElement('input');
    headerCheckbox.type = 'checkbox';
    headerCheckbox.checked = true;
    headerCheckbox.style.cursor = 'pointer';
    headerOption.appendChild(headerCheckbox);
    const headerText = document.createElement('span');
    headerText.textContent = '第一行作为标题';
    headerOption.appendChild(headerText);
    optionsGroup.appendChild(headerOption);

    const trimOption = document.createElement('label');
    trimOption.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const trimCheckbox = document.createElement('input');
    trimCheckbox.type = 'checkbox';
    trimCheckbox.checked = true;
    trimCheckbox.style.cursor = 'pointer';
    trimOption.appendChild(trimCheckbox);
    const trimText = document.createElement('span');
    trimText.textContent = '去除空格';
    trimOption.appendChild(trimText);
    optionsGroup.appendChild(trimOption);

    wrapper.appendChild(optionsGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入 CSV:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = 'name,age,city\nJohn,30,New York\nJane,25,Boston';
    input.style.minHeight = '120px';
    input.style.fontFamily = 'monospace';
    input.style.fontSize = '13px';
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

    const loadSampleBtn = document.createElement('button');
    loadSampleBtn.className = 'btn-copy';
    loadSampleBtn.textContent = '📝 示例';
    loadSampleBtn.style.marginLeft = '4px';
    loadSampleBtn.onclick = () => {
      input.value = 'name,age,city,active\nJohn,30,New York,true\nJane,25,Boston,false\nBob,35,Chicago,true';
      convert();
    };
    inputWrapper.appendChild(loadSampleBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn-primary';
    convertBtn.textContent = '🔄 转换为 JSON';
    buttonGroup.appendChild(convertBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    clearBtn.onclick = () => {
      input.value = '';
      output.value = '';
    };
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 输出区域
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.textContent = 'JSON 结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = 'JSON 结果将显示在这里...';
    output.style.minHeight = '150px';
    output.style.fontFamily = 'monospace';
    output.style.fontSize = '13px';
    outputWrapper.appendChild(output);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-copy';
    copyBtn.textContent = '📋 复制';
    copyBtn.onclick = async () => {
      if (output.value) {
        await copyToClipboard(output.value);
        showCopyFeedback(copyBtn);
      }
    };
    outputWrapper.appendChild(copyBtn);

    outputGroup.appendChild(outputWrapper);
    wrapper.appendChild(outputGroup);

    container.appendChild(wrapper);

    // 解析 CSV
    function parseCSV(text: string, delimiter: string): string[][] {
      const lines: string[][] = [];
      let currentLine: string[] = [];
      let currentField = '';
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            currentField += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          currentLine.push(currentField);
          currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
          if (char === '\r' && nextChar === '\n') {
            i++;
          }
          currentLine.push(currentField);
          if (currentLine.length > 0 || currentField !== '') {
            lines.push(currentLine);
          }
          currentLine = [];
          currentField = '';
        } else {
          currentField += char;
        }
      }

      if (currentField || currentLine.length > 0) {
        currentLine.push(currentField);
        lines.push(currentLine);
      }

      return lines;
    }

    // 转换为 JSON
    function convert() {
      errorDiv.style.display = 'none';
      output.value = '';

      const csvText = input.value.trim();

      if (!csvText) {
        errorDiv.textContent = '❌ 请输入 CSV 数据';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        const delimiter = delimiterSelect.value;
        const hasHeader = headerCheckbox.checked;
        const shouldTrim = trimCheckbox.checked;

        const rows = parseCSV(csvText, delimiter);

        if (rows.length === 0) {
          errorDiv.textContent = '❌ CSV 数据为空';
          errorDiv.style.display = 'block';
          return;
        }

        let result: any;

        if (hasHeader) {
          const headers = rows[0];
          const data = rows.slice(1);

          if (shouldTrim) {
            for (let i = 0; i < headers.length; i++) {
              headers[i] = headers[i].trim();
            }
          }

          result = data.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              let value = row[index] || '';

              if (shouldTrim) {
                value = value.trim();
              }

              // 尝试转换为数字
              if (value === '' || value.toLowerCase() === 'null') {
                obj[header] = null;
              } else if (value.toLowerCase() === 'true') {
                obj[header] = true;
              } else if (value.toLowerCase() === 'false') {
                obj[header] = false;
              } else if (!isNaN(Number(value))) {
                obj[header] = Number(value);
              } else {
                obj[header] = value;
              }
            });
            return obj;
          });
        } else {
          result = rows.map(row => {
            if (shouldTrim) {
              return row.map(field => field.trim());
            }
            return row;
          });
        }

        output.value = JSON.stringify(result, null, 2);

        // 显示统计信息
        const stats = document.createElement('div');
        stats.style.cssText = 'margin-top: 8px; padding: 8px; background: #e8f4f8; border-radius: 6px; font-size: 12px; color: #007acc;';
        const itemCount = Array.isArray(result) ? result.length : 0;
        stats.textContent = `✅ 成功转换 ${itemCount} 条记录`;
        outputWrapper.appendChild(stats);

      } catch (err) {
        errorDiv.textContent = '❌ 转换失败: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    convertBtn.onclick = convert;
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default CSVToJSONTool;

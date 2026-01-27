import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const SQLFormatterTool: Tool = {
  id: 'sql-formatter',
  name: 'SQL Formatter',
  category: 'developer',
  description: 'Format and beautify SQL queries',
  icon: '🗃️',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 选项
    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'display: flex; gap: 16px; margin: 12px 0; flex-wrap: wrap;';

    const uppercaseOption = document.createElement('label');
    uppercaseOption.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const uppercaseCheckbox = document.createElement('input');
    uppercaseCheckbox.type = 'checkbox';
    uppercaseCheckbox.checked = true;
    uppercaseCheckbox.style.cursor = 'pointer';
    uppercaseOption.appendChild(uppercaseCheckbox);
    const uppercaseText = document.createElement('span');
    uppercaseText.textContent = '关键字大写';
    uppercaseOption.appendChild(uppercaseText);
    optionsGroup.appendChild(uppercaseOption);

    const commasOption = document.createElement('label');
    commasOption.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const commasCheckbox = document.createElement('input');
    commasCheckbox.type = 'checkbox';
    commasCheckbox.checked = true;
    commasCheckbox.style.cursor = 'pointer';
    commasOption.appendChild(commasCheckbox);
    const commasText = document.createElement('span');
    commasText.textContent = '逗号前置';
    commasOption.appendChild(commasText);
    optionsGroup.appendChild(commasOption);

    wrapper.appendChild(optionsGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入 SQL:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = 'SELECT * FROM users WHERE id = 1 AND name = "John"';
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
        format();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-copy';
    clearBtn.textContent = '🗑️ 清空';
    clearBtn.style.marginLeft = '4px';
    clearBtn.onclick = () => {
      input.value = '';
      output.value = '';
    };
    inputWrapper.appendChild(clearBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const formatBtn = document.createElement('button');
    formatBtn.className = 'btn-primary';
    formatBtn.textContent = '✨ 格式化';
    buttonGroup.appendChild(formatBtn);

    const compressBtn = document.createElement('button');
    compressBtn.className = 'btn-secondary';
    compressBtn.textContent = '🗜️ 压缩';
    compressBtn.onclick = () => {
      output.value = compressSQL(input.value);
    };
    buttonGroup.appendChild(compressBtn);

    wrapper.appendChild(buttonGroup);

    // 输出区域
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.textContent = '格式化结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '格式化后的 SQL 将显示在这里...';
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

    // SQL 关键字
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
      'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
      'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
      'ON', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
      'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT',
      'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'COLUMN',
      'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT',
      'DISTINCT', 'AS', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
      'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS',
      'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'GROUP_CONCAT'
    ];

    // 格式化 SQL
    function formatSQL(sql: string): string {
      const uppercaseKeywords = uppercaseCheckbox.checked;
      const commasBefore = commasCheckbox.checked;

      let formatted = sql.trim();

      // 关键字大写
      if (uppercaseKeywords) {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          formatted = formatted.replace(regex, keyword);
        });
      }

      // 移除多余空格和换行
      formatted = formatted.replace(/\s+/g, ' ');

      // 在关键字前后添加换行
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\s+${keyword}\\s+`, 'gi');
        formatted = formatted.replace(regex, `\n  ${keyword} `);
      });

      // 处理逗号
      if (commasBefore) {
        formatted = formatted.replace(/,\s*/g, '\n  , ');
      }

      // 处理括号
      formatted = formatted.replace(/\(\s*/g, '(\n    ');
      formatted = formatted.replace(/\s*\)/g, '\n  )');

      // 清理多余空行
      formatted = formatted.replace(/\n\s*\n/g, '\n');

      // 修复缩进
      const lines = formatted.split('\n');
      let indent = 0;
      const result: string[] = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.startsWith(')')) {
          indent = Math.max(0, indent - 1);
        }

        result.push('  '.repeat(indent) + trimmed);

        if (trimmed.endsWith('(')) {
          indent++;
        }
      });

      return result.join('\n');
    }

    // 压缩 SQL
    function compressSQL(sql: string): string {
      return sql
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*=\s*/g, '=')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*;\s*/g, ';')
        .trim();
    }

    function format() {
      output.value = formatSQL(input.value);
    }

    formatBtn.onclick = format;
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default SQLFormatterTool;

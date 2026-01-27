import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const XMLFormatterTool: Tool = {
  id: 'xml-formatter',
  name: 'XML Formatter',
  category: 'developer',
  description: 'Format and validate XML documents',
  icon: '📄',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 选项
    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'display: flex; gap: 16px; margin: 12px 0; flex-wrap: wrap;';

    const indentOption = document.createElement('div');
    indentOption.style.cssText = 'display: flex; align-items: center; gap: 6px;';
    const indentLabel = document.createElement('label');
    indentLabel.textContent = '缩进:';
    indentLabel.style.cssText = 'font-size: 13px; color: #666;';
    indentOption.appendChild(indentLabel);

    const indentSelect = document.createElement('select');
    indentSelect.className = 'btn-secondary';
    indentSelect.style.cssText = 'padding: 4px 8px;';
    const indents = [
      { value: '2', label: '2空格' },
      { value: '4', label: '4空格' },
      { value: '8', label: '8空格' },
      { value: 'tab', label: '制表符' }
    ];
    indents.forEach(indent => {
      const option = document.createElement('option');
      option.value = indent.value;
      option.textContent = indent.label;
      indentSelect.appendChild(option);
    });
    indentOption.appendChild(indentSelect);
    optionsGroup.appendChild(indentOption);

    const compressOption = document.createElement('label');
    compressOption.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const compressCheckbox = document.createElement('input');
    compressCheckbox.type = 'checkbox';
    compressCheckbox.style.cursor = 'pointer';
    compressOption.appendChild(compressCheckbox);
    const compressText = document.createElement('span');
    compressText.textContent = '压缩XML';
    compressOption.appendChild(compressText);
    optionsGroup.appendChild(compressOption);

    wrapper.appendChild(optionsGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入 XML:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '<root><person><name>John</name><age>30</age></person></root>';
    input.style.minHeight = '150px';
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
      output.value = compressXML(input.value);
    };
    buttonGroup.appendChild(compressBtn);

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
    outputLabel.textContent = '格式化结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '格式化后的 XML 将显示在这里...';
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

    function format() {
      errorDiv.style.display = 'none';
      output.value = '';

      const xml = input.value.trim();

      if (!xml) {
        errorDiv.textContent = '❌ 请输入 XML';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        const shouldCompress = compressCheckbox.checked;
        const indentSize = indentSelect.value;

        if (shouldCompress) {
          output.value = compressXML(xml);
        } else {
          output.value = formatXML(xml, indentSize);
        }
      } catch (err) {
        errorDiv.textContent = '❌ XML 格式错误: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    function formatXML(xml: string, indentSize: string): string {
      let formatted = '';
      let indent = 0;
      const indentStr = indentSize === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize));

      // 移除现有格式
      xml = xml.replace(/\s+</g, '<').replace(/>\s+/g, '>');

      let i = 0;
      while (i < xml.length) {
        if (xml.substr(i, 2) === '</') {
          // 结束标签
          indent = Math.max(0, indent - 1);
          formatted += indentStr.repeat(indent) + xml.substr(i, xml.indexOf('>', i) + 1 - i) + '\n';
          i = xml.indexOf('>', i) + 1;
        } else if (xml[i] === '<') {
          // 开始标签
          const tagEnd = xml.indexOf('>', i);
          const tag = xml.substring(i + 1, tagEnd);

          if (tag.startsWith('?') || tag.startsWith('!')) {
            // 处理指令或注释
            formatted += xml.substring(i, tagEnd + 1) + '\n';
            i = tagEnd + 1;
          } else if (tag.endsWith('/')) {
            // 自闭合标签
            formatted += indentStr.repeat(indent) + xml.substring(i, tagEnd + 1) + '\n';
            i = tagEnd + 1;
          } else {
            // 开始标签
            formatted += indentStr.repeat(indent) + xml.substring(i, tagEnd + 1) + '\n';
            indent++;
            i = tagEnd + 1;
          }
        } else {
          // 文本内容
          const nextTag = xml.indexOf('<', i);
          if (nextTag === -1) {
            formatted += xml.substring(i) + '\n';
            break;
          }
          const text = xml.substring(i, nextTag).trim();
          if (text) {
            formatted += indentStr.repeat(indent) + text + '\n';
          }
          i = nextTag;
        }
      }

      return formatted.trim();
    }

    function compressXML(xml: string): string {
      return xml
        .replace(/\s+</g, '<')
        .replace(/>\s+/g, '>')
        .replace(/<!--.*?-->/g, '') // 移除注释
        .replace(/<\?[^>]*\?>/g, '') // 移除处理指令
        .trim();
    }

    formatBtn.onclick = format;
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default XMLFormatterTool;

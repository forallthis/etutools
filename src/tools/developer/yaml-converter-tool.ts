import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';
import * as yaml from 'js-yaml';

const YAMLConverterTool: Tool = {
  id: 'yaml-converter',
  name: 'YAML Converter',
  category: 'developer',
  description: 'Convert between YAML and JSON formats',
  icon: '🔄',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 模式切换
    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';

    const yamlToJsonBtn = document.createElement('button');
    yamlToJsonBtn.className = 'toggle-button active';
    yamlToJsonBtn.textContent = 'YAML → JSON';
    toggleGroup.appendChild(yamlToJsonBtn);

    const jsonToYamlBtn = document.createElement('button');
    jsonToYamlBtn.className = 'toggle-button';
    jsonToYamlBtn.textContent = 'JSON → YAML';
    toggleGroup.appendChild(jsonToYamlBtn);

    wrapper.appendChild(toggleGroup);

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.id = 'inputLabel';
    inputLabel.textContent = '输入 YAML:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = `name: John Doe
age: 30
city: New York
hobbies:
  - reading
  - gaming
  - coding`;
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
    outputLabel.id = 'outputLabel';
    outputLabel.textContent = 'JSON 结果:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = '转换结果将显示在这里...';
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

    let mode: 'yamlToJson' | 'jsonToYaml' = 'yamlToJson';

    function convert() {
      errorDiv.style.display = 'none';
      output.value = '';

      const text = input.value.trim();

      if (!text) {
        errorDiv.textContent = '❌ 请输入内容';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        if (mode === 'yamlToJson') {
          // YAML 转 JSON
          const obj = yaml.load(text);
          output.value = JSON.stringify(obj, null, 2);
        } else {
          // JSON 转 YAML
          const obj = JSON.parse(text);
          output.value = yaml.dump(obj, {
            indent: 2,
            lineWidth: -1,
            noRefs: true
          });
        }
      } catch (err) {
        const errorMsg = mode === 'yamlToJson' ? 'YAML' : 'JSON';
        errorDiv.textContent = `❌ ${errorMsg} 格式错误: ` + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    convertBtn.onclick = convert;

    // 模式切换
    yamlToJsonBtn.onclick = () => {
      mode = 'yamlToJson';
      yamlToJsonBtn.classList.add('active');
      jsonToYamlBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入 YAML:';
      document.getElementById('outputLabel')!.textContent = 'JSON 结果:';
      input.placeholder = `name: John Doe
age: 30
city: New York
hobbies:
  - reading
  - gaming`;
    };

    jsonToYamlBtn.onclick = () => {
      mode = 'jsonToYaml';
      jsonToYamlBtn.classList.add('active');
      yamlToJsonBtn.classList.remove('active');
      document.getElementById('inputLabel')!.textContent = '输入 JSON:';
      document.getElementById('outputLabel')!.textContent = 'YAML 结果:';
      input.placeholder = '{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York"\n}';
    };
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default YAMLConverterTool;

import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const UUIDGeneratorTool: Tool = {
  id: 'uuid-generator',
  name: 'UUID Generator',
  category: 'utilities',
  description: 'Generate UUID v4 identifiers',
  icon: '🆔',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 数量选择
    const countGroup = document.createElement('div');
    countGroup.className = 'input-output-group';

    const countLabel = document.createElement('label');
    countLabel.className = 'tool-label';
    countLabel.textContent = '生成数量: 1';
    countGroup.appendChild(countLabel);

    const countSlider = document.createElement('input');
    countSlider.type = 'range';
    countSlider.min = '1';
    countSlider.max = '10';
    countSlider.value = '1';
    countSlider.style.cssText = 'width: 100%; cursor: pointer;';
    countGroup.appendChild(countSlider);

    wrapper.appendChild(countGroup);

    // 生成按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const generateBtn = document.createElement('button');
    generateBtn.className = 'btn-primary';
    generateBtn.textContent = '🔄 生成 UUID';
    buttonGroup.appendChild(generateBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '生成的 UUID:';
    resultGroup.appendChild(resultLabel);

    const resultOutput = document.createElement('div');
    resultOutput.className = 'info-display';
    resultOutput.style.maxHeight = '300px';
    resultOutput.style.overflowY = 'auto';
    resultGroup.appendChild(resultOutput);

    wrapper.appendChild(resultGroup);

    container.appendChild(wrapper);

    // 生成 UUID v4
    function generateUUID(): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // 生成并显示
    function generate() {
      resultOutput.textContent = '';

      const count = parseInt(countSlider.value);
      countLabel.textContent = `生成数量: ${count}`;

      for (let i = 0; i < count; i++) {
        const uuid = generateUUID();
        const uuidDiv = document.createElement('div');
        uuidDiv.style.cssText = 'padding: 10px; margin: 6px 0; background: #f0f7ff; border-left: 3px solid #007acc; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';

        const uuidText = document.createElement('div');
        uuidText.style.cssText = 'flex: 1; font-family: monospace; font-size: 12px; word-break: break-all; color: #333;';
        uuidText.textContent = uuid;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-secondary';
        copyBtn.style.cssText = 'padding: 4px 10px; font-size: 11px; white-space: nowrap; margin-left: 8px;';
        copyBtn.textContent = '📋';
        copyBtn.title = '复制';
        copyBtn.onclick = async () => {
          await copyToClipboard(uuid);
          showCopyFeedback(copyBtn);
        };

        uuidDiv.appendChild(uuidText);
        uuidDiv.appendChild(copyBtn);
        resultOutput.appendChild(uuidDiv);
      }
    }

    generateBtn.onclick = generate;

    countSlider.addEventListener('input', () => {
      countLabel.textContent = `生成数量: ${countSlider.value}`;
    });

    clearBtn.onclick = () => {
      resultOutput.textContent = '';
    };

    // 初始生成
    generate();
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default UUIDGeneratorTool;

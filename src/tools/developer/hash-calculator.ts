import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';
import MD5 from 'crypto-js/md5';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';

const HashCalculatorTool: Tool = {
  id: 'hash-calculator',
  name: 'Hash Calculator',
  category: 'developer',
  description: 'Calculate MD5, SHA1, SHA256, SHA512 hashes',
  icon: '#️⃣',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 输入区域
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = '输入文本:';
    inputGroup.appendChild(inputLabel);

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'textarea-wrapper';

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '输入要计算哈希值的文本...';
    inputWrapper.appendChild(input);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        input.value = text;
        calculateHashes();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    inputWrapper.appendChild(pasteBtn);

    inputGroup.appendChild(inputWrapper);
    wrapper.appendChild(inputGroup);

    // 算法选择
    const algoGroup = document.createElement('div');
    algoGroup.className = 'input-output-group';

    const algoLabel = document.createElement('label');
    algoLabel.className = 'tool-label';
    algoLabel.textContent = '选择算法:';
    algoGroup.appendChild(algoLabel);

    const toggleGroup = document.createElement('div');
    toggleGroup.className = 'toggle-group';
    toggleGroup.style.flexWrap = 'wrap';

    const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];
    const selectedAlgos = new Set<string>(['MD5', 'SHA256']);

    algorithms.forEach(algo => {
      const algoBtn = document.createElement('button');
      algoBtn.className = 'toggle-button';
      if (selectedAlgos.has(algo)) {
        algoBtn.classList.add('active');
      }
      algoBtn.textContent = algo;
      algoBtn.style.flex = '1';
      algoBtn.style.minWidth = '70px';

      algoBtn.onclick = () => {
        if (selectedAlgos.has(algo)) {
          // 至少保留一个选中
          if (selectedAlgos.size > 1) {
            selectedAlgos.delete(algo);
            algoBtn.classList.remove('active');
          }
        } else {
          selectedAlgos.add(algo);
          algoBtn.classList.add('active');
        }
        calculateHashes();
      };

      toggleGroup.appendChild(algoBtn);
    });

    algoGroup.appendChild(toggleGroup);
    wrapper.appendChild(algoGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const calculateBtn = document.createElement('button');
    calculateBtn.className = 'btn-primary';
    calculateBtn.textContent = '🔄 计算哈希';
    buttonGroup.appendChild(calculateBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultDiv = document.createElement('div');
    resultDiv.className = 'info-display';
    resultDiv.style.display = 'block';
    resultDiv.style.maxHeight = '300px';
    resultDiv.style.overflowY = 'auto';
    wrapper.appendChild(resultDiv);

    container.appendChild(wrapper);

    // 计算哈希值
    function calculateHashes() {
      resultDiv.textContent = '';

      const text = input.value;

      if (!text) {
        const info = document.createElement('div');
        info.style.color = '#999';
        info.style.textAlign = 'center';
        info.style.padding = '20px';
        info.textContent = '输入文本开始计算哈希值';
        resultDiv.appendChild(info);
        return;
      }

      selectedAlgos.forEach(algo => {
        let hash: string;

        switch (algo) {
          case 'MD5':
            hash = MD5(text).toString();
            break;
          case 'SHA1':
            hash = SHA1(text).toString();
            break;
          case 'SHA256':
            hash = SHA256(text).toString();
            break;
          case 'SHA512':
            hash = SHA512(text).toString();
            break;
          default:
            return;
        }

        const hashGroup = document.createElement('div');
        hashGroup.style.marginBottom = '12px';
        hashGroup.style.paddingBottom = '12px';
        hashGroup.style.borderBottom = '1px solid #e0e0e0';

        const algoTitle = document.createElement('div');
        algoTitle.style.cssText = 'font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px;';
        algoTitle.textContent = `${algo} 哈希值:`;
        hashGroup.appendChild(algoTitle);

        const hashWrapper = document.createElement('div');
        hashWrapper.style.cssText = 'display: flex; align-items: flex-start; gap: 8px;';

        const hashText = document.createElement('div');
        hashText.style.cssText = 'flex: 1; font-family: monospace; font-size: 11px; word-break: break-all; color: #333; line-height: 1.6;';
        hashText.textContent = hash;
        hashWrapper.appendChild(hashText);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-secondary';
        copyBtn.style.cssText = 'padding: 4px 10px; font-size: 11px; white-space: nowrap;';
        copyBtn.textContent = '📋 复制';
        copyBtn.onclick = async () => {
          await copyToClipboard(hash);
          showCopyFeedback(copyBtn);
        };
        hashWrapper.appendChild(copyBtn);

        hashGroup.appendChild(hashWrapper);
        resultDiv.appendChild(hashGroup);
      });
    }

    // 计算按钮
    calculateBtn.onclick = calculateHashes;

    // 实时计算
    input.addEventListener('input', calculateHashes);

    // 清空按钮
    clearBtn.onclick = () => {
      input.value = '';
      calculateHashes();
    };

    // 初始计算
    calculateHashes();
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default HashCalculatorTool;

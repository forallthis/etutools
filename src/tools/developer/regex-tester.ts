import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const RegexTesterTool: Tool = {
  id: 'regex-tester',
  name: 'Regex Tester',
  category: 'developer',
  description: 'Test regular expressions with real-time matching',
  icon: '🔍',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 正则表达式输入区域
    const regexGroup = document.createElement('div');
    regexGroup.className = 'input-output-group';

    const regexLabel = document.createElement('label');
    regexLabel.className = 'tool-label';
    regexLabel.textContent = '正则表达式:';
    regexGroup.appendChild(regexLabel);

    const regexInput = document.createElement('input');
    regexInput.type = 'text';
    regexInput.className = 'tool-textarea';
    regexInput.style.minHeight = 'auto';
    regexInput.placeholder = '例如: \\d+ 或 [a-z]+';
    regexGroup.appendChild(regexInput);

    // 标志选项
    const flagsGroup = document.createElement('div');
    flagsGroup.className = 'button-group';
    flagsGroup.style.marginTop = '8px';

    const flagLabels = ['g', 'i', 'm', 's', 'u', 'y'];
    const selectedFlags = new Set<string>();

    flagLabels.forEach(flag => {
      const flagBtn = document.createElement('button');
      flagBtn.className = 'btn-secondary';
      flagBtn.style.padding = '6px 12px';
      flagBtn.style.minWidth = '40px';
      flagBtn.textContent = flag;
      flagBtn.style.fontFamily = 'monospace';

      flagBtn.onclick = () => {
        if (selectedFlags.has(flag)) {
          selectedFlags.delete(flag);
          flagBtn.classList.remove('btn-primary');
          flagBtn.classList.add('btn-secondary');
        } else {
          selectedFlags.add(flag);
          flagBtn.classList.remove('btn-secondary');
          flagBtn.classList.add('btn-primary');
        }
        testRegex();
      };

      flagsGroup.appendChild(flagBtn);
    });

    regexGroup.appendChild(flagsGroup);
    wrapper.appendChild(regexGroup);

    // 测试文本输入区域
    const textGroup = document.createElement('div');
    textGroup.className = 'input-output-group';

    const textLabel = document.createElement('label');
    textLabel.className = 'tool-label';
    textLabel.textContent = '测试文本:';
    textGroup.appendChild(textLabel);

    const textWrapper = document.createElement('div');
    textWrapper.className = 'textarea-wrapper';

    const textInput = document.createElement('textarea');
    textInput.className = 'tool-textarea';
    textInput.placeholder = '输入要测试的文本...';
    textInput.style.minHeight = '120px';
    textWrapper.appendChild(textInput);

    const pasteBtn = document.createElement('button');
    pasteBtn.className = 'btn-copy';
    pasteBtn.textContent = '📋 粘贴';
    pasteBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        textInput.value = text;
        testRegex();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    textWrapper.appendChild(pasteBtn);

    textGroup.appendChild(textWrapper);
    wrapper.appendChild(textGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 匹配结果显示
    const resultDiv = document.createElement('div');
    resultDiv.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '匹配结果:';
    resultDiv.appendChild(resultLabel);

    const resultOutput = document.createElement('div');
    resultOutput.className = 'info-display';
    resultOutput.style.display = 'block';
    resultOutput.style.maxHeight = '200px';
    resultOutput.style.overflowY = 'auto';
    resultDiv.appendChild(resultOutput);

    wrapper.appendChild(resultDiv);

    container.appendChild(wrapper);

    // 测试正则表达式
    function testRegex() {
      errorDiv.style.display = 'none';
      resultOutput.textContent = '';

      const pattern = regexInput.value.trim();
      const text = textInput.value;

      if (!pattern) {
        const info = document.createElement('div');
        info.style.color = '#999';
        info.style.textAlign = 'center';
        info.style.padding = '20px';
        info.textContent = '输入正则表达式开始测试';
        resultOutput.appendChild(info);
        return;
      }

      if (!text) {
        const info = document.createElement('div');
        info.style.color = '#999';
        info.style.textAlign = 'center';
        info.style.padding = '20px';
        info.textContent = '输入测试文本查看匹配结果';
        resultOutput.appendChild(info);
        return;
      }

      try {
        const flags = Array.from(selectedFlags).join('');
        const regex = new RegExp(pattern, flags);

        let matches: RegExpExecArray | null;
        const allMatches: string[] = [];

        if (flags.includes('g')) {
          // 全局匹配
          while ((matches = regex.exec(text)) !== null) {
            allMatches.push(matches[0]);
            if (matches.index === regex.lastIndex) {
              regex.lastIndex++;
            }
          }
        } else {
          // 单次匹配
          matches = regex.exec(text);
          if (matches) {
            allMatches.push(matches[0]);
          }
        }

        if (allMatches.length === 0) {
          const noMatch = document.createElement('div');
          noMatch.style.color = '#999';
          noMatch.style.textAlign = 'center';
          noMatch.style.padding = '20px';
          noMatch.textContent = '没有找到匹配';
          resultOutput.appendChild(noMatch);
        } else {
          // 显示匹配统计
          const stats = document.createElement('div');
          stats.className = 'info-row';
          stats.style.borderBottom = '1px solid #e0e0e0';
          stats.style.paddingBottom = '8px';
          stats.style.marginBottom = '8px';

          const statsLabel = document.createElement('span');
          statsLabel.className = 'info-label';
          statsLabel.textContent = `找到 ${allMatches.length} 个匹配:`;

          stats.appendChild(statsLabel);
          resultOutput.appendChild(stats);

          // 显示每个匹配
          allMatches.forEach((match, index) => {
            const matchDiv = document.createElement('div');
            matchDiv.style.cssText = 'padding: 8px; margin: 4px 0; background: #f0f7ff; border-left: 3px solid #007acc; border-radius: 4px;';

            const matchIndex = document.createElement('div');
            matchIndex.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 4px;';
            matchIndex.textContent = `匹配 #${index + 1}`;

            const matchText = document.createElement('div');
            matchText.style.cssText = 'font-family: monospace; font-size: 12px; word-break: break-all; color: #333;';
            matchText.textContent = match;

            matchDiv.appendChild(matchIndex);
            matchDiv.appendChild(matchText);
            resultOutput.appendChild(matchDiv);
          });
        }
      } catch (err) {
        errorDiv.textContent = '❌ 正则表达式错误: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    // 实时测试
    regexInput.addEventListener('input', testRegex);
    textInput.addEventListener('input', testRegex);

    // 初始测试
    testRegex();
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default RegexTesterTool;

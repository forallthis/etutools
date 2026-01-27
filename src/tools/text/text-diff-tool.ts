import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const TextDiffTool: Tool = {
  id: 'text-diff',
  name: 'Text Diff',
  category: 'text',
  description: 'Compare two texts and show differences',
  icon: '📝',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 原始文本
    const originalGroup = document.createElement('div');
    originalGroup.className = 'input-output-group';

    const originalLabel = document.createElement('label');
    originalLabel.className = 'tool-label';
    originalLabel.textContent = '原始文本:';
    originalGroup.appendChild(originalLabel);

    const originalInput = document.createElement('textarea');
    originalInput.className = 'tool-textarea';
    originalInput.placeholder = '输入原始文本...';
    originalInput.style.minHeight = '100px';
    originalGroup.appendChild(originalInput);

    wrapper.appendChild(originalGroup);

    // 新文本
    const newGroup = document.createElement('div');
    newGroup.className = 'input-output-group';

    const newLabel = document.createElement('label');
    newLabel.className = 'tool-label';
    newLabel.textContent = '新文本:';
    newGroup.appendChild(newLabel);

    const newInput = document.createElement('textarea');
    newInput.className = 'tool-textarea';
    newInput.placeholder = '输入修改后的文本...';
    newInput.style.minHeight = '100px';
    newGroup.appendChild(newInput);

    wrapper.appendChild(newGroup);

    // 选项
    const optionsGroup = document.createElement('div');
    optionsGroup.style.cssText = 'display: flex; gap: 16px; margin: 12px 0;';

    const ignoreWhitespace = document.createElement('label');
    ignoreWhitespace.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const wsCheckbox = document.createElement('input');
    wsCheckbox.type = 'checkbox';
    wsCheckbox.style.cursor = 'pointer';
    ignoreWhitespace.appendChild(wsCheckbox);
    const wsText = document.createElement('span');
    wsText.textContent = '忽略空格';
    ignoreWhitespace.appendChild(wsText);
    optionsGroup.appendChild(ignoreWhitespace);

    const caseInsensitive = document.createElement('label');
    caseInsensitive.style.cssText = 'display: flex; align-items: center; gap: 6px; font-size: 13px; color: #666; cursor: pointer;';
    const caseCheckbox = document.createElement('input');
    caseCheckbox.type = 'checkbox';
    caseCheckbox.style.cursor = 'pointer';
    caseInsensitive.appendChild(caseCheckbox);
    const caseText = document.createElement('span');
    caseText.textContent = '忽略大小写';
    caseInsensitive.appendChild(caseText);
    optionsGroup.appendChild(caseInsensitive);

    wrapper.appendChild(optionsGroup);

    // 按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const compareBtn = document.createElement('button');
    compareBtn.className = 'btn-primary';
    compareBtn.textContent = '🔄 对比';
    buttonGroup.appendChild(compareBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    clearBtn.onclick = () => {
      originalInput.value = '';
      newInput.value = '';
      resultDiv.textContent = '';
    };
    buttonGroup.appendChild(clearBtn);

    wrapper.appendChild(buttonGroup);

    // 结果显示
    const resultGroup = document.createElement('div');
    resultGroup.className = 'input-output-group';

    const resultLabel = document.createElement('label');
    resultLabel.className = 'tool-label';
    resultLabel.textContent = '对比结果:';
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

    function compare() {
      resultDiv.textContent = '';

      const original = originalInput.value;
      const newText = newInput.value;

      if (!original && !newText) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'info-row';
        const emptyValue = document.createElement('span');
        emptyValue.className = 'info-value';
        emptyValue.textContent = '请输入要对比的文本';
        emptyRow.appendChild(emptyValue);
        resultDiv.appendChild(emptyRow);
        return;
      }

      const shouldIgnoreWS = wsCheckbox.checked;
      const shouldIgnoreCase = caseCheckbox.checked;

      let originalLines = original.split('\n');
      let newLines = newText.split('\n');

      if (shouldIgnoreCase) {
        originalLines = originalLines.map(l => l.toLowerCase());
        newLines = newLines.map(l => l.toLowerCase());
      }

      if (shouldIgnoreWS) {
        originalLines = originalLines.map(l => l.trim().replace(/\s+/g, ' '));
        newLines = newLines.map(l => l.trim().replace(/\s+/g, ' '));
      }

      const changes: Array<{
        type: 'added' | 'removed' | 'unchanged';
        lineNum: number;
        content: string;
      }> = [];

      let i = 0;
      let j = 0;

      while (i < originalLines.length || j < newLines.length) {
        if (i >= originalLines.length) {
          changes.push({ type: 'added', lineNum: j + 1, content: newLines[j] });
          j++;
        } else if (j >= newLines.length) {
          changes.push({ type: 'removed', lineNum: i + 1, content: originalLines[i] });
          i++;
        } else if (originalLines[i] === newLines[j]) {
          changes.push({ type: 'unchanged', lineNum: i + 1, content: originalLines[i] });
          i++;
          j++;
        } else {
          changes.push({ type: 'removed', lineNum: i + 1, content: originalLines[i] });
          changes.push({ type: 'added', lineNum: j + 1, content: newLines[j] });
          i++;
          j++;
        }
      }

      if (changes.length === 0) {
        const sameRow = document.createElement('div');
        sameRow.className = 'info-row';
        const sameValue = document.createElement('span');
        sameValue.className = 'info-value';
        sameValue.style.color = '#28a745';
        sameValue.textContent = '✅ 两个文本完全相同';
        sameRow.appendChild(sameValue);
        resultDiv.appendChild(sameRow);
        return;
      }

      // 统计信息
      const summary = document.createElement('div');
      summary.style.cssText = 'display: flex; gap: 16px; margin-bottom: 12px; padding: 8px; background: #f8f9fa; border-radius: 6px;';

      const removedCount = changes.filter(c => c.type === 'removed').length;
      const addedCount = changes.filter(c => c.type === 'added').length;
      const unchangedCount = changes.filter(c => c.type === 'unchanged').length;

      const removedSpan = document.createElement('span');
      removedSpan.style.color = '#dc3545';
      removedSpan.style.fontWeight = '600';
      removedSpan.textContent = `🔴 删除 ${removedCount} 行`;
      summary.appendChild(removedSpan);

      const addedSpan = document.createElement('span');
      addedSpan.style.color = '#28a745';
      addedSpan.style.fontWeight = '600';
      addedSpan.textContent = `🟢 新增 ${addedCount} 行`;
      summary.appendChild(addedSpan);

      const unchangedSpan = document.createElement('span');
      unchangedSpan.style.color = '#6c757d';
      unchangedSpan.textContent = `⚪ 未变 ${unchangedCount} 行`;
      summary.appendChild(unchangedSpan);

      resultDiv.appendChild(summary);

      // 显示差异
      changes.forEach(change => {
        const row = document.createElement('div');
        row.style.cssText = 'padding: 6px 8px; margin: 2px 0; font-family: monospace; font-size: 12px; border-radius: 4px; white-space: pre-wrap; word-break: break-all;';

        if (change.type === 'removed') {
          row.style.background = '#ffeef0';
          row.style.color = '#dc3545';
          row.textContent = `- ${change.content || '(空行)'}`;
        } else if (change.type === 'added') {
          row.style.background = '#e8f5e9';
          row.style.color = '#28a745';
          row.textContent = `+ ${change.content || '(空行)'}`;
        } else {
          row.style.background = '#f8f9fa';
          row.style.color = '#666';
          row.textContent = `  ${change.content || '(空行)'}`;
        }

        resultDiv.appendChild(row);
      });
    }

    compareBtn.onclick = compare;
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default TextDiffTool;

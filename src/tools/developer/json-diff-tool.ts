import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const JSONDiffTool: Tool = {
  id: 'json-diff',
  name: 'JSON Diff',
  category: 'developer',
  description: 'Compare two JSON objects and show differences',
  icon: '📊',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 左侧 JSON
    const leftGroup = document.createElement('div');
    leftGroup.className = 'input-output-group';

    const leftLabel = document.createElement('label');
    leftLabel.className = 'tool-label';
    leftLabel.textContent = '原始 JSON (左边):';
    leftGroup.appendChild(leftLabel);

    const leftWrapper = document.createElement('div');
    leftWrapper.className = 'textarea-wrapper';

    const leftInput = document.createElement('textarea');
    leftInput.className = 'tool-textarea';
    leftInput.placeholder = '{\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}';
    leftInput.style.minHeight = '120px';
    leftInput.style.fontFamily = 'monospace';
    leftInput.style.fontSize = '12px';
    leftWrapper.appendChild(leftInput);

    const pasteLeftBtn = document.createElement('button');
    pasteLeftBtn.className = 'btn-copy';
    pasteLeftBtn.textContent = '📋 粘贴';
    pasteLeftBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        leftInput.value = text;
        compare();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    leftWrapper.appendChild(pasteLeftBtn);

    leftGroup.appendChild(leftWrapper);
    wrapper.appendChild(leftGroup);

    // 右侧 JSON
    const rightGroup = document.createElement('div');
    rightGroup.className = 'input-output-group';

    const rightLabel = document.createElement('label');
    rightLabel.className = 'tool-label';
    rightLabel.textContent = '对比 JSON (右边):';
    rightGroup.appendChild(rightLabel);

    const rightWrapper = document.createElement('div');
    rightWrapper.className = 'textarea-wrapper';

    const rightInput = document.createElement('textarea');
    rightInput.className = 'tool-textarea';
    rightInput.placeholder = '{\n  "name": "John",\n  "age": 32,\n  "city": "Boston"\n}';
    rightInput.style.minHeight = '120px';
    rightInput.style.fontFamily = 'monospace';
    rightInput.style.fontSize = '12px';
    rightWrapper.appendChild(rightInput);

    const pasteRightBtn = document.createElement('button');
    pasteRightBtn.className = 'btn-copy';
    pasteRightBtn.textContent = '📋 粘贴';
    pasteRightBtn.onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        rightInput.value = text;
        compare();
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    };
    rightWrapper.appendChild(pasteRightBtn);

    rightGroup.appendChild(rightWrapper);
    wrapper.appendChild(rightGroup);

    // 按钮组
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
      leftInput.value = '';
      rightInput.value = '';
      resultDiv.textContent = '';
    };
    buttonGroup.appendChild(clearBtn);

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

    // 深度对比函数
    function compareObjects(obj1: any, obj2: any, path = ''): Array<{
      path: string;
      type: 'added' | 'removed' | 'changed' | 'unchanged';
      oldValue?: any;
      newValue?: any;
    }> {
      const differences: Array<{
        path: string;
        type: 'added' | 'removed' | 'changed' | 'unchanged';
        oldValue?: any;
        newValue?: any;
      }> = [];

      const keys1 = Object.keys(obj1 || {});
      const keys2 = Object.keys(obj2 || {});
      const allKeys = new Set([...keys1, ...keys2]);

      allKeys.forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        const value1 = obj1?.[key];
        const value2 = obj2?.[key];

        // 检查键是否存在
        if (!(key in obj1) && key in obj2) {
          differences.push({
            path: currentPath,
            type: 'added',
            newValue: value2
          });
        } else if (key in obj1 && !(key in obj2)) {
          differences.push({
            path: currentPath,
            type: 'removed',
            oldValue: value1
          });
        } else if (key in obj1 && key in obj2) {
          // 比较值
          if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
            // 递归比较对象
            const nestedDiffs = compareObjects(value1, value2, currentPath);
            differences.push(...nestedDiffs);
          } else if (value1 !== value2) {
            differences.push({
              path: currentPath,
              type: 'changed',
              oldValue: value1,
              newValue: value2
            });
          }
        }
      });

      return differences;
    }

    // 格式化值显示
    function formatValue(value: any): string {
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value, null, 2);
        } catch {
          return String(value);
        }
      }
      return String(value);
    }

    // 对比函数
    function compare() {
      errorDiv.style.display = 'none';
      resultDiv.textContent = '';

      const leftStr = leftInput.value.trim();
      const rightStr = rightInput.value.trim();

      if (!leftStr && !rightStr) {
        errorDiv.textContent = '❌ 请输入要对比的 JSON';
        errorDiv.style.display = 'block';
        return;
      }

      let obj1: any;
      let obj2: any;

      try {
        obj1 = leftStr ? JSON.parse(leftStr) : null;
      } catch (e) {
        errorDiv.textContent = '❌ 左侧 JSON 格式错误: ' + (e as Error).message;
        errorDiv.style.display = 'block';
        return;
      }

      try {
        obj2 = rightStr ? JSON.parse(rightStr) : null;
      } catch (e) {
        errorDiv.textContent = '❌ 右侧 JSON 格式错误: ' + (e as Error).message;
        errorDiv.style.display = 'block';
        return;
      }

      const differences = compareObjects(obj1, obj2);

      if (differences.length === 0) {
        const sameRow = document.createElement('div');
        sameRow.className = 'info-row';
        const sameValue = document.createElement('span');
        sameValue.className = 'info-value';
        sameValue.style.color = '#28a745';
        sameValue.textContent = '✅ 两个 JSON 完全相同';
        sameRow.appendChild(sameValue);
        resultDiv.appendChild(sameRow);
        return;
      }

      const changes = differences.filter(d => d.type !== 'unchanged');

      if (changes.length === 0) {
        const sameRow = document.createElement('div');
        sameRow.className = 'info-row';
        const sameValue = document.createElement('span');
        sameValue.className = 'info-value';
        sameValue.style.color = '#28a745';
        sameValue.textContent = '✅ 两个 JSON 结构和值完全相同';
        sameRow.appendChild(sameValue);
        resultDiv.appendChild(sameRow);
        return;
      }

      // 统计信息
      const summary = document.createElement('div');
      summary.style.cssText = 'display: flex; gap: 16px; margin-bottom: 12px; padding: 8px; background: #f8f9fa; border-radius: 6px;';
      
      const removedCount = changes.filter(d => d.type === 'removed').length;
      const addedCount = changes.filter(d => d.type === 'added').length;
      const changedCount = changes.filter(d => d.type === 'changed').length;
      
      const removedSpan = document.createElement('span');
      removedSpan.style.color = '#dc3545';
      removedSpan.textContent = `🔴 删除: ${removedCount}`;
      
      const addedSpan = document.createElement('span');
      addedSpan.style.color = '#28a745';
      addedSpan.textContent = `🟢 新增: ${addedCount}`;
      
      const changedSpan = document.createElement('span');
      changedSpan.style.color = '#ffc107';
      changedSpan.textContent = `🟡 修改: ${changedCount}`;
      
      summary.appendChild(removedSpan);
      summary.appendChild(addedSpan);
      summary.appendChild(changedSpan);
      resultDiv.appendChild(summary);

      // 显示差异
      changes.forEach(diff => {
        const row = document.createElement('div');
        row.className = 'info-row';
        row.style.cssText = 'padding: 8px; margin: 4px 0; border-radius: 4px; background: #f8f9fa;';

        const typeIcon = diff.type === 'removed' ? '🔴' : diff.type === 'added' ? '🟢' : '🟡';
        const color = diff.type === 'removed' ? '#dc3545' : diff.type === 'added' ? '#28a745' : '#ffc107';

        const label = document.createElement('span');
        label.className = 'info-label';
        label.textContent = `${typeIcon} ${diff.path}`;
        label.style.color = color;
        label.style.fontWeight = '600';

        const valueDiv = document.createElement('div');
        valueDiv.style.cssText = 'flex: 1; display: flex; flex-direction: column; gap: 4px;';

        if (diff.oldValue !== undefined) {
          const oldVal = document.createElement('span');
          oldVal.style.cssText = 'font-size: 11px; color: #dc3545;';
          oldVal.textContent = `旧值: ${formatValue(diff.oldValue)}`;
          valueDiv.appendChild(oldVal);
        }

        if (diff.newValue !== undefined) {
          const newVal = document.createElement('span');
          newVal.style.cssText = 'font-size: 11px; color: #28a745;';
          newVal.textContent = `新值: ${formatValue(diff.newValue)}`;
          valueDiv.appendChild(newVal);
        }

        row.appendChild(label);
        row.appendChild(valueDiv);
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

export default JSONDiffTool;

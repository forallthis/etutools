import type { Tool } from '../../types/tool.js';

const CronParserTool: Tool = {
  id: 'cron-parser',
  name: 'Cron Parser',
  category: 'developer',
  description: 'Parse and preview cron expressions',
  icon: '⏰',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // Cron 表达式输入
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-output-group';

    const inputLabel = document.createElement('label');
    inputLabel.className = 'tool-label';
    inputLabel.textContent = 'Cron 表达式:';
    inputGroup.appendChild(inputLabel);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tool-textarea';
    input.style.minHeight = 'auto';
    input.placeholder = '例如: 0 9 * * 1-5 (周一到周五每天9点)';
    input.value = '0 9 * * 1-5';
    inputGroup.appendChild(input);

    wrapper.appendChild(inputGroup);

    // 示例按钮
    const exampleGroup = document.createElement('div');
    exampleGroup.className = 'button-group';

    const examples = [
      { label: '每天9点', value: '0 9 * * *' },
      { label: '每分钟', value: '* * * * *' },
      { label: '每周一', value: '0 0 * * 1' },
      { label: '每月1号', value: '0 0 1 * *' },
      { label: '工作日9点', value: '0 9 * * 1-5' }
    ];

    examples.forEach(ex => {
      const btn = document.createElement('button');
      btn.className = 'btn-secondary';
      btn.style.padding = '6px 12px';
      btn.style.fontSize = '11px';
      btn.textContent = ex.label;
      btn.onclick = () => {
        input.value = ex.value;
        parseCron();
      };
      exampleGroup.appendChild(btn);
    });

    wrapper.appendChild(exampleGroup);

    // 按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const parseBtn = document.createElement('button');
    parseBtn.className = 'btn-primary';
    parseBtn.textContent = '🔄 解析表达式';
    buttonGroup.appendChild(parseBtn);

    wrapper.appendChild(buttonGroup);

    // 错误提示
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.display = 'none';
    wrapper.appendChild(errorDiv);

    // 解释区域
    const explainDiv = document.createElement('div');
    explainDiv.className = 'info-display';
    explainDiv.style.display = 'none';
    explainDiv.style.marginTop = '12px';
    wrapper.appendChild(explainDiv);

    // 执行时间预览
    const scheduleDiv = document.createElement('div');
    scheduleDiv.className = 'input-output-group';
    scheduleDiv.style.marginTop = '12px';

    const scheduleLabel = document.createElement('label');
    scheduleLabel.className = 'tool-label';
    scheduleLabel.textContent = '接下来5次执行时间:';
    scheduleDiv.appendChild(scheduleLabel);

    const scheduleOutput = document.createElement('div');
    scheduleOutput.className = 'info-display';
    scheduleOutput.style.maxHeight = '250px';
    scheduleOutput.style.overflowY = 'auto';
    scheduleDiv.appendChild(scheduleOutput);

    wrapper.appendChild(scheduleDiv);

    container.appendChild(wrapper);

    // 解析 Cron 表达式
    function parseCron() {
      errorDiv.style.display = 'none';
      explainDiv.style.display = 'none';
      explainDiv.textContent = '';
      scheduleOutput.textContent = '';

      const cron = input.value.trim();

      if (!cron) {
        errorDiv.textContent = '❌ 请输入 Cron 表达式';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        const parts = cron.split(/\s+/);

        if (parts.length < 5 || parts.length > 6) {
          throw new Error('Cron 表达式应该包含5或6个字段');
        }

        // 显示解释
        explainDiv.style.display = 'block';

        const fields = [
          { name: '分钟', value: parts[0], range: '0-59' },
          { name: '小时', value: parts[1], range: '0-23' },
          { name: '日期', value: parts[2], range: '1-31' },
          { name: '月份', value: parts[3], range: '1-12' },
          { name: '星期', value: parts[4], range: '0-6 (0=周日)' }
        ];

        if (parts.length === 6) {
          fields.push({ name: '年份', value: parts[5], range: '例如: 2024' });
        }

        const title = document.createElement('div');
        title.style.cssText = 'font-weight: 600; margin-bottom: 8px; color: #333;';
        title.textContent = '表达式解释:';
        explainDiv.appendChild(title);

        fields.forEach(field => {
          const row = document.createElement('div');
          row.className = 'info-row';

          const label = document.createElement('span');
          label.className = 'info-label';
          label.textContent = `${field.name}:`;

          const value = document.createElement('span');
          value.className = 'info-value';
          value.textContent = `${field.value} (${field.range})`;

          row.appendChild(label);
          row.appendChild(value);
          explainDiv.appendChild(row);
        });

        // 计算执行时间
        const nextExecutions = calculateNextExecutions(cron, 5);

        if (nextExecutions.length === 0) {
          const noExec = document.createElement('div');
          noExec.style.cssText = 'color: #999; text-align: center; padding: 20px;';
          noExec.textContent = '无法计算执行时间';
          scheduleOutput.appendChild(noExec);
        } else {
          nextExecutions.forEach((exec, index) => {
            const execDiv = document.createElement('div');
            execDiv.style.cssText = 'padding: 10px; margin: 6px 0; background: #f0f7ff; border-left: 3px solid #007acc; border-radius: 4px;';

            const execIndex = document.createElement('div');
            execIndex.style.cssText = 'font-size: 11px; color: #666; margin-bottom: 4px;';
            execIndex.textContent = `#${index + 1}`;
            execDiv.appendChild(execIndex);

            const execTime = document.createElement('div');
            execTime.style.cssText = 'font-size: 13px; font-weight: 600; color: #333;';
            execTime.textContent = exec;
            execDiv.appendChild(execTime);

            scheduleOutput.appendChild(execDiv);
          });
        }

      } catch (err) {
        errorDiv.textContent = '❌ Cron 解析失败: ' + (err as Error).message;
        errorDiv.style.display = 'block';
      }
    }

    // 计算接下来的执行时间（简化版）
    function calculateNextExecutions(cron: string, count: number): string[] {
      const parts = cron.split(/\s+/);
      const results: string[] = [];

      // 简化实现：基于当前时间和基本规则
      const now = new Date();
      let current = new Date(now);

      // 提取各部分的值
      const minutePart = parts[0];
      const hourPart = parts[1];
      const dayPart = parts[2];
      const monthPart = parts[3];
      const weekdayPart = parts[4];

      // 简化：只处理常见模式
      // 实际应用中应使用专门的 cron 解析库

      for (let i = 0; i < count * 100 && results.length < count; i++) {
        current.setMinutes(current.getMinutes() + 1);

        // 检查分钟
        if (!matchesField(current.getMinutes(), minutePart, 0, 59)) continue;

        // 检查小时
        if (!matchesField(current.getHours(), hourPart, 0, 23)) continue;

        // 检查日期
        if (!matchesField(current.getDate(), dayPart, 1, 31)) continue;

        // 检查月份
        if (!matchesField(current.getMonth() + 1, monthPart, 1, 12)) continue;

        // 检查星期
        if (!matchesField(current.getDay() === 0 ? 7 : current.getDay(), weekdayPart, 1, 7)) continue;

        results.push(current.toLocaleString('zh-CN'));
      }

      return results;
    }

    // 检查字段是否匹配
    function matchesField(value: number, pattern: string, min: number, max: number): boolean {
      if (pattern === '*') return true;

      // 处理数字
      if (/^\d+$/.test(pattern)) {
        return value === parseInt(pattern);
      }

      // 处理范围 (例如: 1-5)
      const rangeMatch = pattern.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1]);
        const end = parseInt(rangeMatch[2]);
        return value >= start && value <= end;
      }

      // 处理列表 (例如: 1,3,5)
      if (pattern.includes(',')) {
        const values = pattern.split(',').map(v => parseInt(v));
        return values.includes(value);
      }

      // 处理步长 (例如: */5, 1-10/2)
      const stepMatch = pattern.match(/^(.+?)\/(\d+)$/);
      if (stepMatch) {
        const base = stepMatch[1];
        const step = parseInt(stepMatch[2]);

        if (base === '*') {
          return value % step === 0;
        }

        const baseRangeMatch = base.match(/^(\d+)-(\d+)$/);
        if (baseRangeMatch) {
          const start = parseInt(baseRangeMatch[1]);
          const end = parseInt(baseRangeMatch[2]);
          if (value < start || value > end) return false;
          return (value - start) % step === 0;
        }
      }

      return false;
    }

    // 解析按钮
    parseBtn.onclick = parseCron;

    // 实时解析
    input.addEventListener('input', parseCron);

    // 初始解析
    parseCron();
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default CronParserTool;

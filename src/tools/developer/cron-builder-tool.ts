import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const CronBuilderTool: Tool = {
  id: 'cron-builder',
  name: 'Cron Builder',
  category: 'developer',
  description: 'Visual cron expression builder',
  icon: '⏰',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 创建选择器组容器
    const selectorsGroup = document.createElement('div');
    selectorsGroup.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-bottom: 20px;';

    // 辅助函数：添加选项
    function addOptions(select: HTMLSelectElement, min: string, max: string, labels?: string[]) {
      const minNum = parseInt(min);
      const maxNum = parseInt(max);

      // 添加 * (任意) 选项
      const anyOption = document.createElement('option');
      anyOption.value = '*';
      anyOption.textContent = '* (任意)';
      select.appendChild(anyOption);

      // 添加范围选项
      const rangeOption = document.createElement('option');
      rangeOption.value = `${min}-${max}`;
      rangeOption.textContent = `${min}-${max} (范围)`;
      select.appendChild(rangeOption);

      // 添加具体数值选项
      for (let i = minNum; i <= maxNum; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = labels ? labels[i - minNum] : i.toString();
        select.appendChild(option);
      }
    }

    // 辅助函数：创建选择组
    function createSelectGroup(label: string, min: string, max: string, labels?: string[]) {
      const group = document.createElement('div');
      group.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      labelEl.style.cssText = 'font-size: 13px; color: #666; font-weight: 600;';
      group.appendChild(labelEl);

      const select = document.createElement('select');
      select.className = 'btn-secondary';
      select.style.cssText = 'width: 100%; padding: 6px;';

      // 添加选项
      addOptions(select, min, max, labels);

      group.appendChild(select);

      return { group, select };
    }

    // 分钟
    const minuteGroup = createSelectGroup('分钟', '0', '59');
    selectorsGroup.appendChild(minuteGroup.group);

    // 小时
    const hourGroup = createSelectGroup('小时', '0', '23');
    selectorsGroup.appendChild(hourGroup.group);

    // 日期
    const dayGroup = createSelectGroup('日期', '1', '31');
    selectorsGroup.appendChild(dayGroup.group);

    // 月份
    const monthGroup = createSelectGroup('月份', '1', '12');
    selectorsGroup.appendChild(monthGroup.group);

    // 星期
    const weekdayGroup = createSelectGroup('星期', '0', '6', ['日', '一', '二', '三', '四', '五', '六']);
    selectorsGroup.appendChild(weekdayGroup.group);

    wrapper.appendChild(selectorsGroup);

    // Cron 表达式显示
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.textContent = 'Cron 表达式:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const outputTextarea = document.createElement('textarea');
    outputTextarea.className = 'tool-textarea';
    outputTextarea.readOnly = true;
    outputTextarea.value = '* * * * *';
    outputWrapper.appendChild(outputTextarea);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-copy';
    copyBtn.textContent = '📋 复制';
    copyBtn.onclick = async () => {
      await copyToClipboard(outputTextarea.value);
      showCopyFeedback(copyBtn);
    };
    outputWrapper.appendChild(copyBtn);

    outputGroup.appendChild(outputWrapper);
    wrapper.appendChild(outputGroup);

    // 快速选择
    const presetsGroup = document.createElement('div');
    presetsGroup.className = 'input-output-group';

    const presetsLabel = document.createElement('label');
    presetsLabel.className = 'tool-label';
    presetsLabel.textContent = '快速选择:';
    presetsGroup.appendChild(presetsLabel);

    const presetsContainer = document.createElement('div');
    presetsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;';

    const presets = [
      { name: '每分钟', cron: '* * * * *' },
      { name: '每小时', cron: '0 * * * *' },
      { name: '每天 0 点', cron: '0 0 * * *' },
      { name: '每周一 0 点', cron: '0 0 * * 1' },
      { name: '每月 1 号 0 点', cron: '0 0 1 * *' },
      { name: '每天 9:00', cron: '0 9 * * *' },
      { name: '工作日 9:00', cron: '0 9 * * 1-5' },
      { name: '每 5 分钟', cron: '*/5 * * * *' },
      { name: '每 2 小时', cron: '0 */2 * * *' },
      { name: '每天 12:00', cron: '0 12 * * *' },
      { name: '每天 18:00', cron: '0 18 * * *' },
      { name: '每天 23:59', cron: '59 23 * * *' },
    ];

    presets.forEach(preset => {
      const btn = document.createElement('button');
      btn.className = 'btn-secondary';
      btn.style.cssText = 'font-size: 12px;';
      btn.textContent = preset.name;
      btn.onclick = () => {
        const [minute, hour, day, month, weekday] = preset.cron.split(' ');
        minuteGroup.select.value = minute;
        hourGroup.select.value = hour;
        dayGroup.select.value = day;
        monthGroup.select.value = month;
        weekdayGroup.select.value = weekday;
        updateCron();
      };
      presetsContainer.appendChild(btn);
    });

    presetsGroup.appendChild(presetsContainer);
    wrapper.appendChild(presetsGroup);

    // 下次执行时间预览
    const previewGroup = document.createElement('div');
    previewGroup.className = 'info-display';

    const previewTitle = document.createElement('div');
    previewTitle.style.cssText = 'font-weight: 600; margin-bottom: 12px; color: #007acc;';
    previewTitle.textContent = '说明:';
    previewGroup.appendChild(previewTitle);

    const previewText = document.createElement('div');
    previewText.className = 'info-row';
    previewText.innerHTML = '<span class="info-label">格式:</span><span class="info-value">分钟 小时 日期 月份 星期</span>';
    previewGroup.appendChild(previewText);

    const previewText2 = document.createElement('div');
    previewText2.className = 'info-row';
    previewText2.innerHTML = '<span class="info-label">范围:</span><span class="info-value">分钟:0-59 小时:0-23 日期:1-31 月份:1-12 星期:0-6(0=周日)</span>';
    previewGroup.appendChild(previewText2);

    const previewText3 = document.createElement('div');
    previewText3.className = 'info-row';
    previewText3.innerHTML = '<span class="info-label">特殊:</span><span class="info-value">* = 任意值, */n = 每 n 单位</span>';
    previewGroup.appendChild(previewText3);

    wrapper.appendChild(previewGroup);

    container.appendChild(wrapper);

    // 更新 Cron 表达式
    function updateCron() {
      const minute = minuteGroup.select.value;
      const hour = hourGroup.select.value;
      const day = dayGroup.select.value;
      const month = monthGroup.select.value;
      const weekday = weekdayGroup.select.value;

      const cron = `${minute} ${hour} ${day} ${month} ${weekday}`;
      outputTextarea.value = cron;
    }

    // 监听变化
    minuteGroup.select.addEventListener('change', updateCron);
    hourGroup.select.addEventListener('change', updateCron);
    dayGroup.select.addEventListener('change', updateCron);
    monthGroup.select.addEventListener('change', updateCron);
    weekdayGroup.select.addEventListener('change', updateCron);
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default CronBuilderTool;

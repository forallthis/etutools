import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const LoremIpsumTool: Tool = {
  id: 'lorem-ipsum',
  name: 'Lorem Ipsum Generator',
  category: 'text',
  description: 'Generate random placeholder text',
  icon: '📄',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';

    // 选项
    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'input-output-group';

    const optionsLabel = document.createElement('label');
    optionsLabel.className = 'tool-label';
    optionsLabel.textContent = '选项:';
    optionsGroup.appendChild(optionsLabel);

    // 段落数
    const paragraphGroup = document.createElement('div');
    paragraphGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; margin: 8px 0;';

    const paraLabel = document.createElement('label');
    paraLabel.textContent = '段落数:';
    paraLabel.style.cssText = 'font-size: 13px; color: #666;';
    paragraphGroup.appendChild(paraLabel);

    const paraSlider = document.createElement('input');
    paraSlider.type = 'range';
    paraSlider.min = '1';
    paraSlider.max = '10';
    paraSlider.value = '3';
    paraSlider.style.cssText = 'flex: 1; cursor: pointer;';
    paragraphGroup.appendChild(paraSlider);

    const paraValue = document.createElement('span');
    paraValue.textContent = '3';
    paraValue.style.cssText = 'font-weight: 600; color: #007acc; min-width: 20px;';
    paragraphGroup.appendChild(paraValue);

    paraSlider.addEventListener('input', () => {
      paraValue.textContent = paraSlider.value;
    });

    optionsGroup.appendChild(paragraphGroup);

    // 每段句子数
    const sentenceGroup = document.createElement('div');
    sentenceGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; margin: 8px 0;';

    const sentLabel = document.createElement('label');
    sentLabel.textContent = '句子数:';
    sentLabel.style.cssText = 'font-size: 13px; color: #666;';
    sentenceGroup.appendChild(sentLabel);

    const sentSlider = document.createElement('input');
    sentSlider.type = 'range';
    sentSlider.min = '1';
    sentSlider.max = '10';
    sentSlider.value = '5';
    sentSlider.style.cssText = 'flex: 1; cursor: pointer;';
    sentenceGroup.appendChild(sentSlider);

    const sentValue = document.createElement('span');
    sentValue.textContent = '5';
    sentValue.style.cssText = 'font-weight: 600; color: #007acc; min-width: 20px;';
    sentenceGroup.appendChild(sentValue);

    sentSlider.addEventListener('input', () => {
      sentValue.textContent = sentSlider.value;
    });

    optionsGroup.appendChild(sentenceGroup);

    // 起始模式
    const modeGroup = document.createElement('div');
    modeGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; margin: 8px 0;';

    const modeLabel = document.createElement('label');
    modeLabel.textContent = '模式:';
    modeLabel.style.cssText = 'font-size: 13px; color: #666;';
    modeGroup.appendChild(modeLabel);

    const modeSelect = document.createElement('select');
    modeSelect.className = 'btn-secondary';
    modeSelect.style.cssText = 'flex: 1; padding: 6px 10px; cursor: pointer;';

    const modes = ['paragraphs', 'words', 'bytes'];
    modes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode;
      option.textContent = mode === 'paragraphs' ? '段落' : mode === 'words' ? '单词' : '字节';
      modeSelect.appendChild(option);
    });

    modeGroup.appendChild(modeLabel);
    modeGroup.appendChild(modeSelect);
    optionsGroup.appendChild(modeGroup);

    wrapper.appendChild(optionsGroup);

    // 生成按钮
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const generateBtn = document.createElement('button');
    generateBtn.className = 'btn-primary';
    generateBtn.textContent = '🔄 生成';
    buttonGroup.appendChild(generateBtn);

    wrapper.appendChild(buttonGroup);

    // 输出区域
    const outputGroup = document.createElement('div');
    outputGroup.className = 'input-output-group';

    const outputLabel = document.createElement('label');
    outputLabel.className = 'tool-label';
    outputLabel.textContent = '生成的文本:';
    outputGroup.appendChild(outputLabel);

    const outputWrapper = document.createElement('div');
    outputWrapper.className = 'textarea-wrapper';

    const output = document.createElement('textarea');
    output.className = 'tool-textarea';
    output.readOnly = true;
    output.placeholder = 'Lorem Ipsum 文本将显示在这里...';
    output.style.minHeight = '150px';
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

    // Lorem Ipsum 词库
    const words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
      'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
      'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
      'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
      'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
      'laborum', 'et', 'dolorum', 'fugiat', 'nulla', 'pariatur'
    ];

    // 生成函数
    function generate() {
      const paragraphs = parseInt(paraSlider.value);
      const sentencesPerParagraph = parseInt(sentSlider.value);
      const mode = modeSelect.value;

      let text = '';

      for (let p = 0; p < paragraphs; p++) {
        let paragraph = '';

        for (let s = 0; s < sentencesPerParagraph; s++) {
          const sentenceLength = Math.floor(Math.random() * 8) + 4; // 4-12 words
          let sentence = '';

          for (let w = 0; w < sentenceLength; w++) {
            const word = words[Math.floor(Math.random() * words.length)];
            sentence += word + ' ';
          }

          sentence = sentence.trim() + '. ';
          paragraph += sentence;
        }

        text += paragraph.trim();

        if (p < paragraphs - 1) {
          text += '\n\n';
        }
      }

      output.value = text;
    }

    generateBtn.onclick = generate;
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default LoremIpsumTool;

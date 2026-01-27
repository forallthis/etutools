import type { Tool } from '../../types/tool.js';
import { copyToClipboard, showCopyFeedback } from '../../utils/clipboard.js';

const MarkdownPreviewTool: Tool = {
  id: 'markdown-preview',
  name: 'Markdown Preview',
  category: 'text',
  description: 'Preview Markdown with live rendering',
  icon: '📝',

  render(container: HTMLElement): void {
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'tool-container';
    wrapper.style.cssText = 'display: flex; flex-direction: column; height: 100%;';

    // 工具栏
    const toolbar = document.createElement('div');
    toolbar.style.cssText = 'display: flex; gap: 8px; margin-bottom: 12px;';

    const sampleBtn = document.createElement('button');
    sampleBtn.className = 'btn-secondary';
    sampleBtn.textContent = '📝 示例';
    sampleBtn.onclick = () => {
      input.value = `# Markdown 示例

## 文本格式

**粗体文本** 和 *斜体文本*
~~删除线~~

## 列表

### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2

### 有序列表
1. 第一项
2. 第二项
3. 第三项

## 代码

行内代码: \`console.log('Hello')\`

\`\`\`javascript
function greet(name) {
  return 'Hello, ' + name;
}
\`\`\`

## 引用

> 这是一段引用文本
> 可以有多行

## 链接和图片

[访问 GitHub](https://github.com)

## 表格

| 名称 | 年龄 | 城市 |
|------|------|------|
| John | 30   | 纽约 |
| Jane | 25   | 波士顿 |

## 分隔线

---

## 任务列表

- [x] 已完成任务
- [ ] 未完成任务
`;
      updatePreview();
    };
    toolbar.appendChild(sampleBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'btn-secondary';
    clearBtn.textContent = '🗑️ 清空';
    clearBtn.onclick = () => {
      input.value = '';
      updatePreview();
    };
    toolbar.appendChild(clearBtn);

    const copyHtmlBtn = document.createElement('button');
    copyHtmlBtn.className = 'btn-secondary';
    copyHtmlBtn.textContent = '📋 复制 HTML';
    copyHtmlBtn.onclick = async () => {
      if (preview.innerHTML) {
        await copyToClipboard(preview.innerHTML);
        showCopyFeedback(copyHtmlBtn);
      }
    };
    toolbar.appendChild(copyHtmlBtn);

    wrapper.appendChild(toolbar);

    // 主内容区 - 两列布局
    const contentArea = document.createElement('div');
    contentArea.style.cssText = 'display: flex; gap: 16px; flex: 1; min-height: 500px;';

    // 左侧编辑区
    const editorSection = document.createElement('div');
    editorSection.style.cssText = 'flex: 1; display: flex; flex-direction: column;';

    const editorLabel = document.createElement('label');
    editorLabel.className = 'tool-label';
    editorLabel.textContent = 'Markdown 输入:';
    editorSection.appendChild(editorLabel);

    const input = document.createElement('textarea');
    input.className = 'tool-textarea';
    input.placeholder = '# 标题\n\n输入 Markdown 文本...';
    input.style.cssText = 'flex: 1; min-height: 400px; font-family: monospace; font-size: 13px; resize: vertical;';
    input.addEventListener('input', updatePreview);
    editorSection.appendChild(input);

    contentArea.appendChild(editorSection);

    // 右侧预览区
    const previewSection = document.createElement('div');
    previewSection.style.cssText = 'flex: 1; display: flex; flex-direction: column;';

    const previewLabel = document.createElement('label');
    previewLabel.className = 'tool-label';
    previewLabel.textContent = '预览:';
    previewSection.appendChild(previewLabel);

    const preview = document.createElement('div');
    preview.style.cssText = 'flex: 1; min-height: 400px; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px; background: #ffffff; overflow-y: auto; font-size: 14px; line-height: 1.6;';
    previewSection.appendChild(preview);

    contentArea.appendChild(previewSection);
    wrapper.appendChild(contentArea);

    container.appendChild(wrapper);

    // 简单的 Markdown 解析器
    function parseMarkdown(markdown: string): string {
      let html = markdown;

      // 转义 HTML
      html = html.replace(/&/g, '&amp;');
      html = html.replace(/</g, '&lt;');
      html = html.replace(/>/g, '&gt;');

      // 代码块 (必须在其他规则之前)
      html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
      });

      // 行内代码
      html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

      // 标题
      html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
      html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
      html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
      html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
      html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
      html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

      // 粗体和斜体
      html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
      html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
      html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
      html = html.replace(/_(.+?)_/g, '<em>$1</em>');

      // 删除线
      html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

      // 引用
      html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

      // 水平线
      html = html.replace(/^---$/gm, '<hr>');
      html = html.replace(/^\*\*\*$/gm, '<hr>');

      // 无序列表
      html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
      html = html.replace(/(<li>.*<\/li>)\n(?!<li>)/g, '$1</ul>\n');
      html = html.replace(/(?<!<\/ul>\n)(<li>)/g, '<ul>$1');

      // 有序列表
      html = html.replace(/^\d+\.\s+(.+)$/gm, '<oli>$1</oli>');
      html = html.replace(/(<oli>.*<\/oli>)\n(?!<oli>)/g, '$1</ol>\n');
      html = html.replace(/(?<!<\/ol>\n)(<oli>)/g, '<ol>$1');
      html = html.replace(/<oli>/g, '<li>');
      html = html.replace(/<\/oli>/g, '</li>');

      // 任务列表
      html = html.replace(/^\s*-\s*\[x\]\s+(.*)$/gmi, '<li><input type="checkbox" checked disabled> $1</li>');
      html = html.replace(/^\s*-\s*\[\s*\]\s+(.*)$/gmi, '<li><input type="checkbox" disabled> $1</li>');

      // 链接
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

      // 图片
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;">');

      // 表格
      const lines = html.split('\n');
      let inTable = false;
      let tableRows: string[] = [];
      const result: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('|') && line.trim().startsWith('|')) {
          const cells = line.split('|').filter((_, idx) => idx > 0 && idx < line.split('|').length - 1);
          
          if (cells.some(cell => /^[\s\-:]+$/.test(cell))) {
            // 表头分隔行,跳过
            continue;
          }

          if (!inTable) {
            inTable = true;
            tableRows = [];
          }

          const isHeader = i > 0 && lines[i - 1].includes('|') && 
                          lines[i - 1].split('|').some(cell => /^[\s\-:]+$/.test(cell));
          
          const cellTag = isHeader ? 'th' : 'td';
          const rowTag = isHeader ? 'thead' : 'tr';
          
          const row = `<${rowTag}>${cells.map(cell => `<${cellTag}>${cell.trim()}</${cellTag}>`).join('')}</${rowTag}>`;
          tableRows.push(row);
        } else {
          if (inTable) {
            result.push('<table>' + tableRows.join('') + '</table>');
            tableRows = [];
            inTable = false;
          }
          result.push(line);
        }
      }

      if (inTable) {
        result.push('<table>' + tableRows.join('') + '</table>');
      }

      html = result.join('\n');

      // 段落
      html = html.replace(/\n\n/g, '</p><p>');
      html = '<p>' + html + '</p>';

      // 清理空段落
      html = html.replace(/<p>\s*<\/p>/g, '');
      html = html.replace(/<p>(<h[1-6]>)/g, '$1');
      html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
      html = html.replace(/<p>(<ul>)/g, '$1');
      html = html.replace(/(<\/ul>)<\/p>/g, '$1');
      html = html.replace(/<p>(<ol>)/g, '$1');
      html = html.replace(/(<\/ol>)<\/p>/g, '$1');
      html = html.replace(/<p>(<blockquote>)/g, '$1');
      html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
      html = html.replace(/<p>(<pre>)/g, '$1');
      html = html.replace(/(<\/pre>)<\/p>/g, '$1');
      html = html.replace(/<p>(<table>)/g, '$1');
      html = html.replace(/(<\/table>)<\/p>/g, '$1');
      html = html.replace(/<p>(<hr>)/g, '$1');
      html = html.replace(/(<\/hr>)<\/p>/g, '$1');

      return html;
    }

    function updatePreview() {
      const markdown = input.value;
      preview.innerHTML = parseMarkdown(markdown) || '<p style="color: #999; font-style: italic;">预览将显示在这里...</p>';
    }
  },

  process(input: string): string {
    return input;
  },

  async copyResult() {}
};

export default MarkdownPreviewTool;

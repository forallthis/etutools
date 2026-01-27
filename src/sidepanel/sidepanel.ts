import type { Tool, ToolCategory } from '../types/tool.js';
import { storage } from '../utils/storage.js';
import { tools } from '../tools/index.js';

interface CategoryGroup {
  category: ToolCategory;
  name: string;
  icon: string;
  tools: Tool[];
}

const categories: CategoryGroup[] = [
  { category: 'developer', name: 'Developer Tools', icon: '💻', tools: [] },
  { category: 'text', name: 'Text Processing', icon: '📝', tools: [] },
  { category: 'encryption', name: 'Encryption', icon: '🔐', tools: [] },
  { category: 'time', name: 'Time & Number', icon: '⏰', tools: [] },
  { category: 'image', name: 'Image & Visual', icon: '🖼️', tools: [] },
  { category: 'utilities', name: 'Utilities', icon: '🔧', tools: [] }
];

let currentTool: Tool | null = null;
let currentTheme: 'light' | 'dark' = 'light';

// Theme Management
function initTheme(): void {
  // Load saved theme or use system preference
  const savedTheme = localStorage.getItem('oktools-theme') as 'light' | 'dark' | null;

  if (savedTheme) {
    currentTheme = savedTheme;
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    }
  }

  applyTheme();
  setupThemeToggle();
}

function applyTheme(): void {
  document.documentElement.setAttribute('data-theme', currentTheme);
  const themeIcon = document.querySelector('.theme-icon-sidepanel') as HTMLElement;
  themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme(): void {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('oktools-theme', currentTheme);
  applyTheme();
}

function setupThemeToggle(): void {
  const themeToggle = document.getElementById('themeToggleSidepanel') as HTMLElement;
  themeToggle.addEventListener('click', toggleTheme);
}

// Register tools on load
function registerAllTools(): void {
  tools.forEach(tool => {
    const category = categories.find(c => c.category === tool.category);
    if (category && !category.tools.find(t => t.id === tool.id)) {
      category.tools.push(tool);
    }
  });
  console.log('SidePanel registered', tools.length, 'tools');
}

function renderCategories(): void {
  const nav = document.getElementById('categoriesNav')!;
  nav.textContent = '';

  categories.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'category-group';

    const header = document.createElement('div');
    header.className = 'category-header';

    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '▼';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${group.icon} ${group.name}`;

    header.appendChild(arrow);
    header.appendChild(nameSpan);

    const toolsList = document.createElement('div');
    toolsList.className = 'category-tools';

    group.tools.forEach(tool => {
      const toolItem = document.createElement('div');
      toolItem.className = 'tool-item';
      toolItem.textContent = tool.name;
      toolItem.dataset.toolId = tool.id;
      toolItem.addEventListener('click', () => loadTool(tool));
      toolsList.appendChild(toolItem);
    });

    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      toolsList.classList.toggle('collapsed');
    });

    groupDiv.appendChild(header);
    groupDiv.appendChild(toolsList);
    nav.appendChild(groupDiv);
  });
}

async function loadTool(tool: Tool): Promise<void> {
  console.log('Loading tool:', tool.id);

  currentTool = tool;

  document.querySelectorAll('.tool-item').forEach(item => {
    item.classList.remove('active');
    const activeItem = document.querySelector(`[data-tool-id="${tool.id}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  });

  await storage.set('lastUsedTool', tool.id);

  const container = document.getElementById('toolContainer')!;
  container.textContent = '';
  tool.render(container);

  console.log('Tool loaded:', tool.id);
}

function setupSearch(): void {
  const searchInput = document.getElementById('sidebarSearch') as HTMLInputElement;
  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();

    categories.forEach(group => {
      const visibleTools = group.tools.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );

      const toolItems = document.querySelectorAll('.tool-item');
      toolItems.forEach(item => {
        const toolId = item.dataset.toolId;
        const isVisible = visibleTools.some(t => t.id === toolId);
        (item as HTMLElement).style.display = isVisible ? 'block' : 'none';
      });
    });
  });
}

async function loadLastUsedTool(): Promise<void> {
  const lastUsedToolId = await storage.get('lastUsedTool');
  if (lastUsedToolId) {
    const tool = tools.find(t => t.id === lastUsedToolId);
    if (tool) {
      await loadTool(tool);
    }
  }
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message) => {
  console.log('SidePanel received message:', message);

  if (message.type === 'LOAD_TOOL' || message.type === 'OPEN_TOOL') {
    const tool = tools.find(t => t.id === message.toolId);
    if (tool) {
      loadTool(tool);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme first
  initTheme();

  registerAllTools();
  renderCategories();
  setupSearch();
  loadLastUsedTool();

  console.log('SidePanel initialized');
});

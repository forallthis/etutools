import type { Tool, ToolCategory } from '../types/tool.js';
import { tools } from '../tools/index.js';

let currentCategory: ToolCategory | 'all' = 'all';
let searchQuery = '';
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
  const themeIcon = document.querySelector('.theme-icon') as HTMLElement;
  themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme(): void {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('oktools-theme', currentTheme);
  applyTheme();
}

function setupThemeToggle(): void {
  const themeToggle = document.getElementById('themeToggle') as HTMLElement;
  themeToggle.addEventListener('click', toggleTheme);
}

function renderTools(): void {
  const grid = document.getElementById('toolsGrid')!;
  grid.textContent = '';

  const filteredTools = tools.filter(tool => {
    const matchesCategory = currentCategory === 'all' || tool.category === currentCategory;
    const matchesSearch =
      searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredTools.length === 0) {
    const noTools = document.createElement('div');
    noTools.className = 'no-tools-message';
    noTools.innerHTML = `
      <div class="no-tools-message-icon">🔍</div>
      <div class="no-tools-message-text">No tools found</div>
      <div style="font-size: 12px; margin-top: 4px;">Try adjusting your search or category</div>
    `;
    grid.appendChild(noTools);
    return;
  }

  filteredTools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'tool-icon';
    iconDiv.textContent = tool.icon;

    const nameDiv = document.createElement('div');
    nameDiv.className = 'tool-name';
    nameDiv.textContent = tool.name;

    card.appendChild(iconDiv);
    card.appendChild(nameDiv);

    card.addEventListener('click', () => openToolInPopup(tool));
    grid.appendChild(card);
  });
}

function openToolInPopup(tool: Tool): void {
  console.log('Opening tool in popup:', tool.id);

  currentTool = tool;

  // Hide tools grid
  const grid = document.getElementById('toolsGrid')!;
  grid.style.display = 'none';

  // Hide header, search and categories
  const header = document.querySelector('.popup-header') as HTMLElement;
  header.style.display = 'none';
  const search = document.querySelector('.search-bar')!;
  search.style.display = 'none';
  const chips = document.querySelector('.category-chips')!;
  chips.style.display = 'none';

  // Show tool display
  const toolDisplay = document.getElementById('toolDisplay')!;
  toolDisplay.style.display = 'block';

  // Set tool title
  const title = document.getElementById('toolTitle')!;
  title.textContent = tool.name;

  // Render tool in workspace
  const workspace = document.getElementById('toolWorkspace')!;
  workspace.textContent = '';
  workspace.style.maxHeight = '400px';
  workspace.style.overflowY = 'auto';

  tool.render(workspace);

  // Setup close button
  const closeBtn = document.getElementById('closeTool')!;
  closeBtn.onclick = () => closeTool();
}

function closeTool(): void {
  console.log('Closing tool');

  currentTool = null;

  // Show tools grid
  const grid = document.getElementById('toolsGrid')!;
  grid.style.display = 'grid';

  // Show header, search and categories
  const header = document.querySelector('.popup-header') as HTMLElement;
  header.style.display = 'flex';
  const search = document.querySelector('.search-bar')!;
  search.style.display = 'block';
  const chips = document.querySelector('.category-chips')!;
  chips.style.display = 'flex';

  // Hide tool display
  const toolDisplay = document.getElementById('toolDisplay')!;
  toolDisplay.style.display = 'none';
}

function setupCategoryChips(): void {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCategory = chip.dataset.category as ToolCategory | 'all';
      renderTools();
    });
  });
}

function setupSearch(): void {
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  searchInput.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    renderTools();
  });
}

// Initialize on DOM loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup loaded with', tools.length, 'tools');

  // Initialize theme first
  initTheme();

  // Check if Side Panel is available
  if (chrome.sidePanel) {
    console.log('Side Panel API available - opening Side Panel and closing popup');

    try {
      // Open Side Panel
      await chrome.sidePanel.open();

      // Close this popup immediately
      window.close();

      return;
    } catch (error) {
      console.error('Failed to open Side Panel, falling back to popup mode:', error);
      // Continue with popup mode if Side Panel fails
    }
  } else {
    console.log('Side Panel API not available - using popup inline mode');
  }

  // Initialize popup mode (either fallback or Side Panel not available)
  renderTools();
  setupCategoryChips();
  setupSearch();
});

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export async function readFromClipboard(): Promise<string> {
  return await navigator.clipboard.readText();
}

export function showCopyFeedback(button: HTMLElement): void {
  const originalText = button.textContent;
  button.textContent = '✓ Copied!';
  button.classList.add('copied');

  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove('copied');
  }, 1500);
}

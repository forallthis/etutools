export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  render(container: HTMLElement): void;
  process(input: string, options?: Record<string, any>): Promise<string> | string;
  copyResult(): Promise<void>;
}

export type ToolCategory =
  | 'developer'
  | 'text'
  | 'encryption'
  | 'time'
  | 'image'
  | 'utilities';

export interface ToolOptions {
  [key: string]: any;
}

export interface ToolResult {
  output: string;
  error?: string;
  metadata?: Record<string, any>;
}

interface hljsInterface {
  highlightAll: () => void;
}

declare global {
  interface Window {
    hljs: hljsInterface;
  }
}

export interface Link {
  name: string;
  hyperlink: string;
}

export function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getExtension(path: string): string {
  const parts = path.split(".");
  return parts[parts.length - 1];
}

export function highlightCode() {
  // TODO: use web worker: https://github.com/highlightjs/highlight.js/#using-web-workers
  window.hljs.highlightAll();
}

export async function get_trees(): Promise<string[]> {
  const response = await fetch("JXR_BACKEND/trees");
  return await response.json();
}

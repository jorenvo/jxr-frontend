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

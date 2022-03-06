import { JXRSearchUI } from "./component_search.js";

interface hljsMock {
  highlightAll: () => void;
}

declare global {
  interface Window {
    hljs: hljsMock;
  }
}

function setup_search() {
  async function redirect(query: string) {
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  }

  new JXRSearchUI("search-placeholder", redirect).getDom();
}

async function load_file() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get("path");

  const response = await fetch(`jxr-code/${path}`);
  document.getElementById("file")!.textContent = await response.text();

  window.hljs.highlightAll();
}

setup_search();
load_file();

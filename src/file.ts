import {
  JXRCodeTable,
  JXRCodeTableLineClickable,
} from "./component_code_table.js";
import { JXRSearchUI } from "./component_search.js";

interface hljsInterface {
  highlightAll: () => void;
}

declare global {
  interface Window {
    hljs: hljsInterface;
  }
}

const code_table = new JXRCodeTable("code-table-placeholder");

function setup_search() {
  async function redirect(query: string) {
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  }

  new JXRSearchUI("search-placeholder", redirect).getDom();
}

function populate_code_table(code: string, extension: string) {
  code.split("\n").forEach((line, index) => {
    code_table.append(
      new JXRCodeTableLineClickable(String(index + 1), line, extension)
    );
  });
}

async function load_file() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get("path")!;
  const extension = path.split(".")[1];

  const response = await fetch(`jxr-code/${path}`);
  populate_code_table(await response.text(), extension);

  // TODO: use web worker: https://github.com/highlightjs/highlight.js/#using-web-workers
  window.hljs.highlightAll();
}

setup_search();
load_file();

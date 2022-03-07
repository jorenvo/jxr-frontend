import { JXRCodeTable, JXRCodeTableLine } from "./component_code_table.js";
import { JXRSearchUI } from "./component_search.js";
import { getExtension, highlightCode } from "./utils.js";

const code_table = new JXRCodeTable("code-table-placeholder");

function setup_search() {
  async function redirect(query: string) {
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  }

  new JXRSearchUI("search-placeholder", redirect).getDom();
}

function populate_code_table(code: string, extension: string) {
  code.split("\n").forEach((line, index) => {
    code_table.append(new JXRCodeTableLine(String(index + 1), line, extension));
  });
}

async function load_file() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get("path")!;
  const extension = getExtension(path);

  const response = await fetch(`jxr-code/${path}`);
  populate_code_table(await response.text(), extension);

  highlightCode();

  const hash = window.location.hash;
  if (hash) {
    document.getElementById(hash.replace("#", ""))!.scrollIntoView();
  }
}

setup_search();
load_file();

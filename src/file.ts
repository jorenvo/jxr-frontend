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

function populate_code_table(code: string) {
  code.split("\n").forEach((line, index) => {
    const number_td = document.createElement("td");
    const code_td = document.createElement("td");

    let pre = document.createElement("pre");
    pre.classList.add("line-number");
    pre.textContent = String(index + 1);
    number_td.append(pre);

    pre = document.createElement("pre");
    const code_el = document.createElement("code"); // TODO: language based on extension
    code_el.innerText = line;
    pre.append(code_el);
    code_td.append(pre);

    const tr = document.createElement("tr");
    tr.append(number_td, code_td);
    document.getElementById("code-table")!.append(tr);

    // abstract class CodeTableElement {
    //
    // }

    // outside: const table = new JXRCodeTable("code-table");
    // const code_line = new CodeLine(index + 1, line)
    // table.append(code_line, 1);
  });
}

async function load_file() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get("path");

  const response = await fetch(`jxr-code/${path}`);
  populate_code_table(await response.text());

  // TODO: use web worker: https://github.com/highlightjs/highlight.js/#using-web-workers
  window.hljs.highlightAll();
}

setup_search();
load_file();

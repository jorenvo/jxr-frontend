import { getLineAndCharacterOfPosition } from "../node_modules/typescript/lib/typescript.js";
import { JXRCodeTable, JXRCodeTableLine } from "./component_code_table.js";
import { JXRGithubLinks } from "./component_github.js";
import { JXRSearchUI } from "./component_search.js";
import { escapeHtml, getExtension, get_trees, highlightCode } from "./utils.js";

let search_ui: JXRSearchUI | undefined;
let code_table: JXRCodeTable | undefined;

async function setup_search() {
  async function redirect(tree: string, query: string) {
    window.location.href = `/?tree=${encodeURIComponent(
      tree
    )}&search=${encodeURIComponent(query)}`;
  }

  search_ui = new JXRSearchUI(
    "search-placeholder",
    await get_trees(),
    redirect
  );

  code_table = new JXRCodeTable(
    "code-table-placeholder",
    search_ui,
    "search-symbol-popup"
  );
}

function construct_line_numbers(code: string) {
  var nr_lines = (code.match(/\n/g) || []).length;
  let line_number_dom = "";
  for (let i = 1; i < nr_lines + 2; i++) {
    line_number_dom += `<div id="line-${i}">${i}</div>`;
  }
  line_number_dom = `<div class="line-numbers">${line_number_dom}</div>`;

  return line_number_dom;
}

function show_specified_line() {
  const hash = window.location.hash;
  if (hash) {
    document.querySelector(hash)!.scrollIntoView();
  }
}

function populate_code_table(code: string, extension: string) {
  const worker = new Worker("js/highlight_worker.js");

  worker.onmessage = (event) => {
    const right = `<pre><code class="language-${extension}">${event.data.trim()}</pre></code>`;
    const left = construct_line_numbers(right);
    code_table!.dom.innerHTML = `<div id="flex-parent">${left}${right}</div>`;
    show_specified_line();
  };

  worker.postMessage({ code: code, extension: extension });
}

async function setup_github(tree: string, path: string) {
  const full_path = `${tree}/${path}`;
  const root_response = fetch(`JXR_BACKEND/root?path=${full_path}`);
  const head_response = fetch(`JXR_BACKEND/head?path=${full_path}`);
  const github_response = fetch(`JXR_BACKEND/github?path=${full_path}`);

  const root = await (await root_response).json();
  const head = await (await head_response).json();
  const repo = await (await github_response).json();

  console.log(
    `Using path: ${path}, root: ${root}, head: ${head}, repo: ${repo}`
  );

  const github_path = path.substring(root.length - (tree + "/").length);
  new JXRGithubLinks("github-placeholder", github_path, head, repo);
}

async function load_file() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get("path")!;
  const extension = getExtension(path);
  const tree = search_ui!.getTreeSelector().getTree();
  const response = await fetch(`jxr-code/${tree}/${path}`);
  populate_code_table(await response.text(), extension);
  setup_github(tree, path);
}

async function main() {
  await setup_search();
  load_file();
}

main();

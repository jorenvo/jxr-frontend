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

function getLines(node: Node, current_line: string, lines: string[]) {
  if (!node) {
    return;
  }

  if (node.textContent?.includes("\n")) {
    console.log(`pushing ${current_line} in`, node);
    lines.push(`${current_line}`);
    current_line = "";
  } else {
    current_line += node.textContent;
  }

  for (let child of node.childNodes) {
    getLines(child, current_line, lines);
  }
}

function populate_code_table(code: string, extension: string) {
  // <pre><code class="language-${extension}"></code></pre>
  code_table!.dom.innerHTML = `<pre><code class="language-${extension}">${escapeHtml(
    code
  )}</code></pre>`;

  // console.log(document.querySelector("code")?.childNodes);
  // setTimeout(() => console.log(document.querySelector("code")?.childNodes), 0);

  const lines: string[] = [];
  getLines(document.querySelector("code")! as Node, "", lines);
  console.log("got lines");
  console.log(lines);

  // console.log("extracted lines are:", lines);

  highlightCode();

  // code.split("\n").forEach((line, index) => {
  //   code_table!.append(
  //     new JXRCodeTableLine(String(index + 1), line, extension)
  //   );
  // });
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

  const hash = window.location.hash;
  if (hash) {
    document.getElementById(hash.replace("#", ""))!.scrollIntoView();
  }

  setup_github(tree, path);
}

async function main() {
  await setup_search();
  load_file();
}

main();

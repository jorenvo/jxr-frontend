import { JXRCodeTable, JXRCodeTableLine } from "./component_code_table.js";
import { JXRGithubLinks } from "./component_github.js";
import { JXRSearchUI } from "./component_search.js";
import { getExtension, get_trees, highlightCode } from "./utils.js";

let search_ui: JXRSearchUI | undefined;
let code_table: JXRCodeTable | undefined;

async function setup_search() {
  async function redirect(query: string) {
    window.location.href = `/?search=${encodeURIComponent(query)}`;
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

function populate_code_table(code: string, extension: string) {
  code.split("\n").forEach((line, index) => {
    code_table!.append(
      new JXRCodeTableLine(String(index + 1), line, extension)
    );
  });
}

async function setup_github(tree: string, path: string) {
  let response = await fetch(`JXR_BACKEND/head?tree=${tree}`);
  const head = await response.json();
  response = await fetch(`JXR_BACKEND/github?tree=${tree}`);
  const repo = await response.json();
  console.log(`Using path: ${path}, head: ${head}, repo: ${repo}`);
  new JXRGithubLinks("github-placeholder", path, head, repo);
}

async function load_file() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get("path")!;
  const extension = getExtension(path);
  const tree = search_ui!.getTreeSelector().getTree();
  const response = await fetch(`jxr-code/${tree}/${path}`);
  populate_code_table(await response.text(), extension);

  highlightCode();

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

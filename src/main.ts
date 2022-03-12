import { JXRSearchUI } from "./component_search.js";
import {
  JXRCodeTable,
  JXRCodeTableLine,
  JXRCodeTableNav,
} from "./component_code_table.js";
import { getExtension, get_trees, highlightCode } from "./utils.js";

const MAX_LENGTH_MATCH = 1_000;

let last_search_promise;
const code_table = new JXRCodeTable("code-table-placeholder");

async function search(tree: string, query: string) {
  if (query.length === 0) {
    return;
  }

  const search_promise = fetch(
    `http://localhost:8081/search?tree=${encodeURIComponent(
      tree
    )}&query=${encodeURIComponent(query)}`
  );
  last_search_promise = search_promise;

  const response = await last_search_promise;

  // check if there's a more recent search
  if (search_promise !== last_search_promise) {
    console.log(`Aborted search promise for "${query}"`);
    return;
  }

  console.log(`Processing search result for "${query}"`);

  const rg_results: any[] = await response.json();

  code_table.clear();

  let extension = "";
  let file_path = "";
  for (let result of rg_results) {
    if (result.type === "begin") {
      file_path = result.data.path.text;
      extension = getExtension(file_path);

      const links = file_path.split("/").map((part, index, parts) => {
        let hyperlink = part;
        if (index === parts.length - 1) {
          hyperlink = `file.html?path=${encodeURIComponent(file_path)}`;
        }

        return { name: part, hyperlink: hyperlink };
      });

      code_table.append(new JXRCodeTableNav(links));
    } else if (result.type === "match") {
      const line = result.data.lines.text.trim();

      if (line.length > MAX_LENGTH_MATCH) {
        console.warn(
          `Skipped long match (${line.length} lines, max is ${MAX_LENGTH_MATCH}) in ${result.data.path.text}`
        );
        continue;
      }

      const line_number = result.data.line_number;
      code_table.append(
        new JXRCodeTableLine(
          line_number,
          line,
          extension,
          `file.html?tree=${encodeURIComponent(tree)}&path=${encodeURIComponent(
            file_path
          )}#line-${line_number}`
        )
      );
    } else if (result.type === "summary") {
      const time = result.data.elapsed_total.human;
      const lines = result.data.stats.matched_lines;
      console.log(`Backend search took ${time} and matched ${lines} lines`);
    }
  }

  highlightCode();
}

async function main() {
  const searchUI = new JXRSearchUI(
    "search-placeholder",
    await get_trees(),
    search
  );
}

main();

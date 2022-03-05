import { JXRPath } from "./component_path.js";
import { JXRResult } from "./component_result.js";
import { JXRSearchUI } from "./component_search.js";

const MAX_LENGTH_MATCH = 1_000;

let last_search_promise;
let delayed_search: number | undefined;
const results_element = document.getElementById("results")!;

async function search(query: string) {
  if (query.length === 0) {
    return;
  }

  const search_promise = fetch(
    `http://localhost:8081/search?query=${encodeURIComponent(query)}`
  );
  last_search_promise = search_promise;

  const response = await last_search_promise;

  // check if there's a more recent search
  if (search_promise !== last_search_promise) {
    console.log(`Aborted search promise for "${query}"`);
    return;
  }

  console.log(`Processing search result for "${query}"`);

  history.replaceState({}, "", `/?search=${encodeURIComponent(query)}`);

  const rg_results: any[] = await response.json();

  results_element.innerHTML = "";

  for (let result of rg_results) {
    if (result.type === "begin") {
      const path_text: string = result.data.path.text;

      const links = path_text.split("/").map((part, index, parts) => {
        let hyperlink = part;
        if (index === parts.length - 1) {
          hyperlink = `jxr-code/${path_text}`;
        }

        return { name: part, hyperlink: hyperlink };
      });
      results_element.appendChild(new JXRPath(links));
    } else if (result.type === "match") {
      const line = result.data.lines.text;

      if (line.length > MAX_LENGTH_MATCH) {
        console.warn(
          `Skipped long match (${line.length} lines, max is ${MAX_LENGTH_MATCH}) in ${result.data.path.text}`
        );
        continue;
      }

      results_element.appendChild(
        new JXRResult(result.data.line_number, line, "/dummy")
      );
    } else if (result.type === "summary") {
      const time = result.data.elapsed_total.human;
      const lines = result.data.stats.matched_lines;
      console.log(`Backend search took ${time} and matched ${lines} lines`);
    }
  }
}

const search_element = new JXRSearchUI("search-placeholder").getDom();
search_element.focus();

search_element.addEventListener("input", async (e: Event) => {
  if (delayed_search) {
    window.clearTimeout(delayed_search);
  }

  delayed_search = window.setTimeout(() => {
    const new_query = (e.target! as HTMLInputElement).value;
    search(new_query);
  }, 300);
});

const url = new URL(window.location.href);
const initial_search = url.searchParams.get("search");

if (initial_search) {
  search_element.value = initial_search;
  search(initial_search);
}

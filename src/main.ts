import { JXRPath } from "./component_path.js";
import { JXRResult } from "./component_result.js";

let last_search_promise;
const query_element = document.getElementById("query")!;
const results_element = document.getElementById("results")!;

async function search(query: string) {
  const search_promise = fetch(
    `http://localhost:8081/search?query=${encodeURIComponent(query)}`
  );
  last_search_promise = search_promise;

  const response = await last_search_promise;

  // check if there's a more recent search
  if (search_promise !== last_search_promise) {
    return;
  }

  const rg_results: any[] = await response.json();

  results_element.innerHTML = "";

  for (let result of rg_results) {
    if (result.type === "begin") {
      const path_text: string = result.data.path.text;

      const links = path_text.split("/").map((part) => {
        return { name: part, hyperlink: part };
      });
      results_element.appendChild(new JXRPath(links));
    } else if (result.type === "match") {
      results_element.appendChild(
        new JXRResult(result.data.line_number, result.data.lines.text, "/dummy")
      );
    }
  }
}

let delayed_search: number | undefined;
query_element.addEventListener("input", async (e: Event) => {
  if (delayed_search) {
    window.clearTimeout(delayed_search);
  }

  delayed_search = window.setTimeout(() => {
    const new_query = (e.target! as HTMLInputElement).value;
    search(new_query);
  }, 300);
});

import { JXRPath } from "./component_path.js";
import { JXRResult } from "./component_result.js";

const query_element = document.getElementById("query")!;
const results_element = document.getElementById("results")!;

query_element.addEventListener("input", async (e: Event) => {
  const new_query = (e.target! as HTMLInputElement).value;

  const response = await fetch(
    `http://localhost:8081/search?query=${encodeURIComponent(new_query)}`
  );

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
        new JXRResult(result.data.line_number, result.data.lines.text)
      );
    }
  }
});

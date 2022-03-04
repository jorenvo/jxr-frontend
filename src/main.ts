import { JXRPath } from "./component_path.js";

const query_element = document.getElementById("query")!;
const results_element = document.getElementById("results")!;

query_element.addEventListener("input", async (e: Event) => {
  const new_query = (e.target! as HTMLInputElement).value;

  const response = await fetch(
    `http://localhost:8081/search?query=${encodeURIComponent(new_query)}`
  );

  const rg_results: any[] = await response.json();

  const begins = rg_results.filter((result) => result.type === "begin");

  for (let begin of begins) {
    const path_text: string = begin.data.path.text;

    const links = path_text.split("/").map((part) => {
      return { name: part, hyperlink: part };
    });
    document.body.appendChild(new JXRPath(links));
  }

  // .map(
  //   (result) =>
  //     new JXRPath([
  //       { name: result.data.path.text, hyperlink: result.data.path.text },
  //     ])
  // )
  // .forEach((path) => document.body.appendChild(path));
});

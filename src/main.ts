const query_element = document.getElementById("query")!;
const results_element = document.getElementById("results")!;

query_element.addEventListener("input", async (e: Event) => {
  const new_query = (e.target! as HTMLInputElement).value;

  const response = await fetch(
    `http://localhost:8081/search?query=${encodeURIComponent(new_query)}`
  );

  results_element.innerText = await response.json();
});

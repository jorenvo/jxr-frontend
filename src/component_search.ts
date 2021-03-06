export class JXRSearchUI {
  static SEARCH_DELAY_MS = 99999999; // TODO: re-enable when performance improves

  private dom: HTMLInputElement;
  private tree_selector: JXRTreeSelector;
  private delayed_search: number | undefined;
  private search_fn: (tree: string, query: string) => Promise<void>;

  constructor(
    id: string,
    trees: string[],
    search_fn: (tree: string, query: string) => Promise<void>
  ) {
    const search_container = document.createElement("div");
    this.dom = document.createElement("input");
    this.dom.placeholder = "search query";
    search_container.append(this.dom);

    const tree_placeholder = document.createElement("div");
    search_container.append(tree_placeholder);

    this.tree_selector = new JXRTreeSelector(
      tree_placeholder,
      trees,
      this.search.bind(this)
    );

    this.search_fn = search_fn;

    this.setupHandler();
    document.getElementById(id)!.replaceWith(search_container);

    this.initializeFromURL();
  }

  private initializeFromURL() {
    const url = new URL(window.location.href);
    const initial_tree = url.searchParams.get("tree");
    const initial_search = url.searchParams.get("search");
    if (initial_tree) {
      this.tree_selector.setTree(initial_tree);
    }

    if (initial_search) {
      this.setQuery(initial_search);
    }

    if (initial_tree && initial_search) {
      this.search_fn(initial_tree, initial_search);
    }
  }

  private getQuery() {
    return this.dom.value;
  }

  setQuery(query: string) {
    this.dom.value = query;
  }

  private search() {
    const tree = this.tree_selector.getTree();
    const query = this.getQuery();
    history.replaceState(
      {},
      "",
      `/?${this.serialize(!!"include search").join("&")}`
    );
    this.search_fn(tree, query);
  }

  private setupHandler() {
    this.dom.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        this.search();
      }
    });

    this.dom.addEventListener("input", async (e: Event) => {
      if (this.delayed_search) {
        window.clearTimeout(this.delayed_search);
      }

      this.delayed_search = window.setTimeout(() => {
        this.search();
      }, JXRSearchUI.SEARCH_DELAY_MS);
    });
  }

  serialize(include_search: boolean): string[] {
    const params = [];
    params.push(`tree=${encodeURIComponent(this.getTreeSelector().getTree())}`);

    if (include_search) {
      params.push(`search=${encodeURIComponent(this.getQuery())}`);
    }

    return params;
  }

  getDom() {
    return this.dom;
  }

  getTreeSelector() {
    return this.tree_selector;
  }
}

export class JXRTreeSelector {
  private options: string[];
  private dom: HTMLSelectElement;

  constructor(
    placeholder: HTMLElement,
    options: string[],
    changed: () => void
  ) {
    this.options = options;
    this.dom = this.constructDom();
    placeholder.replaceWith(this.dom);
    this.setupHandlers(changed);
  }

  private constructDom(): HTMLSelectElement {
    const select = document.createElement("select");

    this.options.forEach((option) => {
      select.innerHTML += `<option value=${option}>${option}</option>`;
    });

    return select;
  }

  private setupHandlers(changed: () => void) {
    this.dom.addEventListener("change", (e) => changed());
  }

  getTree(): string {
    return this.dom.value;
  }

  setTree(tree: string) {
    this.dom.value = tree;
  }
}

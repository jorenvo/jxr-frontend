export class JXRSearchUI {
  static SEARCH_DELAY_MS = 300;

  private dom: HTMLInputElement;
  private delayed_search: number | undefined;
  private search_fn: (query: string) => Promise<void>;

  constructor(id: string, search_fn: (query: string) => Promise<void>) {
    this.dom = document.createElement("input");
    this.dom.placeholder = "search query";
    this.search_fn = search_fn;

    this.setupHandler();
    document.getElementById(id)!.replaceWith(this.dom);
  }

  private setupHandler() {
    this.dom.addEventListener("input", async (e: Event) => {
      if (this.delayed_search) {
        window.clearTimeout(this.delayed_search);
      }

      this.delayed_search = window.setTimeout(() => {
        const new_query = (e.target! as HTMLInputElement).value;
        this.search_fn(new_query);
      }, JXRSearchUI.SEARCH_DELAY_MS);
    });
  }

  getDom() {
    return this.dom;
  }
}

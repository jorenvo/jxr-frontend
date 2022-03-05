export class JXRSearchUI {
  private dom: HTMLInputElement;

  constructor(id: string) {
    this.dom = document.createElement("input");
    this.dom.placeholder = "search query";

    document.getElementById(id)!.replaceWith(this.dom);
  }

  getDom() {
    return this.dom;
  }
}

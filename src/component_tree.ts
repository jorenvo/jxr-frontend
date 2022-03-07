export class JXRTreeSelector {
  private options: string[];
  private dom: HTMLSelectElement;

  constructor(id: string, options: string[]) {
    this.options = options;
    this.dom = this.constructDom();
    document.getElementById(id)!.replaceWith(this.dom);
  }

  private constructDom(): HTMLSelectElement {
    const select = document.createElement("select");

    this.options.forEach((option) => {
      select.innerHTML += `<option value=${option}>${option}</option>`;
    });

    return select;
  }
}

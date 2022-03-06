import { Link } from "./utils.js";

abstract class JXRCodeTableElementInterface {
  abstract getDom(): HTMLTableRowElement;
  // abstract handleClick(e: MouseEvent): void;
}

export class JXRCodeTable {
  private table_elements: JXRCodeTableElementInterface[];
  private dom: HTMLTableElement;

  constructor(id: string) {
    this.table_elements = [];
    this.dom = document.createElement("table");
    this.dom.classList.add("code-table");
    document.getElementById(id)!.replaceWith(this.dom);
  }

  append(table_element: JXRCodeTableElementInterface) {
    this.table_elements.push(table_element);
    this.dom.append(table_element.getDom());
  }

  clear() {
    this.table_elements = [];
    this.dom.innerHTML = "";
  }
}

export class JXRCodeTableNav implements JXRCodeTableElementInterface {
  private dom: HTMLTableRowElement;

  constructor(links: Link[]) {
    this.dom = this.constructDom(links);
  }

  private constructDom(links: Link[]): HTMLTableRowElement {
    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.setAttribute("colspan", "2");
    tr.append(td);

    links
      .map((link) => {
        const a = document.createElement("a");
        a.setAttribute("href", link.hyperlink);
        a.innerText = link.name;
        return a;
      })
      .forEach((a, index, all) => {
        td.append(a);
        if (index < all.length - 1) {
          td.append("/");
        }
      });

    return tr;
  }

  getDom(): HTMLTableRowElement {
    return this.dom;
  }
}

export class JXRCodeTableLine implements JXRCodeTableElementInterface {
  private dom: HTMLTableRowElement;
  private lineNumber: string;
  private line: string;
  private link: string;

  constructor(line_number: string, line: string, link: string) {
    this.lineNumber = line_number;
    this.line = line;
    this.link = link;
    this.dom = this.constructDom();
  }

  private constructDom(): HTMLTableRowElement {
    const line_number_a = document.createElement("a");
    line_number_a.setAttribute("href", this.link);
    line_number_a.innerText = this.lineNumber;

    const line_a = document.createElement("a");
    line_a.setAttribute("href", this.link);
    line_a.innerText = this.line.trim();

    const tr = document.createElement("tr");
    let td = document.createElement("td");
    td.classList.add("line-number");
    td.append(line_number_a);
    tr.append(td);

    td = document.createElement("td");
    td.append(line_a);
    tr.append(td);

    return tr;
  }

  getDom(): HTMLTableRowElement {
    return this.dom;
  }
}

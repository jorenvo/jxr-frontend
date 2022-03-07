import { Link, escapeHtml } from "./utils.js";

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

export class JXRCodeTableLineLinked implements JXRCodeTableElementInterface {
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
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="line-number">
        <a href="${this.link}">
          ${this.lineNumber}
        </a>
      </td>
      <td>
        <a href="${this.link}">
          <pre><code>${this.line}</code></pre>
        </a>
      </td>
    `;
    return tr;
  }

  getDom(): HTMLTableRowElement {
    return this.dom;
  }
}

export class JXRCodeTableLineClickable implements JXRCodeTableElementInterface {
  private dom: HTMLTableRowElement;
  private lineNumber: string;
  private line: string;
  private extension: string;

  constructor(line_number: string, line: string, extension: string) {
    this.lineNumber = line_number;
    this.line = line;
    this.extension = extension;
    this.dom = this.constructDom();
  }

  private constructDom(): HTMLTableRowElement {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="line-number">
        ${this.lineNumber}
      </td>
      <td>
        <pre><code class="language-${this.extension}">${escapeHtml(
      this.line
    )}</code></pre>
      </td>
    `;
    return tr;
  }

  getDom(): HTMLTableRowElement {
    return this.dom;
  }
}

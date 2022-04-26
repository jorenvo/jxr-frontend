import { JXRSearchUI } from "./component_search.js";
import { Link, escapeHtml } from "./utils.js";

abstract class JXRCodeTableElementInterface {
  abstract getDom(): HTMLTableRowElement;
}

// TODO: create subclass for symbol-click searching. It will take search_ui
// and popup_id instead.
export class JXRCodeTable {
  private table_elements: JXRCodeTableElementInterface[];
  private dom: HTMLTableElement;
  private popup_dom: HTMLElement | undefined;
  private last_clicked_symbol: string | undefined;
  private search_ui: JXRSearchUI;

  constructor(id: string, search_ui: JXRSearchUI, popup_id?: string) {
    this.table_elements = [];
    this.dom = document.createElement("table");
    this.dom.classList.add("code-table");
    document.getElementById(id)!.replaceWith(this.dom);
    this.search_ui = search_ui;

    this.dom.addEventListener("click", this.on_click_symbol.bind(this));
    if (popup_id) {
      this.popup_dom = document.getElementById(popup_id)!;
    }
  }

  private on_click_symbol(event: MouseEvent) {
    if (!this.popup_dom) {
      return;
    }

    const MIN_SYMBOL_LENGTH = 3;
    const symbol_regexp = /^[a-zA-Z0-9_]*$/;
    const selection = window.getSelection()!;
    const range = selection.getRangeAt(0);
    const node = selection.anchorNode!;

    this.popup_dom.classList.add("hide");

    while (symbol_regexp.test(range.toString()) && range.startOffset > 0) {
      range.setStart(node, range.startOffset - 1);
    }

    if (!symbol_regexp.test(range.toString())) {
      range.setStart(node, range.startOffset + 1);
    }

    while (
      symbol_regexp.test(range.toString()) &&
      range.endOffset < node.textContent!.length
    ) {
      range.setEnd(node, range.endOffset + 1);
    }

    if (!symbol_regexp.test(range.toString())) {
      range.setEnd(node, range.endOffset - 1);
    }

    const clicked_symbol = range.toString().trim();
    if (clicked_symbol.length >= MIN_SYMBOL_LENGTH) {
      this.last_clicked_symbol = clicked_symbol;
      this.search_ui.setQuery(this.last_clicked_symbol);
      this.popup_dom.innerHTML = `<a href=${`/?${this.search_ui
        .serialize(!!"include search")
        .join("&")}`}>Search ${clicked_symbol}</a>`;
      this.popup_dom.style.top = `${event.pageY}px`;
      this.popup_dom.style.left = `${event.pageX}px`;
      this.popup_dom.classList.remove("hide");
    }
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
  private line_number: string;
  private line: string;
  private extension: string;
  private link: string | undefined;

  constructor(
    line_number: string,
    line: string,
    extension: string,
    link?: string
  ) {
    this.line_number = line_number;
    this.line = line;
    this.extension = extension;
    this.link = link;
    this.dom = this.constructDom();
  }

  private wrapInLink(content: string): string {
    if (this.link) {
      return `
        <a href="${this.link}">
          ${content}
        </a>
      `;
    } else {
      return content;
    }
  }

  private constructDom(): HTMLTableRowElement {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="line-number" id="line-${this.line_number}">
        ${this.wrapInLink(this.line_number)}
      </td>
      <td>
        ${this.wrapInLink(
          `<pre><code class="language-${this.extension}">${escapeHtml(
            this.line
          )}</code></pre>`
        )}
      </td>
    `;
    return tr;
  }

  getDom(): HTMLTableRowElement {
    return this.dom;
  }
}

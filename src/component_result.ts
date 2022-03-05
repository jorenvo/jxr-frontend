export class JXRResult extends HTMLElement {
  lineNumber: string;
  line: string;
  link: string;

  constructor(lineNumber: string, line: string, link: string) {
    super();
    this.attachShadow({ mode: "open" });

    this.lineNumber = lineNumber;
    this.line = line;
    this.link = link;

    this.setStyle();

    const lineNumberA = document.createElement("a");
    lineNumberA.setAttribute("href", this.link);
    lineNumberA.innerText = this.lineNumber;

    const lineA = document.createElement("a");
    lineA.setAttribute("href", this.link);
    lineA.innerText = this.line;

    this.shadowRoot!.append(lineNumberA, lineA);
  }

  private setStyle() {
    const style = document.createElement("style");
    style.textContent = `
      * {
        font-family: monospace;
      }

      a {
        color: unset;
        text-decoration: unset;
      }

      a:hover {
        text-decoration: underline;
      }
    `;
    this.shadowRoot!.append(style);
  }
}

customElements.define("jxr-result", JXRResult);

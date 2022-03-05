export class JXRResult extends HTMLElement {
  lineNumber: string;
  line: string;

  constructor(lineNumber: string, line: string) {
    super();
    this.attachShadow({ mode: "open" });

    this.lineNumber = lineNumber;
    this.line = line;

    this.shadowRoot!.append(this.lineNumber, this.line);
  }
}

customElements.define("jxr-result", JXRResult);

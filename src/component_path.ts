import { Link } from "./utils.js";

export class JXRPath extends HTMLElement {
  components: JXRPathComponent[];

  constructor(links: Link[]) {
    super();
    this.attachShadow({ mode: "open" });

    this.setStyle();

    this.components = links.map((link) => new JXRPathComponent(link));
    this.components.forEach((component) => this.shadowRoot!.append(component));
  }

  private setStyle() {
    const style = document.createElement("style");
    style.textContent = ":host { display: block; }";
    this.shadowRoot!.append(style);
  }
}

export class JXRPathComponent extends HTMLElement {
  constructor(link: Link) {
    super();
    this.attachShadow({ mode: "open" });

    const a_element = document.createElement("a");
    a_element.innerText = link.name;
    a_element.href = link.hyperlink;
    this.shadowRoot!.append(a_element);
  }
}

customElements.define("jxr-path", JXRPath);
customElements.define("jxr-path-component", JXRPathComponent);

import { Link } from "./utils.js";

export class JXRPath extends HTMLElement {
  components: JXRPathComponent[];

  constructor(links: Link[]) {
    super();
    this.attachShadow({ mode: "open" });

    this.components = links.map((link) => {
      const component = document.createElement("a");
      component.setAttribute("is", "jxr-path-component");
      component.setAttribute("href", link.hyperlink);
      component.innerText = link.name;
      return component;
    });

    this.components.forEach((component, index) => {
      this.shadowRoot!.append(component);

      if (index < this.components.length - 1) {
        this.shadowRoot!.append("/");
      }
    });
  }
}

export class JXRPathComponent extends HTMLAnchorElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
}

customElements.define("jxr-path", JXRPath);
customElements.define("jxr-path-component", JXRPathComponent, { extends: "a" });

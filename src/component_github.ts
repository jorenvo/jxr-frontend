export class JXRGithubLinks {
  private dom: HTMLElement;
  private file_path: string;
  private git_head: string;

  constructor(id: string, file_path: string, git_head: string) {
    this.file_path = file_path;
    this.git_head = git_head;
    this.dom = this.constructDom(id);
  }

  private constructDom(id: string): HTMLElement {
    const div = document.getElementById(id)!;

    div.innerHTML = `
      <div><a href="https://github.com/x/x/blob/${this.git_head}/${this.file_path}">Log</a></div>
      <div><a href="/">Blame</a></div>
    `;

    return div;
  }
}

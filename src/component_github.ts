export class JXRGithubLinks {
  private dom: HTMLElement;
  private file_path: string;
  private git_head: string;
  private repo: string;

  constructor(id: string, file_path: string, git_head: string, repo: string) {
    this.file_path = file_path;
    this.git_head = git_head;
    this.repo = repo;
    this.dom = this.constructDom(id);
  }

  private file_link(view_type: string): string {
    return `https://github.com/${this.repo}/${view_type}/${this.git_head}/${this.file_path}`;
  }

  private constructDom(id: string): HTMLElement {
    const div = document.getElementById(id)!;

    div.innerHTML = `
      <div><a href="${this.file_link('blob')}">Log</a></div>
      <div><a href="${this.file_link('blame')}">Blame</a></div>
    `;

    return div;
  }
}

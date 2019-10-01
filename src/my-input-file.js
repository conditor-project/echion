
import { html, render } from 'lit-html';

class MyInputFile extends window.HTMLElement {
  constructor () {
    super();
    this.name = '';
    this.data = [];
    this.isValid = false;
  }

  connectedCallback () {
    render(this.template(), this, { eventContext: this });
    const input = this.querySelector('input');
    input.addEventListener('change', () => {
      this.name = input.files[0].name;
      const reader = new window.FileReader();
      reader.readAsText(input.files[0]);

      reader.addEventListener('load', () => {
        try {
          this.data = JSON.parse(reader.result);
          this.isValid = true;
        } catch (error) {
          this.isValid = false;
        }
      });
    });
  }

  template () {
    return html`
    <input type="file" accept="application/json">
    `;
  }
}

window.customElements.define('my-input-file', MyInputFile);

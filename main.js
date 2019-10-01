import { html, render } from 'lit-html';
import './src/my-input-file.js';
import './src/venn-diagram.js';

class MyApp extends window.HTMLElement {
  connectedCallback () {
    render(this.template(), this, { eventContext: this });
    const form = this.querySelector('form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
      if (form.checkValidity()) this.injectData();
      form.classList.add('was-validated');
    }, false);
  }

  template () {
    return html`
    <form novalidate>
      <div class="form-group">
        <label for="JSONFileOne">Choose source A</label>
        <my-input-file id="JSONFileOne"></my-input-file>
      </div>
      <div class="form-group">
        <label for="JSONFileTwo">Choose source B</label>
        <my-input-file id="JSONFileTwo"></my-input-file>
      </div>
      <div class="form-group">
        <label for="commonField">Common field</label>
        <input type="text" class="form-control" id="commonField" placeholder="Enter a field's name" required>
      </div>
      <button class="btn btn-primary">Submit</button>
    </form>
    <venn-diagram></venn-diagram>
    `;
  }

  injectData () {
    const inputFiles = [].slice.call(this.querySelectorAll('my-input-file'));
    const dataFiles = inputFiles.map(inputFile => {
      return ({ data: inputFile.data, name: inputFile.name });
    });
    const commonFieldValue = this.querySelector('#commonField').value;
    const vennDiagram = this.querySelector('#venn');
    vennDiagram.dispatchEvent(new window.CustomEvent('onUpdateChart', {
      detail: { dataFiles, commonFieldValue }
    }));
  }
}

window.customElements.define('my-app', MyApp);

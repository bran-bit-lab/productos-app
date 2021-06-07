// web components ( componente de busqueda )
class SearchBarComponent extends HTMLElement {

  constructor() {
    super();

    this.handleChangeInput = this.handleChangeInput.bind( this );
  }

  handleChangeInput( $event ) {

    let event = new CustomEvent('search', {
      detail: {
        from: this.from,
        value: $event.target.value
      },
      bubbles: true,
      cancel: true
    });

    this.dispatchEvent( event );
  }

  connectedCallback() {

    this.from = this.getAttribute('from') || '';

    this.appendChild( this.getHtml() );

    this.querySelector('input').addEventListener('input', this.handleChangeInput );
  }

  disconnectedCallback() {
    this.querySelector('input').removeEventListener('input', this.handleChangeInput );
  }

  getHtml() {

    let range = document.createRange();
    let nodeHTML = range.createContextualFragment(
      (`
        <div class="row justify-content-end">
          <div class="form-group w-25 p-0">
            <input type="text" placeholder="Buscar ..." class="form-control form-control-sm" />
          </div>
        </div>
      `)
    );

    return nodeHTML;
  }
}

customElements.define('search-bar-component', SearchBarComponent );

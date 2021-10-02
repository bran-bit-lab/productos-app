/** Componente de busqueda (Web compoent) */
class SearchBarComponent extends HTMLElement {

  constructor() {
    super();

    this.handleChangeInput = this.handleChangeInput.bind( this );
  }

  /**
   * Evento de cambio despacha el evento al padre
   */
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

  /** callback que se ejecuta cuando el componente se conecta en el DOM */
  connectedCallback() {

    this.from = this.getAttribute('from') || '';

    this.innerHTML = this.getHtml();

    this.querySelector('input').addEventListener('input', this.handleChangeInput );
  }

  /** callback que se ejecuta cuando se desconecta del DOM */
  disconnectedCallback() {
    this.querySelector('input').removeEventListener('input', this.handleChangeInput );
  }


  /**
   * Obtiene el html del componente
   * @returns {string}
   *
  */
  getHtml() {

   return (`
      <div class="d-flex w-100 justify-content-end">
        <div class="form-group w-25 p-0">
          <input type="text" placeholder="Buscar ..." class="form-control form-control-sm" />
        </div>
      </div>
    `);
  }
}

customElements.define('search-bar-component', SearchBarComponent );

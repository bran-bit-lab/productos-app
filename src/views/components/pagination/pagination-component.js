/** Componente de paginacion */
class PaginationComponentElement extends HTMLElement {

  constructor() {

      super();

      // props
      this.limit = this._limit;
      this.registers = this._registers;
      this.page = this._page;
      this.from = this.getAttribute('from');

      // methods
      this.render = this.render.bind( this );
  }

  /** atributos del componente registrados en el componente
   * @returns {Array<string>} registra las propiadades del componente
  */
  static get observedAttributes() {
    return ['limit', 'page', 'registers'];
  }

  // es obligatorio los set y get ya que invocan el attributeChangedCallback
  // cuando cambian de valor

  /** prop limite de paginacion */
  set _limit( val = '' ) {
    return this.setAttribute('limit', val );
  }

  /** prop pagina actual */
  set _page( val = '' ) {
    return this.setAttribute('page', val || '1' );
  }

  /** prop total registrados  */
  set _registers( val = '' ) {
    return this.setAttribute('registers', val );
  }

  get _limit() {
    return this.getAttribute('limit');
  }


  get _page() {
    return this.getAttribute('page');
  }


  get _registers() {
    return this.getAttribute('registers');
  }


  /**
   * funcion que avanza la paginacion
   * @param  {number} index indice de busqueda
   */
  prev( index = 1 ) {

    if ( index < 1 ) {
      index = 1;
      return;
    }

    // this._page = index;
    this.sendPagination( index );
  }

  /**
   * funcion que retrocede la paginacion
   * @param  {number} index indice de busqueda
   */
  next( index = this.limit ) {

    if ( index > +this.limit ) {
      index = this.limit;
      return;
    }

    // this._page = index;
    this.sendPagination( index );
  }


  /**
   * dispara el evento de paginacion
   * @param  {number} page pagina actual
   * @param  {number} pagination cantidad de registros a tomar
   */
  sendPagination( page, pagination = 10 ) {
    let indexPagination = ( +page - 1 ) * pagination;

    // console.log(page, pagination, this);

    let event = new CustomEvent('pagination', {
      detail: {
        from: this.from,
        value: [ indexPagination, pagination ],
        page // pagina actual
      },
      bubbles: true,
      cancel: true
    });

    // console.log( event );

    this.dispatchEvent( event );
  }


  /**
   * funcion que se dispara cuando hay cambio en las props registradas
   *
   * @param  {string} name  nombre de la propiedad
   * @param  {string} oldValue valor anterior
   * @param  {string} newValue nuevo valor
   */
  attributeChangedCallback( name, oldValue, newValue ) {

    // console.log({ name, oldValue, newValue });

    if ( oldValue !== newValue ) {
      this[name] = newValue;
      this.render();
    }
  }

  /** renderiza el elemento de paginacion con los nuevos valores */
  render() {

    this.innerHTML = (`
      <div class="row mt-3">
        <div class="col-sm-6 col-12 text-start">
          Total de registros: <span>${ this.registers }</span>
        </div>
        <div class="col-sm-6 col-12 text-end">
          Página actual: <span>${ +this.page }</span> de <span>${ +this.limit }</span>
        </div>
      </div>

      <nav aria-label="Table navigation" class="mt-2">
          <ul class="pagination justify-content-center">
            <li class="page-item" id="prev">
                <a class="page-link" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item active">
              <a class="page-link">${ +this.page }</a>
            </li>
            <li class="page-item" id="next">
              <a class="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
      </nav>
    `);

    // listeners
    this.querySelector('#prev').addEventListener('click', ( $event ) => this.prev( +this.page - 1 ));
    this.querySelector('#next').addEventListener('click', ( $event ) => this.next( +this.page + 1 ));
  }
}

customElements.define( 'pagination-component', PaginationComponentElement );

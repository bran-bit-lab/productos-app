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

  // atributos que se estaran observando
  static get observedAttributes() {
    return ['limit', 'page', 'registers'];
  }

  // es obligatorio los set y get ya que invocan el attributeChangedCallback
  // cuando cambian de valor

  set _limit( val = '' ) {
    return this.setAttribute('limit', val );
  }

  set _page( val = '' ) {
    return this.setAttribute('page', val || '1' );
  }

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

  prev( index = 1 ) {

    if ( index < 1 ) {
      index = 1;
      return;
    }

    // this._page = index;
    this.sendPagination( index );
  }

  next( index = this.limit ) {

    if ( index > +this.limit ) {
      index = this.limit;
      return;
    }

    // this._page = index;
    this.sendPagination( index );
  }


  sendPagination( page, pagination = 10 ) {
    let indexPagination = ( +page - 1 ) * pagination;

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

  attributeChangedCallback( name, oldValue, newValue ) {

    // console.log({ name, oldValue, newValue });

    if ( oldValue !== newValue ) {
      this[name] = newValue;
      this.render();
    }
  }


  render() {

    this.innerHTML = (`
      <div class="row pt-2">
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

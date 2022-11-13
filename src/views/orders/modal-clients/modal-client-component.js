/** clase de modal de clientes */
class ModalClientComponent {

  constructor() {
    this.modalClients = ordersForm.footer.querySelector('#modal-clients');
    this.tbody = this.modalClients.querySelector('#tbody-clients');
    this.pagination = this.modalClients.querySelector('#pagination-clients');
    this.submitButton = this.modalClients.querySelector('#submit-button');
    this.searchBar = this.modalClients.querySelector('search-bar-component');

    /** @type {Array<Client>} */
    this.clients = [];

    /**
     * Array de clientes seleccionados
     * @type {Array<Client>}
    */
    this.clientSelected = [];

    /** @type {number} */
    this.page = 1;

    this.modalClientsInstance = new Modal( this.modalClients, { backdrop: 'static' });
    this.setEvents();
  }

  /** establece los escuchadores de eventos */
  setEvents() {

    // abrir modal
    this.modalClients.addEventListener('shown.bs.modal', () => {
      this.submitButton.setAttribute('disabled', '');
    });

    // cerrar modal
    this.modalClients.addEventListener('hide.bs.modal', () => {
      this.clientSelected = [];
    })

    this.pagination.addEventListener('pagination', ( $event ) => {
      this.page = $event.detail.page;
      this.openModalClients( $event.detail.value );
    });

    this.searchBar.addEventListener('search', ( $event ) => {
      this.searchClient( $event.detail.value );
    });
  }


  /**
   * despluiega el modal de clientes
   * @param  {Array<Client>} pagination listado de clientes
   */
  async openModalClients( pagination = [0, 10] ) {

    try {

      this.clients = await ClientesController.listarClientes( pagination );

      // console.log( this.clients );

      let totalClients = await ClientesController.obtenerTotalClientes();

      setPaginationStorage('clientsModalTable', { pagination });

      this.renderClients( totalClients.totalPaginas, totalClients.totalRegistros );


      if ( !this.modalClientsInstance._isShown ) {
        this.modalClientsInstance.show();
      }


    } catch ( error ) {
      console.error( error );

    }
  }

  /**
   * renderiza la tabla de clientes
   *
   * @param  {?number} totalPages total de paginas
   * @param  {?number} totalRegisters total de registros
   * @param  {boolean} search flag de actualizacion del paginador
   */
  renderClients( totalPages = 0, totalRegisters = 0, search = false ) {

    if ( !search ) {

      this.tbody.innerHTML = '';
      this.pagination._limit = totalPages;
      this.pagination._registers = totalRegisters;
      this.pagination._page = this.page;
    }

    if ( this.clients.length > 0 ) {
      showElement( this.pagination );

      this.tbody.innerHTML = this.clients.map(( client ) => (`
       <tr class="text-center point" onclick="client_${ client.id_cliente }.click();">
         <td name="id_cliente">${ client.id_cliente }</td>
         <td name="nombre_cliente">${ client.nombre_cliente }</td>
         <td name="rif">${ client.rif }</td>
         <td>
          <input
            type="radio"
            class="form-check-input point"
            id="client_${ client.id_cliente }"
            name="client"
            ${ this.checkClient( client ) ? 'checked' : '' }
          />
         </td>
       </tr>
      `)).join('');

      for ( const input of this.tbody.querySelectorAll('input[type="radio"]') ) {
        
        input.addEventListener( 'change', this.handleChange.bind( this ) );

        // se crea este listener para dar solucion a la propagacion del evento onclick
        // del input al tr.
        input.addEventListener('click', $event => $event.stopPropagation());
      }

   } else {
      hideElement( this.pagination );

      this.tbody.innerHTML = (`
        <tr class="text-center">
         <td colspan="6" class="text-danger">No existen clientes disponibles</td>
       </tr>
     `);

    }
  }

  /**
   * funcion que controla la seleccion del cliente
   * @param {*} $event evento check
  */
  handleChange( $event ) {

    // obtenemos el padre tr en 2 niveles
    const rowElement = $event.target.parentNode.parentNode;
    const id_client = +rowElement.querySelector('td[name="id_cliente"]').innerText;

    this.clientSelected = [];
    this.clientSelected.push( this.clients.find(( client ) => client.id_cliente === id_client ) );

    // activa el boton si el usuario selecciona un cliente

    if ( this.clientSelected.length > 0 ) {
      this.submitButton.removeAttribute('disabled');
    }
  }

  /**
   * busca el cliente en la BD
   * @param  {string} search cadena de busqueda
   */
  async searchClient( search ) {

    const rexp = /^[\w-\d\s]+$/;

    if ( search.length === 0 ) {

      let { pagination } = JSON.parse( sessionStorage.getItem('clientsModalTable') );

      return this.openModalClients( pagination );
    }

    if ( !rexp.test( search ) ) {
      console.log('no concuerda con expresion regular');
      return;

    }

    // search es la busqueda
    this.clients = await ClientesController.buscarCliente({ search: '%' + search + '%' });

    this.renderClients( null, null, true );
  }

  /** cierra el modal de seleccion */
  closeModalClients() {

    ordersForm.clientsSelected = this.clientSelected;

    this.modalClientsInstance.hide();

    ordersForm.setClientsTable();
  }

  /**
   * chequea la seleccion del cliente
   *
   * @param  {Client} client instancia del cliente
   * @return {boolean}  retorna un booleano indicando si el cliente fue seleccionado anteriormente   
   */
  checkClient( client ) {
    return this.clientSelected.findIndex(
        clientSelec => clientSelec.id_cliente === client.id_cliente
      ) !== -1;
  }
}

module.exports = {
  ModalClientComponent
}

/** Clase tabla de clientes */
class ClientsTableComponent {
  constructor() {

    /** @type {Array<Client>} */
    this.clients = [];

    /** @type {number} */
    this.page = 1;

    this.pagination = document.querySelector('#pagination-clients');
    this.searchBar = document.querySelector('search-bar-component[from="clients"]');
    this.tbody = document.querySelector('#tbody-client');
    this.getAll = this.getAll.bind( this );

    this.setEvents();
  }

  /**
   * Obtiene la lista de clientes paginadas
   *
   * @param  {?*} $event  evento de carga de sito
   * @param  {Array<number>} pagination paginacion de los usuarios
   */
  async getAll( $event = null, pagination = [0, 10] ) {

    try {

      this.clients = await ClientesController.listarClientes( pagination );

      const totalClients = await ClientesController.obtenerTotalClientes();

      sessionStorage.setItem('clientsTable', JSON.stringify({ pagination }));

      // console.log({ clients: this.clients, totalClients, pagination });

      this.renderClients( totalClients.totalPaginas, totalClients.totalRegistros );

    } catch ( error ) {
      console.error( error );

    }
  }

  /** Establece los eventos de la tabla */
  setEvents() {

    this.pagination.addEventListener( 'pagination', ( $event ) => {
      this.page = $event.detail.page;
      this.getAll( null,  $event.detail.value );
    });

    this.searchBar.addEventListener('search', ( $event ) => this.searchClient( $event.detail.value ));
  }


  /**
   * Añade un nuevo cliente
   * @param  {Client} client instancia del cliente
   */
  addClient( client ) {
    ClientesController.crearCliente( client );

    this.getAll( null, getPaginationStorage('clientsTable'));
  }

  /**
   * Edita un cliente
   * @param  {Client} client instancia del cliente
   */
  editClient( client ) {
    ClientesController.editarCliente( client );

    this.getAll( null, getPaginationStorage('clientsTable'));
  }

  /**
	 * Realiza una búsqueda de clientes
	 * @param  {string} search cadena de busqueda
	 */
  async searchClient( search ) {

    const rexp = /^[\w-\d\s]+$/;

		if ( search.length === 0 ) {

			let { pagination } = JSON.parse( sessionStorage.getItem('clientsTable') );

			return this.getAll( null, pagination );
		}

		if ( !rexp.test( search ) ) {
			console.log('no concuerda con expresion regular');
			return;

    }

		// search es la busqueda
		this.clients = await ClientesController.buscarCliente({ search: '%' + search + '%' });

		this.renderClients( null, null, true );
  }

  /**
	 * Obtiene una fila en formato html
	 *
	 * @param  {Client} client instancia del cliente
	 * @return {string}  retorna una fila de la tabla en string html
   * @example
   * const tbody = document.querySelector('tbody'); 
   * tbody.innerHTML = this.clients.map( this.setRows ).join('');
	 */
  setRows( client ) {
    return (`
      <tr class="text-center">
        <td>${ client.id_cliente }</td>
        <td>${ client.nombre_cliente }</td>
        <td>${ client.rif }</td>
        <td>${ sliceString( client.direccion_entrega, 0, 30 ) }</td>
        <td>${ client.telefono_contacto }</td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            onclick="ModalClientComponent.openModal('edit', ${ client.id_cliente })"
          >
            <i class="fas fa-edit"></i>
          </button>
          <!-- <button
            type="button"
            class="btn btn-danger btn-sm"
          >
            <i class="fas fa-trash"></i>
          </button> -->
        </td>
      </tr>
    `);
  }

  /**
	 * Rendiza la tabla de clientes
	 *
	 * @param  {?number} totalPages paginas totales
	 * @param  {?number} totalRegisters numeros de registros
	 * @param  {boolean} search flag de busqueda le indica si actualiza la paginacion
	 */
  renderClients( totalPages = null , totalRegisters = null, search = false ) {

    if ( !search ) {

      this.tbody.innerHTML = '';
      this.pagination._limit = totalPages;
      this.pagination._registers = totalRegisters;
      this.pagination._page = this.page;
    }

    if ( this.clients.length > 0 ) {
      showElement( this.pagination );

      this.tbody.innerHTML = this.clients.map( this.setRows ).join('');

    } else {
      hideElement( this.pagination );

      this.tbody.innerHTML = (`
        <tr class="text-center">
          <td colspan="6" class="text-danger">No existen clientes disponibles</td>
        </tr>
      `);
    }

  }
}

module.exports = ClientsTableComponent;

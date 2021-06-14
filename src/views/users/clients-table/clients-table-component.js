class ClientsTableComponent {
  constructor() {
    this.clients = [];
    this.page = 1;
    this.pagination = document.querySelector('#pagination-clients');
    this.tbody = document.querySelector('#tbody-client');
    this.getAll = this.getAll.bind( this );

    this.setEvents();
  }

  async getAll( $event = null, pagination = [0, 10], page = this.page ) {
    try {
      this.clients = await ClientesController.listarClientes( pagination );

      const totalClients = await ClientesController.obtenerTotalClientes();

      sessionStorage.setItem('clientsTable', JSON.stringify({ pagination }));

      // set the page ...
      this.page = page;

      // console.log({ clients: this.clients, totalClients, pagination });

      this.renderClients( totalClients.totalPaginas, totalClients.totalRegistros );

    } catch ( error ) {
      console.error( error );

    }
  }

  setEvents() {
    this.pagination.addEventListener(
      'pagination',
      ( $event ) => this.getAll( null,  $event.detail.value, $event.detail.page )
    );
  }

  setRows( client ) {
    return (`
      <tr class="text-center">
        <td>${ client.id_cliente }</td>
        <td>${ client.nombre_cliente }</td>
        <td>${ client.direccion_entrega }</td>
        <td>${ client.rif }</td>
        <td>${ client.telefono_contacto }</td>
        <td>
          <button
            type="button"
            class="btn btn-primary btn-sm"
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

class OrdersForm {
  constructor() {
    this.delivery = null;
    this.productsSelected = new Array( 5 ).fill({
      id: 1,
      name: 'test',
      description: 'test de producto',
      priceUnit: 250,
      quantity: 5
    });

    this.setProductsTable();
  }

  selectProducts() {

  }

  selectClients() {
  }

  setProductsTable() {

    const tableProducts = document.querySelector('#table-products-selected');
    const tableFooter = document.querySelector('tfoot');

    // calculate total
    let total = this.productsSelected.reduce(( accum, product, index ) => {
      return accum += ( product.priceUnit * product.quantity )
    }, 0 ) || 0;

    if ( this.productsSelected.length > 0 ) {

      tableProducts.innerHTML = this.productsSelected.map(( product, index ) => (`
        <tr class="text-center">
          <td>${ index + 1 }</td>
          <td>${ product.name }</td>
          <td>${ product.priceUnit }</td>
          <td class="d-flex justify-content-center">
              <input
                type="number"
                value=${ product.quantity.toString() }
                class="form-control text-center"
                min="1"
                max="9999"
              />
          </td>
          <td>
            <i class="fas fa-trash"></i>
          </td>
        </tr>
      `)).join('');

    } else {
      tableProducts.innerHTML = (`
        <tr class="text-center">
          <td colspan="5" class="text-danger">
            No existen productos seleccionados
          </td>
        </tr>
      `);
    }

    // table footer
    tableFooter.innerHTML = (`
      <tr class="text-end">
        <td colspan="4"></td>
        <td colspan="1">Total: ${ total }$</td>
      </tr>
    `);
  }

  getParamsUrl() {

    /*
      las expresiones regulares tienen una caracteristica que permite almacenar
      los valores hallados en objetos, agrupandolos para una mejor lectura, usando
      los grupos para ello.

      const regex = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
      let date = '2021-06-09';

      console.log( query );
      console.log( date.match( regex ) );

      documentacion
      const regex = /^\?new=(?<new>true|false)&idDelivery=(?<idDelivery>[0-9]+)$/;
    */

    const query = location.search;
    const regex = /(?<idDelivery>[0-9]+)/;

    let match = query.match( regex );

    if ( match ) { // edit
      console.log('editar entrega', match['groups'].idDelivery );

      this.delivery = match['groups'].idDelivery;

      document.querySelector('#title').innerText = 'Editar entrega ' + this.delivery;

    } else { // new
      console.log('nueva entrega');

      document.querySelector('#title').innerText = 'Nueva entrega';
    }
  }
}

const ordersForm = new OrdersForm();

document.addEventListener('DOMContentLoaded', ordersForm.getParamsUrl );

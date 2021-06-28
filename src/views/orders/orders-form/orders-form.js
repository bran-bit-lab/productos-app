const { remote } = require('electron');
const { dateToString } = remote.require('./util_functions/time');
const { readFileAssets } = remote.require('./util_functions/file');
const { ClientesController } = remote.require('./controllers/clientes_controller');

const Modal = require('bootstrap/js/dist/modal');
const { ModalClientComponent } = require('../modal-clients/modal-client-component');

class OrdersForm {

  constructor() {

    this.footer = document.querySelector('footer');

    this.deliveryId = null;
    this.productsSelected = new Array( 5 ).fill({
      id: 1,
      name: 'test',
      description: 'test de producto',
      priceUnit: 250,
      quantity: 5
    });

    this.clientsSelected = new Array(1).fill({
      id: 1,
      name: 'Comercializadora Valparaiso',
      type: 'Juridico',
      direction: 'Av. Principal de Manicomio',
      phone: '04129101803'
    });

    this.setHtml(() => {
      this.setForm();
      this.setProductsTable();
      this.setClientsTable();
    });
  }

  setForm( delivery = null ) {

    // set form
    let today = dateToString();

    // date
    const inputDate = form.querySelector('input[name="delivery-date"]');
    inputDate.value = delivery ? delivery.today : today
  }

  getParamsUrl() {

    const query = location.search;
    const regex = /(?<idDelivery>[0-9]+)/;

    let match = query.match( regex );

    if ( match ) { // edit
      console.log('editar entrega', match['groups'].idDelivery );

      this.deliveryId = match['groups'].idDelivery;

      document.querySelector('#title').innerText = 'Editar entrega ' + this.deliveryId;

    } else { // new
      console.log('nueva entrega');

      document.querySelector('#title').innerText = 'Nueva entrega';
    }

    /*
      documentacion

      las expresiones regulares tienen una caracteristica que permite almacenar
      los valores hallados en objetos, agrupandolos para una mejor lectura, usando
      los grupos para ello.

      const regex = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
      let date = '2021-06-09';

      console.log( query );
      console.log( date.match( regex ) );
      const regex = /^\?new=(?<new>true|false)&idDelivery=(?<idDelivery>[0-9]+)$/;
    */
  }

  selectProducts() {
    console.log('seleccionar productos...');
  }

  selectClients() {
     modalClientComponent.openModalClients();
  }

  setClientsTable()  {
    const tableClients = document.querySelector('#table-clients-selected');

    if ( this.clientsSelected.length > 0 ) {
      tableClients.innerHTML = this.clientsSelected.map(( client ) => (`
        <tr class="text-center">
          <td>${ client.id }</td>
          <td>${ client.name }</td>
          <td>${ client.type }</td>
          <td>${ client.direction }</td>
          <td>${ client.phone }</td>
          <td>
            <i class="fas fa-trash" onclick="ordersForm.deleteProduct( ${ client.id } )"></i>
          </td>
        </tr>
      `)).join('');

    } else {
      tableClients.innerHTML = (`
        <tr class="text-center">
          <td colspan="6" class="text-danger">
            No existen cliente seleccionado
          </td>
        </tr>
      `);
    }
  }

  setProductsTable() {

    const tableProducts = document.querySelector('#table-products-selected');
    const tableFooter = document.querySelector('tfoot');

    // calculate total
    let total = this.productsSelected.reduce(( accum, product, index ) => {
      return accum += ( product.priceUnit * product.quantity )
    }, 0 );

    if ( this.productsSelected.length > 0 ) {
      tableProducts.innerHTML = this.productsSelected.map(( product, index ) => (`
        <tr class="text-center">
          <td>${ index + 1 }</td>
          <td>${ product.name }</td>
          <td>${ product.priceUnit }</td>
          <td class="d-flex justify-content-center">
              <input
                type="number"
                value=${ product.quantity }
                class="form-control text-center"
                min="1"
                max="9999"
                onchange="ordersForm.handleChangeQuantity(
                  +event.target.value, ${ index + 1 }
                )"
              />
          </td>
          <td>
            <i class="fas fa-trash" onclick="ordersForm.deleteProduct( ${ index + 1 } )"></i>
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

  handleSubmit( event ) {

    let formData = new FormData( form );

    let data = {
      name: formData.get('delivery-name'),
      state: formData.get('delivery-state'),
      description: formData.get('delivery-description'),
      // client_id: +formData.get('delivery-client'),
      date_delivery: formData.get('delivery-date'),
      products: this.productsSelected
    };

    console.log( data );

    event.preventDefault();
  }

  handleChangeQuantity( value, idDelivery ) {

    // console.log({ value, idDelivery });

    if ( value < 1 ) {
      value = 1;

    } else if ( value > 9999 ) {
      value = 9999

    }

    // actualiza los cambios locales
    this.productsSelected = this.productsSelected.map(( product, index ) => {

      if ( ( index + 1 ) === idDelivery ) {
        return {
          ...product,
          quantity: value
        };
      }

      return product
    });

    console.log( this.productsSelected );

    // renderiza la tabla local
    this.setProductsTable();
  }

  deleteProduct( idProduct ) {

    if ( this.deliveryId ) { // edit
      console.log('edit');

    } else { // new

      console.log('new');

      this.productsSelected = this.productsSelected.filter(( product, index ) => ( index + 1 ) !== idProduct );

      console.log( idProduct, this.productsSelected );

      this.setProductsTable();
    }
  }

  setHtml( callback ) {
    try {
      this.footer.innerHTML += readFileAssets('/orders/modal-clients/modal-client-component.html');
      callback();

    } catch ( error ) {
      console.error( error );

    }
  }
}

const form = document.forms[0];
const ordersForm = new OrdersForm();
const modalClientComponent = new ModalClientComponent();

let clientsSelected = [];
let productsSelected = [];

document.addEventListener('DOMContentLoaded', ordersForm.getParamsUrl );

form.addEventListener('submit', ordersForm.handleSubmit.bind( ordersForm ) );

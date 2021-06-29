const { remote } = require('electron');
const { dateToString } = remote.require('./util_functions/time');
const { readFileAssets } = remote.require('./util_functions/file');
const { ClientesController } = remote.require('./controllers/clientes_controller');
const { ProductosController } = remote.require('./controllers/productos_controllers');

const Modal = require('bootstrap/js/dist/modal');
const { ModalClientComponent } = require('../modal-clients/modal-client-component');
const { ModalProductsComponent } = require('../modal-products/modal-products-component');

class OrdersForm {

  constructor() {

    this.footer = document.querySelector('footer');

    this.deliveryId = null;
    this.productsSelected = [];
    this.clientsSelected = [];
    this.totalOrder = 0;

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

    const query = location.search;
    const regex = /(?<idDelivery>[0-9]+)/;

    let match = query.match( regex );

    if ( match ) { // edit
      // console.log('editar entrega', match['groups'].idDelivery );

      this.deliveryId = match['groups'].idDelivery;

      document.querySelector('#title').innerText = 'Editar entrega ' + this.deliveryId;

    } else { // new
      // console.log('nueva entrega');

      document.querySelector('#title').innerText = 'Nueva entrega';
    }
  }

  selectProducts() {
    modalProductsComponent.openModalProducts( getPaginationStorage('productsModalTable') );
  }

  selectClients() {
    modalClientComponent.openModalClients( getPaginationStorage('clientsModalTable') );
  }

  setClientsTable()  {
    const tableClients = document.querySelector('#table-clients-selected');

    if ( this.clientsSelected.length > 0 ) {
      tableClients.innerHTML = this.clientsSelected.map(( client ) => (`
        <tr class="text-center">
          <td>${ client.id_cliente }</td>
          <td>${ client.nombre_cliente }</td>
          <td>${ client.rif }</td>
          <td>${ client.direccion_entrega }</td>
          <td>${ client.telefono_contacto }</td>
          <td>
            <i class="fas fa-trash point" onclick="ordersForm.deleteClient( ${ client.id_cliente } )"></i>
          </td>
        </tr>
      `)).join('');

    } else {
      tableClients.innerHTML = (`
        <tr class="text-center">
          <td colspan="6" class="text-danger">
            No hay cliente seleccionado
          </td>
        </tr>
      `);
    }
  }

  calculateTotal() {
    
    this.totalOrder = this.productsSelected.reduce(( accum, product, index ) => {
      return accum += ( product.precio * product.cantidad_seleccionada )
    }, 0 )

    this.totalOrder.toFixed(2);
  }

  setProductsTable() {

    const tableProducts = document.querySelector('#table-products-selected');
    const tableFooter = document.querySelector('tfoot');

    this.calculateTotal();

    if ( this.productsSelected.length > 0 ) {
      tableProducts.innerHTML = this.productsSelected.map(( product ) => (`
        <tr class="text-center">
          <td>${ product.productoid }</td>
          <td>${ product.nombre }</td>
          <td>${ product.precio }</td>
          <td class="d-flex justify-content-center">
              <input
                type="number"
                value="${ product.cantidad_seleccionada }"
                max="${ product.cantidad }"
                class="form-control text-center"
                min="1"
                onchange="ordersForm.handleChangeQuantity(
                  +event.target.value, ${ product.productoid }
                )"
              />
          </td>
          <td>
            <i class="fas fa-trash" onclick="ordersForm.deleteProduct( ${ product.productoid } )"></i>
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
        <td colspan="1" id="totalOrder">Total: ${ this.totalOrder }$</td>
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
    this.productsSelected = this.productsSelected.map(( product ) => {

      if ( product.productoid === idDelivery ) {
        return {
          ...product,
          cantidad_seleccionada: value
        };
      }

      return product;
    });
   
    this.setProductsTable();
  }

  deleteProduct( idProduct ) {

    if ( this.deliveryId ) {
      console.log('edit');

    } else {

      console.log('new');

      this.productsSelected = this.productsSelected.filter(( product ) => product.productoid !== idProduct );

      console.log( idProduct, this.productsSelected );

      this.setProductsTable();
    }
  }

  deleteClient( idClient ) {

    console.log( idClient );

    if ( this.deliveryId ) {
      console.log('edit');

    } else {

      this.clientsSelected = this.clientsSelected.filter(( client ) => client.id_cliente !== idClient );

      this.setClientsTable();
    }
  }

  setHtml( callback ) {
    
    try {

      this.footer.innerHTML += readFileAssets('/orders/modal-clients/modal-client-component.html');
      this.footer.innerHTML += readFileAssets('/orders/modal-products/modal-products-component.html');
      
      callback();

    } catch ( error ) {
      console.error( error );

    }
  }
}

const form = document.forms[0];
const ordersForm = new OrdersForm();
const modalClientComponent = new ModalClientComponent();
const modalProductsComponent = new ModalProductsComponent();


document.addEventListener('DOMContentLoaded', ordersForm.getParamsUrl );

form.addEventListener('submit', ordersForm.handleSubmit.bind( ordersForm ) );

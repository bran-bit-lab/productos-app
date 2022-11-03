const { remote } = require('electron');
const { dateToString } = remote.require('./util_functions/time');
const { ClientesController, ProductosController, NotasController, NotasProductosController } = remote.require('./controllers');
const Modal = require('bootstrap/js/dist/modal');

/** clase formulario notas de entrega */
class OrdersForm {

  constructor() {

    this.footer = document.querySelector('footer');
    this.noteForm = document.forms['note-form'];

    this.loadingComponent = document.querySelector('app-loading');  

    /** @type {?number} */
    this.deliveryId = null;

    /**
     * listado de productos seleccionados por el usuario
     * @type {Array<Product>} */
    this.productsSelected = [];

    /**
     * listado del cliente seleccionado por el usuario
     * @type {Array<Client>} */
    this.clientsSelected = [];

    /** @type {number} */
    this.totalOrder = 0;

    /**
     * Instancia de la nota
     * @type {?Nota}
     * */
    this.note = null;

    // errors
    this.errorDescription = document.querySelector('#error-delivery-description');
    this.errorDeliveryDate = document.querySelector('#error-delivery-date');
    this.loadButton = document.querySelector('#load-button');
    this.submitButton = document.querySelector('#submit-button');
    

    this.setHtml(() => {

      ModalConfirmComponent = require('../../shared/modal-confirm/modal-confirm-component');
      ModalClientComponent = require('../modal-clients/modal-client-component').ModalClientComponent;
      ModalProductsComponent = require('../modal-products/modal-products-component').ModalProductsComponent;

      modalClientComponent = new ModalClientComponent();
      modalProductsComponent = new ModalProductsComponent();

      this.setForm();
      this.setProductsTable();
      this.setClientsTable();
    });
  }

 
  /**
   * establece el html del sitio y sus eventos
   * @param  {callback} callback devolucion de llamada cuando el html se cargue al sitio
   */
  setHtml( callback ) {

    Promise.all([
      fetch('orders/modal-clients/modal-client-component.html').then( resp => resp.text() ),
      fetch('orders/modal-products/modal-products-component.html').then( resp => resp.text() ),
      fetch('shared/modal-confirm/modal-confirm-component.html').then( resp => resp.text() )
    ]).then( htmlArray => {
      
      this.footer.innerHTML = htmlArray.join('');
      
      callback();

    })
    .catch( error => console.error( error ) )
    .finally( () => { setTimeout(() => this.loadingComponent._show = 'false', 1000 ) });
  }


  /**
   * establece el formulario de la nota
   * @param  {Nota} delivery instancia de la nota
   */
  setForm( delivery = null ) {

    // set form
    let today = dateToString();

    // date
    const inputDate = form.querySelector('input[name="delivery-date"]');
    inputDate.value = delivery ? delivery.today : today
  }

  /** Obtiene el id de la nota pasada por la url */
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

      // this.loadingComponent._show = 'true';

      this.deliveryId = match['groups'].idDelivery;

      document.querySelector('#title').innerText = 'Editar entrega ' + this.deliveryId;
      document.querySelector('.select-state').style.display = '';

      // se consulta a la base de datos
      this.getDeliveryNote( this.deliveryId );

    } else { // new

      document.querySelector('#title').innerText = 'Nueva entrega';
    }
  }


  /**
   * obtiene la informacion de la nota seleccionada
   * @param  {number} idNote identificador de la nota
   */
  async getDeliveryNote( idNote ) {

   this.note = await NotasController.obtenerNota( idNote );

   if ( this.note.fecha_entrega ) {
     document.querySelector('.date-state').style.display = '';
   }

   // console.log( this.note );

    // se añaden al formulario
    const inputs = this.noteForm.querySelectorAll('input');
    const select = this.noteForm.querySelector('select');

    inputs[0].value = this.note.descripcion_nota;
    inputs[1].value = this.note.fecha_entrega;

    select.value = this.note.status;

    this.productsSelected = this.note.productos;
    this.clientsSelected = this.clientsSelected.concat([{
      direccion_entrega: this.note.direccion_entrega,
      id_cliente: this.note.id_cliente,
      nombre_cliente: this.note.nombre_cliente,
      rif: this.note.rif,
      telefono_contacto: this.note.telefono_contacto
    }]);

    this.setClientsTable();
    this.setProductsTable();
  }

  /** Funcion que activa la seleccion de productos */
  selectProducts() {

    // se asignan el valor al hijo
    if ( this.deliveryId ) {
      modalProductsComponent.productsSelected = this.productsSelected;
    }

    modalProductsComponent.openModalProducts( getPaginationStorage('productsModalTable') );
  }

  /** Funcion que activa la seleccion del cliente */
  selectClients() {

    if ( this.deliveryId ) {
      modalClientComponent.clientSelected = this.clientsSelected;
    }

    modalClientComponent.openModalClients( getPaginationStorage('clientsModalTable') );
  }

  /** establece las filas en formato html del card de clientes */
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

  /** establece las filas en formato html del card de productos */
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
                class="form-control text-center"
                min="1"
                max="${ product.cantidad }"
                onchange="ordersForm.handleChangeQuantity(
                  this, ${ product.productoid }, ${ product.cantidad }
                )"
              />
          </td>
          <td>
            <i
              class="fas fa-trash point"
              onclick="ordersForm.deleteProduct( ${ product.productoid } )"
            ></i>
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
  }

  /**
   * evento que captura el envio del formulario
   * @param  {*} event description
   */
  handleSubmit( event ) {

    event.preventDefault();

    if ( this.productsSelected.length > 0 && this.clientsSelected.length > 0 ) {

      let formData = new FormData( form );

      let data = {
        status: formData.get('delivery-state') || 'EN_PROCESO',
        descripcion_nota: formData.get('delivery-description').trim() || '',
        id_cliente: this.clientsSelected[0].id_cliente,
        fecha_entrega: formData.get('delivery-state').trim() !== 'ENTREGADA' ?
          null : dateToString(),
        userid: getUserLogged().userid,
        productos: this.productsSelected,
        total_order: Number.parseFloat( this.totalOrder.toFixed(2) ) || 0
      };

      this.validateForm( data, ( error ) => {

        if ( error ) {
          return;
        }

        this.sendData( data );
      });

    } else if ( this.productsSelected.length === 0 && this.clientsSelected.length > 0 ) {
      NotasController.mostrarAlerta( 'warning', 'Advertencia', 'Debes ingresar productos a la nota de entrega' );

    } else if ( this.productsSelected.length > 0 && this.clientsSelected.length === 0 ) {
      NotasController.mostrarAlerta( 'warning', 'Advertencia', 'Debes ingresar un cliente en la nota de entrega' );

    } else {
      NotasController.mostrarAlerta( 'warning', 'Advertencia', 'Debes ingresar productos y un cliente en la nota de entrega' );
    }
  }


  /**
   * envia la informacion al controlador
   * @param  {Nota} data instancia de la nota
   */
  sendData( data ) {

    hideElement( this.submitButton );
    showElement( this.loadButton );
    
    try {

      // genera un loading de 3 segundos mientra registra la nota + productos
      setTimeout(() => {
        
        if ( this.deliveryId ) {
          
          NotasController.actualizarNota({ ...data, id_nota:  Number.parseInt( this.deliveryId ) });
  
          redirectTo('orders/orders.html');

          return;
        }

        
        NotasController.crearNota( data );

        redirectTo('orders/orders.html');

      }, 3000 );

    } catch ( error ) {

      hideElement( this.loadButton );
      showElement( this.submitButton );

      console.log( error );
    }
  }


  /**
   * valida el formulario
   * @param  {Nota} data   instancia de la nota
   * @param  {callbackValidateForm} callback llamada de respuesta
   */
  validateForm( data, callback ) {

    this.resetForm();

    const ERROR_MESSAGES = Object.freeze({
      required: 'campo requerido',
      email: 'correo inválido',
      min: ( min ) => 'minimo ' + min + ' caracteres',
      max: ( max ) => 'máximo ' + max + ' caracteres',
      pattern: 'Patrón de datos inválido',
      notMatch: 'La contraseña no coincide',
      rif: 'El rif no es valido',
      phone: 'El numero de telefono no es valido'
    });

    // console.log( data );

    const PATTERNS = Object.freeze({
      email: new RegExp( /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/ ),
      onlyLetters: new RegExp( /^[a-zA-Z\s]+$/ ),
      area: new RegExp( /^Ventas|Almacen|Administracion$/ ),
      rif: new RegExp( /^(J|j)-[0-9]{1,8}-[0-9]{1}|(V|v)-[0-9]{1,8}-[0-9]{1}|(G|g)-[0-9]{1,8}-[0-9]{1}$/ ),
      phone: new RegExp( /^[0-9]{4}-[0-9]{7}$/ )
    });

    const { descripcion_nota, fecha_entrega } = data;

    let errors = 0;

    // ==================================
    //  descripcion_nota
    // ==================================
    if ( !PATTERNS.onlyLetters.test( descripcion_nota ) ) {
      errors += 1;
      renderErrors( this.errorDescription, ERROR_MESSAGES.pattern );
    }

    if ( descripcion_nota.trim().length === 0 ) {
      errors += 1;
      renderErrors( this.errorDescription, ERROR_MESSAGES.required );
    }

    if ( descripcion_nota.trim().length > 255 ) {
      errors += 1;
      renderErrors( this.errorDescription, ERROR_MESSAGES.max( 255 ) );
    }

    if ( descripcion_nota.trim().length > 0 && descripcion_nota.trim().length < 3 ) {
      errors += 1;
      renderErrors( this.errorDescription, ERROR_MESSAGES.min( 3 ) );
    }

    // ==================================
    //  fecha entrega
    // ==================================

    /*
    *  if ( fecha_entrega.trim().length === 0 ) {
    *    errors += 1;
    *    renderErrors( this.errorDeliveryDate, ERROR_MESSAGES.required )
    *  }
    */

    if ( errors > 0 ) {
      callback( true );

      return;
    }

    callback( false );

  }


  /**
   * funcion que maneja el cambio de la cantidad seleccionada
   *
   * @param  {HTMLElement} element elemento html
   * @param  {number} idDelivery identificador de la nota
   * @param  {number|string} quantityTotal cantidad total
   */
  handleChangeQuantity( element, idDelivery, quantityTotal ) {

    // console.log({ value, idDelivery });

   if ( +element.value < 1 ) {
      element.value = 1;


    } else if ( +element.value > quantityTotal ) {
      element.value = quantityTotal;

    }

    // console.log( element.value );

    // actualiza los cambios locales
    this.productsSelected = this.productsSelected.map(( product ) => {

      if ( product.productoid === idDelivery ) {
        return {
          ...product,
          cantidad_seleccionada: +element.value
        };
      }

      return product;
    });

    this.calculateTotal();
  }


  /**
   * eliminar un producto de la orden
   * @param  {number} idProduct identificador del producto
   */
  deleteProduct( idProduct ) {

    if ( this.deliveryId ) {

      let title = 'Eliminar producto ' + idProduct;
      let description = 'Esta seguro de retirar este producto de la orden??';

      closeModalConfirm = ModalConfirmComponent.closeModalConfirm.bind( this.confirmDeleteProduct );

      ModalConfirmComponent.openModalConfirm( title, description, idProduct );

    } else {

      this.productsSelected = this.productsSelected.filter(( product ) => product.productoid !== idProduct );

      // console.log( idProduct, this.productsSelected );

      this.setProductsTable();
    }
  }

  /**
   * confirmacion de elminacion de producto
   *
   * @param {Object} data objeto de confirmacion
   * @param {number} data.id identificador de producto
   * @param {boolean} data.confirm confirmacion
   */
  confirmDeleteProduct( data ) {
    const { confirm, id } = data;

    if ( confirm ) {

      let noteProduct = ordersForm.productsSelected.find(( product ) => product.productoid === id );

      try {
        NotasProductosController.retirarProductoNota( noteProduct );
        
        ordersForm.productsSelected = ordersForm.productsSelected.filter(
          ( product ) => product.productoid !== id 
        );
        
        ordersForm.setProductsTable();

      } catch ( error ) {
        console.error( error );
      }
    }
  }

  /**
   * eliminar un cliente de la orden
   * @param  {number} idClient identificador del cliente
   */
  deleteClient( idClient ) {

    if ( this.deliveryId ) {
      let title = 'Eliminar cliente ' + idClient;
      let description = 'Esta seguro de retirar este cliente de la orden??';

      closeModalConfirm = ModalConfirmComponent.closeModalConfirm.bind( this.confirmDeleteClient );

      ModalConfirmComponent.openModalConfirm( title, description, idClient );

    } else {

      this.clientsSelected = this.clientsSelected.filter(( client ) => client.id_cliente !== idClient );

      this.setClientsTable();
    }
  }

  /**
   * confirmacion de elminacion de producto
   *
   * @param {Object} data objeto de confirmacion
   * @param {number} data.id identificador de producto
   * @param {boolean} data.confirm confirmacion
   */
  confirmDeleteClient( data ) {
    const { confirm, id } = data;

    if ( confirm ) {
      
      ordersForm.clientsSelected = ordersForm.clientsSelected.filter(
        ( client ) => client.id_cliente !== id 
      );
      
      ordersForm.setClientsTable();
    }
  }

  /** calcula el total de la orden */
  calculateTotal() {

    this.totalOrder = this.productsSelected.reduce(( accum, product, index ) => {
      return accum += ( product.precio * product.cantidad_seleccionada )
    }, 0 );

    // table footer
    document.querySelector('#totalOrder').innerText = (`Total: ${ this.totalOrder.toFixed(2) }$`);
  }

  /**
   * Limpia los campos del formulario
   * @param  {boolean} button indica si la funcion es llamado desde el boton del formulario
  */
  resetForm( button = false ) {

    hideElement( this.errorDescription );
    hideElement( this.errorDeliveryDate );

    if ( button ) {
      form.reset();
      document.querySelector('#delivery-description').focus();
    }
  }
}

// class and components
let ModalClientComponent;
let ModalProductsComponent;

let ModalConfirmComponent;
let closeModalConfirm;

/** @type {ModalClientComponent} */
let modalClientComponent;

/** @type {ModalProductsComponent} */
let modalProductsComponent;

const form = document.forms[0];

/** @type {OrdersForm} */
const ordersForm = new OrdersForm();

form.addEventListener('submit', ordersForm.handleSubmit.bind( ordersForm ) );

document.addEventListener('DOMContentLoaded', ordersForm.getParamsUrl.bind( ordersForm ) );

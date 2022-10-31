/** clase modal de productos */
class ModalProductsComponent {

	constructor() {
    this.modalProducts = ordersForm.footer.querySelector('#modal-products');
    this.tbody = this.modalProducts.querySelector('#tbody-products');
    this.pagination = this.modalProducts.querySelector('#pagination-products');
    this.submitButton = this.modalProducts.querySelector('#submit-button');
    this.searchBar = this.modalProducts.querySelector('search-bar-component');

		/**
		 * Listado de productos
		 * @type {Array<Product>}
		*/
		this.products = [];

		/**
		 * Listado de productos seleccionados
		 * @type {Array<Porduct>}
		 */
		this.productsSelected = [];

		/** @type {number} */
    this.page = 1;

		this.modalProductsInstance = new Modal( this.modalProducts, { backdrop: 'static' });

		this.setEvents();
  }

	/** establece el html y eventos del modal */
  setEvents() {

    this.modalProducts.addEventListener('shown.bs.modal', () => {
      this.submitButton.setAttribute('disabled', '');
    });

    this.modalProducts.addEventListener('hide.bs.modal', () => {
      this.productsSelected = [];
    });

    this.pagination.addEventListener('pagination', ( $event ) => {
      this.page = $event.detail.page;
      this.openModalProducts( $event.detail.value );
    });

    this.searchBar.addEventListener('search', ( $event ) => {
      this.searchProduct( $event.detail.value );
    });
  }

  /**
   * despliuega el modal de productos
   * @param  {Array<number>} pagination paginacion de la tabla
   */
  async openModalProducts( pagination = [0, 10] ) {

    try {

      this.products = await ProductosController.listarProductosActivos( pagination );

      // console.log( this.products );

      let totalProducts = await ProductosController.obtenerTotalProductosActivos();

      setPaginationStorage('productsModalTable', { pagination });

      this.renderProducts( totalProducts.totalPaginas, totalProducts.totalRegistros );


      if ( !this.modalProductsInstance._isShown ) {
        this.modalProductsInstance.show();
      }


    } catch ( error ) {
      console.error( error );

    }
  }

  /**
   * renderiza la tabla de productos dentro del modal
   *
   * @param  {number} totalPages numero de paginas
   * @param  {number} totalRegisters numero de registros
   * @param  {boolean} search flag que indica si actualizar el paginador
   */
  renderProducts( totalPages = 0, totalRegisters = 0, search = false ) {

    if ( !search ) {

      this.tbody.innerHTML = '';
      this.pagination._limit = totalPages;
      this.pagination._registers = totalRegisters;
      this.pagination._page = this.page;
    }

    if ( this.products.length > 0 ) {

      showElement( this.pagination );

      this.tbody.innerHTML = this.products.map(( product ) => (`
       <tr class="text-center">
         <td name="productoid">${ product.productoid }</td>
         <td name="nombre_producto">${ product.nombre }</td>
         <td name="nombre_categoria">${ product.nombre_categoria }</td>
         <td name="quantity">${ product.cantidad }</td>
         <td name="price">${ product.precio ? product.precio : 0 }$</td>
         <td>
          <input
            type="checkbox"
            class="form-check-input point"
            id="product_${ product.productoid }"
            name="product_action"
           	${ this.checkProduct( product ) ? 'checked' : '' }
          />
         </td>
       </tr>
      `)).join('');

      for ( const input of this.tbody.querySelectorAll('input[type="checkbox"]') ) {
        input.addEventListener( 'change', this.handleChange.bind( this ) );
      }

   } else {
      hideElement( this.pagination );

      this.tbody.innerHTML = (`
        <tr class="text-center">
         <td colspan="6" class="text-danger">No existen productos disponibles</td>
       </tr>
     `);

    }
  }

	/**
	 * Funcion que maneja la seleccion del producto
	 * @param {*} $event evento change
	*/
  handleChange( $event ) {

    const rowElement = $event.target.parentNode.parentNode;
    const id_product = +rowElement.querySelector('td[name="productoid"]').innerText;

    if ( $event.target.checked ) {

    	let index = this.productsSelected.findIndex(( product ) => product.productoid === id_product );

    	// console.log({ id_product, index });

    	if ( index === -1 ) {

    		let product = this.products.find(( product ) => product.productoid === id_product );
        product = {...product, precio: product.precio || 0, cantidad_seleccionada: 1 };

    		this.productsSelected.push( product );
    	}

    } else {

    	this.productsSelected = this.productsSelected.filter(
    		( product ) => product.productoid !== id_product
    	);

    }

    // activa el boton si el usuario selecciona un producto

    if ( this.productsSelected.length > 0 ) {
      this.submitButton.removeAttribute('disabled');

    } else {
    	this.submitButton.setAttribute('disabled', '');

    }
  }

  /**
   * buscar productos en la BD.
   * @param  {string} search cadena de busqueda
   */
  async searchProduct( search ) {

    const rexp = /^[\w-\d\s]+$/;

    if ( search.length === 0 ) {

      let { pagination } = JSON.parse( sessionStorage.getItem('productsModalTable') );

      return this.openModalProducts( pagination );
    }

    if ( !rexp.test( search ) ) {
      console.log('no concuerda con expresion regular');
      return;

    }

    // search es la busqueda
    this.products = await ProductosController.buscarProducto({ search: '%' + search + '%' });

    this.renderProducts( null, null, true );
  }

	/** cierra el modal de productos */
  closeModalProducts() {

    ordersForm.productsSelected = this.productsSelected;

    this.modalProductsInstance.hide();

    console.log( ordersForm.productsSelected );


    // mandar al formulario de orden
    ordersForm.setProductsTable();
  }

  /**
   * chequea si el producto esta marcado en la orden
   *
   * @param  {Product} product instancia del producto
   * @return {boolean} resultado de la verificacion de la existencia del producto.
	 * Devuelve true si lo encuentra
   */
  checkProduct( product ) {

  	// retorna cuales son los elementos seleccionados y los marca en la lista

  	return this.productsSelected.findIndex(
      productSelect => productSelect.productoid === product.productoid
    ) !== -1;
  }
}

module.exports = {
	ModalProductsComponent
}

class ProductsTableComponent {

	constructor() {

		// this.totalProducts = document.querySelector('#totalProducts');
		// this.availableProducts = document.querySelector('#availableProducts');

		this.tbody = productsElement.querySelector('#tbody-products');
		this.pagination = productsElement.querySelector('#pagination');

		this.render = this.render.bind( this );
		this.getAll = this.getAll.bind( this );
		this.openModalConfirm = this.openModalConfirm.bind( this );

		// primera pagina
		this.page = 1;

		this.products = [];
	}

	async getAll( $event = null, pagination = [0,10] ) {

		try {
			this.products = await ProductosController.listarProductos( pagination );

			let totalProducts = await ProductosController.obtenerTotalProductos();

			this.render( totalProducts );

		} catch ( error ) {
			console.log( error );

		}
	}

	createProduct( data ) {

		ProductosController.crearProducto( data, getUserLogged() );
		// console.log( data, ProductosController ); // enviar al controlador
	}

	selectProduct( idProduct ) {
		let found = PRODUCTOS.find( product => product.id === idProduct );

		openModalEditProduct( found );
	}

	editProduct( data ) {
		console.log( data );  // enviar al controlador
	}

	activeProduct({ id, confirm }) {

		if ( !confirm ) {
			return;
		}

		let found = PRODUCTOS.find(( product ) => product.id === id );

		console.log( found );  // enviar al controller
	}

	searchProducts( $event ) {
		console.log( $event );
	}

	getCategory( categoriaId ) {
		// @string retorna el nombre de la categoria
		return CATEGORIAS.find(( categoria ) => categoria.id === categoriaId ).nombre;
	}

	getProductsActive() {

		// @number devuelve el total de los productos activos

		return PRODUCTOS.reduce(( accum, product, index ) => {

			if ( product.disponible && product.cantidad > 0 ) {
				return accum = accum + 1;
			}

			return accum;
		}, 0 );
	}

	openModalConfirm( idProduct ) {

		let found = PRODUCTOS.find(( product ) => product.id === idProduct );
		let title = `${ found.disponible ? 'Desactivar' : 'Activar' } el producto ${ idProduct }`;
		let element = (`
			<p class="text-center">
				¿Esta seguro de ${ found.disponible ? 'desactivar' : 'activar' } la disponibilidad del producto
				${ found.nombre }?
			</p>
		`);

		// reasigna el bind de la funcion
		closeModalConfirm = ModalConfirmComponent.closeModalConfirm.bind( this.activeProduct );

		return ModalConfirmComponent.openModalConfirm( title, element, idProduct );
	}

	setRows( product ) {
		return (`
			<tr class="text-center">
				<td>${ product.productoid }</td>
				<td>${ product.nombre }</td>
				<td>${ product.cantidad > 0 ? product.cantidad : ('<span class="text-danger">No disponible</span>') }</td>
				<td>${ product.nombre_categoria || 'No disponible' }</td>
				<td>${ product.precio || ('<span class="text-danger">No disponible</span>') }</td>
				<td>${ product.disponibilidad ? ('<i class="fas fa-check text-success"></i>') : ('<i class="fas fa-times text-danger"></i>') }</td>
				<td>
					<button
						type="button"
						onclick="productsTableComponent.selectProduct( ${ product.productoid } )"
						class="btn btn-primary btn-sm"
					>
						<i class="fas fa-edit"></i>
					</button>
					<button
						type="button"
						onclick="productsTableComponent.openModalConfirm( ${ product.productoid } )"
						class="btn btn-danger btn-sm"
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}

	render( totalProducts, search = false ) {

		// console.log( totalProducts );

		if ( !search ) {

			let paginationElement = document.querySelector('pagination-component');

			this.tbody.innerHTML = '';
			paginationElement._limit = totalProducts.totalPaginas;
			paginationElement._registers = totalProducts.totalRegistros;
			paginationElement._page = this.page;
		}

		// paginationElement.setAttribute('totalRegisters', totalProducts.totalRegistros.toString() );

		// console.log( paginationElement );

		/* if ( !search ) {



			let paginationValue = document.querySelector('#paginationValue');
			let paginationEnd = document.querySelector('#paginationEnd');
			let totalCategoriesElement = document.querySelector('#totalCategory');

			console.log({ paginationValue, paginationEnd, totalCategoriesElement });


			this.tbody.innerHTML = '';
			this.totalPages = totalCategories.totalPaginas;
			this.totalRegisters = totalCategories.totalRegistros;

			totalCategoriesElement.textContent = this.totalRegisters;
			paginationValue.textContent =  this.currentPage + 1;
			paginationEnd.textContent = this.totalPages;

			PaginationComponent.setButtonsPagination.call( this, this.totalPages );
		} */


		console.log('render');

		if ( this.products.length > 0 ) {

			this.pagination.style.display = 'block';

			this.tbody.innerHTML = this.products.map( this.setRows.bind( this ) ).join('');

		} else {

			this.pagination.style.display = 'none';

			this.tbody.innerHTML += (`
				<tr class="text-center">
					<td colspan="7" class="text-danger">
						No existen registros de productos disponibles
					</td>
				</tr>
			`);
		}
	}
}

module.exports = ProductsTableComponent;

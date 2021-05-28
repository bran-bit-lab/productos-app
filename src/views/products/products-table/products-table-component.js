class ProductsTableComponent {

	constructor() {

		this.tbody = productsElement.querySelector('#tbody-products');
		this.pagination = productsElement.querySelector('#pagination-products');

		this.render = this.render.bind( this );
		this.getAll = this.getAll.bind( this );
		this.openModalConfirm = this.openModalConfirm.bind( this );

		// primera pagina
		this.page = 1;

		this.products = [];
	}

	async getAll( $event = null, pagination = [0,10], page = this.page ) {

		try {

			let totalProducts = await ProductosController.obtenerTotalProductos();
			
			this.products = await ProductosController.listarProductos( pagination );
			
			this.page = page;

			sessionStorage.setItem('productsTable', JSON.stringify({ pagination }));
			this.render( totalProducts );

		} catch ( error ) {
			
			console.error( error );

		}
	}

	createProduct( data ) {
		
		ProductosController.crearProducto( data, getUserLogged() );

		this.getAll( null, getPaginationStorage('categoriesTable') );
	}

	selectProduct( idProduct ) {

		let found = this.products.find( product => product.productoid === idProduct );

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
				<td>${ this.setName( product.nombre_usuario, product.apellido ) }</td>
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

	setName( name = '', surname = '' ) {

		if ( name.length > 0 && surname.length > 0 ) {
			return name + ' ' + surname;
		}

		return 'No disponible';
	}

	render( totalProducts, search = false ) {

		// console.log( totalProducts );

		if ( !search ) {

			let paginationElement = document.querySelector('#pagination-products');

			this.tbody.innerHTML = '';
			paginationElement._limit = totalProducts.totalPaginas;
			paginationElement._registers = totalProducts.totalRegistros;
			paginationElement._page = this.page;
		}

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

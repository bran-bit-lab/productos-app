class ProductsTableComponent {

	constructor() {

		// this.totalProducts = document.querySelector('#totalProducts');
		// this.availableProducts = document.querySelector('#availableProducts');

		this.tbody = productsElement.querySelector('#tbody-products');
		this.pagination = productsElement.querySelector('#pagination');

		this.render = this.render.bind( this );
	}

	addProduct( data ) {
		console.log( data );
	}

	editProduct() {
		openModalEditProduct();
	}

	activeProduct() {
		console.log('active product');
	}

	getAll() {

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

	setRows( product ) {
		return (`
			<tr class="text-center">
				<td>${ product.id }</td>
				<td>${ product.nombre }</td>
				<td>${ product.cantidad > 0 ? product.cantidad : ('<span class="text-danger">Agotado</span>') }</td>
				<td>${ this.getCategory( product.categoriaId ) }</td>
				<td>${ product.precioUnitario }$</td>
				<td>${ product.disponible && product.cantidad > 0 ? 'disponible' : ('<span class="text-danger">no disponible</span>') }</td>
				<td>
					<button
						type="button"
						onclick="productsTableComponent.editProduct()"
						class="btn btn-primary btn-sm"
					>
						<i class="fas fa-edit"></i>
					</button>
					<button
						type="button"
						onclick="productsTableComponent.activeProduct()"
						class="btn btn-danger btn-sm"
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}

	render() {

		// this.availableProducts.textContent = this.getProductsActive();
		// this.totalProducts.textContent = PRODUCTOS.length;

		this.tbody.innerHTML = '';

		if ( PRODUCTOS.length > 0 ) {

			this.pagination.style.display = 'block';

			this.tbody.innerHTML = PRODUCTOS.map( this.setRows.bind( this ) ).join('');

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

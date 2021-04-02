class ProductsComponent {

	constructor() {
		this.totalProducts = document.querySelector('#totalProducts');
		this.tbody = document.querySelector('#tbody-products');
		this.pagination = document.querySelector('#pagination');
		this.availableProducts = document.querySelector('#availableProducts');
		this.render = this.render.bind( this );
	}

	addProduct() {
		console.log('add product');
	}

	editProduct() {
		console.log('editProduct');
	}

	activeProduct() {
		console.log('active product');
	}

	getPorducts() {

	}

	findCategory( categoriaId ) {
		return CATEGORIAS.find(( categoria ) => categoria.id === categoriaId ).nombre;
	}

	changeView( view = 'category' ) {
		
		const elementsCategory = document.querySelectorAll('.category');
		const elementsProducts = document.querySelectorAll('.products');

		if ( view === 'category' ) {

			elementsCategory.forEach( ( elementHTML ) => showElement( elementHTML ) );
			elementsProducts.forEach( ( elementHTML ) => hideElement( elementHTML ) );

		} else {

			elementsProducts.forEach( ( elementHTML ) => showElement( elementHTML ) );
			elementsCategory.forEach( ( elementHTML ) => hideElement( elementHTML ) );
		}
	}

	getProductsActive() {

		// @number devuelve el total de los productos disponibles

		return PRODUCTOS.reduce(( accum, product, index ) => {
			
			// console.log( product );

			if ( product.disponible && product.cantidad > 0 ) {
				return accum = accum + 1;
			}

			return accum;
		}, 0 );
	}

	render() {

		this.changeView( 'products' );
		
		// this.availableProducts.textContent = this.getProductsActive();
		// this.totalProducts.textContent = PRODUCTOS.length;

		this.tbody.innerHTML = '';

		if ( PRODUCTOS.length > 0 ) {

			this.pagination.style.display = 'block';

			PRODUCTOS.forEach(( product ) => {

				this.tbody.innerHTML += (`
					<tr class="text-center">
						<td>${ product.id }</td>
						<td>${ product.nombre }</td>
						<td>${ this.findCategory( product.categoriaId ) }</td>
						<td>${ product.cantidad > 0 ? product.cantidad : '<span class="text-danger">Agotado</span>' }</td>
						<td>${ product.precioUnitario }$</td>
						<td>${ product.disponible && product.cantidad > 0 ? 'disponible' : '<span class="text-danger">no disponible</span>' }</td>
						<td>
							<button
								type="button"
								onclick="productsComponent.editProduct()"
								class="btn btn-primary btn-sm"
							>
								<i class="fas fa-edit"></i>
							</button>
							<button
								type="button"
								onclick="productsComponent.activeProduct()"
								class="btn btn-danger btn-sm"
							>
								<i class="fas fa-trash"></i>
							</button>
						</td>
					</tr>
				`)
			});


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


const productsComponent = new ProductsComponent();

document.addEventListener('DOMContentLoaded', productsComponent.render );

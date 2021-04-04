class CategoryTableComponent {

	constructor() {
		
		this.tbody = categoriesElement.querySelector('#tbody-categories');
		this.pagination = categoriesElement.querySelector('#pagination');

		this.render = this.render.bind( this );
	}

	addCategory() {
		
		const userLogged = getUserLogged();

		const category = {
			nombre: 'prueba',
			descripcion: 'prueba de desarrollo',
			imagen: '',
		};

		CategoriasController.crearCategoria( category, userLogged );
	}

	editProduct() {
		console.log('edit category');
	}

	activeProduct() {
		console.log('active category');
	}

	getProducts() {
	}


	getCategoriesActive() {

		// @number devuelve el total de los productos activos

		return CATEGORIES.reduce(( accum, product, index ) => {
			
			if ( product.disponible && product.cantidad > 0 ) {
				return accum = accum + 1;
			}

			return accum;
		}, 0 );
	}

	setRows( category ) {
		return (`
			<tr class="text-center">
				<td>${ category.id }</td>
				<td>${ category.nombre }</td>
				<td>${ category.descripcion }</td>
				<td>${ category.userId }</td>
				<td>${ category.activo ?
						('<i class="fas fa-check text-success"></i>') :
						('<i class="fas fa-times text-danger"></i>') 
					}
				</td>
				<td>
					<button
						type="button"
						onclick="categoryTableComponent.editProduct()"
						class="btn btn-primary btn-sm"
					>
						<i class="fas fa-edit"></i>
					</button>
					<button
						type="button"
						onclick="categoryTableComponent.activeProduct()"
						class="btn btn-danger btn-sm"
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}

	render() {
		
		this.tbody.innerHTML = '';

		if ( CATEGORIAS.length > 0 ) {

			this.pagination.style.display = 'block';

			this.tbody.innerHTML = CATEGORIAS.map( this.setRows ).join('');

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

module.exports = CategoryTableComponent;
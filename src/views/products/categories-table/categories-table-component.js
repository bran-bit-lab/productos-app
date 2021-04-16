class CategoryTableComponent {

	constructor() {

		this.tbody = categoriesElement.querySelector('#tbody-categories');
		this.pagination = categoriesElement.querySelector('#pagination');

		this.pagination.innerHTML = readFileAssets( '/shared/pagination/pagination.html' );
		this.getAll = this.getAll.bind( this );

		// nav-table
		this.totalPages = 0;
		this.totalRegisters = 0;
		this.currentPage = 0;
	}

	editCategory() {
		console.log('edit category');
	}

	activeCategory() {
		console.log('active category');
	}

	async searchCategories( $event ) {
		console.log( $event );
	}

	async getAll( $event, pagination = [0, 10] ) {

		try {

			const categories = await CategoriasController.listarCategorias( pagination );
			let totalCategories = await CategoriasController.obtenerTotalCategorias();

			// console.log( categories );

			sessionStorage.setItem('categoriesTable', JSON.stringify({ pagination }));

			this.render( categories, totalCategories );

		} catch ( error ) {
			console.log( error );
		}
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

	getNombre( nombre, apellido ) {

		if ( ( nombre === null || nombre.length === 0 ) &&
			( apellido === null || apellido.length === 0 ) ) {
			return 'No disponible'
		}

		return nombre + ' ' + apellido;
	}

	setRows( category ) {

		return (`
			<tr class="text-center">
				<td>${ category.categoriaid }</td>
				<td>${ category.nombre ? category.nombre : 'No disponible' }</td>
				<td>${ category.descripcion }</td>
				<td>${ this.getNombre( category.nombre, category.apellido ) }</td>
				<td>${ category.activo ?
						('<i class="fas fa-check text-success"></i>') :
						('<i class="fas fa-times text-danger"></i>')
					}
				</td>
				<td>${ category.imagen && category.imagen.length > 0 ?
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

	render( categorias = [], totalCategories ) { // llamamos a este metodos

		let paginationValue = document.querySelector('#paginationValue');
		let paginationEnd = document.querySelector('#paginationEnd');
		let totalCategoriesElement = document.querySelector('#totalCategory');

		this.tbody.innerHTML = '';
		this.totalPages = totalCategories.totalPaginas;
		this.totalRegisters = totalCategories.totalRegistros;

		totalCategoriesElement.textContent = this.totalRegisters;
		paginationValue.textContent =  this.currentPage + 1;
		paginationEnd.textContent = this.totalPages;

		PaginationComponent.setButtonsPagination.call( this, this.totalPages );

		if ( categorias.length > 0 ) {

			this.pagination.style.display = 'block';

			this.tbody.innerHTML = categorias.map( this.setRows.bind( this ) ).join('');

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

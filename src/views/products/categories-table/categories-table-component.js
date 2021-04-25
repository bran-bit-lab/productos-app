class CategoryTableComponent {

	constructor() {

		this.tbody = categoriesElement.querySelector('#tbody-categories');
		this.pagination = categoriesElement.querySelector('#pagination');

		this.pagination.innerHTML = readFileAssets( '/shared/pagination/pagination.html' );
		this.getAll = this.getAll.bind( this );
		this.activeCategory = this.activeCategory.bind( this );

		// nav-table
		this.totalPages = 0;
		this.totalRegisters = 0;
		this.currentPage = 0;

		this.categories = [];
	}

	createCategory( data ) {

		// se elimina el campo categoriaid antes de mandar al controlador
 		delete data.categoriaid;

		CategoriasController.crearCategoria( data, getUserLogged() );

		this.getAll( null,   getPaginationStorage('categoriesTable') );
	}

	editCategory( data ) {
		CategoriasController.editarCategoria( data, getUserLogged() );
	}

	selectCategory( idCategory = 1, method = 'edit' ) {

		let found = this.categories.find( category => category.categoriaid === idCategory );

		openModalEditCategory( found );
	}

	activeCategory({ id, confirm }) {

		if ( !confirm ) {
			return;
		}

		let categoryFound = this.categories.find(( category ) => category.categoriaid === id );

		const send = {
			categoriaid: id,
			activo: !categoryFound.activo
		}

		// enviar al controlador
		console.log( send );
	}

	openModalConfirm( idCategory = null ) {

		let found = this.categories.find(( category ) => category.categoriaid === idCategory );
		let title = `${ found.activo ? 'Desactivar' : 'Activar' } la categoría ${ idCategory }`;

		let element = (`
			<p class="text-center">
				¿Esta seguro de ${ found.activo ? 'desactivar' : 'activar' } la categoria de
				${ found.nombre }?
			</p>
		`);

		return ModalConfirmComponent.openModalConfirm( title, element, idCategory );
	}

	async searchCategories( $event ) {
		console.log( $event );
	}

	async getAll( $event, pagination = [0, 10] ) {

		try {

			this.categories = await CategoriasController.listarCategorias( pagination );
			let totalCategories = await CategoriasController.obtenerTotalCategorias();

			// console.log( categories );

			sessionStorage.setItem('categoriesTable', JSON.stringify({ pagination }));

			this.render( this.categories, totalCategories );

		} catch ( error ) {
			console.log( error );
		}
	}

	getNombre( nombre, apellido ) {

		if ( ( !nombre || nombre.length === 0 ) &&
			( !apellido || apellido.length === 0 ) ) {
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
				<td>${ this.getNombre( category.nombre_usuario, category.apellido ) }</td>
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
						onclick="categoryTableComponent.selectCategory( ${ category.categoriaid } )"
						class="btn btn-primary btn-sm"
					>
						<i class="fas fa-edit"></i>
					</button>
					<button
						type="button"
						onclick="categoryTableComponent.openModalConfirm( ${ category.categoriaid } )"
						class="btn btn-danger btn-sm"
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}

	render( categorias = [], totalCategories ) {

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

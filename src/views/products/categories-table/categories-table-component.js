/** clase tabla de categorias */
class CategoryTableComponent {

	constructor() {

		this.tbody = categoriesElement.querySelector('#tbody-categories');
		this.pagination = categoriesElement.querySelector('#pagination-categories');

		this.pagination.innerHTML = readFileAssets( '/shared/pagination/pagination.html' );
		this.getAll = this.getAll.bind( this );
		this.activeCategory = this.activeCategory.bind( this );
		this.openModalConfirm = this.openModalConfirm.bind( this );

		/** @type {number} */
		this.page = 1;

		/** @type {Array<Category>} */
		this.categories = [];
	}

	/**
	 * crea una categoria
	 * @param  {Category} data instancia de categoria
	 */
	createCategory( data ) {

		// se elimina el campo categoriaid antes de mandar al controlador
 		delete data.categoriaid;

		CategoriasController.crearCategoria( data, getUserLogged() );

		this.getAll( null,  getPaginationStorage('categoriesTable') );
	}

	/**
	 * edita una categoria
	 * @param  {Category} data instancia de categoria
	 */
	editCategory( data ) {

		let found = this.categories.find( category => category.categoriaid === data.categoriaid );

		CategoriasController.editarCategoria( data, getUserLogged(), found.imagen || null );

		this.getAll( null,  getPaginationStorage('categoriesTable') );

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
		};

		CategoriasController.activarCategoria( send );

		this.getAll( null,   getPaginationStorage('categoriesTable') );
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

		closeModalConfirm = ModalConfirmComponent.closeModalConfirm.bind(
			this.activeCategory
		);

		return ModalConfirmComponent.openModalConfirm( title, element, idCategory );
	}

	async searchCategories( $event = '' ) {

		if ( $event.length === 0 ) {
			let { pagination } = getPaginationStorage('categoriesTable');

			return this.getAll( null, pagination );
		}



		this.categories = await CategoriasController.buscarCategoria({ search: '%' + $event + '%' });

		console.log( this.categories );

		this.render( this.categories, null, true );
	}

	async getAll( $event, pagination = [0, 10], page = this.page ) {

		try {

			this.categories = await CategoriasController.listarCategorias( pagination );
			let totalCategories = await CategoriasController.obtenerTotalCategorias();
			this.page = page;

			// console.log( categories );

			sessionStorage.setItem('categoriesTable', JSON.stringify({ pagination }));

			this.render( this.categories, totalCategories );

		} catch ( error ) {
			console.log( error );
		}
	}


	/**
	 * obtiene el nombre del usuario
	 *
	 * @param  {string} name   nombre del usuario
	 * @param  {string} surname apellido del usuario
	 * @returns {string} obtiene el nombre concatenado
	 */
	getName( name, surname ) {

		if ( ( !name || name.length === 0 ) &&
			( !surname || surname.length === 0 ) ) {
			return 'No disponible';
		}

		return name + ' ' + surname;
	}


	/**
	 * obtiene las filas en string html
	 *
	 * @param  {Category} category instancia de categoria
	 * @returns {string}  devuelve el string html
	 */
	setRows( category ) {

		return (`
			<tr class="text-center">
				<td>${ category.categoriaid }</td>
				<td>${ category.nombre ? category.nombre : 'No disponible' }</td>
				<td>${ category.descripcion }</td>
				<td>${ this.getName( category.nombre_usuario, category.apellido ) }</td>
				<td>${ category.activo ?
						('<i class="fas fa-check text-success"></i>') :
						('<i class="fas fa-times text-danger"></i>')
					}
				</td>
				<!-- <td>${ category.imagen && category.imagen.length > 0 ?
						('<i class="fas fa-check text-success"></i>') :
						('<i class="fas fa-times text-danger"></i>')
				 	}
				 </td> -->
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


	/**
	 * renderiza la tabla categorias
	 *
	 * @param  {Array<Category>} categorias
	 * @param  {number} totalCategories total de categorias
	 * @param  {boolean} search  flag que indica si debe setear el paginador
	 */
	render( categorias = [], totalCategories, search = false ) {

		if ( !search ) {

			let paginationElement = document.querySelector('#pagination-categories');

			this.tbody.innerHTML = '';
			paginationElement._limit = totalCategories.totalPaginas;
			paginationElement._registers = totalCategories.totalRegistros;
			paginationElement._page = this.page;
		}

		if ( categorias.length > 0 ) {

			this.pagination.style.display = 'block';

			this.tbody.innerHTML = categorias.map( this.setRows.bind( this ) ).join('');

		} else {

			this.pagination.style.display = 'none';

			this.tbody.innerHTML = (`
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

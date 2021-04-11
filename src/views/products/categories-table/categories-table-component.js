class CategoryTableComponent {

	constructor() {

		this.tbody = categoriesElement.querySelector('#tbody-categories');
		this.pagination = categoriesElement.querySelector('#pagination');

		this.render = this.render.bind( this );
		this.getProducts = this.getProducts.bind( this ); 

		// para que tnega la instancia de 
		// la clase cargada en el this de la funcion
	}

	editProduct() {
		console.log('edit category');
	}

	activeProduct() {
		console.log('active category');
	}

	async getProducts() {

		try {
			
			// esto hay que hacerlo dinaico 
			// esto es para mi voy a hacerlo esta semana

			const categories = await CategoriasController.listarCategorias( 
				[10, 20],  // esta quemado hay que hacerlo dinamico si lo cambias aparece el resto
				getUserLogged() 
			);

			// por ultimo renderiza
			this.render( categories );

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

		if ( ( nombre === null || nombre.length > 0 ) && 
			( apellido === null || apellido.length > 0 ) ) {
			return 'No disponible'
		}

		return nombre + ' ' + apellido;
	}

	setRows( category ) {

	// aqui se añaden los atributos a la fila

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
				<td>${ category.imagen !== null && category.imagen.length > 0 ?
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

	render(  categorias = [] ) { // llamamos a este metodos

		this.tbody.innerHTML = '';

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

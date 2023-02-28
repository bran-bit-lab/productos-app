/** Clase tabla de usuarios */
class UsersTableComponent {

  constructor() {
    	this.pagination = document.querySelector('#pagination-users');
		this.tbody = document.querySelector('#tbody-user');
		this.totalUsers = document.querySelector('#totalUsers');
    	this.searchBar = document.querySelector('search-bar-component[from="users"]');

		this.renderUsers = this.renderUsers.bind( this );
		this.deleteUser = this.deleteUser.bind( this );
		this.changeRole = this.changeRole.bind( this );
		this.getAll = this.getAll.bind( this );

    /** @type {number} */
    this.page = 1;

    /** @type {Array<User>} */
    this.users = [];

    this.setEvents();
  }

  /** Crea los escuchadores de eventos */
  setEvents() {
    this.pagination.addEventListener( 'pagination',
    	( $event ) => this.getAll( null,  $event.detail.value, $event.detail.page )
    );

    this.searchBar.addEventListener('search', ( $event ) => this.searchUser( $event.detail.value ));
  }

  /**
   * Obtiene la lista de usuarios paginadas
   *
   * @param  {*|null} $event  evento de carga de sito
   * @param  {Array<number>} pagination paginacion de los usuarios
   * @param  {number} page número actual de la paginacion
   */
  async getAll( $event, pagination = [ 0, 10 ], page = this.page ) {

		try {

			this.users = await UsersController.listarUsuarios( pagination );

			let totalUsers = await UsersController.obtenerTotalUsuarios();

			sessionStorage.setItem('usersTable', JSON.stringify({ pagination }));

			this.page = page;

			this.renderUsers( totalUsers.totalPaginas, totalUsers.totalRegistros );

		} catch ( error ) {

			console.error( error );
		}

	}

	/**
	 * Realiza una búsqueda de usuarios
	 * @param  {string} search cadena de busqueda
	 */
	async searchUser( search ) {

		const rexp = /^[\w\d\s]+$/;

		if ( search.length === 0 ) {

			let { pagination } = JSON.parse(  sessionStorage.getItem('usersTable') );

			return this.getAll(
				null,
				pagination
			);
		}


		if ( !rexp.test( search ) ) {

      console.log('no concuerda con expresion regular');

      return;
		}

		// search es la busqueda
		this.users = await UsersController.buscarUsuarios({ search: '%' + search + '%' });

		this.renderUsers( null, null, true );
	}


	/**
	 * actualiza el estado del usuario
	 *
	 * @param  {Object} data  objeto de la respuesta
	 * @param  {number} data.id identificador del usuario
   * @param {boolean} data.confirm  confirmacion del cambio   
	 */
	deleteUser({ id, confirm }) {

		if ( !confirm ) {
			return;
		}

		let found = this.users.find(( user ) => user.userid === id );

		UsersController.cambiarEstadoUsuarios({
			estado: !found.estado,
			userid: id
		});

		this.getAll( null, getPaginationStorage('usersTable') );
	}


	/**
	 * Crea el nuevo usuario
	 * @param  {User} form instancia del usuario
	 */
	newUser( form ) {

		UsersController.crearUsuario( form );

		this.getAll( null, getPaginationStorage('usersTable') );
	}

  /**
	 * Cambia el rol del usuario
	 * @param  {User} user instancia del usuario
	 */
	changeRole( user ) {

		UsersController.cambiarRolUsuarios({  // aqui ya se envia el objeto como tal
			area: user.role,
			userid: user.id
		});

		this.getAll( null, getPaginationStorage('usersTable') );
	}

	/**
	 * Abre el modal de confirmacion
	 * @param  {number | null} idUser identificador del usuario
	 */
	openModalConfirm( idUser = null ) {

		let found = this.users.find(( user ) => user.userid === idUser );
		let title = `${ found.estado ? 'Remover' : 'Otorgar' } acceso al usuario ${ idUser }`;

		// description
		let element = (`
			<p class="text-center">
				¿Esta seguro de ${ found.estado ? 'remover' : 'otorgar' } acceso al usuario a
				${ found.nombre + ' ' + found.apellido }?
			</p>`
		);

    closeModalConfirm = ModalConfirmComponent.closeModalConfirm.bind( this.deleteUser );

    ModalConfirmComponent.openModalConfirm( title, element, idUser );
	}


	/**
	 * Obtiene una fila en formato html
	 *
	 * @param  {User} user instancia del usuario
	 * @return {string}  retorna una fila de la tabla en string html
	 */
	getRowTable( user ) {
		return (`
			<tr class="text-center">
				<td>${ user.userid }</td>
				<td>${ user.nombre }</td>
				<td>${ user.apellido }</td>
				<td>${ user.correo }</td>
				<td>${ user.area }</td>
				<td>${ user.estado ?
						('<i class="fas fa-check text-success"></i>') :
						('<i class="fas fa-times text-danger"></i>')
					}
				</td>
				<td>
					<button
						type="button"
						onclick="ModalChangeRole.openModalRole( ${ user.userid } )"
						class="btn btn-primary btn-sm"
						${ getUserLogged().userid === user.userid ? 'disabled' : '' }
					>
						<i class="fas fa-user"></i>
					</button>
					<button
						type="button"
						onclick="usersTableComponent.openModalConfirm( ${ user.userid } )"
						class="btn btn-secondary btn-sm"
						${ getUserLogged().userid === user.userid ? 'disabled' : '' }
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}


	/**
	 * Rendiza la tabla de usuarios
	 *
	 * @param  {number|null} totalPages paginas totales
	 * @param  {number|null} totalRegisters numeros de registros
	 * @param  {boolean} search flag de busqueda le indica si actualiza la paginacion
	 */
	renderUsers( totalPages = null , totalRegisters = null, search = false ) {

		if ( !search ) {

			// asignacion de parametros para pagination component
			this.tbody.innerHTML = '';
			this.pagination._limit = totalPages;
			this.pagination._registers = totalRegisters;
			this.pagination._page = this.page;
		}

		if ( this.users.length > 0 ) {

			showElement( this.pagination );

			this.tbody.innerHTML = this.users.map(( user ) => this.getRowTable( user ))
				.join('');

		} else {

			hideElement( this.pagination );

			this.tbody.innerHTML = (`
				<tr class="text-center">
					<td colspan="7" class="text-danger">
						No existen registros de usuarios disponibles
					</td>
				</tr>
			`);
		}
	}
}

module.exports = UsersTableComponent;

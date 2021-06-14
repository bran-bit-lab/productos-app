class UsersTableComponent {
  constructor() {
    this.pagination = document.querySelector('#pagination-users');
		this.tbody = document.querySelector('#tbody-user');
		this.totalUsers = document.querySelector('#totalUsers');

		this.renderUsers = this.renderUsers.bind( this );
		this.deleteUser = this.deleteUser.bind( this );
		this.changeRole = this.changeRole.bind( this );
		this.getAll = this.getAll.bind( this );

    this.page = 1;

    this.users = [];

    this.setEvents();
  }

  setEvents() {
    this.pagination.addEventListener( 'pagination',
    	( $event ) => this.getAll( null,  $event.detail.value, $event.detail.page )
    );
  }

  async getAll( $event, pagination = [ 0, 10 ], page = this.page ) {

		try {

			this.users = await UsersController.listarUsuarios( pagination );

			let totalUsers = await UsersController.obtenerTotalUsuarios();

			sessionStorage.setItem('usersTable', JSON.stringify({ pagination }));

			this.page = page;

			this.renderUsers(
				totalUsers['totalPaginas'],
				totalUsers['totalRegistros']
			);

		} catch ( error ) {

			console.error( error );
		}

	}

	async getUser( search ) {

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
		this.users = await UsersController.buscarUsuarios({ search :search });

		this.renderUsers( null, null, true );
	}

	deleteUser({ id, confirm }) {

		if ( !confirm ) {
			return;
		}

		let found = USERS.find(( user ) => user.userid === id );

		UsersController.cambiarEstadoUsuarios({
			estado: !found.estado,
			userid: id
		});

		return this.getAll( null, getPaginationStorage('usersTable') );
	}

	newUser( form ) {

		UsersController.crearUsuario( form );

		return this.getAll( null, getPaginationStorage('usersTable') );
	}

	changeRole( user ) {

		UsersController.cambiarRolUsuarios({  // aqui ya se envia el objeto como tal
			area: user.role,
			userid: user.id
		});

		return this.getAll( null, PaginationComponent.getPaginationStorage('usersTable') );
	}

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

		return ModalConfirmComponent.openModalConfirm( title, element, idUser );
	}

	getRowTable( user ) {
    console.log( user );
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
						onclick="usersComponent.openModalConfirm( ${ user.userid } )"
						class="btn btn-danger btn-sm"
						${ getUserLogged().userid === user.userid ? 'disabled' : '' }
					>
						<i class="fas fa-trash"></i>
					</button>
				</td>
			</tr>
		`);
	}

	renderUsers( totalPages = null , totalRegisters = null, search = false ) {

		if ( !search ) {

			let paginationElement = document.querySelector('#pagination-users');

			// asignacion de parametros para pagination compoent
			this.tbody.innerHTML = '';
			paginationElement._limit = totalPages;
			paginationElement._registers = totalRegisters;
			paginationElement._page = this.page;
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

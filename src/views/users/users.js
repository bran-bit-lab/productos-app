class UsersComponent {

	constructor() {
		this.tbody = document.querySelector('#tbody-user');
		this.totalUsers = document.querySelector('#totalUsers');
		this.pagination = document.querySelector('#pagination');
		this.render = this.render.bind( this );
	}

	createUser() {
		console.log('create');
	}

	editUser() {
		console.log('edit');
	}

	deleteUser() {	
		console.log('delete');
	}

	changeRole() {
		console.log('changeRole');
	}

	render() {

		this.tbody.innerHTML = '';
		this.totalUsers.innerText = USERS.length;

		if ( USERS.length > 0 ) {

			this.pagination.style.display = 'block';

			USERS.forEach(( user ) => this.tbody.innerHTML += (`
					<tr class="text-center">
						<td>${ user.id }</td>
						<td>${ user.nombre }</td>
						<td>${ user.apellido }</td>
						<td>${ user.correo }</td>
						<td>${ user.area }</td>
						<td>${ user.activo ? 'activo' : 'no activo' }</td>
						<td>
							<button 
								type="button" 
								onclick="usersComponent.editUser()" 
								class="btn btn-primary btn-sm"
							>
								Editar
							</button>
							<button 
								type="button" 
								onclick="usersComponent.editUser()" 
								class="btn btn-secondary btn-sm"
							>
								Cambiar
							</button>
							<button 
								type="button" 
								onclick="usersComponent.deleteUser()" 
								class="btn btn-danger btn-sm"
							>
								Remover
							</button>
						</td>
					</tr>
				`) 
			);
		
		} else {

			this.pagination.style.display = 'none';

			this.tbody.innerHTML += (`
				<tr class="text-center">
					<td colspan="7" class="text-danger">
						No existen registros de usuarios disponibles
					</td>
				</tr>
			`);
		}
	}
}

const info = document.querySelector('#info');
const usersComponent = new UsersComponent();

document.addEventListener('DOMContentLoaded', usersComponent.render );
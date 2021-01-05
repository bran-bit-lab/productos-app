const info = document.querySelector('#info');

class UsersComponent {

	constructor() {
		this.tbody = document.querySelector('#tbody-user');
		this.totalUsersSelector = document.querySelector('#totalUsers');
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

	render() {

		this.tbody.innerHTML = '';
		this.totalUsersSelector.innerText = USERS.length;

		USERS.forEach(( user ) =>  {
			this.tbody.innerHTML += (`
				
				<tr class="text-center">
					<td>${ user.id }</td>
					<td>${ user.nombre }</td>
					<td>${ user.apellido }</td>
					<td>${ user.correo }</td>
					<td>${ user.area }</td>
					<td>
						<button 
							type="button" 
							onclick="usersComponent.editUser()" 
							class="btn btn-primary btn-sm"
						>
								Editar
						</button>
						<btton 
							type="button" 
							onclick="usersComponent.editUser()" 
							class="btn btn-secondary btn-sm"
						>
							Cambiar
						</btton>
						<button 
							type="button" 
							onclick="usersComponent.deleteUser()" 
							class="btn btn-danger btn-sm"
						>
							Remover
						</button>
					</td>
				</tr>

			`);
		});
	}
}

const usersComponent = new UsersComponent();

document.addEventListener('DOMContentLoaded', usersComponent.render );
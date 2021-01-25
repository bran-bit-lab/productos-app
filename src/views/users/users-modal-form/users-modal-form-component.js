// =========================
// 	ModalUserFormComponent
// =========================
function setForm( data = null ) {
	
	// busca todos los nodos del formularios y les asigna el valor
	const nodesInput = userForm.querySelectorAll('input');
	const nodesSelect = userForm.querySelectorAll('select');

	nodesInput.forEach(( node ) => node.value = data ? data[ node.name ] : '' );
	nodesSelect.forEach(( node ) => node.value = data ? data[ node.name ] : '' );
}

function getForm( $event, userComponent = this ) {

	$event.preventDefault();
	
	let formData = new FormData( userForm );

	const data = {
		nombre: formData.get('nombre').trim(),
		apellido: formData.get('apellido').trim(),
		correo: formData.get('correo').trim(),
		area: formData.get('area').trim()
	}

	if ( idUser ) {
		userComponent.editUser( idUser, data );

	} else {
		userComponent.newUser( data );

	}

	return closeModal();
}


function openModal( method = 'new', id = null ) {

	if ( method === 'edit' ) {
		
		let found = USERS.find(( user ) => user.id === id );
		
		footer.querySelector('.modal-title').innerText = `Editar usuario ${ id }`;
		
		idUser = id;
		
		setForm( found );


	} else {

		footer.querySelector('.modal-title').innerText = 'Nuevo usuario';

		idUser = null;
		
		setForm();
	}
	

	return modalUsersForm.show();
}

function closeModal() {
	return modalUsersForm.hide();
}

const modalUsersForm = new Modal( footer.querySelector('.modal-users'), {
	backdrop: 'static'
});

let idUser = null;

module.exports = {
	openModal,
	closeModal,
	getForm
};
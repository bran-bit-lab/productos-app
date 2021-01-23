// =======================
// 		ModalUserComponent
// =======================

const modalUsers = new Modal( footer.querySelector('.modal-users'), {
	backdrop: 'static'
});

function setForm( data = null ) {
	
	// busca todos los nodos del formularios y les asigna el valor
	const nodesInput = userForm.querySelectorAll('input');
	const nodesSelect = userForm.querySelectorAll('select');

	nodesInput.forEach(( node ) => node.value = data ? data[ node.name ] : '' );
	nodesSelect.forEach(( node ) => node.value = data ? data[ node.name ] : '' );
}

function getForm( $event ) {
	
	$event.preventDefault();
	
	let formData = new FormData( userForm );

	const data = {
		nombre: formData.get('nombre').trim(),
		apellido: formData.get('apellido').trim(),
		correo: formData.get('correo').trim(),
		area: formData.get('area').trim()
	}

	console.log( data );

	return closeModal();
}


function openModal( method = 'new', id = null ) {

	if ( method === 'edit' ) {
		
		let found = USERS.find(( user ) => user.id === id );
		
		footer.querySelector('.modal-title').innerText = `Editar usuario ${ id }`;
		
		setForm( found );

	} else if ( method === 'new' ) {

		footer.querySelector('.modal-title').innerText = 'Nuevo usuario';

		setForm()
	}

	return modalUsers.show();
}

function closeModal() {
	return modalUsers.hide();
}

module.exports = { 
	setForm, 
	openModal, 
	closeModal,
	modalUsers,
	getForm 
};
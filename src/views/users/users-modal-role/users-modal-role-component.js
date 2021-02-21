// ==============================
// ModalChangeRoleUserComponent
// ==============================
function openModalRole( idUser = null ) {

	if ( !idUser ) {
		return;
	}

	id = idUser;

	const titleNode = footer.querySelector('#title-modal-role');

	titleNode.innerText = 'Cambiar de rol al usuario ' + idUser;

	setForm( USERS.find(( user ) => user.userid === idUser )  );

	return modalRole.show();
}

function setForm( user ) {

	const inputNodes = changeRoleForm.querySelectorAll('input');

	inputNodes.forEach(( inputNode ) => inputNode.checked = user.area === inputNode.value );
}

function getForm( $event, userComponent = this ) {

	$event.preventDefault();

	let data = new FormData( changeRoleForm );
	let selected = '';

	for ( const value of data.values() ) {
		selected = value;
	}

	userComponent.changeRole({ id, role: selected });

	return closeModalRole();
}

function closeModalRole() {

	return modalRole.hide();
}

let id = null;

const modalRole = new Modal( footer.querySelector('.modal-role'), { backdrop: 'static' });

module.exports = {
	openModalRole,
	getForm,
	closeModalRole
};

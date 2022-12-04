/**
 * modulo de componente del modal de rol
 * @module UsersModalRole
 */
/**
 * Abre el modal de usuarios del rol de usuario
 * @param  {number|null} idUser identificador del usuario
 */
function openModalRole( idUser = null ) {

	if ( !idUser ) {
		return;
	}

	id = idUser;

	const titleNode = footer.querySelector('#title-modal-role');

	titleNode.innerText = 'Cambiar de rol al usuario ' + idUser;

	setForm( usersTableComponent.users.find(( user ) => user.userid === idUser )  );

	modalRole.toggle();
}


/**
 * establece el formulario de rol
 * @param  {User} user instancia del usuario
 */
function setForm( user ) {

	const inputNodes = changeRoleForm.querySelectorAll('input');

	inputNodes.forEach(( inputNode ) => inputNode.checked = user.area === inputNode.value );
}


/**
 * Obtiene los datos del formulario del rol
 * @param  {*} $event  Evento de envio del formulario del rol
 * @param  {UsersComponent} userComponent instancia del padre
 */
function getForm( $event, userComponent = this ) {

	$event.preventDefault();

	let data = new FormData( changeRoleForm );
	let selected = '';

	for ( const value of data.values() ) {
		selected = value;
	}

	usersTableComponent.changeRole({ id, role: selected });

	closeModalRole();
}

/** Cierra el modal del rol */
function closeModalRole() {
	modalRole.toggle();
}


/** @type {null|number} */
let id = null;

/** @type {Modal} */
const modalRole = new Modal( footer.querySelector('.modal-role'), { backdrop: 'static' });

/** @type {HTMLFormElement} */
const changeRoleForm = document.forms['user-change-role-form'];
changeRoleForm.addEventListener('submit', getForm.bind( usersComponent ));

module.exports = {
	openModalRole,
	getForm,
	closeModalRole
};

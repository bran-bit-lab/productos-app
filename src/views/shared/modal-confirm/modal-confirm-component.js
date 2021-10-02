
/**
 * Modulo de modal de confirmacion
 * @module ModalConfirmComponent
 */

/**
 * abre el modal de confirmacion
 *
 * @param  {string} title  titulo del modal
 * @param  {string} element elemento html en formato string
 * @param  {type} id  identificador del componente
 */
function openModalConfirm( title = '', element = '', id = null ) {

	const titleNode = footer.querySelector('.modal-confirm-title');
	const messageNode = footer.querySelector('#modal-message');

	titleNode.innerText = title;
	messageNode.innerHTML = element;
	idComponent = id;

	modalConfirm.show();
}

/**
* @callback callbackSend
* @param {Object} confirm objeto de confirmacion
* @param {number} confirm.id  identificador de componente
* @param {boolean} confirm.boolean flag de confirmacion
*/
/**
 * closeModalConfirm - description
 *
 * @param  {boolean} confirm confirmacion del usuario
 * @param  {*} callback funcion pasado por el padre para ser ejecutada
 */
function closeModalConfirm( confirm = false, callback = this ) {

	callback({ id: idComponent, confirm });

	return modalConfirm.hide();
}

/** @type {?number} */
let idComponent = null

const modalConfirm = new Modal( footer.querySelector('.modal-users-confirm'), { backdrop: 'static' });

module.exports = {
	openModalConfirm,
	closeModalConfirm,
};

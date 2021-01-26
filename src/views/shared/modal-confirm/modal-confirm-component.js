// ==========================
//	modalConfirmComponent
// ==========================
function openModalConfirm( title = '', element = '', id = null ) {
	
	const titleNode = footer.querySelector('.modal-confirm-title');
	const messageNode = footer.querySelector('#modal-message');

	titleNode.innerText = title;
	messageNode.innerHTML = element;
	idComponent = id;

	return modalConfirm.show();
}

function closeModalConfirm( confirm = false, callback = this ) {
	
	callback({ id: idComponent, confirm });

	return modalConfirm.hide();
}

let idComponent = null

const modalConfirm = new Modal( footer.querySelector('.modal-users-confirm'), { backdrop: 'static' });

module.exports = {
	openModalConfirm,
	closeModalConfirm,
	modalConfirm
};
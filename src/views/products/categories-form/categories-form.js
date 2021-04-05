function openModalNewCategory() {
	
	footer.querySelector('.modal-title').textContent = 'Nueva categoría';

	modalFormCategory.show();
}


function handleImage( $event ) {
	
	const file = $event.files[0];
	const allowedTypes = ['image/png', 'image/jpg'];
	
	if ( !file ) {
		return;
	}

	if ( !allowedTypes.includes( file.types ) ) {
		console.log( 'formato de imagen jpg y png' );
	}
}

const modalFormCategory = new Modal( footer.querySelector('#category-form'), {
	backdrop: 'static'
});

module.exports = {
	openModalNewCategory,
	handleImage
};
// ============================
// CategoriesFormComponent
// ============================
function openModalNewCategory() {
	
	footer.querySelector('.modal-title').textContent = 'Nueva categoría';

	modalFormCategory.toggle();
}

function openImageDialog() {
	
	CategoriasController.openImageDialog( remote.getCurrentWindow(), ({ base64, size, path }) => {
		
		const maxSize = 1000000;  // 1MB de archivos

		hideElement( errorFile );

		if ( size > maxSize ) {
			
			errorFile.textContent = 'Máximo 1MB';

			return showElement( errorFile );
		}

		// se crea una nueva instancia de image
		const imgElement = (`<img src="data:image/png;base64,${ base64 }" alt="imagen" class="image-foto" />`);

		imageContainer.innerHTML = imgElement;

		hideElement( imageDefault );
		showElement( imageContainer );
	});
}


const modalFormCategory = new Modal( footer.querySelector('#category-form'), {
	backdrop: 'static'
});

const imageContainer = footer.querySelector('#image-container');
const imageDefault = footer.querySelector('#image-default');
const errorFile = footer.querySelector('#error-file');

hideElement( imageContainer );
hideElement( errorFile )

module.exports = {
	openModalNewCategory,
	openImageDialog
};
const { remote } = require('electron');
const { readFileAssets } = remote.require('./util_functions/file');
const { CategoriasController } = remote.require('./controllers/categorias_controller');

const productsElement = document.querySelector('#products');
const categoriesElement = document.querySelector('#category');
const footer = document.querySelector('#footer');

productsElement.innerHTML = readFileAssets( '/products/products-table/products-table-component.html' );
categoriesElement.innerHTML = readFileAssets( '/products/categories-table/categories-table-component.html' );
footer.innerHTML = readFileAssets('/products/categories-form/categories-form.html');

const Tab = require('bootstrap/js/dist/tab');
const Modal = require('bootstrap/js/dist/modal');

const ProductsTableComponent = require('./products-table/products-table-component');
const CategoryTableComponent = require('./categories-table/categories-table-component');
const { openModalNewCategory, openImageDialog, resetForm } = require('./categories-form/categories-form');


class ProductsComponent {

	constructor() {
		this.setHtml = this.setHtml.bind( this );
	}

	changeView( view = 'products' ) {

		const elementsCategory = document.querySelectorAll('.category');
		const elementsProducts = document.querySelectorAll('.products');

		switch ( view ) {

			case 'category': {  // cuando cambias realiza la consulta

				elementsCategory.forEach( ( elementHTML ) => showElement( elementHTML ) );
				elementsProducts.forEach( ( elementHTML ) => hideElement( elementHTML ) );

				// se hace la consulta antes de renderizar
				categoryTableComponent.getProducts();

				break;
			}

			default: { 

				elementsProducts.forEach( ( elementHTML ) => showElement( elementHTML ) );
				elementsCategory.forEach( ( elementHTML ) => hideElement( elementHTML ) );

				productsTableComponent.render();

				break;
			}
		}
	}

	setHtml( path ) {

		const tabList = [ ...document.querySelectorAll('#products_list button') ];

		tabList.forEach( this.setOptionsTabs.bind( this ) );

		this.changeView();
	}


	setOptionsTabs( elementTab ) {

		let tabTrigger = new Tab( elementTab );

		elementTab.addEventListener('click', ( $event ) => {

			let nameTab = elementTab.getAttribute('aria-name');

			tabTrigger.show();

			this.changeView( nameTab );

			$event.preventDefault();
		});
	}

}

const productsComponent = new ProductsComponent();
const productsTableComponent = new ProductsTableComponent();
const categoryTableComponent = new CategoryTableComponent();

document.addEventListener('DOMContentLoaded', productsComponent.setHtml );

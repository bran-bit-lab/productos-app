const { remote } = require('electron');
const { readFileAssets } = remote.require('./util_functions/file');
const Tab = require('bootstrap/js/dist/tab');

class ProductsComponent {

	constructor() {
		this.setHtml = this.setHtml.bind( this );
		this.setOptionsTabs = this.setOptionsTabs.bind( this );
	}

	changeView( view = 'products' ) {

		const elementsCategory = document.querySelectorAll('.category');
		const elementsProducts = document.querySelectorAll('.products');

		switch ( view ) {

			case 'category': {
				
				elementsCategory.forEach( ( elementHTML ) => showElement( elementHTML ) );
				elementsProducts.forEach( ( elementHTML ) => hideElement( elementHTML ) );

				break;
			}

			default: {
				
				elementsProducts.forEach( ( elementHTML ) => showElement( elementHTML ) );
				elementsCategory.forEach( ( elementHTML ) => hideElement( elementHTML ) );

				break;
			}
		}
	}

	setHtml( path ) {

		const tabList = new Array().slice.call( document.querySelectorAll('#products_list button') );
		
		let productsElement = document.querySelector('#products');
		let categoriesElement = document.querySelector('#category');
		

		productsElement.innerHTML = readFileAssets( 
			'/products/products-table/products-table-component.html' 
		);

		categoriesElement.innerHTML = readFileAssets( 
			'/products/categories-table/categories-table-component.html'
		);

		// events
		tabList.forEach( this.setOptionsTabs );

		this.changeView();
	}


	setOptionsTabs( elementTab ) {

		let tabTrigger = new Tab( elementTab );

		elementTab.addEventListener('click', ( $event ) => {

			let nameTab = elementTab.getAttribute('aria-name');

			// elementTab.className.toggle('active');

			tabTrigger.show();  // cambia el tab

			this.changeView( nameTab );
			
			$event.preventDefault();
		});
	}

}

const productsComponent = new ProductsComponent();

document.addEventListener('DOMContentLoaded', productsComponent.setHtml );


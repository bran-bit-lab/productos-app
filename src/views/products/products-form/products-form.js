// ============================
// ProductsFormComponent
// ============================
async function openModalNewProduct() {

  try {

    const categories = await ProductosController.listarCategorias();

    const modal = footer.querySelector('#products-form');

    modal.querySelector('.modal-title').textContent = 'Nuevo producto';

    editProductForm = false;

    setForm( null, categories );

    modalFormProducts.toggle();


  } catch ( error ) {

    console.error( error );
  }

}

async function openModalEditProduct( product ) {

  try {

    const categories = await ProductosController.listarCategorias();

    editProductForm = true;

    productId = product.productoid;

    const modal = footer.querySelector('#products-form');

    modal.querySelector('.modal-title').textContent = `Editar producto ${ product.productoid }`;

    console.log({ product, categories });

    setForm( product, categories );

    modalFormProducts.toggle();


  } catch ( error ) {

    console.error( error );
  }

}

function setForm( product, categories ) {

  const inputs = Array.from( productForm.querySelectorAll('input') );
  const select = productForm.querySelector('select');
  const textarea = productForm.querySelector('textarea');

  // se asignan los datos de la categoría
  select.innerHTML = (`
    <option value="">Seleccione</option>
    ${ categories.map(( category ) => (`
        <option value="${ category.categoriaid }">${ category.nombre }</option>
      `)).join('')
    }
  `);

  // pasará por la condicional si es nuevo
  if ( !product ) {
    return;
  }

  textarea.value = product.descripcion;
  select.value = product.categoriaid;

  inputs.forEach(( element ) => {

    switch ( element.name ) {

      case 'product-name': {
        element.value = product.nombre;
        break;
      }

      case 'product-quantity': {
        element.value = product.cantidad || 0;
        break;
      }

      case 'product-available': {
        element.checked = product.disponibilidad === 1 || product.disponibilidad === true;
        break;
      }

      case 'product-price': {
        element.value = product.precio || 0;
        break;
      }

      case 'product-description': {
        element.value = product.descripcion;
        break;
      }

      default: {
        element.value = '';
        break;
      }
    }
  });
}

function handleSubmit( $event ) {

  $event.preventDefault();

  const formData = new FormData( productForm );

  const data = {  // este es la info que se manda
    nombre: formData.get('product-name'),
    categoriaid: formData.get('product-category'),
    cantidad: formData.get('product-quantity'),
    precio: formData.get('product-price'),
    disponibilidad: formData.get('product-available') === 'on',
    descripcion: formData.get('product-description') || ''
  };

  // console.log( formData.get('product-available') );

  validateData( data, ( error, data ) => {

    if ( error ) {
      return;
    }

    if ( editProductForm ) {
      productsTableComponent.editProduct( data, productId );

    } else {
      productsTableComponent.createProduct( data );

    }

    modalFormProducts.toggle();
  });
}

function handleChangeQuantity( element ) {

  let number = Number.parseFloat( element.value );

  if ( number < 0 ) {
    number = 0;
  }

  if ( number > 1000 ) {
    number = 1000;
  }

  element.value = element.name === 'product-quantity' ? number.toString() :
    number.toFixed(2);
}

function validateData( productData, callback ) {

  const {
    nombre,
    cantidad,
    categoriaid,
    precio,
    disponibilidad,
    descripcion
  } = productData;

  const ERROR_MESSAGES = Object.freeze({
		required: 'campo requerido',
		email: 'correo inválido',
		min: ( min ) => 'mínimo ' + min + ' caracteres',
		max: ( max ) => 'máximo ' + max + ' caracteres',
		pattern: 'Patrón de datos inválido',
		notMatch: 'La contraseña no coincide',
    onlyNumbers: 'Solo números enteros',
    onlyNumbersWithDecimal: 'Solo números con 2 decimales'
	});

  const PATTERNS = Object.freeze({
		email: new RegExp( /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/ ),
		onlyLetters: new RegExp( /^[a-zA-Z\s]+$/ ),
    onlyNumbers: new RegExp( /^[0-9]{1,4}$/ ),
    onlyNumbersWithDecimal: new RegExp( /^[0-9]{1,4}(\.[0-9]{0,2})?$/ )
	});

  let errors = 0;

  // console.log( productData );

  if ( !PATTERNS.onlyLetters.test( nombre ) ) {
    errors += 1;
    renderErrors( errorProductName, ERROR_MESSAGES.pattern );
  }

  if ( nombre.trim().length === 0 ) {
    errors += 1;
    renderErrors( errorProductName, ERROR_MESSAGES.required );
  }

  if ( nombre.trim().length > 0 && nombre.trim().length < 2 ) {
    errors += 1;
    renderErrors( errorProductName, ERROR_MESSAGES.min(3) );
  }

  if ( categoriaid.trim().length === 0 ) {
    errors += 1;
    renderErrors( errorProductCategory, ERROR_MESSAGES.required );
  }

  if ( descripcion.trim().length > 600 ) {
    errors += 1;
    renderErrors( errorProductDescription, ERROR_MESSAGES.max(600) );
  }

  if ( !PATTERNS.onlyNumbers.test( cantidad ) ) {
    errors += 1;
    renderErrors( errorProductQuantity, ERROR_MESSAGES.onlyNumbers );
  }

  if ( cantidad.trim().length === 0 ) {
    errors += 1;
    renderErrors( errorProductQuantity, ERROR_MESSAGES.required );
  }


  if ( !PATTERNS.onlyNumbersWithDecimal.test( precio ) ) {
    errors += 1;
    renderErrors( errorProductPrice, ERROR_MESSAGES.onlyNumbersWithDecimal );
  }

  if ( precio.trim().length === 0 ) {
    errors += 1;
    renderErrors( errorProductPrice, ERROR_MESSAGES.required );
  }

  // se chequean los errores
  if ( errors > 0 ) {
    return callback( true, null );
  }

  // se parsea los datos de las cantidades a numeros
  productData.cantidad = Number.parseFloat( productData.cantidad );
  productData.precio = Number.parseFloat( productData.precio );

  callback( false, productData );
}

function resetFormProducts( button = false ) {

  hideElement( errorProductName );
	hideElement( errorProductDescription );
  hideElement( errorProductCategory );
  hideElement( errorProductQuantity );
  hideElement( errorProductPrice );

	if ( button ) {
		productForm.reset();
	}
}

const modalFormProducts = new Modal( footer.querySelector('#products-form'), {
  backdrop: 'static'
});

const productForm = document.forms['products-form'];

// errors
const errorProductName = footer.querySelector('#error-product-name');
const errorProductQuantity = footer.querySelector('#error-product-quantity');
const errorProductPrice = footer.querySelector('#error-product-price');
const errorProductDescription = footer.querySelector('#error-product-description');
const errorProductCategory = footer.querySelector('#error-product-category');

let editProductForm = false;
let productId = null;

productForm.addEventListener( 'submit', handleSubmit );

footer.querySelector('#products-form').addEventListener('hidden.bs.modal', () => resetFormProducts( true ));

module.exports = {
  openModalNewProduct,
  openModalEditProduct,
  resetFormProducts,
  handleChangeQuantity
};

// ============================
// PorductsFormComponent
// ============================
function openModalNewProduct( title = 'Nuevo producto', edit = false ) {

  const modal = footer.querySelector('#products-form');

  modal.querySelector('.modal-title').textContent = title;

  modalFormProducts.toggle();
}

function openModalEditProduct() {
  console.log('modal edit-product');
}

function handleSubmit( $event ) {

  const formData = new FormData( productForm );

  const data = {
    nombre: formData.get('product-name'),
    categoria_id: formData.get('product-category'),
    cantidad: Number( formData.get('product-quantity') ),
    precioUnitario: Number( formData.get('product-price') ),
    disponibilidad: formData.get('product-available') === 'on'
  };

  console.log( data );

  modalFormProducts.toggle();

  $event.preventDefault();
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

function validateData() {

}

function renderErrors() {

}

function resetForm() {

}

const modalFormProducts = new Modal( footer.querySelector('#products-form'), {
  backdrop: 'static'
});

const productForm = document.forms['products-form'];

productForm.addEventListener('submit', handleSubmit);

module.exports = {
  openModalNewProduct,
  openModalEditProduct,
  resetForm,
  handleChangeQuantity
};

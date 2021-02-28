// ====================================
// PaginationComponent
// ====================================
function renderPagination( index, pagination = 10 ) {
}

function changePagination( element, index, limit = 3 ) {

  const items = [
    ...document.querySelector('.pagination').querySelectorAll('li')
  ];

  items.forEach(( item ) => {
    if ( item.classList.contains('active') ) {
      item.classList.toggle('active');
    }
  });

  element.classList.toggle('active');

  renderPagination( index );
}

module.exports = {
  renderPagination,
  changePagination
};

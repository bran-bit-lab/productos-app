// ====================================
// PaginationComponent
// ====================================
function renderPagination( index, pagination = 10 ) {

  let indexPagination = pagination * index;

  this.currentPage = index
  this.getAll( null, [ indexPagination, pagination ] );
}


function setButtonsPagination( numbersPages = 1 ) {

  const listado = this.pagination.querySelector('.pagination');

  let html = '';

  html += (`
    <li class="page-item">
      <a
        class="page-link"
        aria-label="Previous"
        onclick="changePagination( ${ this.currentPage - 1 }, ${ numbersPages } )"
      >
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
 `);


 html += (`
    <li
      class="page-item active"
      onclick="changePagination( ${ this.currentPage }, ${ numbersPages } )"
    >
      <a class="page-link">${ this.currentPage + 1 }</a>
    </li>
 `);


  html += (`
    <li class="page-item">
      <a
        class="page-link"
        aria-label="Next"
        onclick="changePagination( ${ this.currentPage + 1 }, ${ numbersPages } )"
      >
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `);

  listado.innerHTML = html;

  // console.log( listado );
}

function changePagination( index = 0, totalPages = 1 ) {

  if ( index < 0 || index >= totalPages ) {
    return;
  }

  renderPagination.call( this, index );
}

module.exports = {
  renderPagination,
  changePagination,
  setButtonsPagination
};

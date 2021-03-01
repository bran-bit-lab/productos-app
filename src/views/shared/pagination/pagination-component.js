// ====================================
// PaginationComponent
// ====================================
function renderPagination( index, pagination = 10 ) {
  
  const getAllUsers = this;

  let indexPagination = pagination * index;

  currentPage = index;

  getAllUsers( null, [ indexPagination, pagination ] );
}


function setButtonsPagination( numbersPages = 1 ) {

  const listado = document.querySelector('.pagination');

  let html = (`
    <li class="page-item">
      <a 
        class="page-link" 
        aria-label="Previous" 
        onclick="PaginationComponent.changePagination( ${ currentPage - 1 }, ${ numbersPages } )"
      >
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
 `);

  for ( let i = 0; i < numbersPages; i++ ) {
  
    html += (`
      <li 
        class="page-item ${ i === currentPage ? 'active' : '' }" 
        onclick="PaginationComponent.changePagination( ${ i }, ${ numbersPages } )"
      >
        <a class="page-link">${ i + 1 }</a>
      </li>
    `);
  }
    
  html += (`
    <li class="page-item">
      <a 
        class="page-link" 
        aria-label="Next"
        onclick="PaginationComponent.changePagination( ${ currentPage + 1 }, ${ numbersPages } )"
      >
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `);

  listado.innerHTML = html;
}

function changePagination( index = 0, totalPages = 1 ) {

  if ( index === currentPage ) {
    return;
  }

  if ( index < 0 || index > totalPages ) {
    return;
  }

  renderPagination.call( usersComponent.getAllUsers, index );
}

let currentPage = 0;  // pagina actual

module.exports = {
  renderPagination,
  changePagination,
  setButtonsPagination
};

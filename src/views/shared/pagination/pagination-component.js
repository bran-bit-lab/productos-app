// ====================================
// PaginationComponent
// ====================================
function renderPagination( index, pagination = 10 ) {
  const getAllUsers = this;

  let indexPagination = pagination * index;

  getAllUsers( null, [ indexPagination, pagination ] );
}


function setButtons( numberPage = 1 ) {

  const listado = document.querySelector('.pagination');

  let html = (`
    <li class="page-item">
      <a class="page-link" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
 `);

  for ( let i = 0; i < numberPage; i++ ) {
    
    html += (`
      <li class="page-item" onclick="PaginationComponent.changePagination( this, ${ i } )">
        <a class="page-link">${ i + 1 }</a>
      </li>
    `);
  }

  html += (`
    <li class="page-item">
      <a class="page-link" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `);

  listado.innerHTML = html;
}

function changePagination( element, index ) {

  const items = [
    ...document.querySelector('.pagination').querySelectorAll('li')
  ];




  items.forEach(( item ) => {
    
    console.log( item.classList.contains('active') );
    if ( item.classList.contains('active') ) {
      item.classList.toggle('active');
       console.log( 'activo' );
    }
  });



  element.classList.toggle('active');

  renderPagination.call( usersComponent.getAllUsers, index  );
}

module.exports = {
  renderPagination,
  changePagination,
  setButtons
};

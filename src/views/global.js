// ocultar y mostrar elementos
function hideElement( element ) {

  if ( element.classList.contains('show') ) {
    return element.classList.replace('show', 'hide');
  }

  return element.classList.add('hide');
}

function showElement( element ) {

  if ( element.classList.contains('hide') ) {
    return element.classList.replace('hide', 'show');
  }

  return element.classList.add('show');
}

function redirectTo( path ) {
  return location.href = path;
}

function getUserLogged() {
	return JSON.parse( sessionStorage.getItem('userLogged') );
}

function setUserLogged( user ) {
  return sessionStorage.setItem('userLogged', JSON.stringify( user ));
}

function getPaginationStorage( key ) {

  /*
  *  @params: key -> string
  *  @return array: number[];
  *
  */

  if ( !sessionStorage.getItem( key ) ) {
    return [0, 10];
  }

  return JSON.parse( sessionStorage.getItem( key )).pagination;
}

function setPaginationStorage( key, value ) {
  sessionStorage.setItem( key, JSON.stringify( value ) );
}

function renderErrors( element, message ) {

  let html = (`<small class="text-danger">${ message }</small>`);

  element.innerHTML = html;

  showElement( element );
}

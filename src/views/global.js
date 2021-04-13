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

function getPaginationStorage( key ) {
  return JSON.parse( sessionStorage.getItem( key )).pagination || [0, 10];
}

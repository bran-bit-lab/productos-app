/**
 * permite ocultar elementos del DOM
 * @param  {HTMLElement} element elemento html a ocultar
 */
function hideElement( element ) {

  if ( element.classList.contains('show') ) {
    return element.classList.replace('show', 'hide');
  }

  return element.classList.add('hide');
}

/**
 * permite mostrar elementos del DOM
 * @param  {HTMLElement} element elemento html a mostrar
 */
function showElement( element ) {

  if ( element.classList.contains('hide') ) {
    return element.classList.replace('hide', 'show');
  }

  return element.classList.add('show');
}

/**
 * permite redireccionar a una url solicitada
 * @param  {string} path url a solcitar el recurso
 */
function redirectTo( path ) {
  return location.href = path;
}

/** Obtiene la instancia del usuario logueado */
function getUserLogged() {
	return JSON.parse( sessionStorage.getItem('userLogged') );
}

/**
 * establece el usuario logueado de la applicacion
 * @param  {User} user instancia del usuario
 */
function setUserLogged( user ) {
  sessionStorage.setItem('userLogged', JSON.stringify( user ));
}

/**
* Permite obtener el arreglo de elementos paginados
*  @param {string} key propiedad de donde extraer la paginacion
*  @returns {Array<number>}
*  @example
*  let pagination = getPaginationStorage('usersTable');
*/
function getPaginationStorage( key ) {


  if ( !sessionStorage.getItem( key ) ) {
    return [0, 10];
  }

  return JSON.parse( sessionStorage.getItem( key )).pagination;
}

/**
 * establece una nueva paginacion
 *
 * @param  {string} key propiedad de donde sustituir por el nuevo valor
 * @param  {Array<number>} value nuevo valor de paginacion
 */
function setPaginationStorage( key, value ) {
  sessionStorage.setItem( key, JSON.stringify( value ) );
}

/**
 * renderiza los errores en los formularios
 *
 * @param  {HTMLElement} element elemento html
 * @param  {string} message  mensaje al usuario
 */
function renderErrors( element, message ) {

  let html = (`<small class="text-danger">${ message }</small>`);

  element.innerHTML = html;

  showElement( element );
}


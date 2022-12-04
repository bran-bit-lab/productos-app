/**
* Libreria de procesamiento de cadena de texto
* @module string
*/
/**
* Funcion que permite dividir texto segun la altura especificada
* @param {string} text cadena de texto
* @param {number} start incio del texto
* @param {number} limit finalizacion del texto
* @returns {string} devuelve una nueva cadena con los limites especificados
* @example
* // devuelve 15 caracteres
* let message = sliceString( 'prueba de desarrollo en documentación', 0, 14 ); 
*/
function sliceString( text = '', start = 0, limit = 10 ) {

  if ( text.length > limit ) {
    return text.slice( start, limit ) + '...';
  }

  return text;
}

module.exports = {
  sliceString
};

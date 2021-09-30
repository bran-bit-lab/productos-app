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

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


const PATTERNS = Object.freeze({
    email: /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/,
    onlyLetters: /^[a-zA-Z\u00f1\u00d1\u00E0-\u00FC\u00C0-\u017F\s]+$/,
    onlyNumbers: /^[0-9]{1,4}$/,
    onlyNumbersWithDecimal: /^[0-9]{1,4}(\.[0-9]{0,2})?$/,
    lettersAndNumbers: /^[0-9A-Za-z\s]{1,30}$/,
    dateString: /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.]|(0[1-9]|[12][0-9]|3[01])$/
  });

module.exports = {
  sliceString,
  PATTERNS
};

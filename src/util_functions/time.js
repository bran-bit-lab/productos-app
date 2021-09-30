/**
* Modulo de gestion de horas y fechas
* @module time
*/

/**
* Parsea un objeto Date a un string
* @param {Date} date objeto de la fecha si no se espcifica toma el dia de hoy
* @returns {string}  retorna la fecha parseada en YYYY-MM-DD
*/
function dateToString( date = new Date() ) {
  return `${ date.getFullYear() }-${ date.getMonth() > 9 ? date.getMonth() + 1 : '0' + ( date.getMonth() + 1 ) }-${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }`;
}

/**
* Parsea un objeto Date a un string en español
* @param {Date} date objeto de la fecha si no se espcifica toma el dia de hoy
* @returns {string}  retorna la fecha parseada en DD-MM-YYYY
*/
function dateSpanish( date = new Date() ) {
	return `${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }-${ date.getMonth() > 9 ? date.getMonth() + 1 : '0' + ( date.getMonth() + 1 ) }-${ date.getFullYear() }`;
}

/**
* Genera un timestamp con los datos una hora y fecha especigicada
* @param {Date} date objeto de la fecha si no se espcifica toma el dia de hoy
* @returns {string}  retorna la fecha parseada en DD-MM-YYYY HH:mm:ss
*/
function showLog( date = new Date() ) {

    /** @type {string} */
		let dateString = dateToString( date );

    /** @type {number} */
    let hour = date.getHours();

    /** @type {number} */
		let minutes = date.getMinutes();

    /** @type {number} */
		let seconds = date.getSeconds();

		return dateString + ' ' + hour + ':' + minutes + ':' + seconds;
}

module.exports = {
  dateToString,
  showLog,
  dateSpanish
}

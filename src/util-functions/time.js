/**
* Modulo de gestion de horas y fechas
* @module time
*/

/**
* Parsea un objeto Date a un string (Nota el mes llega del 0 al 11 debes sumar uno al mes para concatenarlo)
* @param {Date} [date] objeto de la fecha si no se espcifica toma el dia de hoy
* @returns {string}  retorna la fecha parseada en YYYY-MM-DD
*
* @example
* let date = dateToString(); // 2021-10-01
*
*/
function dateToString( date = new Date() ) {

  let month = date.getMonth() + 1;

  return `${ date.getFullYear() }-${ month > 9 ? month : ( '0' + month ) }-${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }`;
}

/**
* Parsea un objeto Date a un string en español
* @param {Date} [date] objeto de la fecha si no se espcifica toma el dia de hoy
* @returns {string}  retorna la fecha parseada en DD-MM-YYYY
* @example
* let date = dateSpanish(); // 01-10-2021
*/
function dateSpanish( date = new Date() ) {

	let month = date.getMonth() + 1;

	return `${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }-${ month > 9 ? month : ( '0' + month ) }-${ date.getFullYear() }`;
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
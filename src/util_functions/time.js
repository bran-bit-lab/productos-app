function dateToString( date = new Date() ) {
  return `${ date.getFullYear() }-${ date.getMonth() > 9 ? date.getMonth() + 1 : '0' + ( date.getMonth() + 1 ) }-${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }`;
}

function dateSpanish( date = new Date() ) {
	return `${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }-${ date.getMonth() > 9 ? date.getMonth() + 1 : '0' + ( date.getMonth() + 1 ) }-${ date.getFullYear() }`;
}

function showLog( date = new Date() ) {
		
		let dateString = dateToString( date );
		let hour = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
		
		return dateString + ' ' + hour + ':' + minutes + ':' + seconds;
}

module.exports = {
  dateToString,
  showLog,
  dateSpanish
}

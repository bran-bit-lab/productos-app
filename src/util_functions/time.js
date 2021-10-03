function dateToString( date = new Date() ) {
	
  let month = date.getMonth() + 1;

  return `${ date.getFullYear() }-${ month > 9 ? month : '0' + ( month ) }-${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }`;
}

function dateSpanish( date = new Date() ) {

	let month = date.getMonth() + 1;

	return `${ date.getDate() > 9 ? date.getDate() : '0' + ( date.getDate() ) }-${ month > 9 ? month : '0' + ( month ) }-${ date.getFullYear() }`;
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

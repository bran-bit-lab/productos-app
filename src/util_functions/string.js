function sliceString( text = '', start = 0, limit = 10 ) {

  if ( text.length > limit ) {
    return text.slice( start, limit ) + '...';
  }

  return text;
}

module.exports = {
  sliceString
};

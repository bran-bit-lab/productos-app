const ENV = Object.freeze({
  PATH_DOCUMENTS: __dirname + '/user-interfaces/documents',
  PATH_VIEWS: __dirname + '/frontend/',
  PATH_INI: __dirname ,
  PATH_PICTURES: __dirname + '/imagenes/',
  DEV: false,  // production flag
});

module.exports = {
  ENV
}

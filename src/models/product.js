/**
* Modelo de productos y validaciones
* @module product
*/

/**
 * Product
 * @typedef {Object} Product
 * @property {number} [productoid] identificador de producto
 * @property {number} userid identificador de usuario
 * @property {number} categoriaid identificador de categoria
 * @property {string} nombre nombre del producto
 * @property {string} descripcion descripcion de producto
 * @property {number} precio precio del producto
 * @property {number} cantidad cantidad de productos
 * @property {boolean} disponibilidad disponibilidad de producto
 */

/** @type {Product} */
const PRODUCT_MODEL = Object.freeze({
    userid: 0,
    categoriaid: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    disponibilidad: false,
});

/**
 * Valida la importacion de productos antes de mandar a base de datos
 * @param {Product} product Producto a validar
 * @returns {boolean}
 */
function validate( product ) {
  
    const PATTERNS = Object.freeze({
		email: /^[a-z0-9]+@[a-z]{4,}\.[a-z]{3,}$/,
		onlyLetters: /^[a-zA-Z\u00f1\u00d1\u00E0-\u00FC\u00C0-\u017F\s]+$/,
        onlyNumbers: /^[0-9]{1,4}$/,
        onlyNumbersWithDecimal: /^[0-9]{1,4}(\.[0-9]{0,2})?$/,
	});


    // validamos las propiedades
    let key = Array.from( Object.keys( PRODUCT_MODEL ) )
        .every( key => product.hasOwnProperty( key ) );


    // revisamos cada campo
    // si hay propiedades añadidas o retiradas dentro del producto
    // lo rechaza
    
    if ( !key ) {
        return false;
    }

    if ( !Number.isInteger( product.userid ) ) {
        return false;
    }


    if ( !Number.isInteger( product.categoriaid ) ) {
        return false;
    }

    if ( !Number.isInteger( product.cantidad ) ) {
        return false;
    }

    if ( typeof product.precio !== 'number' ) {
        return false;
    }


    if ( !PATTERNS.onlyLetters.test( product.nombre ) ) {
        return false; 
    }

    if ( !PATTERNS.onlyLetters.test( product.descripcion ) ) {
        return false; 
    }

    // verificamos que la disponibilidad es un booleano
    if ( ( product.disponibilidad < 0 ) || ( product.disponibilidad > 1 ) ) {
        return false;
    }

    return true;
}

module.exports = {
    validate
};
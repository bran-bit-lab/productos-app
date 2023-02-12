/**
* Modelo de productos y validaciones
* @module ProductModel
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

const { PATTERNS } = require('../util-functions/string');

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
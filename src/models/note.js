/**
* Modelo de productos y validaciones
* @module NoteModel
*/

/**
 * Note
 * @typedef {Object} Note
 * @property {number} [id_nota] identificador de la nota
 * @property {string} descripcion descripcion de la nota
 * @property {string} creacion fecha de creacion de la nota
 * @property {string} creado_por usuario que crea la nota
 * @property {string} nombre_cliente cliente de la nota
 * @property {'EN_PROGRESO'|'ENTREGADA'|'ACEPTADO'|'CANCELADA'|'POSPUESTO'} status estado de entrega
*/
const { PATTERNS } = require('../util-functions/string');

/** @type Note */
const NOTE_MODEL = Object.freeze({
    id_nota: 0,
    descripcion: '',
    creacion: '',
    creado_por: '',
    nombre_cliente: '',
    status: 'ACEPTADO'
});

/**
 * valida si el contenido de la nota es correcto
 * @param {Note} note nota a validar
 * @returns {boolean} 
 */
function validate( note ) {

    // validamos las propiedades
    let key = Array.from( Object.keys( NOTE_MODEL ) )
        .every( key => note.hasOwnProperty( key ) );

    // si hay propiedades añadidas o retiradas dentro del producto
    // lo rechaza
    if ( !key ) {
        return false;
    }

    // revisamos cada campo
    if ( !Number.isInteger( note.id_nota ) ) {
        return false;
    }

    if ( !PATTERNS.lettersAndNumbers.test( note.creacion ) ) {
        return false;
    }

    if ( !PATTERNS.onlyLetters.test( note.nombre_cliente ) ) {
        return false;
    }

    if ( !PATTERNS.onlyLetters.test( note.creado_por ) ) {
        return false; 
    }

    if ( !PATTERNS.lettersAndNumbers.test( note.descripcion ) ) {
        return false; 
    }

    // evaluamos la nota con un switch debido a que las opciones son 
    // controladas
    switch ( note.status ) {

        case 'ACEPTADO':
            break;

        case 'CANCELADA':
            break;
        
        case 'ENTREGADA':
            break;
        
        case 'EN_PROGRESO':
            break;
        
        case 'POSPUESTO':
            break;
        
        default:
            return false;
    }

    // si pasa las validaciones retorna true
    return true;
}

module.exports = { validate };
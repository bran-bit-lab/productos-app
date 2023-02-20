/**
* Modelo de productos y validaciones
* @module NoteModel
*/

/**
 * Note
 * @typedef {Object} Note
 * @property {number} id_nota identificador de la nota
 * @property {string} descripcion_nota descripcion de la nota
 * @property {string} creacion timestamp de creacion de la nota
 * @property {string} fecha_entrega fecha de entrega de la nota
 * @property {number} id_cliente identificador del cliente de la nota
 * @property {number} userid identificador del usuario que crea la nota
 * @property {'EN_PROCESO'|'ENTREGADA'|'ACEPTADO'|'CANCELADA'|'POSPUESTO'} status estado de entrega
*/
const { PATTERNS } = require('../util-functions/string');

/** @type Note */
const NOTE_MODEL = Object.freeze({
    // id_nota: 0,
    descripcion_nota: '',
    fecha_entrega: '',
    userid: 0,
    id_cliente: 0,
    status: 'ACEPTADO'
});

/**
 * valida si el contenido de la nota es correcto
 * @param {Note} note nota a validar
 * @returns {boolean} 
 */
function validate( note ) {
    
    console.log( note );

    // validamos las propiedades
    let key = Array.from( Object.keys( NOTE_MODEL ) )
        .every( key => note.hasOwnProperty( key ) );
    

    /* 
        log de comprobacion de regex usar si alguna muestra falla
        
        console.log({
            key: key,
            id_nota: Number.isInteger( note.id_nota ),
            id_cliente: Number.isInteger( note.id_cliente ),
            userid: Number.isInteger( note.userid ),
            descripcion_nota: PATTERNS.lettersAndNumbers.test( note.descripcion_nota )
        });

     */

    // si hay propiedades añadidas o retiradas dentro del producto
    // lo rechaza
    if ( !key ) {
        return false;
    }

    // revisamos cada campo
    if ( !Number.isInteger( note.id_cliente ) ) {
        return false;
    }

    if ( !Number.isInteger( note.userid ) ) {
        return false;
    }

    if ( !PATTERNS.lettersAndNumbers.test( note.descripcion_nota ) ) {
        return false; 
    }

    switch ( note.status ) {
        case 'ACEPTADO':
            break;
        
        case 'CANCELADA':
            break;
        
        case 'ENTREGADA':
            break;
        
        case 'EN_PROCESO':
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
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const TIME = require('../util_functions/time');

class PdfController {

	async createPdf( nota ) {

		console.log( 'nota --> ', nota );

		const pdfDoc = await PDFDocument.create();
		const helveticaFont = await pdfDoc.embedFont( StandardFonts.Helvetica );
		const helveticaBoldFont =  await pdfDoc.embedFont( StandardFonts.HelveticaBold );
		const page = pdfDoc.addPage();
		const { width, height } = page.getSize();

		const fontSize = 20

		// datos hoja carta
		// altura = 841.89 y ancho = 595.28

		page.drawText('Productos-app', {
		  x: 50,
		  y: height - 2 * fontSize,
		  size: 24,
		  font: helveticaFont,
		  color: rgb(0, 0, 0),
		});

		page.drawText('# ' + nota.id_nota, {
		  x: width - 4 * fontSize,
		  y: height - 2 * fontSize,
		  size: 14,
		  font: helveticaBoldFont,
		  color: rgb( 0, 0.8, 0.8 ),
		});

		page.drawText('Fecha de creación: ' + TIME.dateSpanish( new Date(nota.creacion)), {
		  x: 50,
		  y: height - 2 * 40,
		  size: 14,
		  font: helveticaBoldFont,
		  color: rgb( 0, 0, 0 ),
		});

		page.drawText('Estado: ' + nota.status, {
		  x: width - 10 * fontSize,
		  y: height - 2 * 40,
		  size: 14,
		  font: helveticaFont,
		  color: rgb( 0, 0, 0 ),
		});

		page.drawText('Datos del Cliente: ', {
		  x: 50,
		  y: height - 6 * fontSize,
		  size: 14,
		  font: helveticaBoldFont,
		  color: rgb( 0, 0, 0 ),
		});

		page.drawText([
    		`Nombre del cliente: ${nota.nombre_cliente}`,
	      `RIF: ${nota.rif}`,
	      `Telefono: ${nota.telefono_contacto}`,
	      `Direccion de Entrega: ${nota.direccion_entrega}`,
	      `Descripción: ${nota.descripcion_nota}`,
	      `Fecha de Entrega: ${nota.fecha_entrega ? nota.fecha_entrega : 'No entregado'}`,
		  ].join('\n'), {
			  x: 50,
			  y: height - 8 * fontSize,
			  size: 14,
			  font: helveticaFont,
			  color: rgb( 0, 0, 0 ),
		});

		page.drawText('Lista de productos: ', {
		  x: 50,
		  y: height - 16 * fontSize,
		  size: 14,
		  font: helveticaBoldFont,
		  color: rgb( 0, 0, 0 ),
		});

		if (nota['productos'].length > 0){

			let posicion = 18; //posicion donde se comienza a agregar el producto

			nota.productos.forEach( ( producto ) => {
				page.drawText([
	      		`• id:   ${producto.productoid}`,
			      `nombre:   ${producto.nombre.length > 15 ? producto.nombre + ' ...' : producto.nombre}`,
			      `cantidad:   ${producto.cantidad_seleccionada}`,
			      `precio unitario:  ${producto.precio}$`,
			    ].join('\t\t'), {
				  	x: 50,
				  	y: height - posicion * fontSize,
				  	size: 12,
				  	font: helveticaFont,
				  	color: rgb( 0, 0, 0 ),
				});

				posicion++;
			});

			page.drawRectangle({
			  x: width - 10 * fontSize,
			  y: 20,
			  width: 120,
			  height: 70,
			  borderWidth: 2,
			  color: rgb(1, 1, 1),
			  opacity: 0.5,
			  borderOpacity: 0.75,
			});

		} else {

			page.drawText('No hay productos seleccionados ', {
			  x: 50,
			  y: height - 18 * fontSize,
			  size: 14,
			  font: helveticaBoldFont,
			  color: rgb( 1, 0, 0 ),
			});
		}

		const pdfBytes = await pdfDoc.save();

		return pdfBytes;
	}
}

module.exports = { PdfController };

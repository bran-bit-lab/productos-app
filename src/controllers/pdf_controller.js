const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const TIME = require('../util_functions/time');

/** clase que permite generar los documentos de salida */
class PdfController {

	/**
	 * genera el pdf de una nota de entrega
	 *
	 * @param  {Nota} nota instancia de la nota
	 * @return {ArrayBuffer}  retorna el buffer de datos del archivo PDF
	 */
	async createPdf( nota ) {

		// console.log( 'nota --> ', nota );

		const pdfDoc = await PDFDocument.create();
		const helveticaFont = await pdfDoc.embedFont( StandardFonts.Helvetica );
		const helveticaBoldFont =  await pdfDoc.embedFont( StandardFonts.HelveticaBold );
		const page = pdfDoc.addPage();
		const { width, height } = page.getSize();

		const fontSize = 20;

		console.log( 'paginas ' + pdfDoc.getPageCount() );

		// datos hoja carta
		// altura = 841.89 y ancho = 595.28

		page.drawText('Productos-app', {
		  x: 50,
		  y: height - 4 * fontSize,
		  size: 24,
		  font: helveticaFont,
		  color: rgb(0, 0, 0),
		});

		page.drawText('# ' + nota.id_nota, {
		  x: width - 4 * fontSize,
		  y: height - 4 * fontSize,
		  size: 14,
		  font: helveticaBoldFont,
		  color: rgb( 0, 0.8, 0.8 ),
		});

		page.drawText('Fecha de creación: ' + TIME.dateSpanish( new Date(nota.creacion)), {
		  x: 50,
		  y: height - 6 * fontSize,
		  size: 14,
		  font: helveticaBoldFont,
		  color: rgb( 0, 0, 0 ),
		});

		page.drawText('Estado: ' + nota.status, {
		  x: width - 10 * fontSize,
		  y: height - 6 * fontSize,
		  size: 14,
		  font: helveticaFont,
		  color: rgb( 0, 0, 0 ),
		});

		page.drawText('Datos del Cliente: ', {
		  x: 50,
		  y: height - 8 * fontSize,
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
			  y: height - 10 * fontSize,
			  size: 14,
			  font: helveticaFont,
			  color: rgb( 0, 0, 0 ),
		});

		page.drawText('Lista de productos: ', {
		  x: 50,
		  y: height - 18 * fontSize,
		  size: 14,
		  font: helveticaBoldFont,
		  color: rgb( 0, 0, 0 ),
		});

		if ( nota.productos.length > 0 ) {

			/*
				console.log ({
					page: width,
					width_cell: width / 4,
					cell_center: width / 8
				});
			*/

			// posicion donde se comienza a agregar el producto
			let posicion = 20;
			let arrayHeader = ['id:', 'nombre:', 'cantidad:', 'precio unitario:'];

			let posicionCell = ( width / ( arrayHeader.length * 2 ) );

			arrayHeader.forEach(( title ) => {

				page.drawText( title, {
					x: posicionCell,
				  	y: height - posicion * fontSize,
				  	size: 12,
				  	font: helveticaBoldFont,
				  	color: rgb( 0, 0, 0 ),
				});

				posicionCell = posicionCell + ( width / 5 );
			});

			posicion++;

			/*  dibujar linea  */

			page.drawLine({
			  start: { x: 50, y: height - posicion * fontSize },
			  end: { x: width - ( 3 * fontSize ) , y: height - posicion * fontSize },
			  thickness: 1,
			  color: rgb(0, 0, 0),
			  opacity: 0.8,
			});

			posicion++;

			nota.productos.forEach(( producto ) => {

				posicionCell = ( width / ( arrayHeader.length * 2 ) );

				page.drawText( producto.productoid.toString(), {
					x: posicionCell,
				  	y: height - posicion * fontSize,
				  	size: 12,
				  	font: helveticaFont,
				  	color: rgb( 0, 0, 0 ),
				});

				posicionCell = posicionCell + ( width / 5 );

				page.drawText(
					producto.nombre.length > 10 ? producto.nombre.slice( 0, 9 ) + '... ' : producto.nombre,
					{
						x: posicionCell,
				  		y: height - posicion * fontSize,
				  		size: 12,
				  		font: helveticaFont,
				  		color: rgb( 0, 0, 0 ),
					});

				posicionCell = posicionCell + ( width / 5 );

				page.drawText(
					producto.cantidad_seleccionada.toString(),
					{
						x: posicionCell,
				  		y: height - posicion * fontSize,
				  		size: 12,
				  		font: helveticaFont,
				  		color: rgb( 0, 0, 0 ),
					});

				posicionCell = posicionCell + ( width / 5 );

				page.drawText( producto.precio.toString() + "$", {
						x: posicionCell,
			  		y: height - posicion * fontSize,
			  		size: 12,
			  		font: helveticaFont,
			  		color: rgb( 0, 0, 0 ),
				});

				posicionCell = posicionCell + ( width / 5 );

				posicion++;
			});

			page.drawLine({
			  start: { x: 50, y: height - posicion * fontSize },
			  end: { x: width - ( 3 * fontSize ) , y: height - posicion * fontSize },
			  thickness: 1,
			  color: rgb(0, 0, 0),
			  opacity: 0.8,
			});

			posicion++;

			page.drawText("Total de la orden: " + nota.total_order.toString() + "$", {
				x: width - 10 * fontSize,
		  	y: height - posicion * fontSize,
		  	size: 12,
		  	font: helveticaBoldFont,
		  	color: rgb( 0, 0, 0 ),
			});

			if ( nota.status === "ENTREGADA" ) {

				page.drawText("Gracias por su compra!!", {
					x: ( width / 2.9 ),
			  	y: height - ( 5 + posicion ) * fontSize,
			  	size: 20,
			  	font: helveticaBoldFont,
			  	color: rgb( 0, 0, 0 ),
				});
			}

		} else {

			page.drawText('No hay productos seleccionados ', {
			  x: 50,
			  y: height - 20 * fontSize,
			  size: 14,
			  font: helveticaBoldFont,
			  color: rgb( 1, 0, 0 ),
			});
		}

		// indice de pagina parte inferior
		page.drawText('Pagina ' + ( pdfDoc.getPageIndices()[0] + 1 ) + ' de ' + pdfDoc.getPageCount(),
			{
			  x: width - 6 * fontSize,
			  y: 2 * fontSize,
			  size: 11,
			  font: helveticaFont,
			  color: rgb( 0, 0, 0 ),
		});

		// fin pagina uno

		const pdfBytes = await pdfDoc.save();

		return pdfBytes;
	}
}

module.exports = { PdfController };

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

			let posicion = 20; //posicion donde se comienza a agregar el producto
			let posicionCell = ( width / 8 );


			let arrayHeader = [
				`Id:`,
			    `Nombre:`,
			    `Cantidad:`,
			    `Precio unitario:`,
			];

			arrayHeader.forEach(( title ) => {

				page.drawText( title, {
					x: posicionCell,
				  	y: height - posicion * fontSize,
				  	size: 12,
				  	font: helveticaFont,
				  	color: rgb( 0, 0, 0 ),
				});
				
				posicionCell = posicionCell + ( width / 6 );				 
			}); 
			
			posicion++;

			/*  dibujar linea  */
			
			page.drawLine({
			  start: { x: 75, y: height - posicion * fontSize },
			  end: { x: width - (4 * fontSize) , y: height - posicion * fontSize },
			  thickness: 1,
			  color: rgb(0, 0, 0),
			  opacity: 0.8,
			});

			posicion++;
			/*
			console.log ({ 
				page: width,
				width_cell: width / 4,
				cell_center: width / 8
			});*/
			nota.productos.forEach( ( producto, index ) => {
				
				posicionCell = ( width / 8 );
				
				page.drawText( producto.productoid.toString(), {
					x: posicionCell,
				  	y: height - posicion * fontSize,
				  	size: 12,
				  	font: helveticaFont,
				  	color: rgb( 0, 0, 0 ),
				});

				posicionCell = posicionCell + ( width / 6 );

				page.drawText( 
					producto.nombre.length > 15 ? producto.nombre.slice(0, 14) + '... ' : producto.nombre, 
					{
						x: posicionCell,
				  		y: height - posicion * fontSize,
				  		size: 12,
				  		font: helveticaFont,
				  		color: rgb( 0, 0, 0 ),
					});

				posicionCell = posicionCell + ( width / 6 );

				page.drawText( 
					producto.cantidad_seleccionada.toString(), 
					{
						x: posicionCell,
				  		y: height - posicion * fontSize,
				  		size: 12,
				  		font: helveticaFont,
				  		color: rgb( 0, 0, 0 ),
					});

				posicionCell = posicionCell + ( width / 6 );

				page.drawText( 
					producto.precio.toString() + "$",
					{
						x: posicionCell,
				  		y: height - posicion * fontSize,
				  		size: 12,
				  		font: helveticaFont,
				  		color: rgb( 0, 0, 0 ),
					});

				posicionCell = posicionCell + ( width / 6 );
				
				// posicionCell = posicionCell + ( width / 6 );
				posicion++;
			});

			page.drawLine({
			  start: { x: 75, y: height - posicion * fontSize },
			  end: { x: width - (4 * fontSize) , y: height - posicion * fontSize },
			  thickness: 1,
			  color: rgb(0, 0, 0),
			  opacity: 0.8,
			});
			
			posicion++;
						
			page.drawText( 
				"Total de la orden: "+ nota.total_order.toString() + "$",
				{
					x: width - 12 * fontSize,
			  		y: height - posicion * fontSize,
			  		size: 12,
			  		font: helveticaFont,
			  		color: rgb( 0, 0, 0 ),
				});
				
			if ( nota.status === "ENTREGADA" ) {

				page.drawText( 
					"Gracias por su compra!!",
					{
						x: (width / 3),
				  		y: height - 35 * fontSize,
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

		page.drawText('Pagina 1 de 1', {
			  x: width - 6 * fontSize,
			  y: 2 * fontSize,
			  size: 11,
			  font: helveticaFont,
			  color: rgb( 0, 0, 0 ),
		});

		const pdfBytes = await pdfDoc.save();

		return pdfBytes;
	}
}

module.exports = { PdfController };

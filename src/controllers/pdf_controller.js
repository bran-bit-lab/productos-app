const { PDFDocument, StandardFonts, rgb, degrees } = require('pdf-lib');
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
		return await pdfDoc.save();
	}

	/**
	 * Funcion que genera el pdf del reporte
	 * @param {Array<ResponseReport>} consultas  arreglo de consultas
	 */
	async crearReporte( consultas ) {
		
		const [ 
			consultaBuscarNotasCategoria,  
			buscarNotasVendidasPorVendedor,
			buscarTotalProductosPorCategoria,
			buscarCantidadMaximaVendida,
			buscarCantidadProductosVendidosAnual
		] = consultas;

		const pdfDoc = await PDFDocument.create();
		const helveticaFont = await pdfDoc.embedFont( StandardFonts.Helvetica );
		const helveticaBoldFont =  await pdfDoc.embedFont( StandardFonts.HelveticaBold );
		const page1 = pdfDoc.addPage();
		page1.setRotation(degrees(-90));
		const fontSize = 20;

		// rotacion horizontal de la pagina (landscape)
		// page1.setRotation( degrees(90) );

		const { width, height } = page1.getSize();
		// puntos de coordenadas en -90, el cero en la esquina inferior derecha
		const propertyPage = Object.freeze({
			margin_left: height - 80,
			margin_right: 80,
			margin_top: width - 80,
			margin_bottom: 80
		});

		console.log( { width, height } );

		page1.drawText('Products-app', {
			rotate: degrees(-90),
			x: propertyPage.margin_top,
			y: propertyPage.margin_left,
			size: 24,
			font: helveticaFont
		});

		page1.drawText('Reporte estadistico', {
			rotate: degrees(-90),
			x: propertyPage.margin_top,
			y: propertyPage.margin_right + 100,
			size: 14,
			font: helveticaBoldFont
		});
		
		page1.drawText('Fecha de creación: ' + TIME.dateSpanish(), {
			rotate: degrees(-90),
			x: propertyPage.margin_top - 40,
			y: propertyPage.margin_left,
			size: 14,
			font: helveticaFont
		});
  
		page1.drawText('Notas de entregas', {
			rotate: degrees(-90),
			x: propertyPage.margin_top - 70,
			y: propertyPage.margin_left,
			size: 14,
			font: helveticaBoldFont
		});


		if ( consultaBuscarNotasCategoria.results.length > 0 ){


			page1.drawText('Cantidad de notas de entrega por categoría (general):', {
				rotate: degrees(-90),
				x: propertyPage.margin_top - 100,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			let posicion = propertyPage.margin_top - 90 ;
			let arrayHeader = ['Estado:', 'Cantidad:',];

			let posicionCell = ( height / ( arrayHeader.length * 2 ) );

			arrayHeader.forEach(( title ) => {

				page1.drawText( title, {
					rotate: degrees(-90),
					x: posicion,
				  	y: posicionCell,
				  	size: 12,
				  	font: helveticaBoldFont,
				  	color: rgb( 0, 0, 0 ),
				});

				posicionCell = posicionCell + ( height / 5 );
			});

		}
			
				
		/*let consultaBuscarNotasCategoria = consultas[0];
		let buscarNotasVendidasPorVendedor = consulta[1];
		let buscarTotalProductosPorCategoria = consulta[2];
		let buscarCantidadMaximaVendida = consulta[3];
		let buscarCantidadProductosVendidosAnual = consulta[4];*/
		/*

		// console.log( consulta );

		const jpegImage = await pdfDoc.embedJpg( consulta.buffer );

		// ajusta el tamaño de la imagen
		const jpgDims = jpegImage.scale( 0.5 );

		page1.drawImage( jpegImage,  {
			x: ( width / 2 ) - 50,
			y: ( height / 2 ) - 50,
			width: jpgDims.width,
			height: jpgDims.height,
			rotate: degrees (90)
		});
		*/
		/*
			===========================
			pagina 1
			===========================
		*/

		
		return await pdfDoc.save();
	}
}

module.exports = { PdfController };

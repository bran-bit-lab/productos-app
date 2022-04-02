const { PDFDocument, StandardFonts, rgb, degrees, PDFPage } = require('pdf-lib');
const TIME = require('../util_functions/time');

/** clase que permite generar los documentos de salida */
class PdfController {

	/**
	 * genera el pdf de una nota de entrega
	 *
	 * @param  {Nota} nota instancia de la nota
	 * @return {Uint8Array}  retorna el buffer de datos del archivo PDF
	 */
	async createPdf( nota ) {

		// console.log( 'nota --> ', nota );
		function getPages( limit = 20 ) {

			let arrayPages = [];

			// console.log( nota.productos )

			if ( nota.productos.length === 0 ) {

				arrayPages.push({
					page: pdfDoc.addPage(),
					products: [],
					number: 0
				});

			} else {

				let totalPages = Math.ceil( nota.productos.length / limit );
				let start = 0;

				console.log( totalPages )

				for (let i = 0; i < totalPages; i++) {

					arrayPages.push({
						page: pdfDoc.addPage(),
						products: nota.productos.slice( start, start + ( limit - 1 )),
						number: i
					});

					start += (limit - 1);
				}
			}

			// console.log(arrayPages);

			return arrayPages;
		}

		const header = ( page, height, width, fontSize ) => {
			
			// datos hoja carta
			// altura = 841.89 y ancho = 595.28

			page.drawText('Nota de entrega', {
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
				color: rgb(0, 0.8, 0.8),
			});

			page.drawText('Fecha de creación: ' + TIME.dateSpanish(new Date(nota.creacion)), {
				x: 50,
				y: height - 6 * fontSize,
				size: 14,
				font: helveticaBoldFont,
				color: rgb(0, 0, 0),
			});

			page.drawText('Estado: ' + nota.status, {
				x: width - 10 * fontSize,
				y: height - 6 * fontSize,
				size: 14,
				font: helveticaFont,
				color: rgb(0, 0, 0),
			});

			// ===================================
			// datos cliente
			// ===================================
			page.drawText('Datos del Cliente: ', {
				x: 50,
				y: height - 8 * fontSize,
				size: 12,
				font: helveticaBoldFont,
				color: rgb(0, 0, 0),
			});

			page.drawText([
				`Nombre del cliente: ${nota.nombre_cliente}\t\t\tRIF: ${nota.rif}\t\t\tTelefono: ${nota.telefono_contacto}`,
				`Direccion de entrega: ${nota.direccion_entrega}`,
				`Fecha de entrega: ${nota.fecha_entrega ? nota.fecha_entrega : 'No entregado'}`,
				`Descripción: ${nota.descripcion_nota}`,
			].join('\n'), {
				x: 50,
				y: height - 9.5 * fontSize,
				size: 10,
				font: helveticaFont,
				color: rgb(0, 0, 0),
			});

			page.drawText('Lista de productos: ', {
				x: 50,
				y: height - 14.5 * fontSize,
				size: 12,
				font: helveticaBoldFont,
				color: rgb(0, 0, 0),
			});
		}

		const footer = ( page, width, fontSize, number = 0 ) => {

			// indice de pagina parte inferior
			page.drawText('Pagina ' + (pdfDoc.getPageIndices()[number] + 1) + ' de ' + pdfDoc.getPageCount(),
				{
					x: width - 6 * fontSize,
					y: 2 * fontSize,
					size: 11,
					font: helveticaFont,
					color: rgb(0, 0, 0),
				});
		}

		const renderTable = ( page, width, height, fontSize, products, totalPage = false ) => {

			// posicion donde se comienza a agregar el producto
			const arrayHeader = ['id:', 'nombre:', 'cantidad:', 'precio unitario:'];

			let posicion = 16;
			let posicionCell = (width / (arrayHeader.length * 2));

			arrayHeader.forEach((title) => {

				page.drawText(title, {
					x: posicionCell,
					y: height - posicion * fontSize,
					size: 12,
					font: helveticaBoldFont,
					color: rgb(0, 0, 0),
				});

				posicionCell = posicionCell + (width / 5);
			});

			posicion++;

			/*  dibujar linea  */
			page.drawLine({
				start: { x: 50, y: height - posicion * fontSize },
				end: { x: width - (3 * fontSize), y: height - posicion * fontSize },
				thickness: 1,
				color: rgb(0, 0, 0),
				opacity: 0.8,
			});

			posicion++;

			products.forEach((producto) => {

				posicionCell = (width / (arrayHeader.length * 2));

				page.drawText(producto.productoid.toString(), {
					x: posicionCell,
					y: (height - posicion * fontSize),
					size: 10,
					font: helveticaFont,
					color: rgb(0, 0, 0),
				});

				posicionCell = posicionCell + (width / 5);

				page.drawText(
					producto.nombre.length > 10 ? producto.nombre.slice(0, 9) + '... ' : producto.nombre,
					{
						x: posicionCell,
						y: height - posicion * fontSize,
						size: 10,
						font: helveticaFont,
						color: rgb(0, 0, 0),
					});

				posicionCell = posicionCell + (width / 5);

				page.drawText(
					producto.cantidad_seleccionada.toString(),
					{
						x: posicionCell,
						y: height - posicion * fontSize,
						size: 10,
						font: helveticaFont,
						color: rgb(0, 0, 0),
					});

				posicionCell = posicionCell + (width / 5);

				page.drawText(producto.precio.toString() + "$", {
					x: posicionCell,
					y: height - posicion * fontSize,
					size: 10,
					font: helveticaFont,
					color: rgb(0, 0, 0),
				});

				posicionCell = posicionCell + (width / 5);

				posicion++;
			});

			page.drawLine({
				start: { x: 50, y: height - posicion * fontSize },
				end: { x: width - (3 * fontSize), y: height - posicion * fontSize },
				thickness: 1,
				color: rgb(0, 0, 0),
				opacity: 0.8,
			});

			posicion++;

			if ( totalPage ) {

				page.drawText("Total de la orden: " + nota.total_order.toString() + "$", {
					x: width - 10 * fontSize,
					y: height - posicion * fontSize,
					size: 12,
					font: helveticaBoldFont,
					color: rgb(0, 0, 0),
				});

				if ( nota.status === "ENTREGADA" ) {

					page.drawText("!! Gracias por su compra !!", {
						x: (width / 3.5),
						y: height - (2 + posicion) * fontSize,
						size: 20,
						font: helveticaBoldFont,
						color: rgb(0, 0, 0),
					});
				}
			}
		}
		
		const pdfDoc = await PDFDocument.create();
		const helveticaFont = await pdfDoc.embedFont( StandardFonts.Helvetica );
		const helveticaBoldFont =  await pdfDoc.embedFont( StandardFonts.HelveticaBold );
		const pages = getPages( nota.status === "ENTREGADA" ? 18 : 20 );
		
		pages.forEach(({ page, products, number }, index, array ) => {

			const { width, height } = page.getSize();
			const fontSize = 20;

			header( page, height, width, fontSize );

			if ( products.length > 0 ) {

				renderTable( 
					page, 
					width, 
					height, 
					fontSize, 
					products, 
					index === ( array.length - 1 )
				)

			} else {

				page.drawText('No hay productos seleccionados ', {
					x: 50,
					y: height - 17 * fontSize,
					size: 14,
					font: helveticaBoldFont,
					color: rgb( 1, 0, 0 ),
				  });
			}

			footer( page, width, fontSize, number )
		})

		// fin pagina
		return await pdfDoc.save();
	}

	/**
	 * Funcion que genera el pdf del reporte
	 * @param {Array<ResponseReport>} consultas  arreglo de consultas
	 * @returns {Uint8Array}  retorna el buffer de datos del archivo PDF
	 */
	async crearReporte( consultas ) {
		
		const [ 
			consultaBuscarNotasCategoria,  
			buscarNotasVendidasPorVendedor,   // segunda consulta
			buscarTotalProductosPorCategoria,
			buscarCantidadMaximaVendida,
			buscarCantidadProductosVendidosAnual
		] = consultas;

		const pdfDoc = await PDFDocument.create();
		const helveticaFont = await pdfDoc.embedFont( StandardFonts.Helvetica );
		const helveticaBoldFont =  await pdfDoc.embedFont( StandardFonts.HelveticaBold );
		
		const page1 = pdfDoc.addPage();
		const page2 = pdfDoc.addPage();
		const page3 = pdfDoc.addPage();
		const page4 = pdfDoc.addPage();

		/**
		 * Establece el encabezado de la pagina PDF
		 * @param {PDFPage} page instancia de la pagina actual pasado por parametro
		 */
		const setHeader = ( page ) => {

			page.drawText('Products-app', {
				...props,
				x: propertyPage.margin_top,
				y: propertyPage.margin_left,
				size: 24,
				font: helveticaFont
			});

			page.drawText('Reporte estadistico', {
				...props,
				x: propertyPage.margin_top,
				y: propertyPage.margin_right + 140,
				size: 14,
				font: helveticaBoldFont
			});
		}

		/**
		 * establece el numero de pagina en el documento
		 * @param {number} index  numero de pagina
		 * @param {PDFPage} page pagina actual
		 */
		const setPagination = ( index, page ) => {
			page.drawText('Pagina ' + index + ' de ' + pdfDoc.getPageCount(), {
				...props,
				x: propertyPage.margin_bottom,
				y: propertyPage.margin_right + 60,
				size: 11,
				font: helveticaFont,
			});
		}
		
		// rotacion horizontal de la pagina (landscape)
		page1.setRotation( degrees( -90 ) );

		const { width, height } = page1.getSize();
		
		// puntos de coordenadas en -90, el cero en la esquina inferior derecha
		const propertyPage = Object.freeze({
			margin_left: height - 60,
			margin_right: 60,
			margin_top: width - 60,
			margin_bottom: 60
		});

		const props = {
			rotate: degrees( -90 )
		};

		// console.log( { width, height } );

		// establece el encabezado
		setHeader( page1 );
		
		page1.drawText('Fecha de creación: ' + TIME.dateSpanish(), {
			...props,
			x: propertyPage.margin_top - 40,
			y: propertyPage.margin_left,
			size: 14,
			font: helveticaFont
		});
  
		page1.drawText('Notas de entregas:', {
			...props,
			x: propertyPage.margin_top - 70,
			y: propertyPage.margin_left,
			size: 14,
			font: helveticaBoldFont
		});


		if ( consultaBuscarNotasCategoria && consultaBuscarNotasCategoria.results.length > 0 ) {

			const jpegImage = await pdfDoc.embedJpg( consultaBuscarNotasCategoria.buffer );
			
			// ajusta el tamaño de la imagen
			const jpgDims = jpegImage.scale( 0.4 );


			let posicion = propertyPage.margin_top - 140 ;
			let arrayHeader = ['Estado:', 'Cantidad:'].reverse();			

			// dividimos a la mitad el grid (50%)
			let rightGrid = propertyPage.margin_left / 2;


			page1.drawText('Cantidad de notas de entrega por categoría (general):', {
				...props,
				x: propertyPage.margin_top - 100,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});


			// le sumamos la mitad derecha para obtener el lado izquierdo
			let leftGrid = ( propertyPage.margin_left / 2 ) + rightGrid; 
			
			let posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			// console.log({ rightGrid, leftGrid, posicionCell });

			// ===============================
			// Grid
			// ===============================

			// image
			page1.drawImage( jpegImage, {
				x: posicion - 140,
				y: ( rightGrid / 2 ) + 100,
				width: jpgDims.width,
				height: jpgDims.height,
				rotate: degrees ( -90 )
			});

			// table
			arrayHeader.forEach(( title ) => {

				page1.drawText( title, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaBoldFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
			});

			// se decrementa la posicion x
			posicion -= 10;

			page1.drawLine({ 
				start: { x: posicion, y: leftGrid },
				end: { x: posicion, y: ( leftGrid - rightGrid ) },
				opacity: 0.8
			});

			posicion -= 20;

			// console.log( consultaBuscarNotasCategoria.results );
			
			posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			consultaBuscarNotasCategoria.results.forEach(( consult ) => {

				posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

				page1.drawText( consult.total.toString(), {
					...props,
					x: posicion,
					y: posicionCell - 15,
					size: 12,
					font: helveticaFont,
				});
				
				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
				
				page1.drawText( consult.status, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );

				posicion -= 20;
			});

		} else {

			// en caso de que la consulta este vacia

			page1.drawText('Cantidad de notas de entrega por categoría (general):', {
				...props,
				x: propertyPage.margin_top - 100,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			page1.drawText('No existen los datos seleccionados', {
				...props,
				x: propertyPage.margin_top - 130,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaFont,
				color: rgb( 0.8, 0.12, 0.12 )
			});

		}

		if ( buscarNotasVendidasPorVendedor && buscarNotasVendidasPorVendedor.results.length > 0 ) {

			const jpegImage = await pdfDoc.embedJpg( buscarNotasVendidasPorVendedor.buffer );
						
			const jpgDims = jpegImage.scale( 0.5 );

			let posicion = propertyPage.margin_top - 330;

			page1.drawText('Cantidad de notas de entrega por vendedor (general):', {
				...props,
				x: propertyPage.margin_top - 300,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			let arrayHeader = ['Nombre:', 'Cantidad'].reverse();			

			// dividimos a la mitad el grid (50%)
			let rightGrid = propertyPage.margin_left / 2;

			// le sumamos la mitad derecha para obtener el lado izquierdo
			let leftGrid = ( propertyPage.margin_left / 2 ) + rightGrid; 
			
			let posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			// console.log({ rightGrid, leftGrid, posicionCell, jpegImage });
		
			page1.drawImage( jpegImage, {
				x: posicion - 100,
				y: ( rightGrid / 2 ) + 120,
				width: jpgDims.width,
				height: jpgDims.height,
				rotate: degrees ( -90 )
			});

			arrayHeader.forEach(( title ) => {

				page1.drawText( title, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaBoldFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
			});

			// se decrementa la posicion x
			posicion -= 10;

			page1.drawLine({ 
				start: { x: posicion, y: leftGrid },
				end: { x: posicion, y: ( leftGrid - rightGrid ) },
				opacity: 0.8
			});

			posicion -= 20;
			
			posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			buscarNotasVendidasPorVendedor.results.forEach(( consult ) => {
				//console.log({consult});
				posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;
		
				// cambia las propiedades a las que estan dentro de consult examinalas y cambialas
				page1.drawText( consult.cantidad_notas.toString(), {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );

				page1.drawText( consult.nombre_vendedor, {
					...props,
					x: posicion,
					y: posicionCell - 15,
					size: 12,
					font: helveticaFont,
				});
				
				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
				
				posicion -= 20;
			});

		} else {

			// en caso de que la consulta este vacia

			page1.drawText('Cantidad de notas de entrega por vendedor (general):', {
				...props,
				x: propertyPage.margin_top - 300,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			page1.drawText('No existen los datos seleccionados', {
				...props,
				x: propertyPage.margin_top - 350,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaFont,
				color: rgb( 0.8, 0.12, 0.12 )
			});
		}

		setPagination( ( pdfDoc.getPageIndices()[0] + 1 ), page1 );

		// ==============================
		// pagina 2
		// ==============================
		
		page2.setRotation( degrees( -90 ) );

		page2.drawText('Products-app', {
			...props,
			x: propertyPage.margin_top,
			y: propertyPage.margin_left,
			size: 24,
			font: helveticaFont
		});


		// establece el encabezado
		setHeader( page2 );

		setPagination( ( pdfDoc.getPageIndices()[1] + 1 ), page2 );

		page2.drawText('Productos:', {
			...props,
			x: propertyPage.margin_top - 40,
			y: propertyPage.margin_left,
			size: 14,
			font: helveticaBoldFont
		});

		// aqui arrancamos valida la condicion de results

		if ( buscarTotalProductosPorCategoria && buscarTotalProductosPorCategoria.results.length > 0 ) {

			const jpegImage = await pdfDoc.embedJpg( buscarTotalProductosPorCategoria.buffer );
						
			const jpgDims = jpegImage.scale( 0.4 );

			let posicion = propertyPage.margin_top - 120;

			page2.drawText('Total de productos por categorias: ', {
				...props,
				x: propertyPage.margin_top - 70,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			let arrayHeader = ['Categoria:', 'Cantidad'].reverse();			

			// dividimos a la mitad el grid (50%)
			let rightGrid = propertyPage.margin_left / 2;

			// le sumamos la mitad derecha para obtener el lado izquierdo
			let leftGrid = ( propertyPage.margin_left / 2 ) + rightGrid; 
			
			let posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			// console.log({ rightGrid, leftGrid, posicionCell, jpegImage });
		
			page2.drawImage( jpegImage, {
				x: posicion - 140,
				y: ( rightGrid / 2 ) + 120,
				width: jpgDims.width,
				height: jpgDims.height,
				rotate: degrees ( -90 )
			});

			arrayHeader.forEach(( title ) => {

				page2.drawText( title, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaBoldFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
			});

			// se decrementa la posicion x
			posicion -= 10;

			page2.drawLine({ 
				start: { x: posicion, y: leftGrid },
				end: { x: posicion, y: ( leftGrid - rightGrid ) },
				opacity: 0.8
			});

			posicion -= 20;
			
			posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			buscarTotalProductosPorCategoria.results.forEach(( consult ) => {
				//console.log({consult});
				posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;
		
				// cambia las propiedades a las que estan dentro de consult examinalas y cambialas
				page2.drawText( consult.cantidad_productos.toString(), {
					...props,
					x: posicion,
					y: posicionCell - 15,
					size: 12,
					font: helveticaFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );

				page2.drawText( consult.categoria, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaFont,
				});
			
				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
				
				posicion -= 20;
				
			});


		} else {

			// en caso de que la consulta este vacia
			page2.drawText('Cantidad de productos por categoria:', {
				...props,
				x: propertyPage.margin_top - 100,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			page2.drawText('No existen los datos seleccionados', {
				...props,
				x: propertyPage.margin_top - 150,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaFont,
				color: rgb( 0.8, 0.12, 0.12 )
			});

		}


		// ==============================
		// pagina 3
		// ==============================

		page3.setRotation( degrees( -90 ) );

		// establece el encabezado
		setHeader( page3 );

		// buscarCantidadMaximaVendida

		if ( buscarCantidadMaximaVendida && buscarCantidadMaximaVendida.results.length > 0 ) {

			const jpegImage = await pdfDoc.embedJpg( buscarCantidadMaximaVendida.buffer );
						
			const jpgDims = jpegImage.scale( 0.6 );

			let posicion = propertyPage.margin_top - 90;

			page3.drawText('Cantidad maxima de productos vendidos:', {
				...props,
				x: propertyPage.margin_top - 50,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			let arrayHeader = ['Producto:', 'Cantidad maxima vendida'].reverse();			

			// dividimos a la mitad el grid (50%)
			let rightGrid = propertyPage.margin_left / 2;

			// le sumamos la mitad derecha para obtener el lado izquierdo
			let leftGrid = ( propertyPage.margin_left / 2 ) + rightGrid; 
			
			let posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			// console.log({ rightGrid, leftGrid, posicionCell, jpegImage });
		
			page3.drawImage( jpegImage, {
				x: posicion - 100,
				y: ( rightGrid / 2 ) + 140,
				width: jpgDims.width,
				height: jpgDims.height,
				rotate: degrees ( -90 )
			});

			arrayHeader.forEach(( title ) => {

				page3.drawText( title, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaBoldFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
			});

			// se decrementa la posicion x
			posicion -= 10;

			page3.drawLine({ 
				start: { x: posicion, y: leftGrid },
				end: { x: posicion, y: ( leftGrid - rightGrid ) },
				opacity: 0.8
			});

			posicion -= 20;
			
			posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			buscarCantidadMaximaVendida.results.forEach(( consult ) => {
				
				posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;
		
				// cambia las propiedades a las que estan dentro de consult examinalas y cambialas
				page3.drawText( consult.cantidad_max_vendida.toString(), {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );

				page3.drawText( consult.nombre, {
					...props,
					x: posicion,
					y: posicionCell - 15,
					size: 12,
					font: helveticaFont,
				});
				
				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
				
				posicion -= 20;
			});

		} else {

			// en caso de que la consulta este vacia

			page3.drawText('Cantidad maxima de productos vendidos:', {
				...props,
				x: propertyPage.margin_top - 50,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			page3.drawText('No existen los datos seleccionados', {
				...props,
				x: propertyPage.margin_top - 90,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaFont,
				color: rgb( 0.8, 0.12, 0.12 )
			});

		}

		setPagination( ( pdfDoc.getPageIndices()[2] + 1 ), page3 );

		// ==============================
		// pagina 4
		// ==============================

		page4.setRotation( degrees( -90 ) );

		// establece el encabezado
		setHeader( page4 );

		// buscarCantidadProductosVendidosAnual

		if ( buscarCantidadProductosVendidosAnual && buscarCantidadProductosVendidosAnual.results.length > 0 ) {

			const jpegImage = await pdfDoc.embedJpg( buscarCantidadProductosVendidosAnual.buffer );
						
			const jpgDims = jpegImage.scale( 0.5 );

			let posicion = propertyPage.margin_top - 80;

			page4.drawText('Total de productos vendidos al año: ', {
				...props,
				x: propertyPage.margin_top - 50,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			let arrayHeader = ['Mes:', 'Total vendidos:'].reverse();			

			// dividimos a la mitad el grid (50%)
			let rightGrid = propertyPage.margin_left / 2;

			// le sumamos la mitad derecha para obtener el lado izquierdo
			let leftGrid = ( propertyPage.margin_left / 2 ) + rightGrid; 
			
			let posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			// console.log({ rightGrid, leftGrid, posicionCell, jpegImage });
		
			page4.drawImage( jpegImage, {
				x: posicion - 100,
				y: ( rightGrid / 2 ) + 140,
				width: jpgDims.width,
				height: jpgDims.height,
				rotate: degrees ( -90 )
			});

			arrayHeader.forEach(( title ) => {

				page4.drawText( title, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaBoldFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
			});

			// se decrementa la posicion x
			posicion -= 10;

			page4.drawLine({ 
				start: { x: posicion, y: leftGrid },
				end: { x: posicion, y: ( leftGrid - rightGrid ) },
				opacity: 0.8
			});

			posicion -= 20;
			
			posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;

			buscarCantidadProductosVendidosAnual.results.forEach(( consult ) => {
				
				posicionCell = ( rightGrid / arrayHeader.length ) + rightGrid;
		
				// cambia las propiedades a las que estan dentro de consult examinalas y cambialas
				page4.drawText( consult.total.toString(), {
					...props,
					x: posicion,
					y: posicionCell - 15,
					size: 12,
					font: helveticaFont,
				});

				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );

				page4.drawText( consult.mes, {
					...props,
					x: posicion,
				  	y: posicionCell - 15,
				  	size: 12,
				  	font: helveticaFont,
				});
			
				posicionCell = posicionCell + ( rightGrid / arrayHeader.length );
				
				posicion -= 20;
				
				
			});


		} else {

			// en caso de que la consulta este vacia
			page4.drawText('Cantidad de productos vendidos al año:', {
				...props,
				x: propertyPage.margin_top - 50,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaBoldFont
			});

			page4.drawText('No existen los datos seleccionados', {
				...props,
				x: propertyPage.margin_top - 90,
				y: propertyPage.margin_left,
				size: 14,
				font: helveticaFont,
				color: rgb( 0.8, 0.12, 0.12 )
			});

		}

		setPagination( ( pdfDoc.getPageIndices()[3] + 1 ), page4 );
		
		return await pdfDoc.save();

	}
}

module.exports = { PdfController };

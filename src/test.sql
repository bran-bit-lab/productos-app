SELECT 
	notas.id_nota, 
	notas.descripcion_nota, 
	notas.creacion, 
	notas.status, 
	CONCAT( usuarios.nombre, " ", usuarios.apellido ) AS nota_usuario, 
	clientes.nombre_cliente 
		FROM notas
			LEFT JOIN usuarios ON notas.userid = usuarios.userid 
			INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente
				ORDER BY notas.id_nota DESC;

SELECT 
	notas_productos.id_NP, 
	notas_productos.cantidad_seleccionada, 
	categorias.nombre AS nombre_categoria, 
	usuarios.nombre AS nombre_usuario, 
	usuarios.apellido, productos.* 
		FROM notas_productos 
			INNER JOIN productos ON notas_productos.id_producto = productos.productoid 
			INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid 
			INNER JOIN usuarios ON usuarios.userid = productos.userid 
				WHERE notas_productos.id_nota = 34

/*SELECT 
	notas.id_nota, 
	notas.descripcion_nota, 
	notas.creacion, 
	notas.status, 
	usuarios.nombre AS nombre_usuario, 
	usuarios.apellido AS apellido_usuario, 
	clientes.nombre_cliente 
		FROM notas;
			LEFT JOIN usuarios ON notas.userid = usuarios.userid 
			INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente
				ORDER BY notas.id_nota DESC;*/	
/*
INSERT INTO productos(nombre, descripcion) VALUES
	("producto_test_1", "monofasico, gas r404"),
	("producto_test_2", "monofasico, gas r404"),
	("producto_test_3", "monofasico, gas r404");
*/
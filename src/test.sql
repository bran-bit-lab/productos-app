SELECT notas.id_nota, notas.descripcion_nota, notas.creacion, notas.status, CONCAT( usuarios.nombre, " ", usuarios.apellido ) AS creado_por, clientes.nombre_cliente FROM notas LEFT JOIN usuarios ON notas.userid = usuarios.userid INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente ORDER BY notas.id_nota ASC;
	
/*
INSERT INTO productos(nombre, descripcion) VALUES
	("producto_test_1", "monofasico, gas r404"),
	("producto_test_2", "monofasico, gas r404"),
	("producto_test_3", "monofasico, gas r404");
*/




/*
SET lc_time_names = 'es_VE';
SELECT MONTHNAME(notas.creacion) AS fecha, SUM(notas_productos.cantidad_seleccionada) AS cantidad FROM notas 
	INNER JOIN notas_productos ON notas_productos.id_nota = notas.id_nota
	WHERE YEAR(notas.creacion) = YEAR(NOW())
	GROUP BY fecha
	ORDER BY fecha DESC;
SELECT cantidad + (4) as cantidad FROM productos WHERE productoid = 1; 
SELECT DATE_FORMAT( fecha_entrega, '%d-%m-%Y') AS fecha_entrega, notas.* FROM notas WHERE id_nota = 64;
SELECT notas_productos.id_NP notas_productos.cantidad_seleccionada, categorias.nombre AS nombre_categoria, usuarios.nombre AS nombre_usuario, usuarios.apellido, productos.* FROM notas_productos 
	INNER JOIN productos ON notas_productos.id_producto = productos.productoid
	INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid
	INNER JOIN usuarios ON usuarios.userid = productos.userid
	WHERE notas_productos.id_nota = :id_nota;*/

/*
 SELECT *FROM notas ORDER BY id_nota DESC LIMIT 0, 1;  /* con esto lo decimos que se traiga el ultimo si no me equivoco
CREATE TABLE notas_productos (
	id_NP bigint NOT NULL PRIMARY KEY,
	id_nota int,
	FOREIGN KEY (id_nota) REFERENCES notas(id_nota),
	id_producto int,
	FOREIGN KEY (id_producto) REFERENCES productos(productoid),
	cantidad_selecionada int  NOT NULL
)

*/
/*
INSERT INTO `notas_productos` VALUES (DEFAULT, 15, 1, 3 );
INSERT INTO `notas_productos` VALUES (DEFAULT, 15, 7, 5 );
INSERT INTO `notas_productos` VALUES (DEFAULT, 16, 4, 3 );
*/

/*
INSERT INTO `notas`( userid, descripcion_nota, id_cliente, fecha_entrega ) VALUES (17, 'descripcion de prueba', 1, "2021-06-13");

Para DATETIME YYYY-MM-DD
*/
/*
ALTER TABLE notas_productos
	MODIFY id_NP BIGINT AUTO_INCREMENT NOT NULl;
ALTER TABLE notas
	MODIFY COLUMN status ENUM ('EN_PROCESO','ACEPTADO','ENTREGADA','CANCELADA','POSPUESTO') DEFAULT 'EN_PROCESO';
*/

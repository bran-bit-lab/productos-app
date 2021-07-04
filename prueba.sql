



/*
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

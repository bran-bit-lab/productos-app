/* Persona natural o juridica
ALTER TABLE clientes ADD (
	telefono_contacto CHAR(30)
	);*/
/*
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
INSERT INTO `notas` VALUES (17, DEFAULT, NULL, 'descripcion de prueba', '2021-06-13', 1, null);
*/

INSERT INTO `notas`( userid, descripcion_nota, id_cliente, fecha_entrega ) VALUES (17, 'descripcion de prueba', 1, "2021-06-13");

/*Para DATETIME YYYY-MM-DD*/
/*
ALTER TABLE notas
	MODIFY COLUMN status ENUM ('EN_PROCESO','ACEPTADO','ENTREGADA','CANCELADA','POSPUESTO') DEFAULT 'EN_PROCESO';
*/

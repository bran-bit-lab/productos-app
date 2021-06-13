-- MySQL dump 10.16  Distrib 10.1.38-MariaDB, for Win32 (AMD64)
--
-- Host: localhost    Database: bd_productosapp
-- ------------------------------------------------------
-- Server version	10.1.38-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `userid` int(11) DEFAULT NULL,
  `nombre` char(30) DEFAULT NULL,
  `descripcion` varchar(600) DEFAULT NULL,
  `categoriaid` int(11) NOT NULL AUTO_INCREMENT,
  `activo` tinyint(1) DEFAULT '1',
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`categoriaid`),
  KEY `userid` (`userid`),
  CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `usuarios` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (NULL,'categoria1','D1,% D1',1,1,NULL);
INSERT INTO `categorias` VALUES (NULL,'categoria2','D2,% D2',2,1,NULL);
INSERT INTO `categorias` VALUES (NULL,'categoria3','D3,% D3',3,1,NULL);
INSERT INTO `categorias` VALUES (NULL,'categoria4','D4,% D4',4,1,NULL);
INSERT INTO `categorias` VALUES (NULL,'categoria5','D5,% D5',5,1,NULL);
INSERT INTO `categorias` VALUES (1,'Alimentacion','prueba de desarrollo',6,1,'');
INSERT INTO `categorias` VALUES (1,'Bebidas','prueba de desarrollo',7,1,'');
INSERT INTO `categorias` VALUES (1,'Frutas','prueba de desarrollo',8,1,'');
INSERT INTO `categorias` VALUES (1,'verduras','prueba de desarrollo',9,1,'');
INSERT INTO `categorias` VALUES (1,'Carnes','prueba de desarrollo',10,1,'');
INSERT INTO `categorias` VALUES (17,'Miscelaneo','prueba de desarrollo',11,1,'');
INSERT INTO `categorias` VALUES (17,'Miscelaneo','prueba de desarrollo',13,1,'');
INSERT INTO `categorias` VALUES (17,'Circuito','Lectura de potencia',14,1,'');
INSERT INTO `categorias` VALUES (17,'Actividad','Rtotal',15,1,'');
INSERT INTO `categorias` VALUES (17,'formula','capacitancia',16,1,'');
INSERT INTO `categorias` VALUES (17,'Formula','impedancia Capacitiva',17,1,'');
INSERT INTO `categorias` VALUES (17,'Carga','condensador',18,1,'');
INSERT INTO `categorias` VALUES (17,'nuevo registro','con imagen',19,1,'');
INSERT INTO `categorias` VALUES (17,'iCincoV','cambioCuatro',23,1,'');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_cliente` char(30) DEFAULT NULL,
  `direccion_entrega` varchar(255) DEFAULT NULL,
  `rif` char(30) DEFAULT NULL,
  `telefono_contacto` char(30) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (2,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (3,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (4,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (5,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (6,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (7,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (8,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (9,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (10,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (11,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
INSERT INTO `clientes` VALUES (12,'cliente','j-12345678','direccion de prueba','0212-123.45.67');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notas`
--

DROP TABLE IF EXISTS `notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notas` (
  `userid` int(11) DEFAULT NULL,
  `status` enum('EN_PROCESO','ACEPTADO','ENTREGADA','CANCELADA','POSPUESTO') DEFAULT 'EN_PROCESO',
  `creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descripcion_nota` varchar(255) DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_nota` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_nota`),
  KEY `userid` (`userid`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `usuarios` (`userid`),
  CONSTRAINT `notas_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas`
--

LOCK TABLES `notas` WRITE;
/*!40000 ALTER TABLE `notas` DISABLE KEYS */;
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:45','descripcion de prueba','2021-06-13',1,15);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:45','descripcion de prueba','2021-06-13',1,16);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:45','descripcion de prueba','2021-06-13',1,17);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:45','descripcion de prueba','2021-06-13',1,18);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,19);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,20);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,21);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,22);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,23);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,24);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,25);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:38:46','descripcion de prueba','2021-06-13',1,26);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:43:48','descripcion de prueba',NULL,1,27);
INSERT INTO `notas` VALUES (17,'EN_PROCESO','2021-06-13 20:45:05','descripcion de prueba','2021-06-13',1,28);
/*!40000 ALTER TABLE `notas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `productoid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `categoriaid` int(11) NOT NULL,
  `nombre` char(30) DEFAULT NULL,
  `descripcion` varchar(600) DEFAULT NULL,
  `cantidad` int(11) DEFAULT '0',
  `precio` decimal(12,2) DEFAULT NULL,
  `disponibilidad` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`productoid`),
  KEY `categoriaid` (`categoriaid`),
  KEY `userid` (`userid`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoriaid`) REFERENCES `categorias` (`categoriaid`),
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `usuarios` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,17,23,'Teclado','Genius',0,NULL,0);
INSERT INTO `productos` VALUES (2,17,23,'Monitor','Samsung',0,NULL,1);
INSERT INTO `productos` VALUES (3,17,23,'Telefono','Iphone',0,NULL,1);
INSERT INTO `productos` VALUES (4,17,23,'Mouse','VIT',0,NULL,1);
INSERT INTO `productos` VALUES (5,17,23,'Cuaderno','Doble linea',0,NULL,1);
INSERT INTO `productos` VALUES (6,17,23,'Carpeta','Manila',0,NULL,1);
INSERT INTO `productos` VALUES (7,17,23,'Bombillo','LED',0,NULL,1);
INSERT INTO `productos` VALUES (8,17,23,'Papel','Bond',0,NULL,1);
INSERT INTO `productos` VALUES (9,17,23,'Papel','Lustrillo',0,NULL,1);
INSERT INTO `productos` VALUES (10,17,23,'Lapiz','Mongol',0,NULL,1);
INSERT INTO `productos` VALUES (11,17,2,'prueba','prueba',22,1.48,1);
INSERT INTO `productos` VALUES (12,17,18,'pruebados','pruebados',10,123.22,1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` char(30) DEFAULT NULL,
  `apellido` char(30) DEFAULT NULL,
  `correo` char(30) DEFAULT NULL,
  `password` char(200) DEFAULT NULL,
  `area` char(30) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `usuarios` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'test1','apellido1','correo1@prueba.com','prueba','Ventas',1);
INSERT INTO `usuarios` VALUES (2,'test2','apellido2','correo2@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (3,'test3','apellido3','correo3@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (4,'test4','apellido4','correo4@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (5,'test5','apellido5','correo5@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (6,'test6','apellido6','correo6@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (7,'test7','apellido7','correo7@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (8,'test8','apellido8','correo8@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (9,'test9','apellido9','correo9@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (10,'test10','apellido10','correo10@prueba.com','prueba','ventas',1);
INSERT INTO `usuarios` VALUES (11,'test11','apellido11','correo11@prueba.com','prueba','ventas',0);
INSERT INTO `usuarios` VALUES (12,'test12','apellido12','correo12@prueba.com','prueba','ventas',0);
INSERT INTO `usuarios` VALUES (13,'test13','apellido13','correo13@prueba.com','prueba','ventas',0);
INSERT INTO `usuarios` VALUES (14,'test14','apellido14','correo14@prueba.com','prueba','ventas',0);
INSERT INTO `usuarios` VALUES (15,'test15','apellido15','correo15@prueba.com','prueba','ventas',0);
INSERT INTO `usuarios` VALUES (16,'test','apellido','correo16@prueba.com','$2a$10$wv4wCtHYqRoyXLNsIa.8IO7h2wwX/xH.ojDBq5TYh8M7SSe9mkYKe','Almacen',0);
INSERT INTO `usuarios` VALUES (17,'test','Silva','correo17@prueba.com','$2a$10$fwC6xJ.HtnXgEbThvOR7jO.ucFfkpLSBuHbWQoBwujYwtlHMcdE5i','Administracion',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-13 17:01:27

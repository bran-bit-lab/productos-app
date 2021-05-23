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
-- Table structure for table `notas`
--

DROP TABLE IF EXISTS `notas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notas` (
  `nro` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `cliente` char(50) DEFAULT NULL,
  `status` char(30) DEFAULT NULL,
  `creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nro`),
  KEY `userid` (`userid`),
  CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `usuarios` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notas`
--

LOCK TABLES `notas` WRITE;
/*!40000 ALTER TABLE `notas` DISABLE KEYS */;
/*!40000 ALTER TABLE `notas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `userid` int(11) DEFAULT NULL,
  `nombre` char(30) DEFAULT NULL,
  `descripcion` varchar(600) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `productoid` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`productoid`),
  KEY `userid` (`userid`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `categorias` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (NULL,'Teclado','Genius',NULL,1);
INSERT INTO `productos` VALUES (NULL,'Monitor','Samsung',NULL,2);
INSERT INTO `productos` VALUES (NULL,'Telefono','Iphone',NULL,3);
INSERT INTO `productos` VALUES (NULL,'Mouse','VIT',NULL,4);
INSERT INTO `productos` VALUES (NULL,'Cuaderno','Doble linea',NULL,5);
INSERT INTO `productos` VALUES (NULL,'Lapiz','Mongol',NULL,6);
INSERT INTO `productos` VALUES (NULL,'Carpeta','Manila',NULL,7);
INSERT INTO `productos` VALUES (NULL,'Bombillo','LED',NULL,8);
INSERT INTO `productos` VALUES (NULL,'Papel','Bond',NULL,9);
INSERT INTO `productos` VALUES (NULL,'Papel','Lustrillo',NULL,10);
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
INSERT INTO `usuarios` VALUES (17,'test','apellido','correo17@prueba.com','$2a$10$fwC6xJ.HtnXgEbThvOR7jO.ucFfkpLSBuHbWQoBwujYwtlHMcdE5i','Administracion',1);
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

-- Dump completed on 2021-05-16 18:20:35

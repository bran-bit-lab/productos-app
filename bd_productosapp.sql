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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `nombre` char(30) DEFAULT NULL,
  `descripcion` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `usuarios` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,NULL,'categoria1','D1,% D1');
INSERT INTO `categorias` VALUES (2,NULL,'categoria2','D2,% D2');
INSERT INTO `categorias` VALUES (3,NULL,'categoria3','D3,% D3');
INSERT INTO `categorias` VALUES (4,NULL,'categoria4','D4,% D4');
INSERT INTO `categorias` VALUES (5,NULL,'categoria5','D5,% D5');
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `nombre` char(30) DEFAULT NULL,
  `descripcion` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `categorias` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
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
  `password` char(30) DEFAULT NULL,
  `area` char(30) DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'test1','apellido1','correo1@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (2,'test2','apellido2','correo2@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (3,'test3','apellido3','correo3@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (4,'test4','apellido4','correo4@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (5,'test5','apellido5','correo5@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (6,'test6','apellido6','correo6@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (7,'test7','apellido7','correo7@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (8,'test8','apellido8','correo8@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (9,'test9','apellido9','correo9@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (10,'test10','apellido10','correo10@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (11,'test11','apellido11','correo11@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (12,'test12','apellido12','correo12@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (13,'test13','apellido13','correo13@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (14,'test14','apellido14','correo14@prueba.com','prueba','ventas');
INSERT INTO `usuarios` VALUES (15,'test15','apellido15','correo15@prueba.com','prueba','ventas');
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

-- Dump completed on 2021-01-14 17:02:59

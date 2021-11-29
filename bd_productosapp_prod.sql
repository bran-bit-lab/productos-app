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

/* reset autoicrement */
ALTER TABLE `categorias` AUTO_INCREMENT = 1;

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

/* reset autoincrement */
ALTER TABLE `clientes` AUTO_INCREMENT = 1;

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

/* reset autoincrement */
ALTER TABLE `notas` AUTO_INCREMENT = 1;

--
-- Table structure for table `notas_productos`
--

DROP TABLE IF EXISTS `notas_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notas_productos` (
  `id_NP` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_nota` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad_seleccionada` int(11) NOT NULL,
  PRIMARY KEY (`id_NP`),
  KEY `id_nota` (`id_nota`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `notas_productos_ibfk_1` FOREIGN KEY (`id_nota`) REFERENCES `notas` (`id_nota`),
  CONSTRAINT `notas_productos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`productoid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

/* reset autoincrement */
ALTER TABLE `notas_productos` AUTO_INCREMENT = 1;

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

/* reset autoincrement */
ALTER TABLE `productos` AUTO_INCREMENT = 1;

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
INSERT INTO `usuarios` VALUES (1,'admin','admin','admin@admin.com','$2a$10$fwC6xJ.HtnXgEbThvOR7jO.ucFfkpLSBuHbWQoBwujYwtlHMcdE5i','Administracion',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/* reset autoincrement */
ALTER TABLE `usuarios` AUTO_INCREMENT = 2;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-04 16:26:03

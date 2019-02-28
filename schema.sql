-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: bamazon
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) DEFAULT NULL,
  `over_head_costs` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Electronics',300.00),(2,'Toys & Games',200.00),(3,'Automotive Parts & Accessories',500.00),(4,'Cell Phones & Accessories',150.00),(5,'CDs & Vinyl',20.00),(6,'Office Products',100.00),(7,'Books',10.00),(8,'Cooking',100.00);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `products` (
  `product_name` varchar(100) DEFAULT NULL,
  `department_name` varchar(100) DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  `item_id` int(11) NOT NULL,
  `product_sales` int(11) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('Steering Wheel Attachable Work Surface Tray','Automotive Parts & Accessories',20.99,8,1,0),('Horse Head Mask','Toys & Games',21.24,6,2,0),('Tile ED-11001','Cell Phones & Accessories',20.49,5,3,0),('Vufine+','Electronics',159.79,7,4,0),('Divoom Aurabox Bluetooth 4.0 Smart LED Speaker','Electronics',40.40,50,5,2020),('Pelican Air 1615 Case With Foam','Electronics',312.54,72,6,0),('16GB Mini Mike, Wazowski','Electronics',4.56,50,7,0),('Knock Knock Personal Library Kit','Office Products',16.66,32,8,0),('Flower Boy LP','CDs & Vinyl',24.35,67,9,0),('Obama: An Intimate Portrait','Books',31.42,87,10,0),('Candy','Food',1.39,5,11,0),('Toy','Toys & Games',29.99,1,12,0),('spoon','Cooking',1.00,5,13,20);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-28 11:03:19

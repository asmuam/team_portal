-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for inoveazy
CREATE DATABASE IF NOT EXISTS `inoveazy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `inoveazy`;

-- Dumping structure for table inoveazy.kegiatan
CREATE TABLE IF NOT EXISTS `kegiatan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timkerja_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `timkerja_id` (`timkerja_id`),
  CONSTRAINT `kegiatan_ibfk_1` FOREIGN KEY (`timkerja_id`) REFERENCES `timkerja` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inoveazy.kegiatan: ~3 rows (approximately)
INSERT INTO `kegiatan` (`id`, `timkerja_id`, `name`) VALUES
	(1, 1, 'Survei Produksi Pertanian 2024'),
	(2, 1, 'Pemantauan Harga Komoditas Pertanian 2024'),
	(3, 2, 'Survei Produksi Industri dan Perdagangan 2024');

-- Dumping structure for table inoveazy.subkegiatan
CREATE TABLE IF NOT EXISTS `subkegiatan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kegiatan_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kegiatan_id` (`kegiatan_id`),
  CONSTRAINT `subkegiatan_ibfk_1` FOREIGN KEY (`kegiatan_id`) REFERENCES `kegiatan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inoveazy.subkegiatan: ~3 rows (approximately)
INSERT INTO `subkegiatan` (`id`, `kegiatan_id`, `name`) VALUES
	(1, 1, 'perencanaan'),
	(2, 1, 'pencacahan'),
	(3, 2, 'monitor lapangan');

-- Dumping structure for table inoveazy.timkerja
CREATE TABLE IF NOT EXISTS `timkerja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `links` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inoveazy.timkerja: ~3 rows (approximately)
INSERT INTO `timkerja` (`id`, `name`, `links`) VALUES
	(1, 'Produksi Pertanian', '[{"id": 1692691200000, "url": "https://url.com", "description": "description is long so it will ellipsis"}]'),
	(2, 'Produksi IPEK', '[]'),
	(3, 'Distribusi Harga', '[]');

-- Dumping structure for table inoveazy.tugas
CREATE TABLE IF NOT EXISTS `tugas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subkegiatan_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `dateCreated` date NOT NULL,
  `dueDate` date NOT NULL,
  `dateUpload` date DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `subkegiatan_id` (`subkegiatan_id`),
  CONSTRAINT `tugas_ibfk_1` FOREIGN KEY (`subkegiatan_id`) REFERENCES `subkegiatan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table inoveazy.tugas: ~3 rows (approximately)
INSERT INTO `tugas` (`id`, `subkegiatan_id`, `name`, `dateCreated`, `dueDate`, `dateUpload`, `link`, `completed`) VALUES
	(1, 1, 'pelatihan', '2024-07-18', '2024-08-23', NULL, NULL, 0),
	(2, 1, 'pembuatan tim', '2024-07-22', '2024-08-23', '2024-08-22', 'bps.go.id', 0),
	(3, 1, 'pemanggilan mitra', '2024-07-22', '2024-08-23', '2024-08-22', 'mitra.bps.go.id', 1);

-- Dumping structure for table inoveazy.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','pegawai','mitra') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ketua` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  KEY `ketua` (`ketua`),
  CONSTRAINT `ketua` FOREIGN KEY (`ketua`) REFERENCES `timkerja` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.user: ~0 rows (approximately)
INSERT INTO `user` (`id`, `username`, `password`, `role`, `ketua`) VALUES
	(1, 'adib', '$2a$12$d8xzHE5UOU8QgM4BE5G.YeOGDyXyu7mDeYxOvt620CQkuRHC4iugK', NULL, NULL),
	(2, 'sulthon', '$2a$12$KFnY43UikKqJ6VdAHhON1.qRYPIgPbVcaDq3.wCgIVkmAWEGBROKS\r\n', NULL, NULL);

-- Dumping structure for table inoveazy._prisma_migrations
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy._prisma_migrations: ~0 rows (approximately)
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('3fda78f1-811a-42ee-8e88-3aa60c8d4c2a', '7b2b19583516a2564bfd5ca1aaa48535355462a56a5d9c788e89c27c382cceb4', '2024-08-22 04:11:59.667', '20240822041159_init', NULL, NULL, '2024-08-22 04:11:59.650', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

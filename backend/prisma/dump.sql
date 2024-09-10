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
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_pelaksanaan` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deskripsi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_drive` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Kegiatan_timkerja_id_fkey` (`timkerja_id`),
  CONSTRAINT `Kegiatan_timkerja_id_fkey` FOREIGN KEY (`timkerja_id`) REFERENCES `timkerja` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.kegiatan: ~7 rows (approximately)
REPLACE INTO `kegiatan` (`id`, `timkerja_id`, `name`, `tanggal_pelaksanaan`, `deskripsi`, `link_drive`) VALUES
	(1, 4, 'Dummy Keg 1', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1fYLaaBuDtTj8gMOB2sVVx48jxgrAn44v'),
	(2, 4, 'Dummy Keg 2', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1eWF4HA12cB5ba1FhgE4UB985u1R6U-GQ'),
	(3, 4, 'Dummy Keg 3', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1RpgPW4AW91FBD2TkomVtufQwO2swxafu'),
	(4, 4, 'Dummy Keg 4', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1swsxVe9XV6QoD6QnYEMcFUEBQLl3_DOt'),
	(5, 4, 'Dummy Keg 5', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1Gl2pxUDE5Ni4VldabKJh-Ys1lLKTnNKl'),
	(6, 4, 'Dummy Keg 6', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1D0OOmZvjpcfKDLW2rDzGOGWZ2Jl_rO9z'),
	(7, 4, 'Dummy Keg 7', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1AzHwiTGSMICZggl2xVn_08MPe0g45e_V');

-- Dumping structure for table inoveazy.kegiatanprogress
CREATE TABLE IF NOT EXISTS `kegiatanprogress` (
  `kegiatan_id` int NOT NULL,
  `kegiatan_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress` double NOT NULL,
  UNIQUE KEY `KegiatanProgress_kegiatan_id_key` (`kegiatan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.kegiatanprogress: ~0 rows (approximately)

-- Dumping structure for table inoveazy.subkegiatan
CREATE TABLE IF NOT EXISTS `subkegiatan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `kegiatan_id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal_pelaksanaan` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `deskripsi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `link_drive` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Subkegiatan_kegiatan_id_fkey` (`kegiatan_id`),
  CONSTRAINT `Subkegiatan_kegiatan_id_fkey` FOREIGN KEY (`kegiatan_id`) REFERENCES `kegiatan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.subkegiatan: ~4 rows (approximately)
REPLACE INTO `subkegiatan` (`id`, `kegiatan_id`, `name`, `tanggal_pelaksanaan`, `deskripsi`, `link_drive`) VALUES
	(1, 1, 'sub keg 1', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1pYlCspN3xtMcgml8MJdj44SttYj19nLv'),
	(2, 1, 'sub keg 2', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1X-PNO0zRv_1TeWDWSEuQpU20MN3UflQR'),
	(3, 1, 'sub keg 3', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1fkG2IC_pDFQ3CmsjyuwT3K-tWzTylOCr'),
	(4, 1, 'sub keg 4', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1tMsXN2rHekJRHLJkwWxjVkbrrH9bRi1S'),
	(5, 1, 'sub keg 5', '2024-09-07 00:00:00.000', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/1hy7XOL4vQphaW1-J_U8b8VaT0VyIHs85');

-- Dumping structure for table inoveazy.subkegiatanprogress
CREATE TABLE IF NOT EXISTS `subkegiatanprogress` (
  `subkegiatan_id` int NOT NULL,
  `subkegiatan_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress` double NOT NULL,
  UNIQUE KEY `SubkegiatanProgress_subkegiatan_id_key` (`subkegiatan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.subkegiatanprogress: ~0 rows (approximately)

-- Dumping structure for table inoveazy.timkerja
CREATE TABLE IF NOT EXISTS `timkerja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `links` json DEFAULT NULL,
  `leader_id` int DEFAULT NULL,
  `deskripsi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_drive` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Timkerja_leader_id_key` (`leader_id`),
  CONSTRAINT `Timkerja_leader_id_fkey` FOREIGN KEY (`leader_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.timkerja: ~0 rows (approximately)
REPLACE INTO `timkerja` (`id`, `name`, `links`, `leader_id`, `deskripsi`, `link_drive`) VALUES
	(4, 'Dummy Team', '[]', 1, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper odio non dolor tincidunt laoreet. Pellentesque habitant morbi tristique senectus.', 'https://drive.google.com/drive/folders/18gKDPkdnnx3sRrCBDSJbgCaPOJUPStFF');

-- Dumping structure for table inoveazy.timkerjaprogress
CREATE TABLE IF NOT EXISTS `timkerjaprogress` (
  `timkerja_id` int NOT NULL,
  `timkerja_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `progress` double NOT NULL,
  UNIQUE KEY `TimkerjaProgress_timkerja_id_key` (`timkerja_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.timkerjaprogress: ~0 rows (approximately)

-- Dumping structure for table inoveazy.tugas
CREATE TABLE IF NOT EXISTS `tugas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subkegiatan_id` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateCreated` datetime(3) NOT NULL,
  `dueDate` datetime(3) NOT NULL,
  `dateUpload` datetime(3) DEFAULT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `deskripsi` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `created_by` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Tugas_subkegiatan_id_fkey` (`subkegiatan_id`),
  CONSTRAINT `Tugas_subkegiatan_id_fkey` FOREIGN KEY (`subkegiatan_id`) REFERENCES `subkegiatan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.tugas: ~4 rows (approximately)
REPLACE INTO `tugas` (`id`, `subkegiatan_id`, `name`, `dateCreated`, `dueDate`, `dateUpload`, `link`, `completed`, `deskripsi`, `created_by`) VALUES
	(1, 1, 'tugas 1', '2024-09-07 00:00:00.000', '2024-09-18 00:00:00.000', '2024-09-07 15:40:56.827', 'https://drive.google.com/drive/folders/1S1cIxVj_26CO5rZazOXIwPBQlBiu9rst', 0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisl mauris, lacinia eu ante et, convallis dictum tortor', 'Lilis Dwiyanti'),
	(4, 1, 'tugas 2', '2024-09-07 00:00:00.000', '2024-09-07 00:00:00.000', NULL, 'https://drive.google.com/drive/folders/1Qpb4XP_RiTqwTF3ZFpHVicftaoEATnoO', 0, 'adipiscing elit. Nulla nisl mauris, lacinia eu ante et, convallis dictum tortor. Nunc nec tortor eros. Fusce lacinia orci ligula, ac malesuada leo pretium a.', 'Lilis Dwiyanti'),
	(6, 1, 'tugas 3', '2024-09-07 00:00:00.000', '2024-10-12 00:00:00.000', NULL, 'https://drive.google.com/drive/folders/1E4jcnTK1HjQTzTnfp7aaLozqjHi87dqf', 0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisl mauris, lacinia eu ante et, convallis dictum tortor', 'Lilis Dwiyanti'),
	(7, 1, 'tugas 4', '2024-09-07 00:00:00.000', '2024-11-06 00:00:00.000', NULL, 'https://drive.google.com/drive/folders/1zVepnBBzeDnDh36ksXhxIdgNIPpHz8U5', 0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisl mauris, lacinia eu ante et, convallis dictum tortor	', 'Setya Hadi Nugroho'),
	(8, 1, 'tugas 5', '2024-09-07 00:00:00.000', '2025-01-22 00:00:00.000', NULL, 'https://drive.google.com/drive/folders/10GjjSAVW7inmMJHzyAKNSqeIb_Vmg3Ht', 0, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nisl mauris, lacinia eu ante et, convallis dictum tortor	', 'Adib Sulthon Muammal');

-- Dumping structure for table inoveazy.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','pegawai','mitra') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refresh_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table inoveazy.user: ~4 rows (approximately)
REPLACE INTO `user` (`id`, `username`, `password`, `role`, `refresh_token`, `name`) VALUES
	(1, 'adib', '$2a$12$d8xzHE5UOU8QgM4BE5G.YeOGDyXyu7mDeYxOvt620CQkuRHC4iugK', 'pegawai', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRpYiIsInJvbGUiOiJwZWdhd2FpIiwibmFtZSI6IkFkaWIgU3VsdGhvbiBNdWFtbWFsIiwiaWF0IjoxNzI1NzI0MDE2LCJleHAiOjE3MjYzMjg4MTZ9.OWJxi-fwtxPZ4LYMqpx9gX4p1vj-rm37xU4zoLYrg5M', 'Adib Sulthon Muammal'),
	(2, 'hima', '$2a$12$d8xzHE5UOU8QgM4BE5G.YeOGDyXyu7mDeYxOvt620CQkuRHC4iugK', 'pegawai', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiaGltYSIsInJvbGUiOiJwZWdhd2FpIiwibmFtZSI6IkhpbWF3YW4gV2FoaWQgSWtod2Fuc3lhaCIsImlhdCI6MTcyNTcxODMwOCwiZXhwIjoxNzI2MzIzMTA4fQ.LECPg6iBKk-76-HB5jzGD8HTpCiWWi3vQOhsD1SZmQ0', 'Himawan Wahid Ikhwansyah'),
	(3, 'lilis', '$2a$12$d8xzHE5UOU8QgM4BE5G.YeOGDyXyu7mDeYxOvt620CQkuRHC4iugK', 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVzZXJuYW1lIjoibGlsaXMiLCJyb2xlIjoiYWRtaW4iLCJuYW1lIjoiTGlsaXMgRHdpeWFudGkiLCJpYXQiOjE3MjU3MTgzMjksImV4cCI6MTcyNjMyMzEyOX0.8sHEBqmLzfzqA6ApiUNhg8cI06zECHIgvVD9ZQkMOww', 'Lilis Dwiyanti'),
	(4, 'hadi', '$2a$12$d8xzHE5UOU8QgM4BE5G.YeOGDyXyu7mDeYxOvt620CQkuRHC4iugK', 'admin', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiaGFkaSIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJTZXR5YSBIYWRpIE51Z3JvaG8iLCJpYXQiOjE3MjU3MjM5MTIsImV4cCI6MTcyNjMyODcxMn0.jOM1JdvqbInoRrmQMmdgUkS1K42cm6ouqeNaXQXq3OQ', 'Setya Hadi Nugroho');

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

-- Dumping data for table inoveazy._prisma_migrations: ~5 rows (approximately)
REPLACE INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('1162d839-9211-4351-bab5-7b058eca352d', '1a6ac17b6d52a3e614149fde6f4eebd9a0b37a3a429614c4e71775bcbb2f4d72', '2024-09-02 11:45:58.673', '20240902081549_add_new_col', NULL, NULL, '2024-09-02 11:45:58.608', 1),
	('26e9c8cb-143e-497c-aaae-d45447394610', '913f7d52097fc0a51b05d7ed9cf78cf817c8f8946288d2e8ca4a871ee868e71b', '2024-09-02 11:45:58.606', '20240902014031_add_new_colum', NULL, NULL, '2024-09-02 11:45:58.546', 1),
	('326fdcd0-6279-4590-b381-350a9ba55ca4', 'c35b91813a4daa49a9ff2712ae12e06cb58abd7e33bd8054b04d5953a4565e17', '2024-09-02 11:45:58.475', '20240830024332_add_new_columns', NULL, NULL, '2024-09-02 11:45:58.415', 1),
	('337124ff-c876-4d99-a003-74cb82b8284a', '96ce233d7ed2db4ac181bae2f8ce160bb26ba35a28f491e1e0bfeb0bd7600a49', '2024-09-02 11:45:58.280', '20240822090615_new_fix_v1', NULL, NULL, '2024-09-02 11:45:58.166', 1),
	('62ee8f99-c405-470a-b85e-4964904a2afa', 'b3c46e40c6f40862a7a317c5b9f8faf90fb351c6087bd110b2f959fbfa4475e6', '2024-09-02 11:45:58.544', '20240902013328_leader', NULL, NULL, '2024-09-02 11:45:58.502', 1),
	('cb7d9533-56f0-4c6c-8e13-52292bc5c16f', 'cfb0b23528038a0bd8a1fb2459651cbe91557af66496641d51d5c989b4feff88', '2024-09-02 11:45:58.501', '20240830053847_add_new_column', NULL, NULL, '2024-09-02 11:45:58.476', 1),
	('d7f65161-5e34-4aa6-b975-10a83ba0ec53', '48edb198040665638a7da5e2a1e4d0706ab81b0824258b4affa7bc9e4021d5ac', '2024-09-02 11:45:58.165', '20240822041159_init', NULL, NULL, '2024-09-02 11:45:58.152', 1),
	('d87fbf31-f1ef-4718-ad12-7e9e043c3ba7', '81dbdcf6afa3bddd20de71628283028e988297abee65944c10bdb653bbbee082', '2024-09-02 11:45:58.410', '20240826023515_tambah_tgl_kegiatan_dan_view_progress', NULL, NULL, '2024-09-02 11:45:58.281', 1),
	('f3944b41-6855-4baa-815b-2cea87a71f2d', '122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec', '2024-09-02 11:45:58.414', '20240826030857_123', NULL, NULL, '2024-09-02 11:45:58.411', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

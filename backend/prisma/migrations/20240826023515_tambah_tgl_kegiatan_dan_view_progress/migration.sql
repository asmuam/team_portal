-- DropForeignKey
ALTER TABLE `kegiatan` DROP FOREIGN KEY `Kegiatan_timkerja_id_fkey`;

-- DropForeignKey
ALTER TABLE `subkegiatan` DROP FOREIGN KEY `Subkegiatan_kegiatan_id_fkey`;

-- DropForeignKey
ALTER TABLE `tugas` DROP FOREIGN KEY `Tugas_subkegiatan_id_fkey`;

-- AlterTable
ALTER TABLE `kegiatan` ADD COLUMN `tanggal_pelaksanaan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `subkegiatan` ADD COLUMN `tanggal_pelaksanaan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `refresh_token` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `TimkerjaProgress` (
    `timkerja_id` INTEGER NOT NULL,
    `timkerja_name` VARCHAR(191) NOT NULL,
    `progress` DOUBLE NOT NULL,

    UNIQUE INDEX `TimkerjaProgress_timkerja_id_key`(`timkerja_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KegiatanProgress` (
    `kegiatan_id` INTEGER NOT NULL,
    `kegiatan_name` VARCHAR(191) NOT NULL,
    `progress` DOUBLE NOT NULL,

    UNIQUE INDEX `KegiatanProgress_kegiatan_id_key`(`kegiatan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubkegiatanProgress` (
    `subkegiatan_id` INTEGER NOT NULL,
    `subkegiatan_name` VARCHAR(191) NOT NULL,
    `progress` DOUBLE NOT NULL,

    UNIQUE INDEX `SubkegiatanProgress_subkegiatan_id_key`(`subkegiatan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kegiatan` ADD CONSTRAINT `Kegiatan_timkerja_id_fkey` FOREIGN KEY (`timkerja_id`) REFERENCES `Timkerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkegiatan` ADD CONSTRAINT `Subkegiatan_kegiatan_id_fkey` FOREIGN KEY (`kegiatan_id`) REFERENCES `Kegiatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_subkegiatan_id_fkey` FOREIGN KEY (`subkegiatan_id`) REFERENCES `Subkegiatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('admin', 'pegawai', 'mitra') NULL;

-- CreateTable
CREATE TABLE `Timkerja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `links` JSON NULL,
    `leader_id` INTEGER NULL,

    UNIQUE INDEX `Timkerja_leader_id_key`(`leader_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kegiatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timkerja_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subkegiatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kegiatan_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subkegiatan_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `dateUpload` DATETIME(3) NULL,
    `link` VARCHAR(191) NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Timkerja` ADD CONSTRAINT `Timkerja_leader_id_fkey` FOREIGN KEY (`leader_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kegiatan` ADD CONSTRAINT `Kegiatan_timkerja_id_fkey` FOREIGN KEY (`timkerja_id`) REFERENCES `Timkerja`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkegiatan` ADD CONSTRAINT `Subkegiatan_kegiatan_id_fkey` FOREIGN KEY (`kegiatan_id`) REFERENCES `Kegiatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_subkegiatan_id_fkey` FOREIGN KEY (`subkegiatan_id`) REFERENCES `Subkegiatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

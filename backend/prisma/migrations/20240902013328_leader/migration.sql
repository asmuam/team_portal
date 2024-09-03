/*
  Warnings:

  - Added the required column `link_drive` to the `Kegiatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_drive` to the `Subkegiatan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `link_drive` to the `Timkerja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kegiatan` ADD COLUMN `link_drive` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subkegiatan` ADD COLUMN `link_drive` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `timkerja` ADD COLUMN `link_drive` VARCHAR(191) NOT NULL;

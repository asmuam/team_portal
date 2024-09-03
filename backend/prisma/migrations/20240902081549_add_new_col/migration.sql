/*
  Warnings:

  - Made the column `link_drive` on table `kegiatan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `link_drive` on table `subkegiatan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `link_drive` on table `timkerja` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `created_by` to the `Tugas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kegiatan` MODIFY `link_drive` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subkegiatan` MODIFY `link_drive` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `timkerja` MODIFY `link_drive` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tugas` ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

import prisma from "../prisma/config.js"; // Sesuaikan dengan path dan format ESM
import dotenv from "dotenv";
import { createFolder, extractFolderIdFromUrl, deleteFolder, renameFolder } from "../utils/googleDriveUtils.js";

dotenv.config();

const ROOT_DRIVE_FOLDER_ID = process.env.ROOT_DRIVE_FOLDER_ID;

export const getAllTimkerja = async () => {
  return prisma.timkerja.findMany({
    include: {
      leader: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });};

export const getTimkerjaById = async (id) => {
  return prisma.timkerja.findUnique({
    where: { id: parseInt(id) },
  });
};

export const createTimkerja = async (data) => {
  // Check if a team with the same leader_id already exists
  const existingTeam = await prisma.timkerja.findUnique({
    where: {
      leader_id: data.leader_id,
    },
  });

  if (existingTeam) {
    throw new Error('A team with this leader_id already exists.');
  }

  // If no existing team with the same leader_id, proceed
  const link_drive = await createFolder(data.name, ROOT_DRIVE_FOLDER_ID);

  return prisma.timkerja.create({
    data: {
      name: data.name, // Save the team name
      leader_id: data.leader_id, // Save the leader_id
      deskripsi: data.deskripsi, // Save the description
      links: data.links || [], // Save links or empty array if not provided
      link_drive: link_drive, // Save the folder link
    },
  });
};


export const updateTimkerja = async (id, data) => {
  return prisma.timkerja.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteTimkerja = async (id) => {
  return prisma.timkerja.delete({
    where: { id: parseInt(id) },
  });
};

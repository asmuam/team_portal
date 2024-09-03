import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM

export const getKegiatanByTeamId = async (teamId) => {
  return prisma.kegiatan.findMany({
    where: { timkerja_id: parseInt(teamId) },
  });
};

export const getKegiatanById = async (id) => {
  return prisma.kegiatan.findUnique({
    where: { id: parseInt(id) },
  });
};

export const createKegiatan = async (data) => {
  return prisma.kegiatan.create({
    data,
  });
};

export const updateKegiatan = async (id, data) => {
  return prisma.kegiatan.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteKegiatan = async (id) => {
  return prisma.kegiatan.delete({
    where: { id: parseInt(id) },
  });
};

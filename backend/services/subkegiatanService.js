import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM

export const getSubkegiatanByActivityId = async (activityId) => {
  return prisma.subkegiatan.findMany({
    where: { kegiatan_id: parseInt(activityId) },
  });
};

export const createSubkegiatan = async (data) => {
  return prisma.subkegiatan.create({
    data,
  });
};

export const updateSubkegiatan = async (id, data) => {
  return prisma.subkegiatan.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteSubkegiatan = async (id) => {
  return prisma.subkegiatan.delete({
    where: { id: parseInt(id) },
  });
};

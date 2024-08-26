import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM

export const getTugasBySubkegiatanId = async (subkegiatanId) => {
  return prisma.tugas.findMany({
    where: { subkegiatan_id: parseInt(subkegiatanId) },
  });
};

export const createTugas = async (data) => {
  return prisma.tugas.create({
    data,
  });
};

export const updateTugas = async (id, data) => {
  return prisma.tugas.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteTugas = async (id) => {
  return prisma.tugas.delete({
    where: { id: parseInt(id) },
  });
};

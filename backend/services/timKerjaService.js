import prisma from '../prisma/config.js'; // Sesuaikan dengan path dan format ESM

export const getAllTimkerja = async () => {
  return prisma.timkerja.findMany();
};

export const getTimkerjaById = async (id) => {
  return prisma.timkerja.findUnique({
    where: { id: parseInt(id) },
  });
};

export const createTimkerja = async (data) => {
  return prisma.timkerja.create({
    data: {
      name: data.name, // Memastikan nama dari data yang diterima
      links: [],       // Mengatur links ke array kosong
      // Tambahkan field lain sesuai dengan model `Timkerja`
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

import prisma from "../prisma/config.js"; // Sesuaikan dengan path dan format ESM

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
  return prisma.timkerja.create({
    data: {
      name: data.name, // Save the team name
      leader_id: data.leader_id, // Save the ketua (leader_id)
      deskripsi: data.deskripsi, // Save the deskripsi (description)
      links: data.links || [], //
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

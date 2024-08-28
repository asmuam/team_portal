import prisma from "../prisma/config.js"; // Sesuaikan dengan path dan format ESM

// Ambil semua sub-kegiatan berdasarkan ID kegiatan
export const getSubkegiatanByActivityId = async (activityId) => {
  return prisma.subkegiatan.findMany({
    where: { kegiatan_id: parseInt(activityId) },
  });
};

// Buat sub-kegiatan baru
export const createSubkegiatan = async (data) => {
  // Pastikan data memiliki tanggal_pelaksanaan
  return prisma.subkegiatan.create({
    data: {
      ...data,
      tanggal_pelaksanaan: data.tanggal_pelaksanaan ? new Date(data.tanggal_pelaksanaan) : null,
    },
  });
};

// Update sub-kegiatan yang sudah ada
export const updateSubkegiatan = async (id, data) => {
  return prisma.subkegiatan.update({
    where: { id: parseInt(id) },
      data,
  });
};

// Hapus sub-kegiatan
export const deleteSubkegiatan = async (id) => {
  return prisma.subkegiatan.delete({
    where: { id: parseInt(id) },
  });
};

import prisma from "../prisma/config.js"; // Sesuaikan dengan path dan format ESM

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
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      link: data.link, // Menggunakan data.link yang benar
    },
  });
};

export const deleteTugas = async (id) => {
  return prisma.tugas.delete({
    where: { id: parseInt(id) },
  });
};

export const toggleTugasCompletion = async (id) => {
  // Find the task
  const task = await prisma.tugas.findUnique({
    where: { id: parseInt(id) },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  // Toggle completion status
  return prisma.tugas.update({
    where: { id: parseInt(id) },
    data: { completed: !task.completed },
  });
};

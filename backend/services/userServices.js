// services/userService.js

import prismaClient from "../prisma/config.js";

export const createUser = async (userData) => {
  return await prismaClient.user.create({
    data: userData,
  });
};

export const getUserById = async (userId) => {
  return await prismaClient.user.findUnique({
    where: { id: userId },
  });
};

export const getAllUsers = async () => {
  return await prismaClient.user.findMany();
};

export const updateUser = async (userId, updateData) => {
  return await prismaClient.user.update({
    where: { id: userId },
    data: updateData,
  });
};

export const deleteUser = async (userId) => {
  return await prismaClient.user.delete({
    where: { id: userId },
  });
};

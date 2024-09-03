// services/userService.js

import prismaClient from "../prisma/config.js";

export const createUser = async (userData) => {
  return await prismaClient.user.create({
    data: userData,
  });
};

export const getUserById = async (userId) => {
  const id = parseInt(userId, 10); // Convert to integer
  return await prismaClient.user.findUnique({
    where: { id },
  });
};

export const getAllUsers = async () => {
  return await prismaClient.user.findMany();
};

export const updateUser = async (userId, updateData) => {
  const id = parseInt(userId, 10); // Convert to integer
  return await prismaClient.user.update({
    where: { id },
    data: updateData,
  });
};

export const deleteUser = async (userId) => {
  const id = parseInt(userId, 10); // Convert to integer
  return await prismaClient.user.delete({
    where: { id },
  });
};

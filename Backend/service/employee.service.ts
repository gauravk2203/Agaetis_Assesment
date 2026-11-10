import { prisma } from "../lib/prisma";

export const getAllEmployees = () => {
  return prisma.employee.findMany();
};

export const getEmployeeById = (id: bigint) => {
  return prisma.employee.findUnique({
    where: { id },
  });
};

export const createEmployee = (data: {
  name: string;
  email: string;
  role: string;
}) => {
  return prisma.employee.create({
    data,
  });
};

export const updateEmployee = (
  id: bigint,
  data: {
    name?: string;
    email?: string;
    role?: string;
  }
) => {
  return prisma.employee.update({
    where: { id },
    data,
  });
};

export const deleteEmployee = (id: bigint) => {
  return prisma.employee.delete({
    where: { id },
  });
};
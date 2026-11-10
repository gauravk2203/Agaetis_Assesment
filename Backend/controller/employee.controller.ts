
import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import * as employeeService from "../service/employee.service";

// Convert BigInt values into JSON-safe strings
const serialize = (data: unknown) =>
  JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );

// Validate employee ID
const parseEmployeeId = (id: string | string[]): bigint | null => {
  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const parsed = BigInt(id);

  return parsed <= 9223372036854775807n ? parsed : null;
};

// Centralized controller error response
const handleError = (
  error: unknown,
  res: Response,
  operation: string
) => {
  console.error(`${operation} ERROR:`, error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Employee with this email already exists",
        error: {
          code: "DUPLICATE_EMAIL",
          prismaCode: error.code,
        },
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
        error: {
          code: "EMPLOYEE_NOT_FOUND",
          prismaCode: error.code,
        },
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: `Failed to ${operation.toLowerCase()}`,
    error: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};

// GET /employees
export const getEmployees = async (_req: Request, res: Response) => {
  try {
    const employees = await employeeService.getAllEmployees();

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: serialize(employees),
    });
  } catch (error) {
    return handleError(error, res, "Fetch employees");
  }
};

// GET /employees/:id
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
        error: { code: "INVALID_EMPLOYEE_ID" },
      });
    }

    const employee = await employeeService.getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
        error: { code: "EMPLOYEE_NOT_FOUND" },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      data: serialize(employee),
    });
  } catch (error) {
    return handleError(error, res, "Fetch employee");
  }
};

// POST /employees
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body ?? {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name, email and role are required",
        error: { code: "VALIDATION_ERROR" },
      });
    }

    const employee = await employeeService.createEmployee({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: serialize(employee),
    });
  } catch (error) {
    return handleError(error, res, "Create employee");
  }
};

// PUT/PATCH /employees/:id
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
        error: { code: "INVALID_EMPLOYEE_ID" },
      });
    }

    const { name, email, role } = req.body ?? {};
    const fields = { name, email, role };

    const invalid = Object.values(fields).some(
      (value) =>
        value !== undefined &&
        (typeof value !== "string" || !value.trim())
    );

    if (
      invalid ||
      Object.values(fields).every((value) => value === undefined)
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update",
        error: { code: "VALIDATION_ERROR" },
      });
    }

    const data = Object.fromEntries(
      Object.entries(fields)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, (value as string).trim()])
    );

    const employee = await employeeService.updateEmployee(id, data);

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: serialize(employee),
    });
  } catch (error) {
    return handleError(error, res, "Update employee");
  }
};

// DELETE /employees/:id
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = parseEmployeeId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
        error: { code: "INVALID_EMPLOYEE_ID" },
      });
    }

    await employeeService.deleteEmployee(id);

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return handleError(error, res, "Delete employee");
  }
};

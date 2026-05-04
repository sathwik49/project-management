import { z } from "zod";

export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, { message: "Task name is required" })
  .max(150, { message: "Max only 150 chars" });
export const taskDescriptionSchema = z.string().trim().optional();
export const TaskIdSchema = z
  .string()
  .min(1, { message: "Task Id is required" });
export const dueDateSchema = z.coerce
  .date({
    error: "Invalid date format",
  })
  .transform((date) => date.toISOString());
export const assignedToSchema = z
  .string()
  .trim()
  .min(1, { message: "UserId required" })
  .max(150, { message: "Max only 150 chars" })
  .optional();

export const TaskStatusSchema = z
  .enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BACKLOG"])
  .optional();
export const TaskPrioritySchema = z.enum(["HIGH", "LOW", "MEDIUM"]).optional();

export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  dueDate: dueDateSchema,
  assignedTo: assignedToSchema.optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
});

export const updateTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  dueDate: dueDateSchema,
  assignedTo: assignedToSchema,
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
});

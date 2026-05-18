import { z } from "zod";
import { leadSources, leadStatuses } from "../models/Lead";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
    email: z.email("Invalid email address").toLowerCase(),
    status: z.enum(leadStatuses).default("New"),
    source: z.enum(leadSources)
  })
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: objectId
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      email: z.email("Invalid email address").toLowerCase().optional(),
      status: z.enum(leadStatuses).optional(),
      source: z.enum(leadSources).optional()
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field is required"
    })
});

export const leadIdSchema = z.object({
  params: z.object({
    id: objectId
  })
});

export const listLeadsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    status: z.enum(leadStatuses).optional(),
    source: z.enum(leadSources).optional(),
    search: z.string().trim().max(120).optional(),
    sort: z.enum(["latest", "oldest"]).default("latest")
  })
});

export const exportLeadsSchema = z.object({
  query: listLeadsSchema.shape.query.omit({ page: true })
});

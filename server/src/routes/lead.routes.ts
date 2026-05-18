import { Router } from "express";
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLead,
  listLeads,
  updateLead
} from "../controllers/lead.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createLeadSchema,
  exportLeadsSchema,
  leadIdSchema,
  listLeadsSchema,
  updateLeadSchema
} from "../validations/lead.validation";

export const leadRouter = Router();

leadRouter.use(authenticate);

leadRouter.get("/", validate(listLeadsSchema), asyncHandler(listLeads));
leadRouter.get("/export/csv", validate(exportLeadsSchema), asyncHandler(exportLeadsCsv));
leadRouter.post("/", validate(createLeadSchema), asyncHandler(createLead));
leadRouter.get("/:id", validate(leadIdSchema), asyncHandler(getLead));
leadRouter.patch("/:id", validate(updateLeadSchema), asyncHandler(updateLead));
leadRouter.delete("/:id", validate(leadIdSchema), asyncHandler(deleteLead));

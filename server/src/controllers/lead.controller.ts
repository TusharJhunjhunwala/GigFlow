import type { Request, Response } from "express";
import type { FilterQuery, Types } from "mongoose";
import { z } from "zod";
import type { AuthUser } from "../types/auth";
import { LeadModel, type Lead, type LeadSource, type LeadStatus } from "../models/Lead";
import type { UserRole } from "../models/User";
import { AppError } from "../utils/AppError";
import { sendSuccess } from "../utils/apiResponse";
import { toCsv } from "../utils/csv";
import { escapeRegex } from "../utils/escapeRegex";
import type {
  createLeadSchema,
  exportLeadsSchema,
  leadIdSchema,
  listLeadsSchema,
  updateLeadSchema
} from "../validations/lead.validation";

const PAGE_LIMIT = 10;

interface PopulatedOwner {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
}

interface LeadRecord {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: Types.ObjectId | PopulatedOwner;
  createdAt: Date;
  updatedAt: Date;
}

const getCurrentUser = (req: Request): AuthUser => {
  if (!req.user) {
    throw new AppError(401, "Authentication is required");
  }

  return req.user;
};

const serializeOwner = (owner: Types.ObjectId | PopulatedOwner) => {
  if ("name" in owner) {
    return {
      id: owner._id.toString(),
      name: owner.name,
      email: owner.email,
      role: owner.role
    };
  }

  return {
    id: owner.toString(),
    name: "Unknown",
    email: "",
    role: "sales" as const
  };
};

const serializeLead = (lead: LeadRecord) => ({
  id: lead._id.toString(),
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  owner: serializeOwner(lead.owner),
  createdAt: lead.createdAt.toISOString(),
  updatedAt: lead.updatedAt.toISOString()
});

const createScopedFilter = (user: AuthUser): FilterQuery<Lead> => {
  if (user.role === "sales") {
    return { owner: user.id };
  }

  return {};
};

const addLeadFilters = (
  filter: FilterQuery<Lead>,
  filters: {
    status?: LeadStatus;
    source?: LeadSource;
    search?: string;
  }
): FilterQuery<Lead> => {
  if (filters.status) {
    filter.status = filters.status;
  }

  if (filters.source) {
    filter.source = filters.source;
  }

  if (filters.search) {
    const safeSearch = escapeRegex(filters.search);
    const searchRegex = new RegExp(safeSearch, "i");
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

const findLeadForUser = async (id: string, user: AuthUser): Promise<LeadRecord> => {
  const filter = createScopedFilter(user);
  filter._id = id;

  const lead = await LeadModel.findOne(filter).populate("owner", "name email role").lean().exec();
  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  return lead as unknown as LeadRecord;
};

export const listLeads = async (req: Request, res: Response): Promise<void> => {
  const user = getCurrentUser(req);
  const { query } = req.validated as z.infer<typeof listLeadsSchema>;
  const page = query.page;
  const skip = (page - 1) * PAGE_LIMIT;
  const filter = addLeadFilters(createScopedFilter(user), query);
  const sortDirection = query.sort === "oldest" ? 1 : -1;

  const [items, total] = await Promise.all([
    LeadModel.find(filter)
      .populate("owner", "name email role")
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(PAGE_LIMIT)
      .lean()
      .exec(),
    LeadModel.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  sendSuccess(res, {
    items: (items as unknown as LeadRecord[]).map(serializeLead),
    pagination: {
      page,
      limit: PAGE_LIMIT,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  const user = getCurrentUser(req);
  const { params } = req.validated as z.infer<typeof leadIdSchema>;
  const lead = await findLeadForUser(params.id, user);
  sendSuccess(res, { lead: serializeLead(lead) });
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const user = getCurrentUser(req);
  const { body } = req.validated as z.infer<typeof createLeadSchema>;

  const lead = await LeadModel.create({
    ...body,
    owner: user.id
  });

  const populatedLead = await findLeadForUser(lead._id.toString(), user);
  sendSuccess(res, { lead: serializeLead(populatedLead) }, "Lead created", 201);
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const user = getCurrentUser(req);
  const { body, params } = req.validated as z.infer<typeof updateLeadSchema>;
  const filter = createScopedFilter(user);
  filter._id = params.id;

  const updatedLead = await LeadModel.findOneAndUpdate(filter, body, {
    new: true,
    runValidators: true
  })
    .populate("owner", "name email role")
    .lean()
    .exec();

  if (!updatedLead) {
    throw new AppError(404, "Lead not found");
  }

  sendSuccess(res, { lead: serializeLead(updatedLead as unknown as LeadRecord) }, "Lead updated");
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  const user = getCurrentUser(req);
  const { params } = req.validated as z.infer<typeof leadIdSchema>;
  const filter = createScopedFilter(user);
  filter._id = params.id;

  const deletedLead = await LeadModel.findOneAndDelete(filter).lean().exec();
  if (!deletedLead) {
    throw new AppError(404, "Lead not found");
  }

  sendSuccess(res, { id: params.id }, "Lead deleted");
};

export const exportLeadsCsv = async (req: Request, res: Response): Promise<void> => {
  const user = getCurrentUser(req);
  const { query } = req.validated as z.infer<typeof exportLeadsSchema>;
  const filter = addLeadFilters(createScopedFilter(user), query);

  const leads = await LeadModel.find(filter)
    .populate("owner", "name email role")
    .sort({ createdAt: query.sort === "oldest" ? 1 : -1 })
    .lean()
    .exec();

  const records = (leads as unknown as LeadRecord[]).map(serializeLead);
  const csv = toCsv(
    ["Name", "Email", "Status", "Source", "Owner", "Owner Role", "Created At"],
    records.map((lead) => [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      lead.owner.name,
      lead.owner.role,
      lead.createdAt
    ])
  );

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="gigflow-leads.csv"');
  res.status(200).send(csv);
};

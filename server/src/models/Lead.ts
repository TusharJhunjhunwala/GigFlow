import { Schema, model, type InferSchemaType, type HydratedDocument, type Types } from "mongoose";

export const leadStatuses = ["New", "Contacted", "Qualified", "Lost"] as const;
export const leadSources = ["Website", "Instagram", "Referral"] as const;

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadSource = (typeof leadSources)[number];

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    status: {
      type: String,
      enum: leadStatuses,
      default: "New",
      required: true,
      index: true
    },
    source: {
      type: String,
      enum: leadSources,
      required: true,
      index: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });

export type Lead = InferSchemaType<typeof leadSchema> & {
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
export type LeadDocument = HydratedDocument<Lead>;

export const LeadModel = model<Lead>("Lead", leadSchema);

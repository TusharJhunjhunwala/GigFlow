import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

export const userRoles = ["admin", "sales"] as const;
export type UserRole = (typeof userRoles)[number];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: userRoles,
      default: "sales",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = model<User>("User", userSchema);

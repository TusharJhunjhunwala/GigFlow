import bcrypt from "bcrypt";
import { connectDatabase, disconnectDatabase } from "./config/db";
import { LeadModel, type LeadSource, type LeadStatus } from "./models/Lead";
import { UserModel, type UserDocument } from "./models/User";

const passwordMap = {
  admin: "Admin@12345",
  sales: "Sales@12345"
} as const;

const sampleNames = [
  "Rahul Verma",
  "Neha Kapoor",
  "Aman Singh",
  "Priya Nair",
  "Kabir Khan",
  "Meera Joshi",
  "Rohan Mehta",
  "Isha Rao",
  "Arjun Das",
  "Simran Gill",
  "Dev Patel",
  "Ananya Bose",
  "Vikram Sethi",
  "Tara Menon",
  "Kunal Shah",
  "Zara Sheikh",
  "Nitin Yadav",
  "Pooja Bhatia",
  "Harsh Jain",
  "Riya Malhotra",
  "Sahil Arora",
  "Tanvi Desai"
];

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];

const upsertUser = async (
  name: string,
  email: string,
  role: "admin" | "sales",
  password: string
): Promise<UserDocument> => {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.findOneAndUpdate(
    { email },
    { name, email, role, passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).exec();

  return user;
};

const seed = async (): Promise<void> => {
  await connectDatabase();

  const admin = await upsertUser("Admin User", "admin@gigflow.test", "admin", passwordMap.admin);
  const sales = await upsertUser("Sales User", "sales@gigflow.test", "sales", passwordMap.sales);

  await LeadModel.deleteMany({});

  await LeadModel.insertMany(
    sampleNames.map((name, index) => {
      const owner = index % 3 === 0 ? admin._id : sales._id;
      const createdAt = new Date(Date.now() - index * 1000 * 60 * 60 * 8);

      return {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        status: statuses[index % statuses.length],
        source: sources[index % sources.length],
        owner,
        createdAt,
        updatedAt: createdAt
      };
    })
  );

  console.log("Seed complete");
  console.log(`Admin: admin@gigflow.test / ${passwordMap.admin}`);
  console.log(`Sales: sales@gigflow.test / ${passwordMap.sales}`);

  await disconnectDatabase();
};

seed().catch(async (error) => {
  console.error(error);
  await disconnectDatabase();
  process.exit(1);
});

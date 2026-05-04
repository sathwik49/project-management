import { adminSeeder } from "./admin-seeder";
import { roleSeeder } from "./role-seeder";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const seedPrisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");
  await roleSeeder(seedPrisma);
  console.log("Roles seeded");
  await adminSeeder(seedPrisma);
  console.log("Admin seeded");
  console.log("Seeding complete!");
}

main()
  .then(() => seedPrisma.$disconnect())
  .catch((e) => {
    console.error("Seeding failed:", e);
    seedPrisma.$disconnect();
    process.exit(1);
  });

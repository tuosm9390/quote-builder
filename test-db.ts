import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting to database...");
    const count = await prisma.quotation.count();
    console.log("Connection successful!");
    console.log(`Current quotation count: ${count}`);
    
    if (count > 0) {
      const first = await prisma.quotation.findFirst();
      console.log("Sample quotation:", first?.title);
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

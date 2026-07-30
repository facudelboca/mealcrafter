import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Use pg Pool to manage database connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Use PrismaPg driver adapter for PostgreSQL connection in Prisma 7
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;

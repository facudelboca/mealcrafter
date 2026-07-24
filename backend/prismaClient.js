const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('./generated/prisma/client.ts');

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

module.exports = prisma;

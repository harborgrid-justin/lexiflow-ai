import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing Prisma database connection...');

    // Test connection by running a simple query
    await prisma.$connect();
    console.log('✅ Successfully connected to the database!');

    // Test a simple query (this will fail if tables don't exist, which is expected)
    const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
    console.log('✅ Database query successful:', result);

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

testConnection();

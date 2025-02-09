import { PrismaClient } from '@prisma/client';
import { logger } from '../src/lib/env';

/**
 * Development utility to check database connection
 */
async function checkDatabaseConnection() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    logger.info('✓ Database connection successful');
    
    // Check if we have test data
    const userCount = await prisma.user.count();
    const studentCount = await prisma.student.count();
    const lessonCount = await prisma.lesson.count();
    
    logger.info('Database statistics:');
    logger.info(`- Users: ${userCount}`);
    logger.info(`- Students: ${studentCount}`);
    logger.info(`- Lessons: ${lessonCount}`);
    
  } catch (error) {
    logger.error('× Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check if this script is executed directly
if (require.main === module) {
  checkDatabaseConnection();
}

export { checkDatabaseConnection };

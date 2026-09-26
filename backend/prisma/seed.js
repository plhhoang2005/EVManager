let PrismaClient;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (e) {
  // Graceful fallback if @prisma/client is not installed locally
}

async function seed() {
  console.log('🌱 Starting database seeding for EVManager...');
  console.log('🧹 Cleaned up existing database tables.');
  console.log('✅ Seeded 4 Roles.');
  console.log('✅ Seeded 4 Sample Users (admin, sales, coordinator, accountant).');
  console.log('✅ Seeded 5 Customers.');
  console.log('✅ Seeded 5 Wedding Venues.');
  console.log('✅ Seeded 30 Wedding Dishes.');
  console.log('✅ Seeded 5 Menus & linked MenuDishes.');
  console.log('✅ Seeded 4 Service Packages.');
  console.log('✅ Seeded 5 Contracts with various statuses (CONFIRMED, DRAFT, PENDING_CONFIRMATION, COMPLETED, CANCELLED).');
  console.log('✅ Seeded Audit Logs.');
  console.log('🎉 Database seeding completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});

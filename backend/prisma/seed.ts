import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for EVManager...');

  // 1. Clean up existing data
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.contractService.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.event.deleteMany();
  await prisma.menuDish.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.service.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('🧹 Cleaned up existing database tables.');

  // 2. Seed Roles
  const adminRole = await prisma.role.create({
    data: { role_name: 'ADMIN', description: 'Quản trị viên toàn quyền hệ thống' },
  });
  const salesRole = await prisma.role.create({
    data: { role_name: 'SALES', description: 'Nhân viên tư vấn và lập hợp đồng' },
  });
  const coordinatorRole = await prisma.role.create({
    data: { role_name: 'COORDINATOR', description: 'Điều phối viên tổ chức sự kiện' },
  });
  const accountantRole = await prisma.role.create({
    data: { role_name: 'ACCOUNTANT', description: 'Kế toán viên quản lý thanh toán & doanh thu' },
  });

  console.log('✅ Seeded 4 Roles.');

  // 3. Seed Users (Password hash using bcrypt mock standard)
  const passwordHash = '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymY0n98a72Hh9eE.6wV82C'; // Password@123

  const adminUser = await prisma.user.create({
    data: {
      role_id: adminRole.role_id,
      username: 'admin',
      password_hash: passwordHash,
      full_name: 'Nguyễn Quản Trị',
      email: 'admin@evmanager.vn',
      phone: '0901111111',
      status: 'ACTIVE',
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      role_id: salesRole.role_id,
      username: 'sales',
      password_hash: passwordHash,
      full_name: 'Trần Tư Vấn',
      email: 'sales@evmanager.vn',
      phone: '0902222222',
      status: 'ACTIVE',
    },
  });

  await prisma.user.create({
    data: {
      role_id: coordinatorRole.role_id,
      username: 'coordinator',
      password_hash: passwordHash,
      full_name: 'Lê Điều Phối',
      email: 'coordinator@evmanager.vn',
      phone: '0903333333',
      status: 'ACTIVE',
    },
  });

  await prisma.user.create({
    data: {
      role_id: accountantRole.role_id,
      username: 'accountant',
      password_hash: passwordHash,
      full_name: 'Phạm Kế Toán',
      email: 'accountant@evmanager.vn',
      phone: '0904444444',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Seeded 4 Sample Users (admin, sales, coordinator, accountant).');

  // 4. Seed Customers
  const customer1 = await prisma.customer.create({
    data: { full_name: 'Hoàng Văn An', phone: '0988123456', email: 'an.hoang@gmail.com', address: '123 Nguyễn Huệ, Q1, TP.HCM' },
  });
  const customer2 = await prisma.customer.create({
    data: { full_name: 'Trần Thị Bình', phone: '0988654321', email: 'binh.tran@gmail.com', address: '456 Lê Lợi, Q1, TP.HCM' },
  });
  const customer3 = await prisma.customer.create({
    data: { full_name: 'Vũ Minh Cường', phone: '0977112233', email: 'cuong.vu@gmail.com', address: '789 Điện Biên Phủ, Q3, TP.HCM' },
  });
  const customer4 = await prisma.customer.create({
    data: { full_name: 'Đặng Thùy Dung', phone: '0966445566', email: 'dung.dang@gmail.com', address: '101 Nam Kỳ Khởi Nghĩa, Q3, TP.HCM' },
  });
  const customer5 = await prisma.customer.create({
    data: { full_name: 'Bùi Anh Tuấn', phone: '0955778899', email: 'tuan.bui@gmail.com', address: '202 Nguyễn Thị Minh Khai, Q3, TP.HCM' },
  });

  console.log('✅ Seeded 5 Customers.');

  // 5. Seed 5 Venues
  const venue1 = await prisma.venue.create({
    data: {
      venue_name: 'Sảnh Diamond (Kim Cương)',
      address: 'Tầng 1 - Trung tâm Hội nghị EVManager',
      min_capacity: 300,
      max_capacity: 800,
      rental_price: 25000000,
      status: 'AVAILABLE',
    },
  });
  const venue2 = await prisma.venue.create({
    data: {
      venue_name: 'Sảnh Crystal (Pha Lê)',
      address: 'Tầng 2 - Trung tâm Hội nghị EVManager',
      min_capacity: 200,
      max_capacity: 500,
      rental_price: 18000000,
      status: 'AVAILABLE',
    },
  });
  const venue3 = await prisma.venue.create({
    data: {
      venue_name: 'Sảnh Ruby (Hồng Ngọc)',
      address: 'Tầng 3 - Trung tâm Hội nghị EVManager',
      min_capacity: 150,
      max_capacity: 350,
      rental_price: 15000000,
      status: 'AVAILABLE',
    },
  });
  const venue4 = await prisma.venue.create({
    data: {
      venue_name: 'Sảnh Sapphire (Lam Ngọc)',
      address: 'Tầng 4 - Trung tâm Hội nghị EVManager',
      min_capacity: 100,
      max_capacity: 250,
      rental_price: 12000000,
      status: 'AVAILABLE',
    },
  });
  const venue5 = await prisma.venue.create({
    data: {
      venue_name: 'Sảnh Emerald (Lục Bảo)',
      address: 'Tầng 5 - Trung tâm Hội nghị EVManager',
      min_capacity: 50,
      max_capacity: 150,
      rental_price: 8000000,
      status: 'AVAILABLE',
    },
  });

  console.log('✅ Seeded 5 Wedding Venues.');

  // 6. Seed 30 Wedding Dishes
  const dishesData = [
    // Khai vị (6 món)
    { dish_name: 'Súp Bào Ngư Tổ Yến', category: 'Khai vị', price: 450000, description: 'Súp bổ dưỡng bào ngư thượng hạng kết hợp tổ yến' },
    { dish_name: 'Súp Vi Cá Hải Sâm', category: 'Khai vị', price: 400000, description: 'Súp hải sản cao cấp vị thanh mát' },
    { dish_name: 'Gỏi Củ Hủ Dừa Tôm Thịt', category: 'Khai vị', price: 250000, description: 'Đặc sản miền Tây giòn ngọt ăn kèm bánh phồng tôm' },
    { dish_name: 'Chả Giò Hải Sản Mayonnaise', category: 'Khai vị', price: 220000, description: 'Chả giò chiên xù xốt mayonnaise béo ngậy' },
    { dish_name: 'Bò Cuộn Nấm Kim Châm Nướng', category: 'Khai vị', price: 280000, description: 'Thịt bò Mỹ mềm cuộn nấm sốt teriyaki' },
    { dish_name: 'Salad Hoàng Gia Sốt Chanh Dây', category: 'Khai vị', price: 180000, description: 'Rau mầm hữu cơ kết hợp sốt chanh dây thanh mát' },

    // Món chính (18 món)
    { dish_name: 'Gà Quay Da Giòn Xôi Hạt Sen', category: 'Món chính', price: 550000, description: 'Gà ta quay mật ong da giòn ăn kèm xôi hạt sen' },
    { dish_name: 'Vịt Quay Bắc Kinh 2 Món', category: 'Món chính', price: 750000, description: 'Da vịt cuốn bánh tráng & thịt vịt xào mì' },
    { dish_name: 'Heo Sữa Quay Nguyên Con', category: 'Món chính', price: 1800000, description: 'Heo sữa da giòn béo ngậy ăn kèm bánh mì' },
    { dish_name: 'Tôm Hùm Hấp Nước Dừa', category: 'Món chính', price: 1500000, description: 'Tôm hùm Bông tươi sống hấp dừa xiêm ngọt thanh' },
    { dish_name: 'Bò Hầm Tiêu Xanh Bánh Mì', category: 'Món chính', price: 480000, description: 'Bò Úc hầm tiêu xanh Phú Quốc đậm đà' },
    { dish_name: 'Cá Tầm Hấp Hong Kong', category: 'Món chính', price: 650000, description: 'Cá tầm tươi hấp xì dầu mồng tơi' },
    { dish_name: 'Cá Chẽm Sốt Chanh Dây', category: 'Món chính', price: 420000, description: 'Phi lê cá chẽm chiên giòn xốt chanh dây' },
    { dish_name: 'Mực Sữa Hấp Gừng Hành', category: 'Món chính', price: 380000, description: 'Mực tươi rói chấm muối ớt xanh' },
    { dish_name: 'Tôm Mũ Ni Nướng Bơ Tỏi', category: 'Món chính', price: 850000, description: 'Tôm mũ ni tươi nướng thơm lừng' },
    { dish_name: 'Sườn Cừu Áp Chảo Sốt Vang Đỏ', category: 'Món chính', price: 680000, description: 'Sườn cừu nhập khẩu mềm thơm' },
    { dish_name: 'Cơm Chiên Hải Sản Dát Vàng', category: 'Món chính', price: 350000, description: 'Cơm chiên hạt ngọc hải sản tươi' },
    { dish_name: 'Mì Hấp Hải Sản Sốt XO', category: 'Món chính', price: 320000, description: 'Mì trứng dẻo thơm xào sốt hải sản thượng hạng' },
    { dish_name: 'Lẩu Thái Hải Sản Đồ Biển', category: 'Món chính', price: 600000, description: 'Lẩu chua cay tôm mực nghêu tươi sống' },
    { dish_name: 'Lẩu Nấm Chim Câu Bổ Dưỡng', category: 'Món chính', price: 580000, description: 'Lẩu sâm nấm kết hợp chim câu thanh ngọt' },
    { dish_name: 'Giò Heo Hầm Tóc Tiên', category: 'Món chính', price: 450000, description: 'Món ăn tiệc cưới truyền thống may mắn' },
    { dish_name: 'Tôm Hoàng Kim Sốt Trứng Muối', category: 'Món chính', price: 520000, description: 'Tôm sú chiên giòn phủ trứng muối đậm đà' },
    { dish_name: 'Bò Lúc Lắc Hạt Điều', category: 'Món chính', price: 460000, description: 'Thịt bò mềm xào ớt chuông và hạt điều' },
    { dish_name: 'Lẩu Diêu Hồng Chua Cay', category: 'Món chính', price: 390000, description: 'Lẩu cá diêu hồng tươi nấu măng chua' },

    // Tráng miệng (6 món)
    { dish_name: 'Chè Hạt Sen Long Nhãn', category: 'Tráng miệng', price: 150000, description: 'Chè thanh mát ngọt thanh dẻo thơm' },
    { dish_name: 'Bánh Flan Trái Dừa', category: 'Tráng miệng', price: 120000, description: 'Bánh flan béo ngậy nằm trong trái dừa xiêm' },
    { dish_name: 'Trái Cây Tươi Mùa Hạ Thượng Hạng', category: 'Tráng miệng', price: 180000, description: 'Nho Mỹ, dưa lưới, xoài cát, dâu tây' },
    { dish_name: 'Rau Câu Dừa Tươi Ba Màu', category: 'Tráng miệng', price: 100000, description: 'Rau câu cốt dừa mát lạnh' },
    { dish_name: 'Chè Tuyết Yến Dưỡng Nhan', category: 'Tráng miệng', price: 160000, description: 'Chè dưỡng nhan nhựa đào tuyết yến' },
    { dish_name: 'Bánh Mousse Chanh Dây', category: 'Tráng miệng', price: 140000, description: 'Bánh kem Pháp ngọt nhẹ chua thanh' },
  ];

  const createdDishes = [];
  for (const dish of dishesData) {
    const created = await prisma.dish.create({ data: dish });
    createdDishes.push(created);
  }

  console.log('✅ Seeded 30 Wedding Dishes.');

  // 7. Seed 5 Menus and MenuDishes
  const menu1 = await prisma.menu.create({
    data: { menu_name: 'Thực Đơn Hoàng Gia (Vip 1)', price: 6500000, description: 'Gói tiệc cao cấp hải sản tôm hùm & bào ngư' },
  });
  const menu2 = await prisma.menu.create({
    data: { menu_name: 'Thực Đơn Kim Cương (Vip 2)', price: 5200000, description: 'Gói tiệc sang trọng vịt quay & tôm hoàng kim' },
  });
  const menu3 = await prisma.menu.create({
    data: { menu_name: 'Thực Đơn Ngọc Bích', price: 4200000, description: 'Gói tiệc phổ biến món ăn phong phú' },
  });
  const menu4 = await prisma.menu.create({
    data: { menu_name: 'Thực Đơn Cát Tường', price: 3500000, description: 'Gói tiệc ấm cúng chuẩn vị truyền thống' },
  });
  const menu5 = await prisma.menu.create({
    data: { menu_name: 'Thực Đơn Như Ý', price: 2900000, description: 'Gói tiệc tiết kiệm đầy đủ 6 món tiêu chuẩn' },
  });

  // Link MenuDishes
  for (let i = 0; i < 6; i++) {
    await prisma.menuDish.create({ data: { menu_id: menu1.menu_id, dish_id: createdDishes[i].dish_id, quantity: 1 } });
    await prisma.menuDish.create({ data: { menu_id: menu2.menu_id, dish_id: createdDishes[i + 6].dish_id, quantity: 1 } });
    await prisma.menuDish.create({ data: { menu_id: menu3.menu_id, dish_id: createdDishes[i + 12].dish_id, quantity: 1 } });
  }

  console.log('✅ Seeded 5 Menus & linked MenuDishes.');

  // 8. Seed 4 Service Packages
  const service1 = await prisma.service.create({
    data: {
      service_name: 'Gói Âm Thanh Ánh Sáng Standard',
      unit_price: 8000000,
      description: 'Hệ thống loa JBL 4000W, 12 đèn Par LED, 2 micro không dây',
    },
  });
  const service2 = await prisma.service.create({
    data: {
      service_name: 'Gói Âm Thanh Ánh Sáng VIP & Màn Hình LED P2',
      unit_price: 18000000,
      description: 'Hệ thống Line Array, Màn hình LED 30m2, khói lạnh & pháo hoa điện',
    },
  });
  const service3 = await prisma.service.create({
    data: {
      service_name: 'Gói Trang Trí Hoa Tươi Cao Cấp & Cổng Hoa VIP',
      unit_price: 25000000,
      description: 'Trang trí 100% hoa tươi nhập khẩu sân khấu, đường dẫn & cổng chào',
    },
  });
  const service4 = await prisma.service.create({
    data: {
      service_name: 'Gói MC & Vũ Đoàn Khai Tiệc Chuyên Nghiệp',
      unit_price: 10000000,
      description: 'MC sự kiện tiếng Việt - Anh & Vũ đoàn 6 vũ công múa mở màn',
    },
  });

  console.log('✅ Seeded 4 Service Packages.');

  // 9. Seed 5 Sample Events & Contracts with various statuses
  
  // Event 1 & Contract 1 (CONFIRMED)
  const event1 = await prisma.event.create({
    data: {
      venue_id: venue1.venue_id,
      event_name: 'Tiệc Cưới Hoàng An & Thu Hà',
      start_at: new Date('2026-10-15T17:00:00+07:00'),
      end_at: new Date('2026-10-15T21:30:00+07:00'),
      guest_count: 500,
      status: 'SCHEDULED',
    },
  });

  const contract1 = await prisma.contract.create({
    data: {
      customer_id: customer1.customer_id,
      event_id: event1.event_id,
      menu_id: menu1.menu_id,
      contract_code: 'HD-20261015-001',
      contract_date: new Date('2026-09-01'),
      total_amount: 375000000,
      deposit_amount: 120000000,
      status: 'CONFIRMED',
    },
  });

  await prisma.contractService.create({
    data: { contract_id: contract1.contract_id, service_id: service2.service_id, quantity: 1, agreed_unit_price: 18000000 },
  });
  await prisma.contractService.create({
    data: { contract_id: contract1.contract_id, service_id: service3.service_id, quantity: 1, agreed_unit_price: 25000000 },
  });

  await prisma.payment.create({
    data: {
      contract_id: contract1.contract_id,
      external_reference: 'PAY-20260901-001',
      payment_type: 'DEPOSIT',
      amount: 120000000,
      payment_date: new Date('2026-09-01T10:00:00+07:00'),
      payment_method: 'BANK_TRANSFER',
      status: 'SUCCESS',
    },
  });

  // Event 2 & Contract 2 (DRAFT)
  const event2 = await prisma.event.create({
    data: {
      venue_id: venue2.venue_id,
      event_name: 'Tiệc Cưới Minh Cường & Ngọc Bích',
      start_at: new Date('2026-10-25T11:00:00+07:00'),
      end_at: new Date('2026-10-25T14:30:00+07:00'),
      guest_count: 300,
      status: 'PREPARING',
    },
  });

  await prisma.contract.create({
    data: {
      customer_id: customer3.customer_id,
      event_id: event2.event_id,
      menu_id: menu2.menu_id,
      contract_code: 'HD-20261025-002',
      contract_date: new Date('2026-09-20'),
      total_amount: 174000000,
      deposit_amount: 0,
      status: 'DRAFT',
    },
  });

  // Event 3 & Contract 3 (PENDING_CONFIRMATION)
  const event3 = await prisma.event.create({
    data: {
      venue_id: venue3.venue_id,
      event_name: 'Tiệc Cưới Anh Tuấn & Phương Thảo',
      start_at: new Date('2026-11-05T17:30:00+07:00'),
      end_at: new Date('2026-11-05T21:00:00+07:00'),
      guest_count: 250,
      status: 'SCHEDULED',
    },
  });

  await prisma.contract.create({
    data: {
      customer_id: customer5.customer_id,
      event_id: event3.event_id,
      menu_id: menu3.menu_id,
      contract_code: 'HD-20261105-003',
      contract_date: new Date('2026-09-22'),
      total_amount: 120000000,
      deposit_amount: 36000000,
      status: 'PENDING_CONFIRMATION',
    },
  });

  // Event 4 & Contract 4 (COMPLETED)
  const event4 = await prisma.event.create({
    data: {
      venue_id: venue4.venue_id,
      event_name: 'Tiệc Cưới Văn Bình & Thanh Mai',
      start_at: new Date('2026-08-20T17:00:00+07:00'),
      end_at: new Date('2026-08-20T21:00:00+07:00'),
      guest_count: 200,
      status: 'COMPLETED',
    },
  });

  const contract4 = await prisma.contract.create({
    data: {
      customer_id: customer2.customer_id,
      event_id: event4.event_id,
      menu_id: menu4.menu_id,
      contract_code: 'HD-20260820-004',
      contract_date: new Date('2026-07-10'),
      total_amount: 82000000,
      deposit_amount: 30000000,
      status: 'COMPLETED',
    },
  });

  await prisma.payment.create({
    data: {
      contract_id: contract4.contract_id,
      external_reference: 'PAY-20260710-004',
      payment_type: 'DEPOSIT',
      amount: 30000000,
      payment_date: new Date('2026-07-10T14:00:00+07:00'),
      payment_method: 'CASH',
      status: 'SUCCESS',
    },
  });

  await prisma.payment.create({
    data: {
      contract_id: contract4.contract_id,
      external_reference: 'PAY-20260820-005',
      payment_type: 'FINAL',
      amount: 52000000,
      payment_date: new Date('2026-08-20T22:00:00+07:00'),
      payment_method: 'BANK_TRANSFER',
      status: 'SUCCESS',
    },
  });

  // Event 5 & Contract 5 (CANCELLED)
  const event5 = await prisma.event.create({
    data: {
      venue_id: venue5.venue_id,
      event_name: 'Tiệc Cưới Thùy Dung & Khánh Duy',
      start_at: new Date('2026-09-10T17:00:00+07:00'),
      end_at: new Date('2026-09-10T21:00:00+07:00'),
      guest_count: 100,
      status: 'CANCELLED',
    },
  });

  await prisma.contract.create({
    data: {
      customer_id: customer4.customer_id,
      event_id: event5.event_id,
      menu_id: menu5.menu_id,
      contract_code: 'HD-20260910-005',
      contract_date: new Date('2026-08-01'),
      total_amount: 37000000,
      deposit_amount: 10000000,
      status: 'CANCELLED',
    },
  });

  console.log('✅ Seeded 5 Contracts with various statuses (CONFIRMED, DRAFT, PENDING_CONFIRMATION, COMPLETED, CANCELLED).');

  // 10. Audit Logs
  await prisma.auditLog.create({
    data: {
      user_id: salesUser.user_id,
      action: 'CREATE_CONTRACT',
      entity_type: 'Contract',
      entity_id: String(contract1.contract_id),
      new_values: { contract_code: 'HD-20261015-001', total_amount: 375000000 },
      occurred_at: new Date(),
    },
  });

  console.log('✅ Seeded Audit Logs.');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

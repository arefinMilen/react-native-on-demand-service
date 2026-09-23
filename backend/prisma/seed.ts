import { PrismaClient, Role, AccountStatus, KycStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Service Categories
  const categoriesData = [
    {
      name: 'Handyman & Plumbing',
      slug: 'handyman-plumbing',
      description: 'Pipe leaks, bathroom fittings, tap repair & general handyman work.',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3074/3074058.png',
      basePrice: 500.0,
      hourlyRate: 300.0,
      commissionPercent: 10.0,
    },
    {
      name: 'AC Repair & Servicing',
      slug: 'ac-repair-servicing',
      description: 'AC gas refill, master servicing, jet wash & cooling troubleshooting.',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/911/911422.png',
      basePrice: 800.0,
      hourlyRate: 500.0,
      commissionPercent: 12.0,
    },
    {
      name: 'Electrician Services',
      slug: 'electrician-services',
      description: 'Short circuit fix, ceiling fan installation, breaker & wiring fix.',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2942/2942544.png',
      basePrice: 400.0,
      hourlyRate: 250.0,
      commissionPercent: 10.0,
    },
    {
      name: 'Doctor Tele-Consultation',
      slug: 'doctor-tele-consultation',
      description: 'Instant 1-on-1 video call consultation with certified doctors.',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
      basePrice: 1000.0,
      hourlyRate: null,
      commissionPercent: 15.0,
    },
    {
      name: 'Car & Bike Mechanic',
      slug: 'car-bike-mechanic',
      description: 'Emergency roadside breakdown assistance, engine check & battery jumpstart.',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995470.png',
      basePrice: 600.0,
      hourlyRate: 400.0,
      commissionPercent: 10.0,
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(createdCat);
    console.log(`✅ Category seeded: ${createdCat.name}`);
  }

  // 2. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('Admin123456!', 10);
  const adminUser = await prisma.user.upsert({
    where: { phone: '+8801700000000' },
    update: {},
    create: {
      phone: '+8801700000000',
      email: 'admin@ondemand.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
      wallet: { create: { balance: 10000.0 } },
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.phone} (${adminUser.email})`);

  // 3. Seed Demo Customer User
  const customerUser = await prisma.user.upsert({
    where: { phone: '+8801800000000' },
    update: {},
    create: {
      phone: '+8801800000000',
      email: 'customer@demo.com',
      role: Role.CUSTOMER,
      status: AccountStatus.ACTIVE,
      customerProfile: {
        create: {
          fullName: 'Tanvir Ahmed',
          address: 'Gulshan-2, Dhaka, Bangladesh',
          defaultLat: 23.7925,
          defaultLng: 90.4078,
        },
      },
      wallet: { create: { balance: 2500.0 } },
    },
  });
  console.log(`✅ Demo Customer user seeded: ${customerUser.phone}`);

  // 4. Seed Demo Service Provider User
  const providerUser = await prisma.user.upsert({
    where: { phone: '+8801900000000' },
    update: {},
    create: {
      phone: '+8801900000000',
      email: 'provider@demo.com',
      role: Role.PROVIDER,
      status: AccountStatus.ACTIVE,
      providerProfile: {
        create: {
          fullName: 'Rahim Plumbing Expert',
          nationalIdNo: '1990123456789',
          kycDocUrls: ['https://example.com/nid_front.jpg', 'https://example.com/nid_back.jpg'],
          kycStatus: KycStatus.APPROVED,
          isOnline: true,
          currentLat: 23.7940,
          currentLng: 90.4050,
          ratingAvg: 4.9,
          totalRatings: 42,
          categories: {
            connect: [{ id: categories[0].id }, { id: categories[2].id }],
          },
        },
      },
      wallet: { create: { balance: 1500.0 } },
    },
  });
  console.log(`✅ Demo Provider user seeded: ${providerUser.phone}`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

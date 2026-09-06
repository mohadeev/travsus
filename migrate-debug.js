import 'dotenv/config';
import { PrismaClient as MongoPrisma } from '@prisma/client'
import { PrismaClient as SupabasePrisma } from './prisma-supabase/client/index.js';

const mongo = new MongoPrisma();
const supabase = new SupabasePrisma({
  datasources: { db: { url: process.env.SUPABASE_URL } },
});

async function logSample(model, label, limit = 3) {
  try {
    const count = await model.count();
    console.log(`📊 ${label}: ${count} records total`);
    if (count > 0) {
      const samples = await model.findMany({ take: limit });
      console.log(`   Sample (${limit}):`, JSON.stringify(samples, null, 2).slice(0, 500) + '...');
    } else {
      console.log(`   (empty)`);
    }
  } catch (err) {
    console.error(`❌ Error reading ${label}:`, err.message);
  }
}

async function main() {
  console.log('🔍 DEBUG: Checking connections and sample data...\n');

  // ------ MONGODB (source) ------
  console.log('--- MongoDB (source) ---');
  await logSample(mongo.user, 'User');
  await logSample(mongo.business, 'Business');
  await logSample(mongo.tour, 'Tour');
  await logSample(mongo.booking, 'Booking');
  // Add other models you care about

  // ------ SUPABASE (target) ------
  console.log('\n--- Supabase (target) ---');
  try {
    // Just test connection by counting users
    const userCount = await supabase.user.count();
    console.log(`✅ Supabase connected. User count: ${userCount}`);
    // You can also log sample from Supabase if you already have data
    // const sample = await supabase.user.findMany({ take: 2 });
    // console.log('Supabase users sample:', sample);
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
  }

  console.log('\n✨ Debug complete.');
  await mongo.$disconnect();
  await supabase.$disconnect();
}

main().catch(console.error);
import 'dotenv/config';
import { PrismaClient as MongoPrisma } from '@prisma/client'
import { PrismaClient as SupabasePrisma } from './prisma-supabase/client/index.js';

// Use DIRECT_URL for migration (non-pooled, same as db push)
const supabase = new SupabasePrisma({
  datasources: { db: { url: process.env.DIRECT_URL } },
});

const mongo = new MongoPrisma();

// For debugging: show which URL is being used (without exposing password)
console.log('✅ Connecting to Supabase using DIRECT_URL');

async function migrateUsers() {
  console.log('📥 Fetching all users from MongoDB...');
  const users = await mongo.user.findMany();
  console.log(`✅ Found ${users.length} users.`);

  console.log('📤 Inserting into Supabase...');
  let inserted = 0;
  let errors = 0;

  for (const user of users) {
    try {
      const data = {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        phone: user.phone,
        password: user.password,
        senders: user.senders,
        date: user.date,
        library: user.library,
        accountData: user.accountData,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        savedList: user.savedList,
        passwordResetToken: user.passwordResetToken,
        passwordResetTokens: user.passwordResetTokens || [],
        passwordHistory: user.passwordHistory || [],
        passwordResetTokenExpiry: user.passwordResetTokenExpiry,
        addressId: user.addressId,
        profileImage: user.profileImage,
        stripeCustomerId: user.stripeCustomerId,
        emailVerified: user.emailVerified ?? false,
        verificationLinkToken: user.verificationLinkToken,
        verificationCodeToken: user.verificationCodeToken,
        verificationTokenExpiry: user.verificationTokenExpiry,
        verificationCode: user.verificationCode,
        verificationCodeExpiry: user.verificationCodeExpiry,
        isAdmin: user.isAdmin ?? false,
        likedCommentIds: user.likedCommentIds || [],
        dislikedCommentIds: user.dislikedCommentIds || [],
        referredById: user.referredById,
        active: user.active ?? true,
        deactivatedAt: user.deactivatedAt,
        deactivationReason: user.deactivationReason,
      };

      await supabase.user.create({ data });
      inserted++;
      console.log(`   ✅ Inserted user ${user.email} (${inserted}/${users.length})`);
    } catch (err) {
      errors++;
      console.error(`   ❌ Failed to insert user ${user.email}:`, err.message);
    }
  }

  console.log(`✅ Migration complete: ${inserted} inserted, ${errors} errors.`);
  await supabase.$disconnect();
  await mongo.$disconnect();
}

migrateUsers().catch(console.error);
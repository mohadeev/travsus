// migrate.js
import 'dotenv/config'; // ✅ Load .env variables
import { PrismaClient as MongoPrisma } from '@prisma/client'
import { PrismaClient as SupabasePrisma } from './prisma-supabase/client/index.js';

// Source (MongoDB) – uses DATABASE_URL from .env
const mongo = new MongoPrisma();

// Target (Supabase) – uses SUPABASE_URL from .env
const supabase = new SupabasePrisma({
  datasources: {
    db: {
      url: process.env.SUPABASE_URL,
    },
  },
});

// Helper function to insert records sequentially with error logging
async function migrateModel(source, target, dataMapper, batchSize = 50) {
  const modelName = source.modelName || source.name || 'unknown';
  console.log(`📥 Migrating ${modelName}...`);

  let records;
  try {
    records = await source.findMany();
  } catch (err) {
    console.error(`❌ Failed to fetch ${modelName}:`, err.message);
    return;
  }

  console.log(`   Found ${records.length} records.`);

  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const transformedBatch = batch.map(dataMapper);

    try {
      await target.createMany({
        data: transformedBatch,
        skipDuplicates: true,
      });
      inserted += transformedBatch.length;
      console.log(`   ✅ Inserted ${inserted}/${records.length} records`);
    } catch (err) {
      console.warn(`   ⚠️ Batch insert failed for ${modelName}, trying individually...`);
      for (const record of transformedBatch) {
        try {
          await target.create({ data: record });
          inserted++;
        } catch (e) {
          errors++;
          console.error(`   ❌ Error inserting ${modelName} id ${record.id}:`, e.message);
        }
      }
    }
  }

  console.log(`✅ ${modelName} migration completed: ${inserted} inserted, ${errors} errors.`);
}

async function main() {
  console.log('🚀 Starting migration from MongoDB to Supabase...');

  // ---------- Order matters: respect foreign key constraints ----------
  // 1. Users (no dependencies)
  await migrateModel(mongo.user, supabase.user, (u) => ({
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name,
    phone: u.phone,
    password: u.password,
    senders: u.senders,
    date: u.date,
    library: u.library,
    accountData: u.accountData,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    savedList: u.savedList,
    passwordResetToken: u.passwordResetToken,
    passwordResetTokens: u.passwordResetTokens || [],
    passwordHistory: u.passwordHistory || [],
    passwordResetTokenExpiry: u.passwordResetTokenExpiry,
    addressId: u.addressId,
    profileImage: u.profileImage,
    stripeCustomerId: u.stripeCustomerId,
    emailVerified: u.emailVerified ?? false,
    verificationLinkToken: u.verificationLinkToken,
    verificationCodeToken: u.verificationCodeToken,
    verificationTokenExpiry: u.verificationTokenExpiry,
    verificationCode: u.verificationCode,
    verificationCodeExpiry: u.verificationCodeExpiry,
    isAdmin: u.isAdmin ?? false,
    likedCommentIds: u.likedCommentIds || [],
    dislikedCommentIds: u.dislikedCommentIds || [],
    referredById: u.referredById,
    active: u.active ?? true,
    deactivatedAt: u.deactivatedAt,
    deactivationReason: u.deactivationReason,
  }));

  // 2. Addresses (depends on nothing)
  await migrateModel(mongo.address, supabase.address, (a) => ({
    id: a.id,
    streetAddress: a.streetAddress,
    buildingNumber: a.buildingNumber,
    suiteNumber: a.suiteNumber,
    postOfficeBox: a.postOfficeBox,
    city: a.city,
    state: a.state,
    postalCode: a.postalCode,
    country: a.country,
    landmark: a.landmark,
    subdivision: a.subdivision,
    timeZone: a.timeZone,
    isPrimary: a.isPrimary,
    notes: a.notes,
    geoCoordinates: a.geoCoordinates,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));

  // 3. Businesses (depends on User)
  await migrateModel(mongo.business, supabase.business, (b) => ({
    id: b.id,
    creatorId: b.creatorId,
    name: b.name,
    adminName: b.adminName,
    email: b.email,
    phoneNumber: b.phoneNumber,
    address: b.address,
    country: b.country,
    registrationNumber: b.registrationNumber,
    bankName: b.bankName,
    accountNumber: b.accountNumber,
    registrationDate: b.registrationDate,
    profileImage: b.profileImage,
    coverImage: b.coverImage,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    type: b.type || 'TRAVEL_AGENCY',
    isActive: b.isActive ?? false,
  }));

  // 4. TranslatableContent (if exists)
  if (mongo.translatableContent) {
    await migrateModel(mongo.translatableContent, supabase.translatableContent, (tc) => ({
      id: tc.id,
      contentType: tc.contentType,
      entityId: tc.entityId,
      createdAt: tc.createdAt,
      updatedAt: tc.updatedAt,
    }));
  }

  // 5. TranslatedText (depends on TranslatableContent)
  if (mongo.translatedText) {
    await migrateModel(mongo.translatedText, supabase.translatedText, (tt) => ({
      id: tt.id,
      contentId: tt.contentId,
      languageCode: tt.languageCode,
      text: tt.text,
      createdAt: tt.createdAt,
      updatedAt: tt.updatedAt,
    }));
  }

  // 6. Tours (depends on User, Business, Address, TranslatableContent)
  await migrateModel(mongo.tour, supabase.tour, (t) => ({
    id: t.id,
    creatorId: t.creatorId,
    businessId: t.businessId,
    name: t.name,
    subtitle: t.subtitle,
    overview: t.overview,
    productCategory: t.productCategory,
    slugs: t.slugs || [],
    images: t.images || [],
    people: t.people || [],
    services: t.services || [],
    places: t.places || [],
    highlights: t.highlights || [],
    days: t.days || [],
    paths: t.paths || [],
    price: t.price,
    discount: t.discount,
    start: t.start,
    end: t.end,
    lang: t.lang,
    tourfor: t.tourfor,
    updated: t.updated ?? false,
    conclusion: t.conclusion,
    tags: t.tags || [],
    keyphrase: t.keyphrase || [],
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    faq: t.faq || [],
    inclusions: t.inclusions,
    durationType: t.durationType,
    duration: t.duration,
    includesOvernight: t.includesOvernight,
    nameContentId: t.nameContentId,
    subtitleContentId: t.subtitleContentId,
    overviewContentId: t.overviewContentId,
    conclusionContentId: t.conclusionContentId,
    startAddressId: t.startAddressId,
    endAddressId: t.endAddressId,
    pricingTiers: t.pricingTiers || [],
    accommodations: t.accommodations || [],
    translations: t.translations || [],
  }));

  // 7. PaymentMethods (depends on User)
  await migrateModel(mongo.paymentMethod, supabase.paymentMethod, (pm) => ({
    id: pm.id,
    userId: pm.userId,
    stripePaymentMethodId: pm.stripePaymentMethodId,
    type: pm.type,
    last4: pm.last4,
    brand: pm.brand,
    exp_month: pm.exp_month,
    exp_year: pm.exp_year,
    cardHolder: pm.cardHolder,
    createdAt: pm.createdAt,
    updatedAt: pm.updatedAt,
    billingAddressLine1: pm.billingAddressLine1,
    billingAddressLine2: pm.billingAddressLine2,
    billingCity: pm.billingCity,
    billingState: pm.billingState,
    billingPostalCode: pm.billingPostalCode,
    billingCountry: pm.billingCountry,
    isDefault: pm.isDefault ?? false,
    isTemporary: pm.isTemporary ?? false,
  }));

  // 8. Bookings (depends on User, Tour, PaymentMethod)
  await migrateModel(mongo.booking, supabase.booking, (b) => ({
    id: b.id,
    customerId: b.customerId,
    providerId: b.providerId,
    tourId: b.tourId,
    duration: b.duration,
    services: b.services || [],
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    accommodation: b.accommodation,
    bookOwnHotels: b.bookOwnHotels ?? true,
    includeInTotal: b.includeInTotal,
    bookingState: b.bookingState,
    guests: b.guests,
    bookingStates: b.bookingStates || [],
    pricePerSeat: b.pricePerSeat,
    serviceCharge: b.serviceCharge,
    subtotal: b.subtotal,
    totalPrice: b.totalPrice,
    lineItems: b.lineItems || [],
    selectedDate: b.selectedDate,
    paymentIntentId: b.paymentIntentId,
    orderNumber: b.orderNumber,
    receiptNumber: b.receiptNumber,
    invoiceNumber: b.invoiceNumber,
    bookingReference: b.bookingReference,
    paymentMethodId: b.paymentMethodId,
  }));

  // 9. Reviews (depends on User, Tour)
  await migrateModel(mongo.review, supabase.review, (r) => ({
    id: r.id,
    tourId: r.tourId,
    userId: r.userId,
    rating: r.rating,
    title: r.title,
    content: r.content,
    titleContentId: r.titleContentId,
    contentContentId: r.contentContentId,
    travelDate: r.travelDate,
    travelType: r.travelType,
    travelDate1: r.travelDate1,
    images: r.images || [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    isVerified: r.isVerified ?? false,
  }));

  // 10. Subscriptions (depends on User)
  await migrateModel(mongo.subscription, supabase.subscription, (s) => ({
    id: s.id,
    userId: s.userId,
    subscriptionType: s.subscriptionType,
    startDate: s.startDate,
    endDate: s.endDate,
    isActive: s.isActive ?? true,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  // 11. Places
  await migrateModel(mongo.place, supabase.place, (p) => ({
    id: p.id,
    tripadvisorData: p.tripadvisorData,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  // 12. Counter
  await migrateModel(mongo.counter, supabase.counter, (c) => ({
    id: c.id,
    name: c.name,
    value: c.value,
  }));

  // 13. NewsletterSubscription
  await migrateModel(mongo.newsletterSubscription, supabase.newsletterSubscription, (n) => ({
    id: n.id,
    email: n.email,
    subscribed: n.subscribed ?? true,
    types: n.types || [],
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    tokens: n.tokens || [],
  }));

  // 14. Posts (depends on User)
  await migrateModel(mongo.post, supabase.post, (p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    excerpt: p.excerpt,
    tags: p.tags || [],
    featuredImage: p.featuredImage,
    authorId: p.authorId,
    createdAt: p.createdAt,
    imageIds: p.imageIds || [],
    translations: p.translations || [],
  }));

  // 15. TravelSpot
  await migrateModel(mongo.travelSpot, supabase.travelSpot, (ts) => ({
    id: ts.id,
    title: ts.title,
    subtitle: ts.subtitle,
    content: ts.content,
    imageUrl: ts.imageUrl,
    createdAt: ts.createdAt,
    updatedAt: ts.updatedAt,
  }));

  // 16. WhistleblowerReport
  await migrateModel(mongo.whistleblowerReport, supabase.whistleblowerReport, (wr) => ({
    id: wr.id,
    title: wr.title,
    description: wr.description,
    category: wr.category,
    urgencyLevel: wr.urgencyLevel,
    involvedParties: wr.involvedParties,
    dateOfIncident: wr.dateOfIncident,
    additionalInfo: wr.additionalInfo,
    status: wr.status || 'pending',
    submittedAt: wr.submittedAt,
    lastUpdated: wr.lastUpdated,
  }));

  // 17. Spin and Winner (order: Spin first, then Winner)
  await migrateModel(mongo.spin, supabase.spin, (s) => ({
    id: s.id,
    prizeNumber: s.prizeNumber,
    timestamp: s.timestamp,
  }));
  await migrateModel(mongo.winner, supabase.winner, (w) => ({
    id: w.id,
    spinId: w.spinId,
    code: w.code,
  }));

  // 18. ForumPost (depends on User)
  await migrateModel(mongo.forumPost, supabase.forumPost, (fp) => ({
    id: fp.id,
    title: fp.title,
    content: fp.content,
    excerpt: fp.excerpt,
    authorId: fp.authorId,
    createdAt: fp.createdAt,
    updatedAt: fp.updatedAt,
    tags: fp.tags || [],
    category: fp.category,
    likes: fp.likes ?? 0,
    views: fp.views ?? 0,
  }));

  // 19. ForumComment (depends on User, ForumPost, and itself)
  await migrateModel(mongo.forumComment, supabase.forumComment, (fc) => ({
    id: fc.id,
    content: fc.content,
    authorId: fc.authorId,
    postId: fc.postId,
    createdAt: fc.createdAt,
    updatedAt: fc.updatedAt,
    parentId: fc.parentId,
    likedByIds: fc.likedByIds || [],
    dislikedByIds: fc.dislikedByIds || [],
  }));

  // 20. ReferralLink (depends on User)
  await migrateModel(mongo.referralLink, supabase.referralLink, (rl) => ({
    id: rl.id,
    userId: rl.userId,
    code: rl.code,
    commissionType: rl.commissionType,
    commissionValue: rl.commissionValue,
    isLifetime: rl.isLifetime ?? false,
    maxUses: rl.maxUses,
    usedCount: rl.usedCount ?? 0,
    startDate: rl.startDate,
    endDate: rl.endDate,
    clientDiscount: rl.clientDiscount,
    createdAt: rl.createdAt,
    updatedAt: rl.updatedAt,
  }));

  // 21. PayoutMethod (depends on User)
  await migrateModel(mongo.payoutMethod, supabase.payoutMethod, (pm) => ({
    id: pm.id,
    userId: pm.userId,
    type: pm.type,
    email: pm.email,
    accountHolderName: pm.accountHolderName,
    accountNumber: pm.accountNumber,
    bankName: pm.bankName,
    swiftCode: pm.swiftCode,
    iban: pm.iban,
    routingNumber: pm.routingNumber,
    country: pm.country,
    currency: pm.currency,
    isDefault: pm.isDefault ?? false,
    createdAt: pm.createdAt,
    updatedAt: pm.updatedAt,
  }));

  console.log('🎉 Migration completed successfully!');
  await supabase.$disconnect();
  await mongo.$disconnect();
}

main().catch((err) => {
  console.error('💥 Migration failed:', err);
  process.exit(1);
});
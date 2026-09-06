
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.BusinessScalarFieldEnum = {
  id: 'id',
  creatorId: 'creatorId',
  name: 'name',
  adminName: 'adminName',
  email: 'email',
  phoneNumber: 'phoneNumber',
  address: 'address',
  country: 'country',
  registrationNumber: 'registrationNumber',
  bankName: 'bankName',
  accountNumber: 'accountNumber',
  registrationDate: 'registrationDate',
  profileImage: 'profileImage',
  coverImage: 'coverImage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  type: 'type',
  isActive: 'isActive'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  subscriptionType: 'subscriptionType',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  providerId: 'providerId',
  tourId: 'tourId',
  duration: 'duration',
  services: 'services',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  accommodation: 'accommodation',
  bookOwnHotels: 'bookOwnHotels',
  includeInTotal: 'includeInTotal',
  bookingState: 'bookingState',
  guests: 'guests',
  bookingStates: 'bookingStates',
  pricePerSeat: 'pricePerSeat',
  serviceCharge: 'serviceCharge',
  subtotal: 'subtotal',
  totalPrice: 'totalPrice',
  lineItems: 'lineItems',
  selectedDate: 'selectedDate',
  paymentIntentId: 'paymentIntentId',
  orderNumber: 'orderNumber',
  receiptNumber: 'receiptNumber',
  invoiceNumber: 'invoiceNumber',
  bookingReference: 'bookingReference',
  paymentMethodId: 'paymentMethodId'
};

exports.Prisma.PlaceScalarFieldEnum = {
  id: 'id',
  tripadvisorData: 'tripadvisorData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  username: 'username',
  name: 'name',
  phone: 'phone',
  password: 'password',
  senders: 'senders',
  date: 'date',
  library: 'library',
  accountData: 'accountData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  savedList: 'savedList',
  passwordResetToken: 'passwordResetToken',
  passwordResetTokens: 'passwordResetTokens',
  passwordHistory: 'passwordHistory',
  passwordResetTokenExpiry: 'passwordResetTokenExpiry',
  addressId: 'addressId',
  profileImage: 'profileImage',
  stripeCustomerId: 'stripeCustomerId',
  emailVerified: 'emailVerified',
  verificationLinkToken: 'verificationLinkToken',
  verificationCodeToken: 'verificationCodeToken',
  verificationTokenExpiry: 'verificationTokenExpiry',
  verificationCode: 'verificationCode',
  verificationCodeExpiry: 'verificationCodeExpiry',
  isAdmin: 'isAdmin',
  likedCommentIds: 'likedCommentIds',
  dislikedCommentIds: 'dislikedCommentIds',
  referredById: 'referredById',
  active: 'active',
  deactivatedAt: 'deactivatedAt',
  deactivationReason: 'deactivationReason'
};

exports.Prisma.PaymentMethodScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stripePaymentMethodId: 'stripePaymentMethodId',
  type: 'type',
  last4: 'last4',
  brand: 'brand',
  exp_month: 'exp_month',
  exp_year: 'exp_year',
  cardHolder: 'cardHolder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  billingAddressLine1: 'billingAddressLine1',
  billingAddressLine2: 'billingAddressLine2',
  billingCity: 'billingCity',
  billingState: 'billingState',
  billingPostalCode: 'billingPostalCode',
  billingCountry: 'billingCountry',
  isDefault: 'isDefault',
  isTemporary: 'isTemporary'
};

exports.Prisma.TourScalarFieldEnum = {
  id: 'id',
  creatorId: 'creatorId',
  businessId: 'businessId',
  name: 'name',
  subtitle: 'subtitle',
  overview: 'overview',
  productCategory: 'productCategory',
  slugs: 'slugs',
  images: 'images',
  people: 'people',
  services: 'services',
  places: 'places',
  highlights: 'highlights',
  days: 'days',
  paths: 'paths',
  price: 'price',
  discount: 'discount',
  start: 'start',
  end: 'end',
  lang: 'lang',
  tourfor: 'tourfor',
  updated: 'updated',
  conclusion: 'conclusion',
  tags: 'tags',
  keyphrase: 'keyphrase',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  faq: 'faq',
  inclusions: 'inclusions',
  durationType: 'durationType',
  duration: 'duration',
  includesOvernight: 'includesOvernight',
  nameContentId: 'nameContentId',
  subtitleContentId: 'subtitleContentId',
  overviewContentId: 'overviewContentId',
  conclusionContentId: 'conclusionContentId',
  startAddressId: 'startAddressId',
  endAddressId: 'endAddressId',
  pricingTiers: 'pricingTiers',
  accommodations: 'accommodations',
  translations: 'translations'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  tourId: 'tourId',
  userId: 'userId',
  rating: 'rating',
  title: 'title',
  content: 'content',
  titleContentId: 'titleContentId',
  contentContentId: 'contentContentId',
  travelDate: 'travelDate',
  travelType: 'travelType',
  travelDate1: 'travelDate1',
  images: 'images',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isVerified: 'isVerified'
};

exports.Prisma.TranslatableContentScalarFieldEnum = {
  id: 'id',
  contentType: 'contentType',
  entityId: 'entityId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TranslatedTextScalarFieldEnum = {
  id: 'id',
  contentId: 'contentId',
  languageCode: 'languageCode',
  text: 'text',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  streetAddress: 'streetAddress',
  buildingNumber: 'buildingNumber',
  suiteNumber: 'suiteNumber',
  postOfficeBox: 'postOfficeBox',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  landmark: 'landmark',
  subdivision: 'subdivision',
  timeZone: 'timeZone',
  isPrimary: 'isPrimary',
  notes: 'notes',
  geoCoordinates: 'geoCoordinates',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CounterScalarFieldEnum = {
  id: 'id',
  name: 'name',
  value: 'value'
};

exports.Prisma.NewsletterSubscriptionScalarFieldEnum = {
  id: 'id',
  email: 'email',
  subscribed: 'subscribed',
  types: 'types',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tokens: 'tokens'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  excerpt: 'excerpt',
  tags: 'tags',
  featuredImage: 'featuredImage',
  authorId: 'authorId',
  createdAt: 'createdAt',
  imageIds: 'imageIds',
  translations: 'translations'
};

exports.Prisma.TravelSpotScalarFieldEnum = {
  id: 'id',
  title: 'title',
  subtitle: 'subtitle',
  content: 'content',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WhistleblowerReportScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  urgencyLevel: 'urgencyLevel',
  involvedParties: 'involvedParties',
  dateOfIncident: 'dateOfIncident',
  additionalInfo: 'additionalInfo',
  status: 'status',
  submittedAt: 'submittedAt',
  lastUpdated: 'lastUpdated'
};

exports.Prisma.SpinScalarFieldEnum = {
  id: 'id',
  prizeNumber: 'prizeNumber',
  timestamp: 'timestamp'
};

exports.Prisma.WinnerScalarFieldEnum = {
  id: 'id',
  spinId: 'spinId',
  code: 'code'
};

exports.Prisma.ForumPostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  excerpt: 'excerpt',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tags: 'tags',
  category: 'category',
  likes: 'likes',
  views: 'views'
};

exports.Prisma.ForumCommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  authorId: 'authorId',
  postId: 'postId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  parentId: 'parentId',
  likedByIds: 'likedByIds',
  dislikedByIds: 'dislikedByIds'
};

exports.Prisma.ReferralLinkScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  code: 'code',
  commissionType: 'commissionType',
  commissionValue: 'commissionValue',
  isLifetime: 'isLifetime',
  maxUses: 'maxUses',
  usedCount: 'usedCount',
  startDate: 'startDate',
  endDate: 'endDate',
  clientDiscount: 'clientDiscount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PayoutMethodScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  email: 'email',
  accountHolderName: 'accountHolderName',
  accountNumber: 'accountNumber',
  bankName: 'bankName',
  swiftCode: 'swiftCode',
  iban: 'iban',
  routingNumber: 'routingNumber',
  country: 'country',
  currency: 'currency',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.CommissionType = exports.$Enums.CommissionType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT'
};

exports.Prisma.ModelName = {
  Business: 'Business',
  Subscription: 'Subscription',
  Booking: 'Booking',
  Place: 'Place',
  User: 'User',
  PaymentMethod: 'PaymentMethod',
  Tour: 'Tour',
  Review: 'Review',
  TranslatableContent: 'TranslatableContent',
  TranslatedText: 'TranslatedText',
  Address: 'Address',
  Counter: 'Counter',
  NewsletterSubscription: 'NewsletterSubscription',
  Post: 'Post',
  TravelSpot: 'TravelSpot',
  WhistleblowerReport: 'WhistleblowerReport',
  Spin: 'Spin',
  Winner: 'Winner',
  ForumPost: 'ForumPost',
  ForumComment: 'ForumComment',
  ReferralLink: 'ReferralLink',
  PayoutMethod: 'PayoutMethod'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

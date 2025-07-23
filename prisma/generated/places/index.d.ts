
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AlternativeName
 * 
 */
export type AlternativeName = $Result.DefaultSelection<Prisma.$AlternativeNamePayload>
/**
 * Model GeoCoordinates
 * 
 */
export type GeoCoordinates = $Result.DefaultSelection<Prisma.$GeoCoordinatesPayload>
/**
 * Model Image
 * 
 */
export type Image = $Result.DefaultSelection<Prisma.$ImagePayload>
/**
 * Model City
 * 
 */
export type City = $Result.DefaultSelection<Prisma.$CityPayload>
/**
 * Model Country
 * 
 */
export type Country = $Result.DefaultSelection<Prisma.$CountryPayload>
/**
 * Model Place
 * 
 */
export type Place = $Result.DefaultSelection<Prisma.$PlacePayload>
/**
 * Model TranslatableContent
 * 
 */
export type TranslatableContent = $Result.DefaultSelection<Prisma.$TranslatableContentPayload>
/**
 * Model TranslatedText
 * 
 */
export type TranslatedText = $Result.DefaultSelection<Prisma.$TranslatedTextPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Cities
 * const cities = await prisma.city.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Cities
   * const cities = await prisma.city.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.city`: Exposes CRUD operations for the **City** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cities
    * const cities = await prisma.city.findMany()
    * ```
    */
  get city(): Prisma.CityDelegate<ExtArgs>;

  /**
   * `prisma.country`: Exposes CRUD operations for the **Country** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Countries
    * const countries = await prisma.country.findMany()
    * ```
    */
  get country(): Prisma.CountryDelegate<ExtArgs>;

  /**
   * `prisma.place`: Exposes CRUD operations for the **Place** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Places
    * const places = await prisma.place.findMany()
    * ```
    */
  get place(): Prisma.PlaceDelegate<ExtArgs>;

  /**
   * `prisma.translatableContent`: Exposes CRUD operations for the **TranslatableContent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TranslatableContents
    * const translatableContents = await prisma.translatableContent.findMany()
    * ```
    */
  get translatableContent(): Prisma.TranslatableContentDelegate<ExtArgs>;

  /**
   * `prisma.translatedText`: Exposes CRUD operations for the **TranslatedText** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TranslatedTexts
    * const translatedTexts = await prisma.translatedText.findMany()
    * ```
    */
  get translatedText(): Prisma.TranslatedTextDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    City: 'City',
    Country: 'Country',
    Place: 'Place',
    TranslatableContent: 'TranslatableContent',
    TranslatedText: 'TranslatedText'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "city" | "country" | "place" | "translatableContent" | "translatedText"
      txIsolationLevel: never
    }
    model: {
      City: {
        payload: Prisma.$CityPayload<ExtArgs>
        fields: Prisma.CityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          findFirst: {
            args: Prisma.CityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          findMany: {
            args: Prisma.CityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>[]
          }
          create: {
            args: Prisma.CityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          createMany: {
            args: Prisma.CityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          update: {
            args: Prisma.CityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          deleteMany: {
            args: Prisma.CityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CityPayload>
          }
          aggregate: {
            args: Prisma.CityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCity>
          }
          groupBy: {
            args: Prisma.CityGroupByArgs<ExtArgs>
            result: $Utils.Optional<CityGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.CityFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.CityAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.CityCountArgs<ExtArgs>
            result: $Utils.Optional<CityCountAggregateOutputType> | number
          }
        }
      }
      Country: {
        payload: Prisma.$CountryPayload<ExtArgs>
        fields: Prisma.CountryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CountryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CountryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          findFirst: {
            args: Prisma.CountryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CountryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          findMany: {
            args: Prisma.CountryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>[]
          }
          create: {
            args: Prisma.CountryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          createMany: {
            args: Prisma.CountryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CountryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          update: {
            args: Prisma.CountryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          deleteMany: {
            args: Prisma.CountryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CountryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CountryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CountryPayload>
          }
          aggregate: {
            args: Prisma.CountryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCountry>
          }
          groupBy: {
            args: Prisma.CountryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CountryGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.CountryFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.CountryAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.CountryCountArgs<ExtArgs>
            result: $Utils.Optional<CountryCountAggregateOutputType> | number
          }
        }
      }
      Place: {
        payload: Prisma.$PlacePayload<ExtArgs>
        fields: Prisma.PlaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload>
          }
          findFirst: {
            args: Prisma.PlaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload>
          }
          findMany: {
            args: Prisma.PlaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload>[]
          }
          create: {
            args: Prisma.PlaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload>
          }
          createMany: {
            args: Prisma.PlaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PlaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload>
          }
          update: {
            args: Prisma.PlaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload>
          }
          deleteMany: {
            args: Prisma.PlaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlacePayload>
          }
          aggregate: {
            args: Prisma.PlaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlace>
          }
          groupBy: {
            args: Prisma.PlaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlaceGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.PlaceFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.PlaceAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.PlaceCountArgs<ExtArgs>
            result: $Utils.Optional<PlaceCountAggregateOutputType> | number
          }
        }
      }
      TranslatableContent: {
        payload: Prisma.$TranslatableContentPayload<ExtArgs>
        fields: Prisma.TranslatableContentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranslatableContentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranslatableContentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload>
          }
          findFirst: {
            args: Prisma.TranslatableContentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranslatableContentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload>
          }
          findMany: {
            args: Prisma.TranslatableContentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload>[]
          }
          create: {
            args: Prisma.TranslatableContentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload>
          }
          createMany: {
            args: Prisma.TranslatableContentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TranslatableContentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload>
          }
          update: {
            args: Prisma.TranslatableContentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload>
          }
          deleteMany: {
            args: Prisma.TranslatableContentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranslatableContentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TranslatableContentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatableContentPayload>
          }
          aggregate: {
            args: Prisma.TranslatableContentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranslatableContent>
          }
          groupBy: {
            args: Prisma.TranslatableContentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranslatableContentGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.TranslatableContentFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.TranslatableContentAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.TranslatableContentCountArgs<ExtArgs>
            result: $Utils.Optional<TranslatableContentCountAggregateOutputType> | number
          }
        }
      }
      TranslatedText: {
        payload: Prisma.$TranslatedTextPayload<ExtArgs>
        fields: Prisma.TranslatedTextFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranslatedTextFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranslatedTextFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload>
          }
          findFirst: {
            args: Prisma.TranslatedTextFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranslatedTextFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload>
          }
          findMany: {
            args: Prisma.TranslatedTextFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload>[]
          }
          create: {
            args: Prisma.TranslatedTextCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload>
          }
          createMany: {
            args: Prisma.TranslatedTextCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TranslatedTextDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload>
          }
          update: {
            args: Prisma.TranslatedTextUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload>
          }
          deleteMany: {
            args: Prisma.TranslatedTextDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranslatedTextUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TranslatedTextUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranslatedTextPayload>
          }
          aggregate: {
            args: Prisma.TranslatedTextAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranslatedText>
          }
          groupBy: {
            args: Prisma.TranslatedTextGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranslatedTextGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.TranslatedTextFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.TranslatedTextAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.TranslatedTextCountArgs<ExtArgs>
            result: $Utils.Optional<TranslatedTextCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CityCountOutputType
   */

  export type CityCountOutputType = {
    places: number
  }

  export type CityCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    places?: boolean | CityCountOutputTypeCountPlacesArgs
  }

  // Custom InputTypes
  /**
   * CityCountOutputType without action
   */
  export type CityCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CityCountOutputType
     */
    select?: CityCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CityCountOutputType without action
   */
  export type CityCountOutputTypeCountPlacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaceWhereInput
  }


  /**
   * Count Type CountryCountOutputType
   */

  export type CountryCountOutputType = {
    cities: number
    places: number
  }

  export type CountryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cities?: boolean | CountryCountOutputTypeCountCitiesArgs
    places?: boolean | CountryCountOutputTypeCountPlacesArgs
  }

  // Custom InputTypes
  /**
   * CountryCountOutputType without action
   */
  export type CountryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CountryCountOutputType
     */
    select?: CountryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CountryCountOutputType without action
   */
  export type CountryCountOutputTypeCountCitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CityWhereInput
  }

  /**
   * CountryCountOutputType without action
   */
  export type CountryCountOutputTypeCountPlacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaceWhereInput
  }


  /**
   * Count Type TranslatableContentCountOutputType
   */

  export type TranslatableContentCountOutputType = {
    translations: number
    countries: number
    cities: number
    places: number
  }

  export type TranslatableContentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    translations?: boolean | TranslatableContentCountOutputTypeCountTranslationsArgs
    countries?: boolean | TranslatableContentCountOutputTypeCountCountriesArgs
    cities?: boolean | TranslatableContentCountOutputTypeCountCitiesArgs
    places?: boolean | TranslatableContentCountOutputTypeCountPlacesArgs
  }

  // Custom InputTypes
  /**
   * TranslatableContentCountOutputType without action
   */
  export type TranslatableContentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContentCountOutputType
     */
    select?: TranslatableContentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TranslatableContentCountOutputType without action
   */
  export type TranslatableContentCountOutputTypeCountTranslationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslatedTextWhereInput
  }

  /**
   * TranslatableContentCountOutputType without action
   */
  export type TranslatableContentCountOutputTypeCountCountriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CountryWhereInput
  }

  /**
   * TranslatableContentCountOutputType without action
   */
  export type TranslatableContentCountOutputTypeCountCitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CityWhereInput
  }

  /**
   * TranslatableContentCountOutputType without action
   */
  export type TranslatableContentCountOutputTypeCountPlacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AlternativeName
   */





  export type AlternativeNameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    text?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["alternativeName"]>


  export type AlternativeNameSelectScalar = {
    text?: boolean
    source?: boolean
    createdAt?: boolean
  }


  export type $AlternativeNamePayload = {
    name: "AlternativeName"
    objects: {}
    scalars: {
      text: string
      source: string
      createdAt: Date
    }
    composites: {}
  }

  type AlternativeNameGetPayload<S extends boolean | null | undefined | AlternativeNameDefaultArgs> = $Result.GetResult<Prisma.$AlternativeNamePayload, S>





  /**
   * Fields of the AlternativeName model
   */ 
  interface AlternativeNameFieldRefs {
    readonly text: FieldRef<"AlternativeName", 'String'>
    readonly source: FieldRef<"AlternativeName", 'String'>
    readonly createdAt: FieldRef<"AlternativeName", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AlternativeName without action
   */
  export type AlternativeNameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlternativeName
     */
    select?: AlternativeNameSelect<ExtArgs> | null
  }


  /**
   * Model GeoCoordinates
   */





  export type GeoCoordinatesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    lat?: boolean
    log?: boolean
  }, ExtArgs["result"]["geoCoordinates"]>


  export type GeoCoordinatesSelectScalar = {
    lat?: boolean
    log?: boolean
  }


  export type $GeoCoordinatesPayload = {
    name: "GeoCoordinates"
    objects: {}
    scalars: {
      lat: number
      log: number
    }
    composites: {}
  }

  type GeoCoordinatesGetPayload<S extends boolean | null | undefined | GeoCoordinatesDefaultArgs> = $Result.GetResult<Prisma.$GeoCoordinatesPayload, S>





  /**
   * Fields of the GeoCoordinates model
   */ 
  interface GeoCoordinatesFieldRefs {
    readonly lat: FieldRef<"GeoCoordinates", 'Float'>
    readonly log: FieldRef<"GeoCoordinates", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * GeoCoordinates without action
   */
  export type GeoCoordinatesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeoCoordinates
     */
    select?: GeoCoordinatesSelect<ExtArgs> | null
  }


  /**
   * Model Image
   */





  export type ImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    url?: boolean
    public_id?: boolean
    uploadFrom?: boolean
  }, ExtArgs["result"]["image"]>


  export type ImageSelectScalar = {
    url?: boolean
    public_id?: boolean
    uploadFrom?: boolean
  }


  export type $ImagePayload = {
    name: "Image"
    objects: {}
    scalars: {
      url: string | null
      public_id: string | null
      uploadFrom: string | null
    }
    composites: {}
  }

  type ImageGetPayload<S extends boolean | null | undefined | ImageDefaultArgs> = $Result.GetResult<Prisma.$ImagePayload, S>





  /**
   * Fields of the Image model
   */ 
  interface ImageFieldRefs {
    readonly url: FieldRef<"Image", 'String'>
    readonly public_id: FieldRef<"Image", 'String'>
    readonly uploadFrom: FieldRef<"Image", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Image without action
   */
  export type ImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Image
     */
    select?: ImageSelect<ExtArgs> | null
  }


  /**
   * Model City
   */

  export type AggregateCity = {
    _count: CityCountAggregateOutputType | null
    _avg: CityAvgAggregateOutputType | null
    _sum: CitySumAggregateOutputType | null
    _min: CityMinAggregateOutputType | null
    _max: CityMaxAggregateOutputType | null
  }

  export type CityAvgAggregateOutputType = {
    population: number | null
  }

  export type CitySumAggregateOutputType = {
    population: number | null
  }

  export type CityMinAggregateOutputType = {
    id: string | null
    countryId: string | null
    contentId: string | null
    population: number | null
    timezone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    code3: string | null
    type: string | null
  }

  export type CityMaxAggregateOutputType = {
    id: string | null
    countryId: string | null
    contentId: string | null
    population: number | null
    timezone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    code3: string | null
    type: string | null
  }

  export type CityCountAggregateOutputType = {
    id: number
    countryId: number
    contentId: number
    population: number
    timezone: number
    createdAt: number
    updatedAt: number
    code3: number
    type: number
    _all: number
  }


  export type CityAvgAggregateInputType = {
    population?: true
  }

  export type CitySumAggregateInputType = {
    population?: true
  }

  export type CityMinAggregateInputType = {
    id?: true
    countryId?: true
    contentId?: true
    population?: true
    timezone?: true
    createdAt?: true
    updatedAt?: true
    code3?: true
    type?: true
  }

  export type CityMaxAggregateInputType = {
    id?: true
    countryId?: true
    contentId?: true
    population?: true
    timezone?: true
    createdAt?: true
    updatedAt?: true
    code3?: true
    type?: true
  }

  export type CityCountAggregateInputType = {
    id?: true
    countryId?: true
    contentId?: true
    population?: true
    timezone?: true
    createdAt?: true
    updatedAt?: true
    code3?: true
    type?: true
    _all?: true
  }

  export type CityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which City to aggregate.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cities
    **/
    _count?: true | CityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CityMaxAggregateInputType
  }

  export type GetCityAggregateType<T extends CityAggregateArgs> = {
        [P in keyof T & keyof AggregateCity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCity[P]>
      : GetScalarType<T[P], AggregateCity[P]>
  }




  export type CityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CityWhereInput
    orderBy?: CityOrderByWithAggregationInput | CityOrderByWithAggregationInput[]
    by: CityScalarFieldEnum[] | CityScalarFieldEnum
    having?: CityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CityCountAggregateInputType | true
    _avg?: CityAvgAggregateInputType
    _sum?: CitySumAggregateInputType
    _min?: CityMinAggregateInputType
    _max?: CityMaxAggregateInputType
  }

  export type CityGroupByOutputType = {
    id: string
    countryId: string
    contentId: string
    population: number | null
    timezone: string | null
    createdAt: Date
    updatedAt: Date
    code3: string | null
    type: string | null
    _count: CityCountAggregateOutputType | null
    _avg: CityAvgAggregateOutputType | null
    _sum: CitySumAggregateOutputType | null
    _min: CityMinAggregateOutputType | null
    _max: CityMaxAggregateOutputType | null
  }

  type GetCityGroupByPayload<T extends CityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CityGroupByOutputType[P]>
            : GetScalarType<T[P], CityGroupByOutputType[P]>
        }
      >
    >


  export type CitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    countryId?: boolean
    contentId?: boolean
    geo?: boolean | GeoCoordinatesDefaultArgs<ExtArgs>
    image?: boolean | ImageDefaultArgs<ExtArgs>
    population?: boolean
    timezone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code3?: boolean
    type?: boolean
    country?: boolean | CountryDefaultArgs<ExtArgs>
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
    places?: boolean | City$placesArgs<ExtArgs>
    _count?: boolean | CityCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["city"]>


  export type CitySelectScalar = {
    id?: boolean
    countryId?: boolean
    contentId?: boolean
    population?: boolean
    timezone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    code3?: boolean
    type?: boolean
  }

  export type CityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    country?: boolean | CountryDefaultArgs<ExtArgs>
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
    places?: boolean | City$placesArgs<ExtArgs>
    _count?: boolean | CityCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "City"
    objects: {
      country: Prisma.$CountryPayload<ExtArgs>
      content: Prisma.$TranslatableContentPayload<ExtArgs>
      places: Prisma.$PlacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      countryId: string
      contentId: string
      population: number | null
      timezone: string | null
      createdAt: Date
      updatedAt: Date
      code3: string | null
      type: string | null
    }, ExtArgs["result"]["city"]>
    composites: {
      geo: Prisma.$GeoCoordinatesPayload
      image: Prisma.$ImagePayload | null
    }
  }

  type CityGetPayload<S extends boolean | null | undefined | CityDefaultArgs> = $Result.GetResult<Prisma.$CityPayload, S>

  type CityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CityCountAggregateInputType | true
    }

  export interface CityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['City'], meta: { name: 'City' } }
    /**
     * Find zero or one City that matches the filter.
     * @param {CityFindUniqueArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CityFindUniqueArgs>(args: SelectSubset<T, CityFindUniqueArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one City that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CityFindUniqueOrThrowArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CityFindUniqueOrThrowArgs>(args: SelectSubset<T, CityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first City that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityFindFirstArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CityFindFirstArgs>(args?: SelectSubset<T, CityFindFirstArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first City that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityFindFirstOrThrowArgs} args - Arguments to find a City
     * @example
     * // Get one City
     * const city = await prisma.city.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CityFindFirstOrThrowArgs>(args?: SelectSubset<T, CityFindFirstOrThrowArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Cities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cities
     * const cities = await prisma.city.findMany()
     * 
     * // Get first 10 Cities
     * const cities = await prisma.city.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cityWithIdOnly = await prisma.city.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CityFindManyArgs>(args?: SelectSubset<T, CityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a City.
     * @param {CityCreateArgs} args - Arguments to create a City.
     * @example
     * // Create one City
     * const City = await prisma.city.create({
     *   data: {
     *     // ... data to create a City
     *   }
     * })
     * 
     */
    create<T extends CityCreateArgs>(args: SelectSubset<T, CityCreateArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Cities.
     * @param {CityCreateManyArgs} args - Arguments to create many Cities.
     * @example
     * // Create many Cities
     * const city = await prisma.city.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CityCreateManyArgs>(args?: SelectSubset<T, CityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a City.
     * @param {CityDeleteArgs} args - Arguments to delete one City.
     * @example
     * // Delete one City
     * const City = await prisma.city.delete({
     *   where: {
     *     // ... filter to delete one City
     *   }
     * })
     * 
     */
    delete<T extends CityDeleteArgs>(args: SelectSubset<T, CityDeleteArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one City.
     * @param {CityUpdateArgs} args - Arguments to update one City.
     * @example
     * // Update one City
     * const city = await prisma.city.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CityUpdateArgs>(args: SelectSubset<T, CityUpdateArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Cities.
     * @param {CityDeleteManyArgs} args - Arguments to filter Cities to delete.
     * @example
     * // Delete a few Cities
     * const { count } = await prisma.city.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CityDeleteManyArgs>(args?: SelectSubset<T, CityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cities
     * const city = await prisma.city.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CityUpdateManyArgs>(args: SelectSubset<T, CityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one City.
     * @param {CityUpsertArgs} args - Arguments to update or create a City.
     * @example
     * // Update or create a City
     * const city = await prisma.city.upsert({
     *   create: {
     *     // ... data to create a City
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the City we want to update
     *   }
     * })
     */
    upsert<T extends CityUpsertArgs>(args: SelectSubset<T, CityUpsertArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Cities that matches the filter.
     * @param {CityFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const city = await prisma.city.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: CityFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a City.
     * @param {CityAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const city = await prisma.city.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: CityAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Cities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityCountArgs} args - Arguments to filter Cities to count.
     * @example
     * // Count the number of Cities
     * const count = await prisma.city.count({
     *   where: {
     *     // ... the filter for the Cities we want to count
     *   }
     * })
    **/
    count<T extends CityCountArgs>(
      args?: Subset<T, CityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a City.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CityAggregateArgs>(args: Subset<T, CityAggregateArgs>): Prisma.PrismaPromise<GetCityAggregateType<T>>

    /**
     * Group by City.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CityGroupByArgs['orderBy'] }
        : { orderBy?: CityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the City model
   */
  readonly fields: CityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for City.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    country<T extends CountryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CountryDefaultArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    content<T extends TranslatableContentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContentDefaultArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    places<T extends City$placesArgs<ExtArgs> = {}>(args?: Subset<T, City$placesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the City model
   */ 
  interface CityFieldRefs {
    readonly id: FieldRef<"City", 'String'>
    readonly countryId: FieldRef<"City", 'String'>
    readonly contentId: FieldRef<"City", 'String'>
    readonly population: FieldRef<"City", 'Int'>
    readonly timezone: FieldRef<"City", 'String'>
    readonly createdAt: FieldRef<"City", 'DateTime'>
    readonly updatedAt: FieldRef<"City", 'DateTime'>
    readonly code3: FieldRef<"City", 'String'>
    readonly type: FieldRef<"City", 'String'>
  }
    

  // Custom InputTypes
  /**
   * City findUnique
   */
  export type CityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City findUniqueOrThrow
   */
  export type CityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City findFirst
   */
  export type CityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cities.
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cities.
     */
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * City findFirstOrThrow
   */
  export type CityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which City to fetch.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cities.
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cities.
     */
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * City findMany
   */
  export type CityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter, which Cities to fetch.
     */
    where?: CityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cities to fetch.
     */
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cities.
     */
    cursor?: CityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cities.
     */
    skip?: number
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * City create
   */
  export type CityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * The data needed to create a City.
     */
    data: XOR<CityCreateInput, CityUncheckedCreateInput>
  }

  /**
   * City createMany
   */
  export type CityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cities.
     */
    data: CityCreateManyInput | CityCreateManyInput[]
  }

  /**
   * City update
   */
  export type CityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * The data needed to update a City.
     */
    data: XOR<CityUpdateInput, CityUncheckedUpdateInput>
    /**
     * Choose, which City to update.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City updateMany
   */
  export type CityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cities.
     */
    data: XOR<CityUpdateManyMutationInput, CityUncheckedUpdateManyInput>
    /**
     * Filter which Cities to update
     */
    where?: CityWhereInput
  }

  /**
   * City upsert
   */
  export type CityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * The filter to search for the City to update in case it exists.
     */
    where: CityWhereUniqueInput
    /**
     * In case the City found by the `where` argument doesn't exist, create a new City with this data.
     */
    create: XOR<CityCreateInput, CityUncheckedCreateInput>
    /**
     * In case the City was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CityUpdateInput, CityUncheckedUpdateInput>
  }

  /**
   * City delete
   */
  export type CityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    /**
     * Filter which City to delete.
     */
    where: CityWhereUniqueInput
  }

  /**
   * City deleteMany
   */
  export type CityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cities to delete
     */
    where?: CityWhereInput
  }

  /**
   * City findRaw
   */
  export type CityFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * City aggregateRaw
   */
  export type CityAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * City.places
   */
  export type City$placesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    where?: PlaceWhereInput
    orderBy?: PlaceOrderByWithRelationInput | PlaceOrderByWithRelationInput[]
    cursor?: PlaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlaceScalarFieldEnum | PlaceScalarFieldEnum[]
  }

  /**
   * City without action
   */
  export type CityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
  }


  /**
   * Model Country
   */

  export type AggregateCountry = {
    _count: CountryCountAggregateOutputType | null
    _min: CountryMinAggregateOutputType | null
    _max: CountryMaxAggregateOutputType | null
  }

  export type CountryMinAggregateOutputType = {
    id: string | null
    code: string | null
    code3: string | null
    contentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    type: string | null
  }

  export type CountryMaxAggregateOutputType = {
    id: string | null
    code: string | null
    code3: string | null
    contentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    type: string | null
  }

  export type CountryCountAggregateOutputType = {
    id: number
    code: number
    code3: number
    contentId: number
    createdAt: number
    updatedAt: number
    type: number
    _all: number
  }


  export type CountryMinAggregateInputType = {
    id?: true
    code?: true
    code3?: true
    contentId?: true
    createdAt?: true
    updatedAt?: true
    type?: true
  }

  export type CountryMaxAggregateInputType = {
    id?: true
    code?: true
    code3?: true
    contentId?: true
    createdAt?: true
    updatedAt?: true
    type?: true
  }

  export type CountryCountAggregateInputType = {
    id?: true
    code?: true
    code3?: true
    contentId?: true
    createdAt?: true
    updatedAt?: true
    type?: true
    _all?: true
  }

  export type CountryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Country to aggregate.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Countries
    **/
    _count?: true | CountryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CountryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CountryMaxAggregateInputType
  }

  export type GetCountryAggregateType<T extends CountryAggregateArgs> = {
        [P in keyof T & keyof AggregateCountry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCountry[P]>
      : GetScalarType<T[P], AggregateCountry[P]>
  }




  export type CountryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CountryWhereInput
    orderBy?: CountryOrderByWithAggregationInput | CountryOrderByWithAggregationInput[]
    by: CountryScalarFieldEnum[] | CountryScalarFieldEnum
    having?: CountryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CountryCountAggregateInputType | true
    _min?: CountryMinAggregateInputType
    _max?: CountryMaxAggregateInputType
  }

  export type CountryGroupByOutputType = {
    id: string
    code: string
    code3: string
    contentId: string
    createdAt: Date
    updatedAt: Date
    type: string | null
    _count: CountryCountAggregateOutputType | null
    _min: CountryMinAggregateOutputType | null
    _max: CountryMaxAggregateOutputType | null
  }

  type GetCountryGroupByPayload<T extends CountryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CountryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CountryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CountryGroupByOutputType[P]>
            : GetScalarType<T[P], CountryGroupByOutputType[P]>
        }
      >
    >


  export type CountrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    code3?: boolean
    contentId?: boolean
    geo?: boolean | GeoCoordinatesDefaultArgs<ExtArgs>
    image?: boolean | ImageDefaultArgs<ExtArgs>
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
    cities?: boolean | Country$citiesArgs<ExtArgs>
    places?: boolean | Country$placesArgs<ExtArgs>
    _count?: boolean | CountryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["country"]>


  export type CountrySelectScalar = {
    id?: boolean
    code?: boolean
    code3?: boolean
    contentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    type?: boolean
  }

  export type CountryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
    cities?: boolean | Country$citiesArgs<ExtArgs>
    places?: boolean | Country$placesArgs<ExtArgs>
    _count?: boolean | CountryCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CountryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Country"
    objects: {
      content: Prisma.$TranslatableContentPayload<ExtArgs>
      cities: Prisma.$CityPayload<ExtArgs>[]
      places: Prisma.$PlacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      code3: string
      contentId: string
      createdAt: Date
      updatedAt: Date
      type: string | null
    }, ExtArgs["result"]["country"]>
    composites: {
      geo: Prisma.$GeoCoordinatesPayload
      image: Prisma.$ImagePayload | null
    }
  }

  type CountryGetPayload<S extends boolean | null | undefined | CountryDefaultArgs> = $Result.GetResult<Prisma.$CountryPayload, S>

  type CountryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CountryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CountryCountAggregateInputType | true
    }

  export interface CountryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Country'], meta: { name: 'Country' } }
    /**
     * Find zero or one Country that matches the filter.
     * @param {CountryFindUniqueArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CountryFindUniqueArgs>(args: SelectSubset<T, CountryFindUniqueArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Country that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CountryFindUniqueOrThrowArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CountryFindUniqueOrThrowArgs>(args: SelectSubset<T, CountryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Country that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryFindFirstArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CountryFindFirstArgs>(args?: SelectSubset<T, CountryFindFirstArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Country that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryFindFirstOrThrowArgs} args - Arguments to find a Country
     * @example
     * // Get one Country
     * const country = await prisma.country.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CountryFindFirstOrThrowArgs>(args?: SelectSubset<T, CountryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Countries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Countries
     * const countries = await prisma.country.findMany()
     * 
     * // Get first 10 Countries
     * const countries = await prisma.country.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const countryWithIdOnly = await prisma.country.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CountryFindManyArgs>(args?: SelectSubset<T, CountryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Country.
     * @param {CountryCreateArgs} args - Arguments to create a Country.
     * @example
     * // Create one Country
     * const Country = await prisma.country.create({
     *   data: {
     *     // ... data to create a Country
     *   }
     * })
     * 
     */
    create<T extends CountryCreateArgs>(args: SelectSubset<T, CountryCreateArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Countries.
     * @param {CountryCreateManyArgs} args - Arguments to create many Countries.
     * @example
     * // Create many Countries
     * const country = await prisma.country.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CountryCreateManyArgs>(args?: SelectSubset<T, CountryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Country.
     * @param {CountryDeleteArgs} args - Arguments to delete one Country.
     * @example
     * // Delete one Country
     * const Country = await prisma.country.delete({
     *   where: {
     *     // ... filter to delete one Country
     *   }
     * })
     * 
     */
    delete<T extends CountryDeleteArgs>(args: SelectSubset<T, CountryDeleteArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Country.
     * @param {CountryUpdateArgs} args - Arguments to update one Country.
     * @example
     * // Update one Country
     * const country = await prisma.country.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CountryUpdateArgs>(args: SelectSubset<T, CountryUpdateArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Countries.
     * @param {CountryDeleteManyArgs} args - Arguments to filter Countries to delete.
     * @example
     * // Delete a few Countries
     * const { count } = await prisma.country.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CountryDeleteManyArgs>(args?: SelectSubset<T, CountryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Countries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Countries
     * const country = await prisma.country.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CountryUpdateManyArgs>(args: SelectSubset<T, CountryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Country.
     * @param {CountryUpsertArgs} args - Arguments to update or create a Country.
     * @example
     * // Update or create a Country
     * const country = await prisma.country.upsert({
     *   create: {
     *     // ... data to create a Country
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Country we want to update
     *   }
     * })
     */
    upsert<T extends CountryUpsertArgs>(args: SelectSubset<T, CountryUpsertArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Countries that matches the filter.
     * @param {CountryFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const country = await prisma.country.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: CountryFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Country.
     * @param {CountryAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const country = await prisma.country.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: CountryAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Countries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryCountArgs} args - Arguments to filter Countries to count.
     * @example
     * // Count the number of Countries
     * const count = await prisma.country.count({
     *   where: {
     *     // ... the filter for the Countries we want to count
     *   }
     * })
    **/
    count<T extends CountryCountArgs>(
      args?: Subset<T, CountryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CountryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Country.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CountryAggregateArgs>(args: Subset<T, CountryAggregateArgs>): Prisma.PrismaPromise<GetCountryAggregateType<T>>

    /**
     * Group by Country.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CountryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CountryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CountryGroupByArgs['orderBy'] }
        : { orderBy?: CountryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CountryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCountryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Country model
   */
  readonly fields: CountryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Country.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CountryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    content<T extends TranslatableContentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContentDefaultArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    cities<T extends Country$citiesArgs<ExtArgs> = {}>(args?: Subset<T, Country$citiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findMany"> | Null>
    places<T extends Country$placesArgs<ExtArgs> = {}>(args?: Subset<T, Country$placesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Country model
   */ 
  interface CountryFieldRefs {
    readonly id: FieldRef<"Country", 'String'>
    readonly code: FieldRef<"Country", 'String'>
    readonly code3: FieldRef<"Country", 'String'>
    readonly contentId: FieldRef<"Country", 'String'>
    readonly createdAt: FieldRef<"Country", 'DateTime'>
    readonly updatedAt: FieldRef<"Country", 'DateTime'>
    readonly type: FieldRef<"Country", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Country findUnique
   */
  export type CountryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country findUniqueOrThrow
   */
  export type CountryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country findFirst
   */
  export type CountryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Countries.
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Countries.
     */
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * Country findFirstOrThrow
   */
  export type CountryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Country to fetch.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Countries.
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Countries.
     */
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * Country findMany
   */
  export type CountryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter, which Countries to fetch.
     */
    where?: CountryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Countries to fetch.
     */
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Countries.
     */
    cursor?: CountryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Countries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Countries.
     */
    skip?: number
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * Country create
   */
  export type CountryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * The data needed to create a Country.
     */
    data: XOR<CountryCreateInput, CountryUncheckedCreateInput>
  }

  /**
   * Country createMany
   */
  export type CountryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Countries.
     */
    data: CountryCreateManyInput | CountryCreateManyInput[]
  }

  /**
   * Country update
   */
  export type CountryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * The data needed to update a Country.
     */
    data: XOR<CountryUpdateInput, CountryUncheckedUpdateInput>
    /**
     * Choose, which Country to update.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country updateMany
   */
  export type CountryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Countries.
     */
    data: XOR<CountryUpdateManyMutationInput, CountryUncheckedUpdateManyInput>
    /**
     * Filter which Countries to update
     */
    where?: CountryWhereInput
  }

  /**
   * Country upsert
   */
  export type CountryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * The filter to search for the Country to update in case it exists.
     */
    where: CountryWhereUniqueInput
    /**
     * In case the Country found by the `where` argument doesn't exist, create a new Country with this data.
     */
    create: XOR<CountryCreateInput, CountryUncheckedCreateInput>
    /**
     * In case the Country was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CountryUpdateInput, CountryUncheckedUpdateInput>
  }

  /**
   * Country delete
   */
  export type CountryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    /**
     * Filter which Country to delete.
     */
    where: CountryWhereUniqueInput
  }

  /**
   * Country deleteMany
   */
  export type CountryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Countries to delete
     */
    where?: CountryWhereInput
  }

  /**
   * Country findRaw
   */
  export type CountryFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Country aggregateRaw
   */
  export type CountryAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Country.cities
   */
  export type Country$citiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    where?: CityWhereInput
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    cursor?: CityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * Country.places
   */
  export type Country$placesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    where?: PlaceWhereInput
    orderBy?: PlaceOrderByWithRelationInput | PlaceOrderByWithRelationInput[]
    cursor?: PlaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlaceScalarFieldEnum | PlaceScalarFieldEnum[]
  }

  /**
   * Country without action
   */
  export type CountryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
  }


  /**
   * Model Place
   */

  export type AggregatePlace = {
    _count: PlaceCountAggregateOutputType | null
    _avg: PlaceAvgAggregateOutputType | null
    _sum: PlaceSumAggregateOutputType | null
    _min: PlaceMinAggregateOutputType | null
    _max: PlaceMaxAggregateOutputType | null
  }

  export type PlaceAvgAggregateOutputType = {
    rating: number | null
  }

  export type PlaceSumAggregateOutputType = {
    rating: number | null
  }

  export type PlaceMinAggregateOutputType = {
    id: string | null
    cityId: string | null
    countryId: string | null
    contentId: string | null
    type: string | null
    category: string | null
    subcategory: string | null
    rating: number | null
    address: string | null
    website: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlaceMaxAggregateOutputType = {
    id: string | null
    cityId: string | null
    countryId: string | null
    contentId: string | null
    type: string | null
    category: string | null
    subcategory: string | null
    rating: number | null
    address: string | null
    website: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlaceCountAggregateOutputType = {
    id: number
    cityId: number
    countryId: number
    contentId: number
    type: number
    category: number
    subcategory: number
    tags: number
    rating: number
    address: number
    website: number
    phone: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlaceAvgAggregateInputType = {
    rating?: true
  }

  export type PlaceSumAggregateInputType = {
    rating?: true
  }

  export type PlaceMinAggregateInputType = {
    id?: true
    cityId?: true
    countryId?: true
    contentId?: true
    type?: true
    category?: true
    subcategory?: true
    rating?: true
    address?: true
    website?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlaceMaxAggregateInputType = {
    id?: true
    cityId?: true
    countryId?: true
    contentId?: true
    type?: true
    category?: true
    subcategory?: true
    rating?: true
    address?: true
    website?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlaceCountAggregateInputType = {
    id?: true
    cityId?: true
    countryId?: true
    contentId?: true
    type?: true
    category?: true
    subcategory?: true
    tags?: true
    rating?: true
    address?: true
    website?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Place to aggregate.
     */
    where?: PlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Places to fetch.
     */
    orderBy?: PlaceOrderByWithRelationInput | PlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Places from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Places.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Places
    **/
    _count?: true | PlaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlaceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlaceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlaceMaxAggregateInputType
  }

  export type GetPlaceAggregateType<T extends PlaceAggregateArgs> = {
        [P in keyof T & keyof AggregatePlace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlace[P]>
      : GetScalarType<T[P], AggregatePlace[P]>
  }




  export type PlaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlaceWhereInput
    orderBy?: PlaceOrderByWithAggregationInput | PlaceOrderByWithAggregationInput[]
    by: PlaceScalarFieldEnum[] | PlaceScalarFieldEnum
    having?: PlaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlaceCountAggregateInputType | true
    _avg?: PlaceAvgAggregateInputType
    _sum?: PlaceSumAggregateInputType
    _min?: PlaceMinAggregateInputType
    _max?: PlaceMaxAggregateInputType
  }

  export type PlaceGroupByOutputType = {
    id: string
    cityId: string | null
    countryId: string | null
    contentId: string
    type: string
    category: string
    subcategory: string | null
    tags: string[]
    rating: number | null
    address: string | null
    website: string | null
    phone: string | null
    createdAt: Date
    updatedAt: Date
    _count: PlaceCountAggregateOutputType | null
    _avg: PlaceAvgAggregateOutputType | null
    _sum: PlaceSumAggregateOutputType | null
    _min: PlaceMinAggregateOutputType | null
    _max: PlaceMaxAggregateOutputType | null
  }

  type GetPlaceGroupByPayload<T extends PlaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlaceGroupByOutputType[P]>
            : GetScalarType<T[P], PlaceGroupByOutputType[P]>
        }
      >
    >


  export type PlaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cityId?: boolean
    countryId?: boolean
    contentId?: boolean
    geo?: boolean | GeoCoordinatesDefaultArgs<ExtArgs>
    image?: boolean | ImageDefaultArgs<ExtArgs>
    type?: boolean
    category?: boolean
    subcategory?: boolean
    tags?: boolean
    rating?: boolean
    address?: boolean
    website?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    city?: boolean | Place$cityArgs<ExtArgs>
    country?: boolean | Place$countryArgs<ExtArgs>
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["place"]>


  export type PlaceSelectScalar = {
    id?: boolean
    cityId?: boolean
    countryId?: boolean
    contentId?: boolean
    type?: boolean
    category?: boolean
    subcategory?: boolean
    tags?: boolean
    rating?: boolean
    address?: boolean
    website?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    city?: boolean | Place$cityArgs<ExtArgs>
    country?: boolean | Place$countryArgs<ExtArgs>
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
  }

  export type $PlacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Place"
    objects: {
      city: Prisma.$CityPayload<ExtArgs> | null
      country: Prisma.$CountryPayload<ExtArgs> | null
      content: Prisma.$TranslatableContentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      cityId: string | null
      countryId: string | null
      contentId: string
      type: string
      category: string
      subcategory: string | null
      tags: string[]
      rating: number | null
      address: string | null
      website: string | null
      phone: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["place"]>
    composites: {
      geo: Prisma.$GeoCoordinatesPayload
      image: Prisma.$ImagePayload | null
    }
  }

  type PlaceGetPayload<S extends boolean | null | undefined | PlaceDefaultArgs> = $Result.GetResult<Prisma.$PlacePayload, S>

  type PlaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PlaceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PlaceCountAggregateInputType | true
    }

  export interface PlaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Place'], meta: { name: 'Place' } }
    /**
     * Find zero or one Place that matches the filter.
     * @param {PlaceFindUniqueArgs} args - Arguments to find a Place
     * @example
     * // Get one Place
     * const place = await prisma.place.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlaceFindUniqueArgs>(args: SelectSubset<T, PlaceFindUniqueArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Place that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PlaceFindUniqueOrThrowArgs} args - Arguments to find a Place
     * @example
     * // Get one Place
     * const place = await prisma.place.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlaceFindUniqueOrThrowArgs>(args: SelectSubset<T, PlaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Place that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaceFindFirstArgs} args - Arguments to find a Place
     * @example
     * // Get one Place
     * const place = await prisma.place.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlaceFindFirstArgs>(args?: SelectSubset<T, PlaceFindFirstArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Place that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaceFindFirstOrThrowArgs} args - Arguments to find a Place
     * @example
     * // Get one Place
     * const place = await prisma.place.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlaceFindFirstOrThrowArgs>(args?: SelectSubset<T, PlaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Places that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Places
     * const places = await prisma.place.findMany()
     * 
     * // Get first 10 Places
     * const places = await prisma.place.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const placeWithIdOnly = await prisma.place.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlaceFindManyArgs>(args?: SelectSubset<T, PlaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Place.
     * @param {PlaceCreateArgs} args - Arguments to create a Place.
     * @example
     * // Create one Place
     * const Place = await prisma.place.create({
     *   data: {
     *     // ... data to create a Place
     *   }
     * })
     * 
     */
    create<T extends PlaceCreateArgs>(args: SelectSubset<T, PlaceCreateArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Places.
     * @param {PlaceCreateManyArgs} args - Arguments to create many Places.
     * @example
     * // Create many Places
     * const place = await prisma.place.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlaceCreateManyArgs>(args?: SelectSubset<T, PlaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Place.
     * @param {PlaceDeleteArgs} args - Arguments to delete one Place.
     * @example
     * // Delete one Place
     * const Place = await prisma.place.delete({
     *   where: {
     *     // ... filter to delete one Place
     *   }
     * })
     * 
     */
    delete<T extends PlaceDeleteArgs>(args: SelectSubset<T, PlaceDeleteArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Place.
     * @param {PlaceUpdateArgs} args - Arguments to update one Place.
     * @example
     * // Update one Place
     * const place = await prisma.place.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlaceUpdateArgs>(args: SelectSubset<T, PlaceUpdateArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Places.
     * @param {PlaceDeleteManyArgs} args - Arguments to filter Places to delete.
     * @example
     * // Delete a few Places
     * const { count } = await prisma.place.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlaceDeleteManyArgs>(args?: SelectSubset<T, PlaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Places.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Places
     * const place = await prisma.place.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlaceUpdateManyArgs>(args: SelectSubset<T, PlaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Place.
     * @param {PlaceUpsertArgs} args - Arguments to update or create a Place.
     * @example
     * // Update or create a Place
     * const place = await prisma.place.upsert({
     *   create: {
     *     // ... data to create a Place
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Place we want to update
     *   }
     * })
     */
    upsert<T extends PlaceUpsertArgs>(args: SelectSubset<T, PlaceUpsertArgs<ExtArgs>>): Prisma__PlaceClient<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Places that matches the filter.
     * @param {PlaceFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const place = await prisma.place.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: PlaceFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Place.
     * @param {PlaceAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const place = await prisma.place.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: PlaceAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Places.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaceCountArgs} args - Arguments to filter Places to count.
     * @example
     * // Count the number of Places
     * const count = await prisma.place.count({
     *   where: {
     *     // ... the filter for the Places we want to count
     *   }
     * })
    **/
    count<T extends PlaceCountArgs>(
      args?: Subset<T, PlaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Place.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlaceAggregateArgs>(args: Subset<T, PlaceAggregateArgs>): Prisma.PrismaPromise<GetPlaceAggregateType<T>>

    /**
     * Group by Place.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlaceGroupByArgs['orderBy'] }
        : { orderBy?: PlaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Place model
   */
  readonly fields: PlaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Place.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    city<T extends Place$cityArgs<ExtArgs> = {}>(args?: Subset<T, Place$cityArgs<ExtArgs>>): Prisma__CityClient<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    country<T extends Place$countryArgs<ExtArgs> = {}>(args?: Subset<T, Place$countryArgs<ExtArgs>>): Prisma__CountryClient<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    content<T extends TranslatableContentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContentDefaultArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Place model
   */ 
  interface PlaceFieldRefs {
    readonly id: FieldRef<"Place", 'String'>
    readonly cityId: FieldRef<"Place", 'String'>
    readonly countryId: FieldRef<"Place", 'String'>
    readonly contentId: FieldRef<"Place", 'String'>
    readonly type: FieldRef<"Place", 'String'>
    readonly category: FieldRef<"Place", 'String'>
    readonly subcategory: FieldRef<"Place", 'String'>
    readonly tags: FieldRef<"Place", 'String[]'>
    readonly rating: FieldRef<"Place", 'Float'>
    readonly address: FieldRef<"Place", 'String'>
    readonly website: FieldRef<"Place", 'String'>
    readonly phone: FieldRef<"Place", 'String'>
    readonly createdAt: FieldRef<"Place", 'DateTime'>
    readonly updatedAt: FieldRef<"Place", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Place findUnique
   */
  export type PlaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * Filter, which Place to fetch.
     */
    where: PlaceWhereUniqueInput
  }

  /**
   * Place findUniqueOrThrow
   */
  export type PlaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * Filter, which Place to fetch.
     */
    where: PlaceWhereUniqueInput
  }

  /**
   * Place findFirst
   */
  export type PlaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * Filter, which Place to fetch.
     */
    where?: PlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Places to fetch.
     */
    orderBy?: PlaceOrderByWithRelationInput | PlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Places.
     */
    cursor?: PlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Places from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Places.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Places.
     */
    distinct?: PlaceScalarFieldEnum | PlaceScalarFieldEnum[]
  }

  /**
   * Place findFirstOrThrow
   */
  export type PlaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * Filter, which Place to fetch.
     */
    where?: PlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Places to fetch.
     */
    orderBy?: PlaceOrderByWithRelationInput | PlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Places.
     */
    cursor?: PlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Places from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Places.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Places.
     */
    distinct?: PlaceScalarFieldEnum | PlaceScalarFieldEnum[]
  }

  /**
   * Place findMany
   */
  export type PlaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * Filter, which Places to fetch.
     */
    where?: PlaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Places to fetch.
     */
    orderBy?: PlaceOrderByWithRelationInput | PlaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Places.
     */
    cursor?: PlaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Places from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Places.
     */
    skip?: number
    distinct?: PlaceScalarFieldEnum | PlaceScalarFieldEnum[]
  }

  /**
   * Place create
   */
  export type PlaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Place.
     */
    data: XOR<PlaceCreateInput, PlaceUncheckedCreateInput>
  }

  /**
   * Place createMany
   */
  export type PlaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Places.
     */
    data: PlaceCreateManyInput | PlaceCreateManyInput[]
  }

  /**
   * Place update
   */
  export type PlaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Place.
     */
    data: XOR<PlaceUpdateInput, PlaceUncheckedUpdateInput>
    /**
     * Choose, which Place to update.
     */
    where: PlaceWhereUniqueInput
  }

  /**
   * Place updateMany
   */
  export type PlaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Places.
     */
    data: XOR<PlaceUpdateManyMutationInput, PlaceUncheckedUpdateManyInput>
    /**
     * Filter which Places to update
     */
    where?: PlaceWhereInput
  }

  /**
   * Place upsert
   */
  export type PlaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Place to update in case it exists.
     */
    where: PlaceWhereUniqueInput
    /**
     * In case the Place found by the `where` argument doesn't exist, create a new Place with this data.
     */
    create: XOR<PlaceCreateInput, PlaceUncheckedCreateInput>
    /**
     * In case the Place was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlaceUpdateInput, PlaceUncheckedUpdateInput>
  }

  /**
   * Place delete
   */
  export type PlaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    /**
     * Filter which Place to delete.
     */
    where: PlaceWhereUniqueInput
  }

  /**
   * Place deleteMany
   */
  export type PlaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Places to delete
     */
    where?: PlaceWhereInput
  }

  /**
   * Place findRaw
   */
  export type PlaceFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Place aggregateRaw
   */
  export type PlaceAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Place.city
   */
  export type Place$cityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    where?: CityWhereInput
  }

  /**
   * Place.country
   */
  export type Place$countryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    where?: CountryWhereInput
  }

  /**
   * Place without action
   */
  export type PlaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
  }


  /**
   * Model TranslatableContent
   */

  export type AggregateTranslatableContent = {
    _count: TranslatableContentCountAggregateOutputType | null
    _min: TranslatableContentMinAggregateOutputType | null
    _max: TranslatableContentMaxAggregateOutputType | null
  }

  export type TranslatableContentMinAggregateOutputType = {
    id: string | null
    entity: string | null
    code3: string | null
    type: string | null
  }

  export type TranslatableContentMaxAggregateOutputType = {
    id: string | null
    entity: string | null
    code3: string | null
    type: string | null
  }

  export type TranslatableContentCountAggregateOutputType = {
    id: number
    entity: number
    code3: number
    type: number
    _all: number
  }


  export type TranslatableContentMinAggregateInputType = {
    id?: true
    entity?: true
    code3?: true
    type?: true
  }

  export type TranslatableContentMaxAggregateInputType = {
    id?: true
    entity?: true
    code3?: true
    type?: true
  }

  export type TranslatableContentCountAggregateInputType = {
    id?: true
    entity?: true
    code3?: true
    type?: true
    _all?: true
  }

  export type TranslatableContentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranslatableContent to aggregate.
     */
    where?: TranslatableContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatableContents to fetch.
     */
    orderBy?: TranslatableContentOrderByWithRelationInput | TranslatableContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranslatableContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatableContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatableContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TranslatableContents
    **/
    _count?: true | TranslatableContentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranslatableContentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranslatableContentMaxAggregateInputType
  }

  export type GetTranslatableContentAggregateType<T extends TranslatableContentAggregateArgs> = {
        [P in keyof T & keyof AggregateTranslatableContent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranslatableContent[P]>
      : GetScalarType<T[P], AggregateTranslatableContent[P]>
  }




  export type TranslatableContentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslatableContentWhereInput
    orderBy?: TranslatableContentOrderByWithAggregationInput | TranslatableContentOrderByWithAggregationInput[]
    by: TranslatableContentScalarFieldEnum[] | TranslatableContentScalarFieldEnum
    having?: TranslatableContentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranslatableContentCountAggregateInputType | true
    _min?: TranslatableContentMinAggregateInputType
    _max?: TranslatableContentMaxAggregateInputType
  }

  export type TranslatableContentGroupByOutputType = {
    id: string
    entity: string
    code3: string | null
    type: string | null
    _count: TranslatableContentCountAggregateOutputType | null
    _min: TranslatableContentMinAggregateOutputType | null
    _max: TranslatableContentMaxAggregateOutputType | null
  }

  type GetTranslatableContentGroupByPayload<T extends TranslatableContentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranslatableContentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranslatableContentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranslatableContentGroupByOutputType[P]>
            : GetScalarType<T[P], TranslatableContentGroupByOutputType[P]>
        }
      >
    >


  export type TranslatableContentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    entity?: boolean
    alternativeNames?: boolean | AlternativeNameDefaultArgs<ExtArgs>
    code3?: boolean
    type?: boolean
    translations?: boolean | TranslatableContent$translationsArgs<ExtArgs>
    countries?: boolean | TranslatableContent$countriesArgs<ExtArgs>
    cities?: boolean | TranslatableContent$citiesArgs<ExtArgs>
    places?: boolean | TranslatableContent$placesArgs<ExtArgs>
    _count?: boolean | TranslatableContentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["translatableContent"]>


  export type TranslatableContentSelectScalar = {
    id?: boolean
    entity?: boolean
    code3?: boolean
    type?: boolean
  }

  export type TranslatableContentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    translations?: boolean | TranslatableContent$translationsArgs<ExtArgs>
    countries?: boolean | TranslatableContent$countriesArgs<ExtArgs>
    cities?: boolean | TranslatableContent$citiesArgs<ExtArgs>
    places?: boolean | TranslatableContent$placesArgs<ExtArgs>
    _count?: boolean | TranslatableContentCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TranslatableContentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TranslatableContent"
    objects: {
      translations: Prisma.$TranslatedTextPayload<ExtArgs>[]
      countries: Prisma.$CountryPayload<ExtArgs>[]
      cities: Prisma.$CityPayload<ExtArgs>[]
      places: Prisma.$PlacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      entity: string
      code3: string | null
      type: string | null
    }, ExtArgs["result"]["translatableContent"]>
    composites: {
      alternativeNames: Prisma.$AlternativeNamePayload[]
    }
  }

  type TranslatableContentGetPayload<S extends boolean | null | undefined | TranslatableContentDefaultArgs> = $Result.GetResult<Prisma.$TranslatableContentPayload, S>

  type TranslatableContentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TranslatableContentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TranslatableContentCountAggregateInputType | true
    }

  export interface TranslatableContentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TranslatableContent'], meta: { name: 'TranslatableContent' } }
    /**
     * Find zero or one TranslatableContent that matches the filter.
     * @param {TranslatableContentFindUniqueArgs} args - Arguments to find a TranslatableContent
     * @example
     * // Get one TranslatableContent
     * const translatableContent = await prisma.translatableContent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranslatableContentFindUniqueArgs>(args: SelectSubset<T, TranslatableContentFindUniqueArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TranslatableContent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TranslatableContentFindUniqueOrThrowArgs} args - Arguments to find a TranslatableContent
     * @example
     * // Get one TranslatableContent
     * const translatableContent = await prisma.translatableContent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranslatableContentFindUniqueOrThrowArgs>(args: SelectSubset<T, TranslatableContentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TranslatableContent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatableContentFindFirstArgs} args - Arguments to find a TranslatableContent
     * @example
     * // Get one TranslatableContent
     * const translatableContent = await prisma.translatableContent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranslatableContentFindFirstArgs>(args?: SelectSubset<T, TranslatableContentFindFirstArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TranslatableContent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatableContentFindFirstOrThrowArgs} args - Arguments to find a TranslatableContent
     * @example
     * // Get one TranslatableContent
     * const translatableContent = await prisma.translatableContent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranslatableContentFindFirstOrThrowArgs>(args?: SelectSubset<T, TranslatableContentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TranslatableContents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatableContentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TranslatableContents
     * const translatableContents = await prisma.translatableContent.findMany()
     * 
     * // Get first 10 TranslatableContents
     * const translatableContents = await prisma.translatableContent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const translatableContentWithIdOnly = await prisma.translatableContent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranslatableContentFindManyArgs>(args?: SelectSubset<T, TranslatableContentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TranslatableContent.
     * @param {TranslatableContentCreateArgs} args - Arguments to create a TranslatableContent.
     * @example
     * // Create one TranslatableContent
     * const TranslatableContent = await prisma.translatableContent.create({
     *   data: {
     *     // ... data to create a TranslatableContent
     *   }
     * })
     * 
     */
    create<T extends TranslatableContentCreateArgs>(args: SelectSubset<T, TranslatableContentCreateArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TranslatableContents.
     * @param {TranslatableContentCreateManyArgs} args - Arguments to create many TranslatableContents.
     * @example
     * // Create many TranslatableContents
     * const translatableContent = await prisma.translatableContent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranslatableContentCreateManyArgs>(args?: SelectSubset<T, TranslatableContentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TranslatableContent.
     * @param {TranslatableContentDeleteArgs} args - Arguments to delete one TranslatableContent.
     * @example
     * // Delete one TranslatableContent
     * const TranslatableContent = await prisma.translatableContent.delete({
     *   where: {
     *     // ... filter to delete one TranslatableContent
     *   }
     * })
     * 
     */
    delete<T extends TranslatableContentDeleteArgs>(args: SelectSubset<T, TranslatableContentDeleteArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TranslatableContent.
     * @param {TranslatableContentUpdateArgs} args - Arguments to update one TranslatableContent.
     * @example
     * // Update one TranslatableContent
     * const translatableContent = await prisma.translatableContent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranslatableContentUpdateArgs>(args: SelectSubset<T, TranslatableContentUpdateArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TranslatableContents.
     * @param {TranslatableContentDeleteManyArgs} args - Arguments to filter TranslatableContents to delete.
     * @example
     * // Delete a few TranslatableContents
     * const { count } = await prisma.translatableContent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranslatableContentDeleteManyArgs>(args?: SelectSubset<T, TranslatableContentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TranslatableContents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatableContentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TranslatableContents
     * const translatableContent = await prisma.translatableContent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranslatableContentUpdateManyArgs>(args: SelectSubset<T, TranslatableContentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TranslatableContent.
     * @param {TranslatableContentUpsertArgs} args - Arguments to update or create a TranslatableContent.
     * @example
     * // Update or create a TranslatableContent
     * const translatableContent = await prisma.translatableContent.upsert({
     *   create: {
     *     // ... data to create a TranslatableContent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TranslatableContent we want to update
     *   }
     * })
     */
    upsert<T extends TranslatableContentUpsertArgs>(args: SelectSubset<T, TranslatableContentUpsertArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more TranslatableContents that matches the filter.
     * @param {TranslatableContentFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const translatableContent = await prisma.translatableContent.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: TranslatableContentFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a TranslatableContent.
     * @param {TranslatableContentAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const translatableContent = await prisma.translatableContent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: TranslatableContentAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of TranslatableContents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatableContentCountArgs} args - Arguments to filter TranslatableContents to count.
     * @example
     * // Count the number of TranslatableContents
     * const count = await prisma.translatableContent.count({
     *   where: {
     *     // ... the filter for the TranslatableContents we want to count
     *   }
     * })
    **/
    count<T extends TranslatableContentCountArgs>(
      args?: Subset<T, TranslatableContentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranslatableContentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TranslatableContent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatableContentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranslatableContentAggregateArgs>(args: Subset<T, TranslatableContentAggregateArgs>): Prisma.PrismaPromise<GetTranslatableContentAggregateType<T>>

    /**
     * Group by TranslatableContent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatableContentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranslatableContentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranslatableContentGroupByArgs['orderBy'] }
        : { orderBy?: TranslatableContentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranslatableContentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranslatableContentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TranslatableContent model
   */
  readonly fields: TranslatableContentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TranslatableContent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranslatableContentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    translations<T extends TranslatableContent$translationsArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContent$translationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "findMany"> | Null>
    countries<T extends TranslatableContent$countriesArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContent$countriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CountryPayload<ExtArgs>, T, "findMany"> | Null>
    cities<T extends TranslatableContent$citiesArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContent$citiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CityPayload<ExtArgs>, T, "findMany"> | Null>
    places<T extends TranslatableContent$placesArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContent$placesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlacePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TranslatableContent model
   */ 
  interface TranslatableContentFieldRefs {
    readonly id: FieldRef<"TranslatableContent", 'String'>
    readonly entity: FieldRef<"TranslatableContent", 'String'>
    readonly code3: FieldRef<"TranslatableContent", 'String'>
    readonly type: FieldRef<"TranslatableContent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TranslatableContent findUnique
   */
  export type TranslatableContentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * Filter, which TranslatableContent to fetch.
     */
    where: TranslatableContentWhereUniqueInput
  }

  /**
   * TranslatableContent findUniqueOrThrow
   */
  export type TranslatableContentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * Filter, which TranslatableContent to fetch.
     */
    where: TranslatableContentWhereUniqueInput
  }

  /**
   * TranslatableContent findFirst
   */
  export type TranslatableContentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * Filter, which TranslatableContent to fetch.
     */
    where?: TranslatableContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatableContents to fetch.
     */
    orderBy?: TranslatableContentOrderByWithRelationInput | TranslatableContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranslatableContents.
     */
    cursor?: TranslatableContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatableContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatableContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranslatableContents.
     */
    distinct?: TranslatableContentScalarFieldEnum | TranslatableContentScalarFieldEnum[]
  }

  /**
   * TranslatableContent findFirstOrThrow
   */
  export type TranslatableContentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * Filter, which TranslatableContent to fetch.
     */
    where?: TranslatableContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatableContents to fetch.
     */
    orderBy?: TranslatableContentOrderByWithRelationInput | TranslatableContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranslatableContents.
     */
    cursor?: TranslatableContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatableContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatableContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranslatableContents.
     */
    distinct?: TranslatableContentScalarFieldEnum | TranslatableContentScalarFieldEnum[]
  }

  /**
   * TranslatableContent findMany
   */
  export type TranslatableContentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * Filter, which TranslatableContents to fetch.
     */
    where?: TranslatableContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatableContents to fetch.
     */
    orderBy?: TranslatableContentOrderByWithRelationInput | TranslatableContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TranslatableContents.
     */
    cursor?: TranslatableContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatableContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatableContents.
     */
    skip?: number
    distinct?: TranslatableContentScalarFieldEnum | TranslatableContentScalarFieldEnum[]
  }

  /**
   * TranslatableContent create
   */
  export type TranslatableContentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * The data needed to create a TranslatableContent.
     */
    data: XOR<TranslatableContentCreateInput, TranslatableContentUncheckedCreateInput>
  }

  /**
   * TranslatableContent createMany
   */
  export type TranslatableContentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TranslatableContents.
     */
    data: TranslatableContentCreateManyInput | TranslatableContentCreateManyInput[]
  }

  /**
   * TranslatableContent update
   */
  export type TranslatableContentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * The data needed to update a TranslatableContent.
     */
    data: XOR<TranslatableContentUpdateInput, TranslatableContentUncheckedUpdateInput>
    /**
     * Choose, which TranslatableContent to update.
     */
    where: TranslatableContentWhereUniqueInput
  }

  /**
   * TranslatableContent updateMany
   */
  export type TranslatableContentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TranslatableContents.
     */
    data: XOR<TranslatableContentUpdateManyMutationInput, TranslatableContentUncheckedUpdateManyInput>
    /**
     * Filter which TranslatableContents to update
     */
    where?: TranslatableContentWhereInput
  }

  /**
   * TranslatableContent upsert
   */
  export type TranslatableContentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * The filter to search for the TranslatableContent to update in case it exists.
     */
    where: TranslatableContentWhereUniqueInput
    /**
     * In case the TranslatableContent found by the `where` argument doesn't exist, create a new TranslatableContent with this data.
     */
    create: XOR<TranslatableContentCreateInput, TranslatableContentUncheckedCreateInput>
    /**
     * In case the TranslatableContent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranslatableContentUpdateInput, TranslatableContentUncheckedUpdateInput>
  }

  /**
   * TranslatableContent delete
   */
  export type TranslatableContentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
    /**
     * Filter which TranslatableContent to delete.
     */
    where: TranslatableContentWhereUniqueInput
  }

  /**
   * TranslatableContent deleteMany
   */
  export type TranslatableContentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranslatableContents to delete
     */
    where?: TranslatableContentWhereInput
  }

  /**
   * TranslatableContent findRaw
   */
  export type TranslatableContentFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * TranslatableContent aggregateRaw
   */
  export type TranslatableContentAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * TranslatableContent.translations
   */
  export type TranslatableContent$translationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    where?: TranslatedTextWhereInput
    orderBy?: TranslatedTextOrderByWithRelationInput | TranslatedTextOrderByWithRelationInput[]
    cursor?: TranslatedTextWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranslatedTextScalarFieldEnum | TranslatedTextScalarFieldEnum[]
  }

  /**
   * TranslatableContent.countries
   */
  export type TranslatableContent$countriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Country
     */
    select?: CountrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CountryInclude<ExtArgs> | null
    where?: CountryWhereInput
    orderBy?: CountryOrderByWithRelationInput | CountryOrderByWithRelationInput[]
    cursor?: CountryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CountryScalarFieldEnum | CountryScalarFieldEnum[]
  }

  /**
   * TranslatableContent.cities
   */
  export type TranslatableContent$citiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the City
     */
    select?: CitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CityInclude<ExtArgs> | null
    where?: CityWhereInput
    orderBy?: CityOrderByWithRelationInput | CityOrderByWithRelationInput[]
    cursor?: CityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CityScalarFieldEnum | CityScalarFieldEnum[]
  }

  /**
   * TranslatableContent.places
   */
  export type TranslatableContent$placesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Place
     */
    select?: PlaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlaceInclude<ExtArgs> | null
    where?: PlaceWhereInput
    orderBy?: PlaceOrderByWithRelationInput | PlaceOrderByWithRelationInput[]
    cursor?: PlaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlaceScalarFieldEnum | PlaceScalarFieldEnum[]
  }

  /**
   * TranslatableContent without action
   */
  export type TranslatableContentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatableContent
     */
    select?: TranslatableContentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatableContentInclude<ExtArgs> | null
  }


  /**
   * Model TranslatedText
   */

  export type AggregateTranslatedText = {
    _count: TranslatedTextCountAggregateOutputType | null
    _min: TranslatedTextMinAggregateOutputType | null
    _max: TranslatedTextMaxAggregateOutputType | null
  }

  export type TranslatedTextMinAggregateOutputType = {
    id: string | null
    contentId: string | null
    code3: string | null
    language: string | null
    text: string | null
    type: string | null
  }

  export type TranslatedTextMaxAggregateOutputType = {
    id: string | null
    contentId: string | null
    code3: string | null
    language: string | null
    text: string | null
    type: string | null
  }

  export type TranslatedTextCountAggregateOutputType = {
    id: number
    contentId: number
    code3: number
    language: number
    text: number
    type: number
    _all: number
  }


  export type TranslatedTextMinAggregateInputType = {
    id?: true
    contentId?: true
    code3?: true
    language?: true
    text?: true
    type?: true
  }

  export type TranslatedTextMaxAggregateInputType = {
    id?: true
    contentId?: true
    code3?: true
    language?: true
    text?: true
    type?: true
  }

  export type TranslatedTextCountAggregateInputType = {
    id?: true
    contentId?: true
    code3?: true
    language?: true
    text?: true
    type?: true
    _all?: true
  }

  export type TranslatedTextAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranslatedText to aggregate.
     */
    where?: TranslatedTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatedTexts to fetch.
     */
    orderBy?: TranslatedTextOrderByWithRelationInput | TranslatedTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranslatedTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatedTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatedTexts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TranslatedTexts
    **/
    _count?: true | TranslatedTextCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranslatedTextMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranslatedTextMaxAggregateInputType
  }

  export type GetTranslatedTextAggregateType<T extends TranslatedTextAggregateArgs> = {
        [P in keyof T & keyof AggregateTranslatedText]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranslatedText[P]>
      : GetScalarType<T[P], AggregateTranslatedText[P]>
  }




  export type TranslatedTextGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranslatedTextWhereInput
    orderBy?: TranslatedTextOrderByWithAggregationInput | TranslatedTextOrderByWithAggregationInput[]
    by: TranslatedTextScalarFieldEnum[] | TranslatedTextScalarFieldEnum
    having?: TranslatedTextScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranslatedTextCountAggregateInputType | true
    _min?: TranslatedTextMinAggregateInputType
    _max?: TranslatedTextMaxAggregateInputType
  }

  export type TranslatedTextGroupByOutputType = {
    id: string
    contentId: string
    code3: string | null
    language: string
    text: string
    type: string | null
    _count: TranslatedTextCountAggregateOutputType | null
    _min: TranslatedTextMinAggregateOutputType | null
    _max: TranslatedTextMaxAggregateOutputType | null
  }

  type GetTranslatedTextGroupByPayload<T extends TranslatedTextGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranslatedTextGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranslatedTextGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranslatedTextGroupByOutputType[P]>
            : GetScalarType<T[P], TranslatedTextGroupByOutputType[P]>
        }
      >
    >


  export type TranslatedTextSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    contentId?: boolean
    code3?: boolean
    language?: boolean
    text?: boolean
    type?: boolean
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["translatedText"]>


  export type TranslatedTextSelectScalar = {
    id?: boolean
    contentId?: boolean
    code3?: boolean
    language?: boolean
    text?: boolean
    type?: boolean
  }

  export type TranslatedTextInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | TranslatableContentDefaultArgs<ExtArgs>
  }

  export type $TranslatedTextPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TranslatedText"
    objects: {
      content: Prisma.$TranslatableContentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      contentId: string
      code3: string | null
      language: string
      text: string
      type: string | null
    }, ExtArgs["result"]["translatedText"]>
    composites: {}
  }

  type TranslatedTextGetPayload<S extends boolean | null | undefined | TranslatedTextDefaultArgs> = $Result.GetResult<Prisma.$TranslatedTextPayload, S>

  type TranslatedTextCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TranslatedTextFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TranslatedTextCountAggregateInputType | true
    }

  export interface TranslatedTextDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TranslatedText'], meta: { name: 'TranslatedText' } }
    /**
     * Find zero or one TranslatedText that matches the filter.
     * @param {TranslatedTextFindUniqueArgs} args - Arguments to find a TranslatedText
     * @example
     * // Get one TranslatedText
     * const translatedText = await prisma.translatedText.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranslatedTextFindUniqueArgs>(args: SelectSubset<T, TranslatedTextFindUniqueArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TranslatedText that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TranslatedTextFindUniqueOrThrowArgs} args - Arguments to find a TranslatedText
     * @example
     * // Get one TranslatedText
     * const translatedText = await prisma.translatedText.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranslatedTextFindUniqueOrThrowArgs>(args: SelectSubset<T, TranslatedTextFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TranslatedText that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatedTextFindFirstArgs} args - Arguments to find a TranslatedText
     * @example
     * // Get one TranslatedText
     * const translatedText = await prisma.translatedText.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranslatedTextFindFirstArgs>(args?: SelectSubset<T, TranslatedTextFindFirstArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TranslatedText that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatedTextFindFirstOrThrowArgs} args - Arguments to find a TranslatedText
     * @example
     * // Get one TranslatedText
     * const translatedText = await prisma.translatedText.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranslatedTextFindFirstOrThrowArgs>(args?: SelectSubset<T, TranslatedTextFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TranslatedTexts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatedTextFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TranslatedTexts
     * const translatedTexts = await prisma.translatedText.findMany()
     * 
     * // Get first 10 TranslatedTexts
     * const translatedTexts = await prisma.translatedText.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const translatedTextWithIdOnly = await prisma.translatedText.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranslatedTextFindManyArgs>(args?: SelectSubset<T, TranslatedTextFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TranslatedText.
     * @param {TranslatedTextCreateArgs} args - Arguments to create a TranslatedText.
     * @example
     * // Create one TranslatedText
     * const TranslatedText = await prisma.translatedText.create({
     *   data: {
     *     // ... data to create a TranslatedText
     *   }
     * })
     * 
     */
    create<T extends TranslatedTextCreateArgs>(args: SelectSubset<T, TranslatedTextCreateArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TranslatedTexts.
     * @param {TranslatedTextCreateManyArgs} args - Arguments to create many TranslatedTexts.
     * @example
     * // Create many TranslatedTexts
     * const translatedText = await prisma.translatedText.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranslatedTextCreateManyArgs>(args?: SelectSubset<T, TranslatedTextCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TranslatedText.
     * @param {TranslatedTextDeleteArgs} args - Arguments to delete one TranslatedText.
     * @example
     * // Delete one TranslatedText
     * const TranslatedText = await prisma.translatedText.delete({
     *   where: {
     *     // ... filter to delete one TranslatedText
     *   }
     * })
     * 
     */
    delete<T extends TranslatedTextDeleteArgs>(args: SelectSubset<T, TranslatedTextDeleteArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TranslatedText.
     * @param {TranslatedTextUpdateArgs} args - Arguments to update one TranslatedText.
     * @example
     * // Update one TranslatedText
     * const translatedText = await prisma.translatedText.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranslatedTextUpdateArgs>(args: SelectSubset<T, TranslatedTextUpdateArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TranslatedTexts.
     * @param {TranslatedTextDeleteManyArgs} args - Arguments to filter TranslatedTexts to delete.
     * @example
     * // Delete a few TranslatedTexts
     * const { count } = await prisma.translatedText.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranslatedTextDeleteManyArgs>(args?: SelectSubset<T, TranslatedTextDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TranslatedTexts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatedTextUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TranslatedTexts
     * const translatedText = await prisma.translatedText.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranslatedTextUpdateManyArgs>(args: SelectSubset<T, TranslatedTextUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TranslatedText.
     * @param {TranslatedTextUpsertArgs} args - Arguments to update or create a TranslatedText.
     * @example
     * // Update or create a TranslatedText
     * const translatedText = await prisma.translatedText.upsert({
     *   create: {
     *     // ... data to create a TranslatedText
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TranslatedText we want to update
     *   }
     * })
     */
    upsert<T extends TranslatedTextUpsertArgs>(args: SelectSubset<T, TranslatedTextUpsertArgs<ExtArgs>>): Prisma__TranslatedTextClient<$Result.GetResult<Prisma.$TranslatedTextPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more TranslatedTexts that matches the filter.
     * @param {TranslatedTextFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const translatedText = await prisma.translatedText.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: TranslatedTextFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a TranslatedText.
     * @param {TranslatedTextAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const translatedText = await prisma.translatedText.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: TranslatedTextAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of TranslatedTexts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatedTextCountArgs} args - Arguments to filter TranslatedTexts to count.
     * @example
     * // Count the number of TranslatedTexts
     * const count = await prisma.translatedText.count({
     *   where: {
     *     // ... the filter for the TranslatedTexts we want to count
     *   }
     * })
    **/
    count<T extends TranslatedTextCountArgs>(
      args?: Subset<T, TranslatedTextCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranslatedTextCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TranslatedText.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatedTextAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranslatedTextAggregateArgs>(args: Subset<T, TranslatedTextAggregateArgs>): Prisma.PrismaPromise<GetTranslatedTextAggregateType<T>>

    /**
     * Group by TranslatedText.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranslatedTextGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranslatedTextGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranslatedTextGroupByArgs['orderBy'] }
        : { orderBy?: TranslatedTextGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranslatedTextGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranslatedTextGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TranslatedText model
   */
  readonly fields: TranslatedTextFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TranslatedText.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranslatedTextClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    content<T extends TranslatableContentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TranslatableContentDefaultArgs<ExtArgs>>): Prisma__TranslatableContentClient<$Result.GetResult<Prisma.$TranslatableContentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TranslatedText model
   */ 
  interface TranslatedTextFieldRefs {
    readonly id: FieldRef<"TranslatedText", 'String'>
    readonly contentId: FieldRef<"TranslatedText", 'String'>
    readonly code3: FieldRef<"TranslatedText", 'String'>
    readonly language: FieldRef<"TranslatedText", 'String'>
    readonly text: FieldRef<"TranslatedText", 'String'>
    readonly type: FieldRef<"TranslatedText", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TranslatedText findUnique
   */
  export type TranslatedTextFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * Filter, which TranslatedText to fetch.
     */
    where: TranslatedTextWhereUniqueInput
  }

  /**
   * TranslatedText findUniqueOrThrow
   */
  export type TranslatedTextFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * Filter, which TranslatedText to fetch.
     */
    where: TranslatedTextWhereUniqueInput
  }

  /**
   * TranslatedText findFirst
   */
  export type TranslatedTextFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * Filter, which TranslatedText to fetch.
     */
    where?: TranslatedTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatedTexts to fetch.
     */
    orderBy?: TranslatedTextOrderByWithRelationInput | TranslatedTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranslatedTexts.
     */
    cursor?: TranslatedTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatedTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatedTexts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranslatedTexts.
     */
    distinct?: TranslatedTextScalarFieldEnum | TranslatedTextScalarFieldEnum[]
  }

  /**
   * TranslatedText findFirstOrThrow
   */
  export type TranslatedTextFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * Filter, which TranslatedText to fetch.
     */
    where?: TranslatedTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatedTexts to fetch.
     */
    orderBy?: TranslatedTextOrderByWithRelationInput | TranslatedTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranslatedTexts.
     */
    cursor?: TranslatedTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatedTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatedTexts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranslatedTexts.
     */
    distinct?: TranslatedTextScalarFieldEnum | TranslatedTextScalarFieldEnum[]
  }

  /**
   * TranslatedText findMany
   */
  export type TranslatedTextFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * Filter, which TranslatedTexts to fetch.
     */
    where?: TranslatedTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranslatedTexts to fetch.
     */
    orderBy?: TranslatedTextOrderByWithRelationInput | TranslatedTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TranslatedTexts.
     */
    cursor?: TranslatedTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranslatedTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranslatedTexts.
     */
    skip?: number
    distinct?: TranslatedTextScalarFieldEnum | TranslatedTextScalarFieldEnum[]
  }

  /**
   * TranslatedText create
   */
  export type TranslatedTextCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * The data needed to create a TranslatedText.
     */
    data: XOR<TranslatedTextCreateInput, TranslatedTextUncheckedCreateInput>
  }

  /**
   * TranslatedText createMany
   */
  export type TranslatedTextCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TranslatedTexts.
     */
    data: TranslatedTextCreateManyInput | TranslatedTextCreateManyInput[]
  }

  /**
   * TranslatedText update
   */
  export type TranslatedTextUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * The data needed to update a TranslatedText.
     */
    data: XOR<TranslatedTextUpdateInput, TranslatedTextUncheckedUpdateInput>
    /**
     * Choose, which TranslatedText to update.
     */
    where: TranslatedTextWhereUniqueInput
  }

  /**
   * TranslatedText updateMany
   */
  export type TranslatedTextUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TranslatedTexts.
     */
    data: XOR<TranslatedTextUpdateManyMutationInput, TranslatedTextUncheckedUpdateManyInput>
    /**
     * Filter which TranslatedTexts to update
     */
    where?: TranslatedTextWhereInput
  }

  /**
   * TranslatedText upsert
   */
  export type TranslatedTextUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * The filter to search for the TranslatedText to update in case it exists.
     */
    where: TranslatedTextWhereUniqueInput
    /**
     * In case the TranslatedText found by the `where` argument doesn't exist, create a new TranslatedText with this data.
     */
    create: XOR<TranslatedTextCreateInput, TranslatedTextUncheckedCreateInput>
    /**
     * In case the TranslatedText was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranslatedTextUpdateInput, TranslatedTextUncheckedUpdateInput>
  }

  /**
   * TranslatedText delete
   */
  export type TranslatedTextDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
    /**
     * Filter which TranslatedText to delete.
     */
    where: TranslatedTextWhereUniqueInput
  }

  /**
   * TranslatedText deleteMany
   */
  export type TranslatedTextDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranslatedTexts to delete
     */
    where?: TranslatedTextWhereInput
  }

  /**
   * TranslatedText findRaw
   */
  export type TranslatedTextFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * TranslatedText aggregateRaw
   */
  export type TranslatedTextAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * TranslatedText without action
   */
  export type TranslatedTextDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranslatedText
     */
    select?: TranslatedTextSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranslatedTextInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const CityScalarFieldEnum: {
    id: 'id',
    countryId: 'countryId',
    contentId: 'contentId',
    population: 'population',
    timezone: 'timezone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    code3: 'code3',
    type: 'type'
  };

  export type CityScalarFieldEnum = (typeof CityScalarFieldEnum)[keyof typeof CityScalarFieldEnum]


  export const CountryScalarFieldEnum: {
    id: 'id',
    code: 'code',
    code3: 'code3',
    contentId: 'contentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    type: 'type'
  };

  export type CountryScalarFieldEnum = (typeof CountryScalarFieldEnum)[keyof typeof CountryScalarFieldEnum]


  export const PlaceScalarFieldEnum: {
    id: 'id',
    cityId: 'cityId',
    countryId: 'countryId',
    contentId: 'contentId',
    type: 'type',
    category: 'category',
    subcategory: 'subcategory',
    tags: 'tags',
    rating: 'rating',
    address: 'address',
    website: 'website',
    phone: 'phone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PlaceScalarFieldEnum = (typeof PlaceScalarFieldEnum)[keyof typeof PlaceScalarFieldEnum]


  export const TranslatableContentScalarFieldEnum: {
    id: 'id',
    entity: 'entity',
    code3: 'code3',
    type: 'type'
  };

  export type TranslatableContentScalarFieldEnum = (typeof TranslatableContentScalarFieldEnum)[keyof typeof TranslatableContentScalarFieldEnum]


  export const TranslatedTextScalarFieldEnum: {
    id: 'id',
    contentId: 'contentId',
    code3: 'code3',
    language: 'language',
    text: 'text',
    type: 'type'
  };

  export type TranslatedTextScalarFieldEnum = (typeof TranslatedTextScalarFieldEnum)[keyof typeof TranslatedTextScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CityWhereInput = {
    AND?: CityWhereInput | CityWhereInput[]
    OR?: CityWhereInput[]
    NOT?: CityWhereInput | CityWhereInput[]
    id?: StringFilter<"City"> | string
    countryId?: StringFilter<"City"> | string
    contentId?: StringFilter<"City"> | string
    geo?: XOR<GeoCoordinatesCompositeFilter, GeoCoordinatesObjectEqualityInput>
    image?: XOR<ImageNullableCompositeFilter, ImageObjectEqualityInput> | null
    population?: IntNullableFilter<"City"> | number | null
    timezone?: StringNullableFilter<"City"> | string | null
    createdAt?: DateTimeFilter<"City"> | Date | string
    updatedAt?: DateTimeFilter<"City"> | Date | string
    code3?: StringNullableFilter<"City"> | string | null
    type?: StringNullableFilter<"City"> | string | null
    country?: XOR<CountryRelationFilter, CountryWhereInput>
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
    places?: PlaceListRelationFilter
  }

  export type CityOrderByWithRelationInput = {
    id?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    geo?: GeoCoordinatesOrderByInput
    image?: ImageOrderByInput
    population?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code3?: SortOrder
    type?: SortOrder
    country?: CountryOrderByWithRelationInput
    content?: TranslatableContentOrderByWithRelationInput
    places?: PlaceOrderByRelationAggregateInput
  }

  export type CityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CityWhereInput | CityWhereInput[]
    OR?: CityWhereInput[]
    NOT?: CityWhereInput | CityWhereInput[]
    countryId?: StringFilter<"City"> | string
    contentId?: StringFilter<"City"> | string
    geo?: XOR<GeoCoordinatesCompositeFilter, GeoCoordinatesObjectEqualityInput>
    image?: XOR<ImageNullableCompositeFilter, ImageObjectEqualityInput> | null
    population?: IntNullableFilter<"City"> | number | null
    timezone?: StringNullableFilter<"City"> | string | null
    createdAt?: DateTimeFilter<"City"> | Date | string
    updatedAt?: DateTimeFilter<"City"> | Date | string
    code3?: StringNullableFilter<"City"> | string | null
    type?: StringNullableFilter<"City"> | string | null
    country?: XOR<CountryRelationFilter, CountryWhereInput>
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
    places?: PlaceListRelationFilter
  }, "id">

  export type CityOrderByWithAggregationInput = {
    id?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    population?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code3?: SortOrder
    type?: SortOrder
    _count?: CityCountOrderByAggregateInput
    _avg?: CityAvgOrderByAggregateInput
    _max?: CityMaxOrderByAggregateInput
    _min?: CityMinOrderByAggregateInput
    _sum?: CitySumOrderByAggregateInput
  }

  export type CityScalarWhereWithAggregatesInput = {
    AND?: CityScalarWhereWithAggregatesInput | CityScalarWhereWithAggregatesInput[]
    OR?: CityScalarWhereWithAggregatesInput[]
    NOT?: CityScalarWhereWithAggregatesInput | CityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"City"> | string
    countryId?: StringWithAggregatesFilter<"City"> | string
    contentId?: StringWithAggregatesFilter<"City"> | string
    population?: IntNullableWithAggregatesFilter<"City"> | number | null
    timezone?: StringNullableWithAggregatesFilter<"City"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"City"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"City"> | Date | string
    code3?: StringNullableWithAggregatesFilter<"City"> | string | null
    type?: StringNullableWithAggregatesFilter<"City"> | string | null
  }

  export type CountryWhereInput = {
    AND?: CountryWhereInput | CountryWhereInput[]
    OR?: CountryWhereInput[]
    NOT?: CountryWhereInput | CountryWhereInput[]
    id?: StringFilter<"Country"> | string
    code?: StringFilter<"Country"> | string
    code3?: StringFilter<"Country"> | string
    contentId?: StringFilter<"Country"> | string
    geo?: XOR<GeoCoordinatesCompositeFilter, GeoCoordinatesObjectEqualityInput>
    image?: XOR<ImageNullableCompositeFilter, ImageObjectEqualityInput> | null
    createdAt?: DateTimeFilter<"Country"> | Date | string
    updatedAt?: DateTimeFilter<"Country"> | Date | string
    type?: StringNullableFilter<"Country"> | string | null
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
    cities?: CityListRelationFilter
    places?: PlaceListRelationFilter
  }

  export type CountryOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    code3?: SortOrder
    contentId?: SortOrder
    geo?: GeoCoordinatesOrderByInput
    image?: ImageOrderByInput
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    content?: TranslatableContentOrderByWithRelationInput
    cities?: CityOrderByRelationAggregateInput
    places?: PlaceOrderByRelationAggregateInput
  }

  export type CountryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    code3?: string
    AND?: CountryWhereInput | CountryWhereInput[]
    OR?: CountryWhereInput[]
    NOT?: CountryWhereInput | CountryWhereInput[]
    contentId?: StringFilter<"Country"> | string
    geo?: XOR<GeoCoordinatesCompositeFilter, GeoCoordinatesObjectEqualityInput>
    image?: XOR<ImageNullableCompositeFilter, ImageObjectEqualityInput> | null
    createdAt?: DateTimeFilter<"Country"> | Date | string
    updatedAt?: DateTimeFilter<"Country"> | Date | string
    type?: StringNullableFilter<"Country"> | string | null
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
    cities?: CityListRelationFilter
    places?: PlaceListRelationFilter
  }, "id" | "code" | "code3">

  export type CountryOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    code3?: SortOrder
    contentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
    _count?: CountryCountOrderByAggregateInput
    _max?: CountryMaxOrderByAggregateInput
    _min?: CountryMinOrderByAggregateInput
  }

  export type CountryScalarWhereWithAggregatesInput = {
    AND?: CountryScalarWhereWithAggregatesInput | CountryScalarWhereWithAggregatesInput[]
    OR?: CountryScalarWhereWithAggregatesInput[]
    NOT?: CountryScalarWhereWithAggregatesInput | CountryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Country"> | string
    code?: StringWithAggregatesFilter<"Country"> | string
    code3?: StringWithAggregatesFilter<"Country"> | string
    contentId?: StringWithAggregatesFilter<"Country"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Country"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Country"> | Date | string
    type?: StringNullableWithAggregatesFilter<"Country"> | string | null
  }

  export type PlaceWhereInput = {
    AND?: PlaceWhereInput | PlaceWhereInput[]
    OR?: PlaceWhereInput[]
    NOT?: PlaceWhereInput | PlaceWhereInput[]
    id?: StringFilter<"Place"> | string
    cityId?: StringNullableFilter<"Place"> | string | null
    countryId?: StringNullableFilter<"Place"> | string | null
    contentId?: StringFilter<"Place"> | string
    geo?: XOR<GeoCoordinatesCompositeFilter, GeoCoordinatesObjectEqualityInput>
    image?: XOR<ImageNullableCompositeFilter, ImageObjectEqualityInput> | null
    type?: StringFilter<"Place"> | string
    category?: StringFilter<"Place"> | string
    subcategory?: StringNullableFilter<"Place"> | string | null
    tags?: StringNullableListFilter<"Place">
    rating?: FloatNullableFilter<"Place"> | number | null
    address?: StringNullableFilter<"Place"> | string | null
    website?: StringNullableFilter<"Place"> | string | null
    phone?: StringNullableFilter<"Place"> | string | null
    createdAt?: DateTimeFilter<"Place"> | Date | string
    updatedAt?: DateTimeFilter<"Place"> | Date | string
    city?: XOR<CityNullableRelationFilter, CityWhereInput> | null
    country?: XOR<CountryNullableRelationFilter, CountryWhereInput> | null
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
  }

  export type PlaceOrderByWithRelationInput = {
    id?: SortOrder
    cityId?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    geo?: GeoCoordinatesOrderByInput
    image?: ImageOrderByInput
    type?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    tags?: SortOrder
    rating?: SortOrder
    address?: SortOrder
    website?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    city?: CityOrderByWithRelationInput
    country?: CountryOrderByWithRelationInput
    content?: TranslatableContentOrderByWithRelationInput
  }

  export type PlaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlaceWhereInput | PlaceWhereInput[]
    OR?: PlaceWhereInput[]
    NOT?: PlaceWhereInput | PlaceWhereInput[]
    cityId?: StringNullableFilter<"Place"> | string | null
    countryId?: StringNullableFilter<"Place"> | string | null
    contentId?: StringFilter<"Place"> | string
    geo?: XOR<GeoCoordinatesCompositeFilter, GeoCoordinatesObjectEqualityInput>
    image?: XOR<ImageNullableCompositeFilter, ImageObjectEqualityInput> | null
    type?: StringFilter<"Place"> | string
    category?: StringFilter<"Place"> | string
    subcategory?: StringNullableFilter<"Place"> | string | null
    tags?: StringNullableListFilter<"Place">
    rating?: FloatNullableFilter<"Place"> | number | null
    address?: StringNullableFilter<"Place"> | string | null
    website?: StringNullableFilter<"Place"> | string | null
    phone?: StringNullableFilter<"Place"> | string | null
    createdAt?: DateTimeFilter<"Place"> | Date | string
    updatedAt?: DateTimeFilter<"Place"> | Date | string
    city?: XOR<CityNullableRelationFilter, CityWhereInput> | null
    country?: XOR<CountryNullableRelationFilter, CountryWhereInput> | null
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
  }, "id">

  export type PlaceOrderByWithAggregationInput = {
    id?: SortOrder
    cityId?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    type?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    tags?: SortOrder
    rating?: SortOrder
    address?: SortOrder
    website?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlaceCountOrderByAggregateInput
    _avg?: PlaceAvgOrderByAggregateInput
    _max?: PlaceMaxOrderByAggregateInput
    _min?: PlaceMinOrderByAggregateInput
    _sum?: PlaceSumOrderByAggregateInput
  }

  export type PlaceScalarWhereWithAggregatesInput = {
    AND?: PlaceScalarWhereWithAggregatesInput | PlaceScalarWhereWithAggregatesInput[]
    OR?: PlaceScalarWhereWithAggregatesInput[]
    NOT?: PlaceScalarWhereWithAggregatesInput | PlaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Place"> | string
    cityId?: StringNullableWithAggregatesFilter<"Place"> | string | null
    countryId?: StringNullableWithAggregatesFilter<"Place"> | string | null
    contentId?: StringWithAggregatesFilter<"Place"> | string
    type?: StringWithAggregatesFilter<"Place"> | string
    category?: StringWithAggregatesFilter<"Place"> | string
    subcategory?: StringNullableWithAggregatesFilter<"Place"> | string | null
    tags?: StringNullableListFilter<"Place">
    rating?: FloatNullableWithAggregatesFilter<"Place"> | number | null
    address?: StringNullableWithAggregatesFilter<"Place"> | string | null
    website?: StringNullableWithAggregatesFilter<"Place"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Place"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Place"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Place"> | Date | string
  }

  export type TranslatableContentWhereInput = {
    AND?: TranslatableContentWhereInput | TranslatableContentWhereInput[]
    OR?: TranslatableContentWhereInput[]
    NOT?: TranslatableContentWhereInput | TranslatableContentWhereInput[]
    id?: StringFilter<"TranslatableContent"> | string
    entity?: StringFilter<"TranslatableContent"> | string
    alternativeNames?: AlternativeNameCompositeListFilter | AlternativeNameObjectEqualityInput[]
    code3?: StringNullableFilter<"TranslatableContent"> | string | null
    type?: StringNullableFilter<"TranslatableContent"> | string | null
    translations?: TranslatedTextListRelationFilter
    countries?: CountryListRelationFilter
    cities?: CityListRelationFilter
    places?: PlaceListRelationFilter
  }

  export type TranslatableContentOrderByWithRelationInput = {
    id?: SortOrder
    entity?: SortOrder
    alternativeNames?: AlternativeNameOrderByCompositeAggregateInput
    code3?: SortOrder
    type?: SortOrder
    translations?: TranslatedTextOrderByRelationAggregateInput
    countries?: CountryOrderByRelationAggregateInput
    cities?: CityOrderByRelationAggregateInput
    places?: PlaceOrderByRelationAggregateInput
  }

  export type TranslatableContentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TranslatableContentWhereInput | TranslatableContentWhereInput[]
    OR?: TranslatableContentWhereInput[]
    NOT?: TranslatableContentWhereInput | TranslatableContentWhereInput[]
    entity?: StringFilter<"TranslatableContent"> | string
    alternativeNames?: AlternativeNameCompositeListFilter | AlternativeNameObjectEqualityInput[]
    code3?: StringNullableFilter<"TranslatableContent"> | string | null
    type?: StringNullableFilter<"TranslatableContent"> | string | null
    translations?: TranslatedTextListRelationFilter
    countries?: CountryListRelationFilter
    cities?: CityListRelationFilter
    places?: PlaceListRelationFilter
  }, "id">

  export type TranslatableContentOrderByWithAggregationInput = {
    id?: SortOrder
    entity?: SortOrder
    code3?: SortOrder
    type?: SortOrder
    _count?: TranslatableContentCountOrderByAggregateInput
    _max?: TranslatableContentMaxOrderByAggregateInput
    _min?: TranslatableContentMinOrderByAggregateInput
  }

  export type TranslatableContentScalarWhereWithAggregatesInput = {
    AND?: TranslatableContentScalarWhereWithAggregatesInput | TranslatableContentScalarWhereWithAggregatesInput[]
    OR?: TranslatableContentScalarWhereWithAggregatesInput[]
    NOT?: TranslatableContentScalarWhereWithAggregatesInput | TranslatableContentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TranslatableContent"> | string
    entity?: StringWithAggregatesFilter<"TranslatableContent"> | string
    code3?: StringNullableWithAggregatesFilter<"TranslatableContent"> | string | null
    type?: StringNullableWithAggregatesFilter<"TranslatableContent"> | string | null
  }

  export type TranslatedTextWhereInput = {
    AND?: TranslatedTextWhereInput | TranslatedTextWhereInput[]
    OR?: TranslatedTextWhereInput[]
    NOT?: TranslatedTextWhereInput | TranslatedTextWhereInput[]
    id?: StringFilter<"TranslatedText"> | string
    contentId?: StringFilter<"TranslatedText"> | string
    code3?: StringNullableFilter<"TranslatedText"> | string | null
    language?: StringFilter<"TranslatedText"> | string
    text?: StringFilter<"TranslatedText"> | string
    type?: StringNullableFilter<"TranslatedText"> | string | null
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
  }

  export type TranslatedTextOrderByWithRelationInput = {
    id?: SortOrder
    contentId?: SortOrder
    code3?: SortOrder
    language?: SortOrder
    text?: SortOrder
    type?: SortOrder
    content?: TranslatableContentOrderByWithRelationInput
  }

  export type TranslatedTextWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TranslatedTextWhereInput | TranslatedTextWhereInput[]
    OR?: TranslatedTextWhereInput[]
    NOT?: TranslatedTextWhereInput | TranslatedTextWhereInput[]
    contentId?: StringFilter<"TranslatedText"> | string
    code3?: StringNullableFilter<"TranslatedText"> | string | null
    language?: StringFilter<"TranslatedText"> | string
    text?: StringFilter<"TranslatedText"> | string
    type?: StringNullableFilter<"TranslatedText"> | string | null
    content?: XOR<TranslatableContentRelationFilter, TranslatableContentWhereInput>
  }, "id">

  export type TranslatedTextOrderByWithAggregationInput = {
    id?: SortOrder
    contentId?: SortOrder
    code3?: SortOrder
    language?: SortOrder
    text?: SortOrder
    type?: SortOrder
    _count?: TranslatedTextCountOrderByAggregateInput
    _max?: TranslatedTextMaxOrderByAggregateInput
    _min?: TranslatedTextMinOrderByAggregateInput
  }

  export type TranslatedTextScalarWhereWithAggregatesInput = {
    AND?: TranslatedTextScalarWhereWithAggregatesInput | TranslatedTextScalarWhereWithAggregatesInput[]
    OR?: TranslatedTextScalarWhereWithAggregatesInput[]
    NOT?: TranslatedTextScalarWhereWithAggregatesInput | TranslatedTextScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TranslatedText"> | string
    contentId?: StringWithAggregatesFilter<"TranslatedText"> | string
    code3?: StringNullableWithAggregatesFilter<"TranslatedText"> | string | null
    language?: StringWithAggregatesFilter<"TranslatedText"> | string
    text?: StringWithAggregatesFilter<"TranslatedText"> | string
    type?: StringNullableWithAggregatesFilter<"TranslatedText"> | string | null
  }

  export type CityCreateInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
    country: CountryCreateNestedOneWithoutCitiesInput
    content: TranslatableContentCreateNestedOneWithoutCitiesInput
    places?: PlaceCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateInput = {
    id?: string
    countryId: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
    places?: PlaceUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityUpdateInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    country?: CountryUpdateOneRequiredWithoutCitiesNestedInput
    content?: TranslatableContentUpdateOneRequiredWithoutCitiesNestedInput
    places?: PlaceUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateInput = {
    countryId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    places?: PlaceUncheckedUpdateManyWithoutCityNestedInput
  }

  export type CityCreateManyInput = {
    id?: string
    countryId: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
  }

  export type CityUpdateManyMutationInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CityUncheckedUpdateManyInput = {
    countryId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CountryCreateInput = {
    id?: string
    code: string
    code3: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    content: TranslatableContentCreateNestedOneWithoutCountriesInput
    cities?: CityCreateNestedManyWithoutCountryInput
    places?: PlaceCreateNestedManyWithoutCountryInput
  }

  export type CountryUncheckedCreateInput = {
    id?: string
    code: string
    code3: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    cities?: CityUncheckedCreateNestedManyWithoutCountryInput
    places?: PlaceUncheckedCreateNestedManyWithoutCountryInput
  }

  export type CountryUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    content?: TranslatableContentUpdateOneRequiredWithoutCountriesNestedInput
    cities?: CityUpdateManyWithoutCountryNestedInput
    places?: PlaceUpdateManyWithoutCountryNestedInput
  }

  export type CountryUncheckedUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    cities?: CityUncheckedUpdateManyWithoutCountryNestedInput
    places?: PlaceUncheckedUpdateManyWithoutCountryNestedInput
  }

  export type CountryCreateManyInput = {
    id?: string
    code: string
    code3: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
  }

  export type CountryUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CountryUncheckedUpdateManyInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlaceCreateInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    city?: CityCreateNestedOneWithoutPlacesInput
    country?: CountryCreateNestedOneWithoutPlacesInput
    content: TranslatableContentCreateNestedOneWithoutPlacesInput
  }

  export type PlaceUncheckedCreateInput = {
    id?: string
    cityId?: string | null
    countryId?: string | null
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaceUpdateInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneWithoutPlacesNestedInput
    country?: CountryUpdateOneWithoutPlacesNestedInput
    content?: TranslatableContentUpdateOneRequiredWithoutPlacesNestedInput
  }

  export type PlaceUncheckedUpdateInput = {
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    countryId?: NullableStringFieldUpdateOperationsInput | string | null
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaceCreateManyInput = {
    id?: string
    cityId?: string | null
    countryId?: string | null
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaceUpdateManyMutationInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaceUncheckedUpdateManyInput = {
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    countryId?: NullableStringFieldUpdateOperationsInput | string | null
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslatableContentCreateInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextCreateNestedManyWithoutContentInput
    countries?: CountryCreateNestedManyWithoutContentInput
    cities?: CityCreateNestedManyWithoutContentInput
    places?: PlaceCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentUncheckedCreateInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextUncheckedCreateNestedManyWithoutContentInput
    countries?: CountryUncheckedCreateNestedManyWithoutContentInput
    cities?: CityUncheckedCreateNestedManyWithoutContentInput
    places?: PlaceUncheckedCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentUpdateInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUpdateManyWithoutContentNestedInput
    countries?: CountryUpdateManyWithoutContentNestedInput
    cities?: CityUpdateManyWithoutContentNestedInput
    places?: PlaceUpdateManyWithoutContentNestedInput
  }

  export type TranslatableContentUncheckedUpdateInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUncheckedUpdateManyWithoutContentNestedInput
    countries?: CountryUncheckedUpdateManyWithoutContentNestedInput
    cities?: CityUncheckedUpdateManyWithoutContentNestedInput
    places?: PlaceUncheckedUpdateManyWithoutContentNestedInput
  }

  export type TranslatableContentCreateManyInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
  }

  export type TranslatableContentUpdateManyMutationInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TranslatableContentUncheckedUpdateManyInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TranslatedTextCreateInput = {
    id?: string
    code3?: string | null
    language: string
    text: string
    type?: string | null
    content: TranslatableContentCreateNestedOneWithoutTranslationsInput
  }

  export type TranslatedTextUncheckedCreateInput = {
    id?: string
    contentId: string
    code3?: string | null
    language: string
    text: string
    type?: string | null
  }

  export type TranslatedTextUpdateInput = {
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    content?: TranslatableContentUpdateOneRequiredWithoutTranslationsNestedInput
  }

  export type TranslatedTextUncheckedUpdateInput = {
    contentId?: StringFieldUpdateOperationsInput | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TranslatedTextCreateManyInput = {
    id?: string
    contentId: string
    code3?: string | null
    language: string
    text: string
    type?: string | null
  }

  export type TranslatedTextUpdateManyMutationInput = {
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TranslatedTextUncheckedUpdateManyInput = {
    contentId?: StringFieldUpdateOperationsInput | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type GeoCoordinatesCompositeFilter = {
    equals?: GeoCoordinatesObjectEqualityInput
    is?: GeoCoordinatesWhereInput
    isNot?: GeoCoordinatesWhereInput
  }

  export type GeoCoordinatesObjectEqualityInput = {
    lat: number
    log: number
  }

  export type ImageNullableCompositeFilter = {
    equals?: ImageObjectEqualityInput | null
    is?: ImageWhereInput | null
    isNot?: ImageWhereInput | null
    isSet?: boolean
  }

  export type ImageObjectEqualityInput = {
    url?: string | null
    public_id?: string | null
    uploadFrom?: string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CountryRelationFilter = {
    is?: CountryWhereInput
    isNot?: CountryWhereInput
  }

  export type TranslatableContentRelationFilter = {
    is?: TranslatableContentWhereInput
    isNot?: TranslatableContentWhereInput
  }

  export type PlaceListRelationFilter = {
    every?: PlaceWhereInput
    some?: PlaceWhereInput
    none?: PlaceWhereInput
  }

  export type GeoCoordinatesOrderByInput = {
    lat?: SortOrder
    log?: SortOrder
  }

  export type ImageOrderByInput = {
    url?: SortOrder
    public_id?: SortOrder
    uploadFrom?: SortOrder
  }

  export type PlaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CityCountOrderByAggregateInput = {
    id?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    population?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code3?: SortOrder
    type?: SortOrder
  }

  export type CityAvgOrderByAggregateInput = {
    population?: SortOrder
  }

  export type CityMaxOrderByAggregateInput = {
    id?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    population?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code3?: SortOrder
    type?: SortOrder
  }

  export type CityMinOrderByAggregateInput = {
    id?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    population?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    code3?: SortOrder
    type?: SortOrder
  }

  export type CitySumOrderByAggregateInput = {
    population?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type CityListRelationFilter = {
    every?: CityWhereInput
    some?: CityWhereInput
    none?: CityWhereInput
  }

  export type CityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CountryCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    code3?: SortOrder
    contentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
  }

  export type CountryMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    code3?: SortOrder
    contentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
  }

  export type CountryMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    code3?: SortOrder
    contentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    type?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type CityNullableRelationFilter = {
    is?: CityWhereInput | null
    isNot?: CityWhereInput | null
  }

  export type CountryNullableRelationFilter = {
    is?: CountryWhereInput | null
    isNot?: CountryWhereInput | null
  }

  export type PlaceCountOrderByAggregateInput = {
    id?: SortOrder
    cityId?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    type?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    tags?: SortOrder
    rating?: SortOrder
    address?: SortOrder
    website?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlaceAvgOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type PlaceMaxOrderByAggregateInput = {
    id?: SortOrder
    cityId?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    type?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    rating?: SortOrder
    address?: SortOrder
    website?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlaceMinOrderByAggregateInput = {
    id?: SortOrder
    cityId?: SortOrder
    countryId?: SortOrder
    contentId?: SortOrder
    type?: SortOrder
    category?: SortOrder
    subcategory?: SortOrder
    rating?: SortOrder
    address?: SortOrder
    website?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlaceSumOrderByAggregateInput = {
    rating?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type AlternativeNameCompositeListFilter = {
    equals?: AlternativeNameObjectEqualityInput[]
    every?: AlternativeNameWhereInput
    some?: AlternativeNameWhereInput
    none?: AlternativeNameWhereInput
    isEmpty?: boolean
    isSet?: boolean
  }

  export type AlternativeNameObjectEqualityInput = {
    text: string
    source: string
    createdAt: Date | string
  }

  export type TranslatedTextListRelationFilter = {
    every?: TranslatedTextWhereInput
    some?: TranslatedTextWhereInput
    none?: TranslatedTextWhereInput
  }

  export type CountryListRelationFilter = {
    every?: CountryWhereInput
    some?: CountryWhereInput
    none?: CountryWhereInput
  }

  export type AlternativeNameOrderByCompositeAggregateInput = {
    _count?: SortOrder
  }

  export type TranslatedTextOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CountryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TranslatableContentCountOrderByAggregateInput = {
    id?: SortOrder
    entity?: SortOrder
    code3?: SortOrder
    type?: SortOrder
  }

  export type TranslatableContentMaxOrderByAggregateInput = {
    id?: SortOrder
    entity?: SortOrder
    code3?: SortOrder
    type?: SortOrder
  }

  export type TranslatableContentMinOrderByAggregateInput = {
    id?: SortOrder
    entity?: SortOrder
    code3?: SortOrder
    type?: SortOrder
  }

  export type TranslatedTextCountOrderByAggregateInput = {
    id?: SortOrder
    contentId?: SortOrder
    code3?: SortOrder
    language?: SortOrder
    text?: SortOrder
    type?: SortOrder
  }

  export type TranslatedTextMaxOrderByAggregateInput = {
    id?: SortOrder
    contentId?: SortOrder
    code3?: SortOrder
    language?: SortOrder
    text?: SortOrder
    type?: SortOrder
  }

  export type TranslatedTextMinOrderByAggregateInput = {
    id?: SortOrder
    contentId?: SortOrder
    code3?: SortOrder
    language?: SortOrder
    text?: SortOrder
    type?: SortOrder
  }

  export type GeoCoordinatesCreateEnvelopeInput = {
    set?: GeoCoordinatesCreateInput
  }

  export type GeoCoordinatesCreateInput = {
    lat: number
    log: number
  }

  export type ImageNullableCreateEnvelopeInput = {
    set?: ImageCreateInput | null
  }

  export type ImageCreateInput = {
    url?: string | null
    public_id?: string | null
    uploadFrom?: string | null
  }

  export type CountryCreateNestedOneWithoutCitiesInput = {
    create?: XOR<CountryCreateWithoutCitiesInput, CountryUncheckedCreateWithoutCitiesInput>
    connectOrCreate?: CountryCreateOrConnectWithoutCitiesInput
    connect?: CountryWhereUniqueInput
  }

  export type TranslatableContentCreateNestedOneWithoutCitiesInput = {
    create?: XOR<TranslatableContentCreateWithoutCitiesInput, TranslatableContentUncheckedCreateWithoutCitiesInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutCitiesInput
    connect?: TranslatableContentWhereUniqueInput
  }

  export type PlaceCreateNestedManyWithoutCityInput = {
    create?: XOR<PlaceCreateWithoutCityInput, PlaceUncheckedCreateWithoutCityInput> | PlaceCreateWithoutCityInput[] | PlaceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCityInput | PlaceCreateOrConnectWithoutCityInput[]
    createMany?: PlaceCreateManyCityInputEnvelope
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
  }

  export type PlaceUncheckedCreateNestedManyWithoutCityInput = {
    create?: XOR<PlaceCreateWithoutCityInput, PlaceUncheckedCreateWithoutCityInput> | PlaceCreateWithoutCityInput[] | PlaceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCityInput | PlaceCreateOrConnectWithoutCityInput[]
    createMany?: PlaceCreateManyCityInputEnvelope
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
  }

  export type GeoCoordinatesUpdateEnvelopeInput = {
    set?: GeoCoordinatesCreateInput
    update?: GeoCoordinatesUpdateInput
  }

  export type ImageNullableUpdateEnvelopeInput = {
    set?: ImageCreateInput | null
    upsert?: ImageUpsertInput
    unset?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CountryUpdateOneRequiredWithoutCitiesNestedInput = {
    create?: XOR<CountryCreateWithoutCitiesInput, CountryUncheckedCreateWithoutCitiesInput>
    connectOrCreate?: CountryCreateOrConnectWithoutCitiesInput
    upsert?: CountryUpsertWithoutCitiesInput
    connect?: CountryWhereUniqueInput
    update?: XOR<XOR<CountryUpdateToOneWithWhereWithoutCitiesInput, CountryUpdateWithoutCitiesInput>, CountryUncheckedUpdateWithoutCitiesInput>
  }

  export type TranslatableContentUpdateOneRequiredWithoutCitiesNestedInput = {
    create?: XOR<TranslatableContentCreateWithoutCitiesInput, TranslatableContentUncheckedCreateWithoutCitiesInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutCitiesInput
    upsert?: TranslatableContentUpsertWithoutCitiesInput
    connect?: TranslatableContentWhereUniqueInput
    update?: XOR<XOR<TranslatableContentUpdateToOneWithWhereWithoutCitiesInput, TranslatableContentUpdateWithoutCitiesInput>, TranslatableContentUncheckedUpdateWithoutCitiesInput>
  }

  export type PlaceUpdateManyWithoutCityNestedInput = {
    create?: XOR<PlaceCreateWithoutCityInput, PlaceUncheckedCreateWithoutCityInput> | PlaceCreateWithoutCityInput[] | PlaceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCityInput | PlaceCreateOrConnectWithoutCityInput[]
    upsert?: PlaceUpsertWithWhereUniqueWithoutCityInput | PlaceUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: PlaceCreateManyCityInputEnvelope
    set?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    disconnect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    delete?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    update?: PlaceUpdateWithWhereUniqueWithoutCityInput | PlaceUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: PlaceUpdateManyWithWhereWithoutCityInput | PlaceUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type PlaceUncheckedUpdateManyWithoutCityNestedInput = {
    create?: XOR<PlaceCreateWithoutCityInput, PlaceUncheckedCreateWithoutCityInput> | PlaceCreateWithoutCityInput[] | PlaceUncheckedCreateWithoutCityInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCityInput | PlaceCreateOrConnectWithoutCityInput[]
    upsert?: PlaceUpsertWithWhereUniqueWithoutCityInput | PlaceUpsertWithWhereUniqueWithoutCityInput[]
    createMany?: PlaceCreateManyCityInputEnvelope
    set?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    disconnect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    delete?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    update?: PlaceUpdateWithWhereUniqueWithoutCityInput | PlaceUpdateWithWhereUniqueWithoutCityInput[]
    updateMany?: PlaceUpdateManyWithWhereWithoutCityInput | PlaceUpdateManyWithWhereWithoutCityInput[]
    deleteMany?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
  }

  export type TranslatableContentCreateNestedOneWithoutCountriesInput = {
    create?: XOR<TranslatableContentCreateWithoutCountriesInput, TranslatableContentUncheckedCreateWithoutCountriesInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutCountriesInput
    connect?: TranslatableContentWhereUniqueInput
  }

  export type CityCreateNestedManyWithoutCountryInput = {
    create?: XOR<CityCreateWithoutCountryInput, CityUncheckedCreateWithoutCountryInput> | CityCreateWithoutCountryInput[] | CityUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: CityCreateOrConnectWithoutCountryInput | CityCreateOrConnectWithoutCountryInput[]
    createMany?: CityCreateManyCountryInputEnvelope
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
  }

  export type PlaceCreateNestedManyWithoutCountryInput = {
    create?: XOR<PlaceCreateWithoutCountryInput, PlaceUncheckedCreateWithoutCountryInput> | PlaceCreateWithoutCountryInput[] | PlaceUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCountryInput | PlaceCreateOrConnectWithoutCountryInput[]
    createMany?: PlaceCreateManyCountryInputEnvelope
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
  }

  export type CityUncheckedCreateNestedManyWithoutCountryInput = {
    create?: XOR<CityCreateWithoutCountryInput, CityUncheckedCreateWithoutCountryInput> | CityCreateWithoutCountryInput[] | CityUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: CityCreateOrConnectWithoutCountryInput | CityCreateOrConnectWithoutCountryInput[]
    createMany?: CityCreateManyCountryInputEnvelope
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
  }

  export type PlaceUncheckedCreateNestedManyWithoutCountryInput = {
    create?: XOR<PlaceCreateWithoutCountryInput, PlaceUncheckedCreateWithoutCountryInput> | PlaceCreateWithoutCountryInput[] | PlaceUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCountryInput | PlaceCreateOrConnectWithoutCountryInput[]
    createMany?: PlaceCreateManyCountryInputEnvelope
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
  }

  export type TranslatableContentUpdateOneRequiredWithoutCountriesNestedInput = {
    create?: XOR<TranslatableContentCreateWithoutCountriesInput, TranslatableContentUncheckedCreateWithoutCountriesInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutCountriesInput
    upsert?: TranslatableContentUpsertWithoutCountriesInput
    connect?: TranslatableContentWhereUniqueInput
    update?: XOR<XOR<TranslatableContentUpdateToOneWithWhereWithoutCountriesInput, TranslatableContentUpdateWithoutCountriesInput>, TranslatableContentUncheckedUpdateWithoutCountriesInput>
  }

  export type CityUpdateManyWithoutCountryNestedInput = {
    create?: XOR<CityCreateWithoutCountryInput, CityUncheckedCreateWithoutCountryInput> | CityCreateWithoutCountryInput[] | CityUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: CityCreateOrConnectWithoutCountryInput | CityCreateOrConnectWithoutCountryInput[]
    upsert?: CityUpsertWithWhereUniqueWithoutCountryInput | CityUpsertWithWhereUniqueWithoutCountryInput[]
    createMany?: CityCreateManyCountryInputEnvelope
    set?: CityWhereUniqueInput | CityWhereUniqueInput[]
    disconnect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    delete?: CityWhereUniqueInput | CityWhereUniqueInput[]
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    update?: CityUpdateWithWhereUniqueWithoutCountryInput | CityUpdateWithWhereUniqueWithoutCountryInput[]
    updateMany?: CityUpdateManyWithWhereWithoutCountryInput | CityUpdateManyWithWhereWithoutCountryInput[]
    deleteMany?: CityScalarWhereInput | CityScalarWhereInput[]
  }

  export type PlaceUpdateManyWithoutCountryNestedInput = {
    create?: XOR<PlaceCreateWithoutCountryInput, PlaceUncheckedCreateWithoutCountryInput> | PlaceCreateWithoutCountryInput[] | PlaceUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCountryInput | PlaceCreateOrConnectWithoutCountryInput[]
    upsert?: PlaceUpsertWithWhereUniqueWithoutCountryInput | PlaceUpsertWithWhereUniqueWithoutCountryInput[]
    createMany?: PlaceCreateManyCountryInputEnvelope
    set?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    disconnect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    delete?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    update?: PlaceUpdateWithWhereUniqueWithoutCountryInput | PlaceUpdateWithWhereUniqueWithoutCountryInput[]
    updateMany?: PlaceUpdateManyWithWhereWithoutCountryInput | PlaceUpdateManyWithWhereWithoutCountryInput[]
    deleteMany?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
  }

  export type CityUncheckedUpdateManyWithoutCountryNestedInput = {
    create?: XOR<CityCreateWithoutCountryInput, CityUncheckedCreateWithoutCountryInput> | CityCreateWithoutCountryInput[] | CityUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: CityCreateOrConnectWithoutCountryInput | CityCreateOrConnectWithoutCountryInput[]
    upsert?: CityUpsertWithWhereUniqueWithoutCountryInput | CityUpsertWithWhereUniqueWithoutCountryInput[]
    createMany?: CityCreateManyCountryInputEnvelope
    set?: CityWhereUniqueInput | CityWhereUniqueInput[]
    disconnect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    delete?: CityWhereUniqueInput | CityWhereUniqueInput[]
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    update?: CityUpdateWithWhereUniqueWithoutCountryInput | CityUpdateWithWhereUniqueWithoutCountryInput[]
    updateMany?: CityUpdateManyWithWhereWithoutCountryInput | CityUpdateManyWithWhereWithoutCountryInput[]
    deleteMany?: CityScalarWhereInput | CityScalarWhereInput[]
  }

  export type PlaceUncheckedUpdateManyWithoutCountryNestedInput = {
    create?: XOR<PlaceCreateWithoutCountryInput, PlaceUncheckedCreateWithoutCountryInput> | PlaceCreateWithoutCountryInput[] | PlaceUncheckedCreateWithoutCountryInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutCountryInput | PlaceCreateOrConnectWithoutCountryInput[]
    upsert?: PlaceUpsertWithWhereUniqueWithoutCountryInput | PlaceUpsertWithWhereUniqueWithoutCountryInput[]
    createMany?: PlaceCreateManyCountryInputEnvelope
    set?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    disconnect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    delete?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    update?: PlaceUpdateWithWhereUniqueWithoutCountryInput | PlaceUpdateWithWhereUniqueWithoutCountryInput[]
    updateMany?: PlaceUpdateManyWithWhereWithoutCountryInput | PlaceUpdateManyWithWhereWithoutCountryInput[]
    deleteMany?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
  }

  export type PlaceCreatetagsInput = {
    set: string[]
  }

  export type CityCreateNestedOneWithoutPlacesInput = {
    create?: XOR<CityCreateWithoutPlacesInput, CityUncheckedCreateWithoutPlacesInput>
    connectOrCreate?: CityCreateOrConnectWithoutPlacesInput
    connect?: CityWhereUniqueInput
  }

  export type CountryCreateNestedOneWithoutPlacesInput = {
    create?: XOR<CountryCreateWithoutPlacesInput, CountryUncheckedCreateWithoutPlacesInput>
    connectOrCreate?: CountryCreateOrConnectWithoutPlacesInput
    connect?: CountryWhereUniqueInput
  }

  export type TranslatableContentCreateNestedOneWithoutPlacesInput = {
    create?: XOR<TranslatableContentCreateWithoutPlacesInput, TranslatableContentUncheckedCreateWithoutPlacesInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutPlacesInput
    connect?: TranslatableContentWhereUniqueInput
  }

  export type PlaceUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type CityUpdateOneWithoutPlacesNestedInput = {
    create?: XOR<CityCreateWithoutPlacesInput, CityUncheckedCreateWithoutPlacesInput>
    connectOrCreate?: CityCreateOrConnectWithoutPlacesInput
    upsert?: CityUpsertWithoutPlacesInput
    disconnect?: boolean
    delete?: CityWhereInput | boolean
    connect?: CityWhereUniqueInput
    update?: XOR<XOR<CityUpdateToOneWithWhereWithoutPlacesInput, CityUpdateWithoutPlacesInput>, CityUncheckedUpdateWithoutPlacesInput>
  }

  export type CountryUpdateOneWithoutPlacesNestedInput = {
    create?: XOR<CountryCreateWithoutPlacesInput, CountryUncheckedCreateWithoutPlacesInput>
    connectOrCreate?: CountryCreateOrConnectWithoutPlacesInput
    upsert?: CountryUpsertWithoutPlacesInput
    disconnect?: boolean
    delete?: CountryWhereInput | boolean
    connect?: CountryWhereUniqueInput
    update?: XOR<XOR<CountryUpdateToOneWithWhereWithoutPlacesInput, CountryUpdateWithoutPlacesInput>, CountryUncheckedUpdateWithoutPlacesInput>
  }

  export type TranslatableContentUpdateOneRequiredWithoutPlacesNestedInput = {
    create?: XOR<TranslatableContentCreateWithoutPlacesInput, TranslatableContentUncheckedCreateWithoutPlacesInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutPlacesInput
    upsert?: TranslatableContentUpsertWithoutPlacesInput
    connect?: TranslatableContentWhereUniqueInput
    update?: XOR<XOR<TranslatableContentUpdateToOneWithWhereWithoutPlacesInput, TranslatableContentUpdateWithoutPlacesInput>, TranslatableContentUncheckedUpdateWithoutPlacesInput>
  }

  export type AlternativeNameListCreateEnvelopeInput = {
    set?: AlternativeNameCreateInput | AlternativeNameCreateInput[]
  }

  export type AlternativeNameCreateInput = {
    text: string
    source: string
    createdAt?: Date | string
  }

  export type TranslatedTextCreateNestedManyWithoutContentInput = {
    create?: XOR<TranslatedTextCreateWithoutContentInput, TranslatedTextUncheckedCreateWithoutContentInput> | TranslatedTextCreateWithoutContentInput[] | TranslatedTextUncheckedCreateWithoutContentInput[]
    connectOrCreate?: TranslatedTextCreateOrConnectWithoutContentInput | TranslatedTextCreateOrConnectWithoutContentInput[]
    createMany?: TranslatedTextCreateManyContentInputEnvelope
    connect?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
  }

  export type CountryCreateNestedManyWithoutContentInput = {
    create?: XOR<CountryCreateWithoutContentInput, CountryUncheckedCreateWithoutContentInput> | CountryCreateWithoutContentInput[] | CountryUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutContentInput | CountryCreateOrConnectWithoutContentInput[]
    createMany?: CountryCreateManyContentInputEnvelope
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
  }

  export type CityCreateNestedManyWithoutContentInput = {
    create?: XOR<CityCreateWithoutContentInput, CityUncheckedCreateWithoutContentInput> | CityCreateWithoutContentInput[] | CityUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CityCreateOrConnectWithoutContentInput | CityCreateOrConnectWithoutContentInput[]
    createMany?: CityCreateManyContentInputEnvelope
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
  }

  export type PlaceCreateNestedManyWithoutContentInput = {
    create?: XOR<PlaceCreateWithoutContentInput, PlaceUncheckedCreateWithoutContentInput> | PlaceCreateWithoutContentInput[] | PlaceUncheckedCreateWithoutContentInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutContentInput | PlaceCreateOrConnectWithoutContentInput[]
    createMany?: PlaceCreateManyContentInputEnvelope
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
  }

  export type TranslatedTextUncheckedCreateNestedManyWithoutContentInput = {
    create?: XOR<TranslatedTextCreateWithoutContentInput, TranslatedTextUncheckedCreateWithoutContentInput> | TranslatedTextCreateWithoutContentInput[] | TranslatedTextUncheckedCreateWithoutContentInput[]
    connectOrCreate?: TranslatedTextCreateOrConnectWithoutContentInput | TranslatedTextCreateOrConnectWithoutContentInput[]
    createMany?: TranslatedTextCreateManyContentInputEnvelope
    connect?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
  }

  export type CountryUncheckedCreateNestedManyWithoutContentInput = {
    create?: XOR<CountryCreateWithoutContentInput, CountryUncheckedCreateWithoutContentInput> | CountryCreateWithoutContentInput[] | CountryUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutContentInput | CountryCreateOrConnectWithoutContentInput[]
    createMany?: CountryCreateManyContentInputEnvelope
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
  }

  export type CityUncheckedCreateNestedManyWithoutContentInput = {
    create?: XOR<CityCreateWithoutContentInput, CityUncheckedCreateWithoutContentInput> | CityCreateWithoutContentInput[] | CityUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CityCreateOrConnectWithoutContentInput | CityCreateOrConnectWithoutContentInput[]
    createMany?: CityCreateManyContentInputEnvelope
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
  }

  export type PlaceUncheckedCreateNestedManyWithoutContentInput = {
    create?: XOR<PlaceCreateWithoutContentInput, PlaceUncheckedCreateWithoutContentInput> | PlaceCreateWithoutContentInput[] | PlaceUncheckedCreateWithoutContentInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutContentInput | PlaceCreateOrConnectWithoutContentInput[]
    createMany?: PlaceCreateManyContentInputEnvelope
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
  }

  export type AlternativeNameListUpdateEnvelopeInput = {
    set?: AlternativeNameCreateInput | AlternativeNameCreateInput[]
    push?: AlternativeNameCreateInput | AlternativeNameCreateInput[]
    updateMany?: AlternativeNameUpdateManyInput
    deleteMany?: AlternativeNameDeleteManyInput
  }

  export type TranslatedTextUpdateManyWithoutContentNestedInput = {
    create?: XOR<TranslatedTextCreateWithoutContentInput, TranslatedTextUncheckedCreateWithoutContentInput> | TranslatedTextCreateWithoutContentInput[] | TranslatedTextUncheckedCreateWithoutContentInput[]
    connectOrCreate?: TranslatedTextCreateOrConnectWithoutContentInput | TranslatedTextCreateOrConnectWithoutContentInput[]
    upsert?: TranslatedTextUpsertWithWhereUniqueWithoutContentInput | TranslatedTextUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: TranslatedTextCreateManyContentInputEnvelope
    set?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    disconnect?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    delete?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    connect?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    update?: TranslatedTextUpdateWithWhereUniqueWithoutContentInput | TranslatedTextUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: TranslatedTextUpdateManyWithWhereWithoutContentInput | TranslatedTextUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: TranslatedTextScalarWhereInput | TranslatedTextScalarWhereInput[]
  }

  export type CountryUpdateManyWithoutContentNestedInput = {
    create?: XOR<CountryCreateWithoutContentInput, CountryUncheckedCreateWithoutContentInput> | CountryCreateWithoutContentInput[] | CountryUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutContentInput | CountryCreateOrConnectWithoutContentInput[]
    upsert?: CountryUpsertWithWhereUniqueWithoutContentInput | CountryUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: CountryCreateManyContentInputEnvelope
    set?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    disconnect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    delete?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    update?: CountryUpdateWithWhereUniqueWithoutContentInput | CountryUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: CountryUpdateManyWithWhereWithoutContentInput | CountryUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: CountryScalarWhereInput | CountryScalarWhereInput[]
  }

  export type CityUpdateManyWithoutContentNestedInput = {
    create?: XOR<CityCreateWithoutContentInput, CityUncheckedCreateWithoutContentInput> | CityCreateWithoutContentInput[] | CityUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CityCreateOrConnectWithoutContentInput | CityCreateOrConnectWithoutContentInput[]
    upsert?: CityUpsertWithWhereUniqueWithoutContentInput | CityUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: CityCreateManyContentInputEnvelope
    set?: CityWhereUniqueInput | CityWhereUniqueInput[]
    disconnect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    delete?: CityWhereUniqueInput | CityWhereUniqueInput[]
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    update?: CityUpdateWithWhereUniqueWithoutContentInput | CityUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: CityUpdateManyWithWhereWithoutContentInput | CityUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: CityScalarWhereInput | CityScalarWhereInput[]
  }

  export type PlaceUpdateManyWithoutContentNestedInput = {
    create?: XOR<PlaceCreateWithoutContentInput, PlaceUncheckedCreateWithoutContentInput> | PlaceCreateWithoutContentInput[] | PlaceUncheckedCreateWithoutContentInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutContentInput | PlaceCreateOrConnectWithoutContentInput[]
    upsert?: PlaceUpsertWithWhereUniqueWithoutContentInput | PlaceUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: PlaceCreateManyContentInputEnvelope
    set?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    disconnect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    delete?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    update?: PlaceUpdateWithWhereUniqueWithoutContentInput | PlaceUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: PlaceUpdateManyWithWhereWithoutContentInput | PlaceUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
  }

  export type TranslatedTextUncheckedUpdateManyWithoutContentNestedInput = {
    create?: XOR<TranslatedTextCreateWithoutContentInput, TranslatedTextUncheckedCreateWithoutContentInput> | TranslatedTextCreateWithoutContentInput[] | TranslatedTextUncheckedCreateWithoutContentInput[]
    connectOrCreate?: TranslatedTextCreateOrConnectWithoutContentInput | TranslatedTextCreateOrConnectWithoutContentInput[]
    upsert?: TranslatedTextUpsertWithWhereUniqueWithoutContentInput | TranslatedTextUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: TranslatedTextCreateManyContentInputEnvelope
    set?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    disconnect?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    delete?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    connect?: TranslatedTextWhereUniqueInput | TranslatedTextWhereUniqueInput[]
    update?: TranslatedTextUpdateWithWhereUniqueWithoutContentInput | TranslatedTextUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: TranslatedTextUpdateManyWithWhereWithoutContentInput | TranslatedTextUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: TranslatedTextScalarWhereInput | TranslatedTextScalarWhereInput[]
  }

  export type CountryUncheckedUpdateManyWithoutContentNestedInput = {
    create?: XOR<CountryCreateWithoutContentInput, CountryUncheckedCreateWithoutContentInput> | CountryCreateWithoutContentInput[] | CountryUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CountryCreateOrConnectWithoutContentInput | CountryCreateOrConnectWithoutContentInput[]
    upsert?: CountryUpsertWithWhereUniqueWithoutContentInput | CountryUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: CountryCreateManyContentInputEnvelope
    set?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    disconnect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    delete?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    connect?: CountryWhereUniqueInput | CountryWhereUniqueInput[]
    update?: CountryUpdateWithWhereUniqueWithoutContentInput | CountryUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: CountryUpdateManyWithWhereWithoutContentInput | CountryUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: CountryScalarWhereInput | CountryScalarWhereInput[]
  }

  export type CityUncheckedUpdateManyWithoutContentNestedInput = {
    create?: XOR<CityCreateWithoutContentInput, CityUncheckedCreateWithoutContentInput> | CityCreateWithoutContentInput[] | CityUncheckedCreateWithoutContentInput[]
    connectOrCreate?: CityCreateOrConnectWithoutContentInput | CityCreateOrConnectWithoutContentInput[]
    upsert?: CityUpsertWithWhereUniqueWithoutContentInput | CityUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: CityCreateManyContentInputEnvelope
    set?: CityWhereUniqueInput | CityWhereUniqueInput[]
    disconnect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    delete?: CityWhereUniqueInput | CityWhereUniqueInput[]
    connect?: CityWhereUniqueInput | CityWhereUniqueInput[]
    update?: CityUpdateWithWhereUniqueWithoutContentInput | CityUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: CityUpdateManyWithWhereWithoutContentInput | CityUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: CityScalarWhereInput | CityScalarWhereInput[]
  }

  export type PlaceUncheckedUpdateManyWithoutContentNestedInput = {
    create?: XOR<PlaceCreateWithoutContentInput, PlaceUncheckedCreateWithoutContentInput> | PlaceCreateWithoutContentInput[] | PlaceUncheckedCreateWithoutContentInput[]
    connectOrCreate?: PlaceCreateOrConnectWithoutContentInput | PlaceCreateOrConnectWithoutContentInput[]
    upsert?: PlaceUpsertWithWhereUniqueWithoutContentInput | PlaceUpsertWithWhereUniqueWithoutContentInput[]
    createMany?: PlaceCreateManyContentInputEnvelope
    set?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    disconnect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    delete?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    connect?: PlaceWhereUniqueInput | PlaceWhereUniqueInput[]
    update?: PlaceUpdateWithWhereUniqueWithoutContentInput | PlaceUpdateWithWhereUniqueWithoutContentInput[]
    updateMany?: PlaceUpdateManyWithWhereWithoutContentInput | PlaceUpdateManyWithWhereWithoutContentInput[]
    deleteMany?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
  }

  export type TranslatableContentCreateNestedOneWithoutTranslationsInput = {
    create?: XOR<TranslatableContentCreateWithoutTranslationsInput, TranslatableContentUncheckedCreateWithoutTranslationsInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutTranslationsInput
    connect?: TranslatableContentWhereUniqueInput
  }

  export type TranslatableContentUpdateOneRequiredWithoutTranslationsNestedInput = {
    create?: XOR<TranslatableContentCreateWithoutTranslationsInput, TranslatableContentUncheckedCreateWithoutTranslationsInput>
    connectOrCreate?: TranslatableContentCreateOrConnectWithoutTranslationsInput
    upsert?: TranslatableContentUpsertWithoutTranslationsInput
    connect?: TranslatableContentWhereUniqueInput
    update?: XOR<XOR<TranslatableContentUpdateToOneWithWhereWithoutTranslationsInput, TranslatableContentUpdateWithoutTranslationsInput>, TranslatableContentUncheckedUpdateWithoutTranslationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type GeoCoordinatesWhereInput = {
    AND?: GeoCoordinatesWhereInput | GeoCoordinatesWhereInput[]
    OR?: GeoCoordinatesWhereInput[]
    NOT?: GeoCoordinatesWhereInput | GeoCoordinatesWhereInput[]
    lat?: FloatFilter<"GeoCoordinates"> | number
    log?: FloatFilter<"GeoCoordinates"> | number
  }

  export type ImageWhereInput = {
    AND?: ImageWhereInput | ImageWhereInput[]
    OR?: ImageWhereInput[]
    NOT?: ImageWhereInput | ImageWhereInput[]
    url?: StringNullableFilter<"Image"> | string | null
    public_id?: StringNullableFilter<"Image"> | string | null
    uploadFrom?: StringNullableFilter<"Image"> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type AlternativeNameWhereInput = {
    AND?: AlternativeNameWhereInput | AlternativeNameWhereInput[]
    OR?: AlternativeNameWhereInput[]
    NOT?: AlternativeNameWhereInput | AlternativeNameWhereInput[]
    text?: StringFilter<"AlternativeName"> | string
    source?: StringFilter<"AlternativeName"> | string
    createdAt?: DateTimeFilter<"AlternativeName"> | Date | string
  }

  export type CountryCreateWithoutCitiesInput = {
    id?: string
    code: string
    code3: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    content: TranslatableContentCreateNestedOneWithoutCountriesInput
    places?: PlaceCreateNestedManyWithoutCountryInput
  }

  export type CountryUncheckedCreateWithoutCitiesInput = {
    id?: string
    code: string
    code3: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    places?: PlaceUncheckedCreateNestedManyWithoutCountryInput
  }

  export type CountryCreateOrConnectWithoutCitiesInput = {
    where: CountryWhereUniqueInput
    create: XOR<CountryCreateWithoutCitiesInput, CountryUncheckedCreateWithoutCitiesInput>
  }

  export type TranslatableContentCreateWithoutCitiesInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextCreateNestedManyWithoutContentInput
    countries?: CountryCreateNestedManyWithoutContentInput
    places?: PlaceCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentUncheckedCreateWithoutCitiesInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextUncheckedCreateNestedManyWithoutContentInput
    countries?: CountryUncheckedCreateNestedManyWithoutContentInput
    places?: PlaceUncheckedCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentCreateOrConnectWithoutCitiesInput = {
    where: TranslatableContentWhereUniqueInput
    create: XOR<TranslatableContentCreateWithoutCitiesInput, TranslatableContentUncheckedCreateWithoutCitiesInput>
  }

  export type PlaceCreateWithoutCityInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    country?: CountryCreateNestedOneWithoutPlacesInput
    content: TranslatableContentCreateNestedOneWithoutPlacesInput
  }

  export type PlaceUncheckedCreateWithoutCityInput = {
    id?: string
    countryId?: string | null
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaceCreateOrConnectWithoutCityInput = {
    where: PlaceWhereUniqueInput
    create: XOR<PlaceCreateWithoutCityInput, PlaceUncheckedCreateWithoutCityInput>
  }

  export type PlaceCreateManyCityInputEnvelope = {
    data: PlaceCreateManyCityInput | PlaceCreateManyCityInput[]
  }

  export type GeoCoordinatesUpdateInput = {
    lat?: FloatFieldUpdateOperationsInput | number
    log?: FloatFieldUpdateOperationsInput | number
  }

  export type ImageUpsertInput = {
    set: ImageCreateInput | null
    update: ImageUpdateInput
  }

  export type CountryUpsertWithoutCitiesInput = {
    update: XOR<CountryUpdateWithoutCitiesInput, CountryUncheckedUpdateWithoutCitiesInput>
    create: XOR<CountryCreateWithoutCitiesInput, CountryUncheckedCreateWithoutCitiesInput>
    where?: CountryWhereInput
  }

  export type CountryUpdateToOneWithWhereWithoutCitiesInput = {
    where?: CountryWhereInput
    data: XOR<CountryUpdateWithoutCitiesInput, CountryUncheckedUpdateWithoutCitiesInput>
  }

  export type CountryUpdateWithoutCitiesInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    content?: TranslatableContentUpdateOneRequiredWithoutCountriesNestedInput
    places?: PlaceUpdateManyWithoutCountryNestedInput
  }

  export type CountryUncheckedUpdateWithoutCitiesInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    places?: PlaceUncheckedUpdateManyWithoutCountryNestedInput
  }

  export type TranslatableContentUpsertWithoutCitiesInput = {
    update: XOR<TranslatableContentUpdateWithoutCitiesInput, TranslatableContentUncheckedUpdateWithoutCitiesInput>
    create: XOR<TranslatableContentCreateWithoutCitiesInput, TranslatableContentUncheckedCreateWithoutCitiesInput>
    where?: TranslatableContentWhereInput
  }

  export type TranslatableContentUpdateToOneWithWhereWithoutCitiesInput = {
    where?: TranslatableContentWhereInput
    data: XOR<TranslatableContentUpdateWithoutCitiesInput, TranslatableContentUncheckedUpdateWithoutCitiesInput>
  }

  export type TranslatableContentUpdateWithoutCitiesInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUpdateManyWithoutContentNestedInput
    countries?: CountryUpdateManyWithoutContentNestedInput
    places?: PlaceUpdateManyWithoutContentNestedInput
  }

  export type TranslatableContentUncheckedUpdateWithoutCitiesInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUncheckedUpdateManyWithoutContentNestedInput
    countries?: CountryUncheckedUpdateManyWithoutContentNestedInput
    places?: PlaceUncheckedUpdateManyWithoutContentNestedInput
  }

  export type PlaceUpsertWithWhereUniqueWithoutCityInput = {
    where: PlaceWhereUniqueInput
    update: XOR<PlaceUpdateWithoutCityInput, PlaceUncheckedUpdateWithoutCityInput>
    create: XOR<PlaceCreateWithoutCityInput, PlaceUncheckedCreateWithoutCityInput>
  }

  export type PlaceUpdateWithWhereUniqueWithoutCityInput = {
    where: PlaceWhereUniqueInput
    data: XOR<PlaceUpdateWithoutCityInput, PlaceUncheckedUpdateWithoutCityInput>
  }

  export type PlaceUpdateManyWithWhereWithoutCityInput = {
    where: PlaceScalarWhereInput
    data: XOR<PlaceUpdateManyMutationInput, PlaceUncheckedUpdateManyWithoutCityInput>
  }

  export type PlaceScalarWhereInput = {
    AND?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
    OR?: PlaceScalarWhereInput[]
    NOT?: PlaceScalarWhereInput | PlaceScalarWhereInput[]
    id?: StringFilter<"Place"> | string
    cityId?: StringNullableFilter<"Place"> | string | null
    countryId?: StringNullableFilter<"Place"> | string | null
    contentId?: StringFilter<"Place"> | string
    type?: StringFilter<"Place"> | string
    category?: StringFilter<"Place"> | string
    subcategory?: StringNullableFilter<"Place"> | string | null
    tags?: StringNullableListFilter<"Place">
    rating?: FloatNullableFilter<"Place"> | number | null
    address?: StringNullableFilter<"Place"> | string | null
    website?: StringNullableFilter<"Place"> | string | null
    phone?: StringNullableFilter<"Place"> | string | null
    createdAt?: DateTimeFilter<"Place"> | Date | string
    updatedAt?: DateTimeFilter<"Place"> | Date | string
  }

  export type TranslatableContentCreateWithoutCountriesInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextCreateNestedManyWithoutContentInput
    cities?: CityCreateNestedManyWithoutContentInput
    places?: PlaceCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentUncheckedCreateWithoutCountriesInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextUncheckedCreateNestedManyWithoutContentInput
    cities?: CityUncheckedCreateNestedManyWithoutContentInput
    places?: PlaceUncheckedCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentCreateOrConnectWithoutCountriesInput = {
    where: TranslatableContentWhereUniqueInput
    create: XOR<TranslatableContentCreateWithoutCountriesInput, TranslatableContentUncheckedCreateWithoutCountriesInput>
  }

  export type CityCreateWithoutCountryInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
    content: TranslatableContentCreateNestedOneWithoutCitiesInput
    places?: PlaceCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateWithoutCountryInput = {
    id?: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
    places?: PlaceUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityCreateOrConnectWithoutCountryInput = {
    where: CityWhereUniqueInput
    create: XOR<CityCreateWithoutCountryInput, CityUncheckedCreateWithoutCountryInput>
  }

  export type CityCreateManyCountryInputEnvelope = {
    data: CityCreateManyCountryInput | CityCreateManyCountryInput[]
  }

  export type PlaceCreateWithoutCountryInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    city?: CityCreateNestedOneWithoutPlacesInput
    content: TranslatableContentCreateNestedOneWithoutPlacesInput
  }

  export type PlaceUncheckedCreateWithoutCountryInput = {
    id?: string
    cityId?: string | null
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaceCreateOrConnectWithoutCountryInput = {
    where: PlaceWhereUniqueInput
    create: XOR<PlaceCreateWithoutCountryInput, PlaceUncheckedCreateWithoutCountryInput>
  }

  export type PlaceCreateManyCountryInputEnvelope = {
    data: PlaceCreateManyCountryInput | PlaceCreateManyCountryInput[]
  }

  export type TranslatableContentUpsertWithoutCountriesInput = {
    update: XOR<TranslatableContentUpdateWithoutCountriesInput, TranslatableContentUncheckedUpdateWithoutCountriesInput>
    create: XOR<TranslatableContentCreateWithoutCountriesInput, TranslatableContentUncheckedCreateWithoutCountriesInput>
    where?: TranslatableContentWhereInput
  }

  export type TranslatableContentUpdateToOneWithWhereWithoutCountriesInput = {
    where?: TranslatableContentWhereInput
    data: XOR<TranslatableContentUpdateWithoutCountriesInput, TranslatableContentUncheckedUpdateWithoutCountriesInput>
  }

  export type TranslatableContentUpdateWithoutCountriesInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUpdateManyWithoutContentNestedInput
    cities?: CityUpdateManyWithoutContentNestedInput
    places?: PlaceUpdateManyWithoutContentNestedInput
  }

  export type TranslatableContentUncheckedUpdateWithoutCountriesInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUncheckedUpdateManyWithoutContentNestedInput
    cities?: CityUncheckedUpdateManyWithoutContentNestedInput
    places?: PlaceUncheckedUpdateManyWithoutContentNestedInput
  }

  export type CityUpsertWithWhereUniqueWithoutCountryInput = {
    where: CityWhereUniqueInput
    update: XOR<CityUpdateWithoutCountryInput, CityUncheckedUpdateWithoutCountryInput>
    create: XOR<CityCreateWithoutCountryInput, CityUncheckedCreateWithoutCountryInput>
  }

  export type CityUpdateWithWhereUniqueWithoutCountryInput = {
    where: CityWhereUniqueInput
    data: XOR<CityUpdateWithoutCountryInput, CityUncheckedUpdateWithoutCountryInput>
  }

  export type CityUpdateManyWithWhereWithoutCountryInput = {
    where: CityScalarWhereInput
    data: XOR<CityUpdateManyMutationInput, CityUncheckedUpdateManyWithoutCountryInput>
  }

  export type CityScalarWhereInput = {
    AND?: CityScalarWhereInput | CityScalarWhereInput[]
    OR?: CityScalarWhereInput[]
    NOT?: CityScalarWhereInput | CityScalarWhereInput[]
    id?: StringFilter<"City"> | string
    countryId?: StringFilter<"City"> | string
    contentId?: StringFilter<"City"> | string
    population?: IntNullableFilter<"City"> | number | null
    timezone?: StringNullableFilter<"City"> | string | null
    createdAt?: DateTimeFilter<"City"> | Date | string
    updatedAt?: DateTimeFilter<"City"> | Date | string
    code3?: StringNullableFilter<"City"> | string | null
    type?: StringNullableFilter<"City"> | string | null
  }

  export type PlaceUpsertWithWhereUniqueWithoutCountryInput = {
    where: PlaceWhereUniqueInput
    update: XOR<PlaceUpdateWithoutCountryInput, PlaceUncheckedUpdateWithoutCountryInput>
    create: XOR<PlaceCreateWithoutCountryInput, PlaceUncheckedCreateWithoutCountryInput>
  }

  export type PlaceUpdateWithWhereUniqueWithoutCountryInput = {
    where: PlaceWhereUniqueInput
    data: XOR<PlaceUpdateWithoutCountryInput, PlaceUncheckedUpdateWithoutCountryInput>
  }

  export type PlaceUpdateManyWithWhereWithoutCountryInput = {
    where: PlaceScalarWhereInput
    data: XOR<PlaceUpdateManyMutationInput, PlaceUncheckedUpdateManyWithoutCountryInput>
  }

  export type CityCreateWithoutPlacesInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
    country: CountryCreateNestedOneWithoutCitiesInput
    content: TranslatableContentCreateNestedOneWithoutCitiesInput
  }

  export type CityUncheckedCreateWithoutPlacesInput = {
    id?: string
    countryId: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
  }

  export type CityCreateOrConnectWithoutPlacesInput = {
    where: CityWhereUniqueInput
    create: XOR<CityCreateWithoutPlacesInput, CityUncheckedCreateWithoutPlacesInput>
  }

  export type CountryCreateWithoutPlacesInput = {
    id?: string
    code: string
    code3: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    content: TranslatableContentCreateNestedOneWithoutCountriesInput
    cities?: CityCreateNestedManyWithoutCountryInput
  }

  export type CountryUncheckedCreateWithoutPlacesInput = {
    id?: string
    code: string
    code3: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    cities?: CityUncheckedCreateNestedManyWithoutCountryInput
  }

  export type CountryCreateOrConnectWithoutPlacesInput = {
    where: CountryWhereUniqueInput
    create: XOR<CountryCreateWithoutPlacesInput, CountryUncheckedCreateWithoutPlacesInput>
  }

  export type TranslatableContentCreateWithoutPlacesInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextCreateNestedManyWithoutContentInput
    countries?: CountryCreateNestedManyWithoutContentInput
    cities?: CityCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentUncheckedCreateWithoutPlacesInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    translations?: TranslatedTextUncheckedCreateNestedManyWithoutContentInput
    countries?: CountryUncheckedCreateNestedManyWithoutContentInput
    cities?: CityUncheckedCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentCreateOrConnectWithoutPlacesInput = {
    where: TranslatableContentWhereUniqueInput
    create: XOR<TranslatableContentCreateWithoutPlacesInput, TranslatableContentUncheckedCreateWithoutPlacesInput>
  }

  export type CityUpsertWithoutPlacesInput = {
    update: XOR<CityUpdateWithoutPlacesInput, CityUncheckedUpdateWithoutPlacesInput>
    create: XOR<CityCreateWithoutPlacesInput, CityUncheckedCreateWithoutPlacesInput>
    where?: CityWhereInput
  }

  export type CityUpdateToOneWithWhereWithoutPlacesInput = {
    where?: CityWhereInput
    data: XOR<CityUpdateWithoutPlacesInput, CityUncheckedUpdateWithoutPlacesInput>
  }

  export type CityUpdateWithoutPlacesInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    country?: CountryUpdateOneRequiredWithoutCitiesNestedInput
    content?: TranslatableContentUpdateOneRequiredWithoutCitiesNestedInput
  }

  export type CityUncheckedUpdateWithoutPlacesInput = {
    countryId?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CountryUpsertWithoutPlacesInput = {
    update: XOR<CountryUpdateWithoutPlacesInput, CountryUncheckedUpdateWithoutPlacesInput>
    create: XOR<CountryCreateWithoutPlacesInput, CountryUncheckedCreateWithoutPlacesInput>
    where?: CountryWhereInput
  }

  export type CountryUpdateToOneWithWhereWithoutPlacesInput = {
    where?: CountryWhereInput
    data: XOR<CountryUpdateWithoutPlacesInput, CountryUncheckedUpdateWithoutPlacesInput>
  }

  export type CountryUpdateWithoutPlacesInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    content?: TranslatableContentUpdateOneRequiredWithoutCountriesNestedInput
    cities?: CityUpdateManyWithoutCountryNestedInput
  }

  export type CountryUncheckedUpdateWithoutPlacesInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    cities?: CityUncheckedUpdateManyWithoutCountryNestedInput
  }

  export type TranslatableContentUpsertWithoutPlacesInput = {
    update: XOR<TranslatableContentUpdateWithoutPlacesInput, TranslatableContentUncheckedUpdateWithoutPlacesInput>
    create: XOR<TranslatableContentCreateWithoutPlacesInput, TranslatableContentUncheckedCreateWithoutPlacesInput>
    where?: TranslatableContentWhereInput
  }

  export type TranslatableContentUpdateToOneWithWhereWithoutPlacesInput = {
    where?: TranslatableContentWhereInput
    data: XOR<TranslatableContentUpdateWithoutPlacesInput, TranslatableContentUncheckedUpdateWithoutPlacesInput>
  }

  export type TranslatableContentUpdateWithoutPlacesInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUpdateManyWithoutContentNestedInput
    countries?: CountryUpdateManyWithoutContentNestedInput
    cities?: CityUpdateManyWithoutContentNestedInput
  }

  export type TranslatableContentUncheckedUpdateWithoutPlacesInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    translations?: TranslatedTextUncheckedUpdateManyWithoutContentNestedInput
    countries?: CountryUncheckedUpdateManyWithoutContentNestedInput
    cities?: CityUncheckedUpdateManyWithoutContentNestedInput
  }

  export type TranslatedTextCreateWithoutContentInput = {
    id?: string
    code3?: string | null
    language: string
    text: string
    type?: string | null
  }

  export type TranslatedTextUncheckedCreateWithoutContentInput = {
    id?: string
    code3?: string | null
    language: string
    text: string
    type?: string | null
  }

  export type TranslatedTextCreateOrConnectWithoutContentInput = {
    where: TranslatedTextWhereUniqueInput
    create: XOR<TranslatedTextCreateWithoutContentInput, TranslatedTextUncheckedCreateWithoutContentInput>
  }

  export type TranslatedTextCreateManyContentInputEnvelope = {
    data: TranslatedTextCreateManyContentInput | TranslatedTextCreateManyContentInput[]
  }

  export type CountryCreateWithoutContentInput = {
    id?: string
    code: string
    code3: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    cities?: CityCreateNestedManyWithoutCountryInput
    places?: PlaceCreateNestedManyWithoutCountryInput
  }

  export type CountryUncheckedCreateWithoutContentInput = {
    id?: string
    code: string
    code3: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
    cities?: CityUncheckedCreateNestedManyWithoutCountryInput
    places?: PlaceUncheckedCreateNestedManyWithoutCountryInput
  }

  export type CountryCreateOrConnectWithoutContentInput = {
    where: CountryWhereUniqueInput
    create: XOR<CountryCreateWithoutContentInput, CountryUncheckedCreateWithoutContentInput>
  }

  export type CountryCreateManyContentInputEnvelope = {
    data: CountryCreateManyContentInput | CountryCreateManyContentInput[]
  }

  export type CityCreateWithoutContentInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
    country: CountryCreateNestedOneWithoutCitiesInput
    places?: PlaceCreateNestedManyWithoutCityInput
  }

  export type CityUncheckedCreateWithoutContentInput = {
    id?: string
    countryId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
    places?: PlaceUncheckedCreateNestedManyWithoutCityInput
  }

  export type CityCreateOrConnectWithoutContentInput = {
    where: CityWhereUniqueInput
    create: XOR<CityCreateWithoutContentInput, CityUncheckedCreateWithoutContentInput>
  }

  export type CityCreateManyContentInputEnvelope = {
    data: CityCreateManyContentInput | CityCreateManyContentInput[]
  }

  export type PlaceCreateWithoutContentInput = {
    id?: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    city?: CityCreateNestedOneWithoutPlacesInput
    country?: CountryCreateNestedOneWithoutPlacesInput
  }

  export type PlaceUncheckedCreateWithoutContentInput = {
    id?: string
    cityId?: string | null
    countryId?: string | null
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlaceCreateOrConnectWithoutContentInput = {
    where: PlaceWhereUniqueInput
    create: XOR<PlaceCreateWithoutContentInput, PlaceUncheckedCreateWithoutContentInput>
  }

  export type PlaceCreateManyContentInputEnvelope = {
    data: PlaceCreateManyContentInput | PlaceCreateManyContentInput[]
  }

  export type AlternativeNameUpdateManyInput = {
    where: AlternativeNameWhereInput
    data: AlternativeNameUpdateInput
  }

  export type AlternativeNameDeleteManyInput = {
    where: AlternativeNameWhereInput
  }

  export type TranslatedTextUpsertWithWhereUniqueWithoutContentInput = {
    where: TranslatedTextWhereUniqueInput
    update: XOR<TranslatedTextUpdateWithoutContentInput, TranslatedTextUncheckedUpdateWithoutContentInput>
    create: XOR<TranslatedTextCreateWithoutContentInput, TranslatedTextUncheckedCreateWithoutContentInput>
  }

  export type TranslatedTextUpdateWithWhereUniqueWithoutContentInput = {
    where: TranslatedTextWhereUniqueInput
    data: XOR<TranslatedTextUpdateWithoutContentInput, TranslatedTextUncheckedUpdateWithoutContentInput>
  }

  export type TranslatedTextUpdateManyWithWhereWithoutContentInput = {
    where: TranslatedTextScalarWhereInput
    data: XOR<TranslatedTextUpdateManyMutationInput, TranslatedTextUncheckedUpdateManyWithoutContentInput>
  }

  export type TranslatedTextScalarWhereInput = {
    AND?: TranslatedTextScalarWhereInput | TranslatedTextScalarWhereInput[]
    OR?: TranslatedTextScalarWhereInput[]
    NOT?: TranslatedTextScalarWhereInput | TranslatedTextScalarWhereInput[]
    id?: StringFilter<"TranslatedText"> | string
    contentId?: StringFilter<"TranslatedText"> | string
    code3?: StringNullableFilter<"TranslatedText"> | string | null
    language?: StringFilter<"TranslatedText"> | string
    text?: StringFilter<"TranslatedText"> | string
    type?: StringNullableFilter<"TranslatedText"> | string | null
  }

  export type CountryUpsertWithWhereUniqueWithoutContentInput = {
    where: CountryWhereUniqueInput
    update: XOR<CountryUpdateWithoutContentInput, CountryUncheckedUpdateWithoutContentInput>
    create: XOR<CountryCreateWithoutContentInput, CountryUncheckedCreateWithoutContentInput>
  }

  export type CountryUpdateWithWhereUniqueWithoutContentInput = {
    where: CountryWhereUniqueInput
    data: XOR<CountryUpdateWithoutContentInput, CountryUncheckedUpdateWithoutContentInput>
  }

  export type CountryUpdateManyWithWhereWithoutContentInput = {
    where: CountryScalarWhereInput
    data: XOR<CountryUpdateManyMutationInput, CountryUncheckedUpdateManyWithoutContentInput>
  }

  export type CountryScalarWhereInput = {
    AND?: CountryScalarWhereInput | CountryScalarWhereInput[]
    OR?: CountryScalarWhereInput[]
    NOT?: CountryScalarWhereInput | CountryScalarWhereInput[]
    id?: StringFilter<"Country"> | string
    code?: StringFilter<"Country"> | string
    code3?: StringFilter<"Country"> | string
    contentId?: StringFilter<"Country"> | string
    createdAt?: DateTimeFilter<"Country"> | Date | string
    updatedAt?: DateTimeFilter<"Country"> | Date | string
    type?: StringNullableFilter<"Country"> | string | null
  }

  export type CityUpsertWithWhereUniqueWithoutContentInput = {
    where: CityWhereUniqueInput
    update: XOR<CityUpdateWithoutContentInput, CityUncheckedUpdateWithoutContentInput>
    create: XOR<CityCreateWithoutContentInput, CityUncheckedCreateWithoutContentInput>
  }

  export type CityUpdateWithWhereUniqueWithoutContentInput = {
    where: CityWhereUniqueInput
    data: XOR<CityUpdateWithoutContentInput, CityUncheckedUpdateWithoutContentInput>
  }

  export type CityUpdateManyWithWhereWithoutContentInput = {
    where: CityScalarWhereInput
    data: XOR<CityUpdateManyMutationInput, CityUncheckedUpdateManyWithoutContentInput>
  }

  export type PlaceUpsertWithWhereUniqueWithoutContentInput = {
    where: PlaceWhereUniqueInput
    update: XOR<PlaceUpdateWithoutContentInput, PlaceUncheckedUpdateWithoutContentInput>
    create: XOR<PlaceCreateWithoutContentInput, PlaceUncheckedCreateWithoutContentInput>
  }

  export type PlaceUpdateWithWhereUniqueWithoutContentInput = {
    where: PlaceWhereUniqueInput
    data: XOR<PlaceUpdateWithoutContentInput, PlaceUncheckedUpdateWithoutContentInput>
  }

  export type PlaceUpdateManyWithWhereWithoutContentInput = {
    where: PlaceScalarWhereInput
    data: XOR<PlaceUpdateManyMutationInput, PlaceUncheckedUpdateManyWithoutContentInput>
  }

  export type TranslatableContentCreateWithoutTranslationsInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    countries?: CountryCreateNestedManyWithoutContentInput
    cities?: CityCreateNestedManyWithoutContentInput
    places?: PlaceCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentUncheckedCreateWithoutTranslationsInput = {
    id?: string
    entity: string
    alternativeNames?: XOR<AlternativeNameListCreateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: string | null
    type?: string | null
    countries?: CountryUncheckedCreateNestedManyWithoutContentInput
    cities?: CityUncheckedCreateNestedManyWithoutContentInput
    places?: PlaceUncheckedCreateNestedManyWithoutContentInput
  }

  export type TranslatableContentCreateOrConnectWithoutTranslationsInput = {
    where: TranslatableContentWhereUniqueInput
    create: XOR<TranslatableContentCreateWithoutTranslationsInput, TranslatableContentUncheckedCreateWithoutTranslationsInput>
  }

  export type TranslatableContentUpsertWithoutTranslationsInput = {
    update: XOR<TranslatableContentUpdateWithoutTranslationsInput, TranslatableContentUncheckedUpdateWithoutTranslationsInput>
    create: XOR<TranslatableContentCreateWithoutTranslationsInput, TranslatableContentUncheckedCreateWithoutTranslationsInput>
    where?: TranslatableContentWhereInput
  }

  export type TranslatableContentUpdateToOneWithWhereWithoutTranslationsInput = {
    where?: TranslatableContentWhereInput
    data: XOR<TranslatableContentUpdateWithoutTranslationsInput, TranslatableContentUncheckedUpdateWithoutTranslationsInput>
  }

  export type TranslatableContentUpdateWithoutTranslationsInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    countries?: CountryUpdateManyWithoutContentNestedInput
    cities?: CityUpdateManyWithoutContentNestedInput
    places?: PlaceUpdateManyWithoutContentNestedInput
  }

  export type TranslatableContentUncheckedUpdateWithoutTranslationsInput = {
    entity?: StringFieldUpdateOperationsInput | string
    alternativeNames?: XOR<AlternativeNameListUpdateEnvelopeInput, AlternativeNameCreateInput> | AlternativeNameCreateInput[]
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    countries?: CountryUncheckedUpdateManyWithoutContentNestedInput
    cities?: CityUncheckedUpdateManyWithoutContentNestedInput
    places?: PlaceUncheckedUpdateManyWithoutContentNestedInput
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type PlaceCreateManyCityInput = {
    id?: string
    countryId?: string | null
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ImageUpdateInput = {
    url?: NullableStringFieldUpdateOperationsInput | string | null
    public_id?: NullableStringFieldUpdateOperationsInput | string | null
    uploadFrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlaceUpdateWithoutCityInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    country?: CountryUpdateOneWithoutPlacesNestedInput
    content?: TranslatableContentUpdateOneRequiredWithoutPlacesNestedInput
  }

  export type PlaceUncheckedUpdateWithoutCityInput = {
    countryId?: NullableStringFieldUpdateOperationsInput | string | null
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaceUncheckedUpdateManyWithoutCityInput = {
    countryId?: NullableStringFieldUpdateOperationsInput | string | null
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CityCreateManyCountryInput = {
    id?: string
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
  }

  export type PlaceCreateManyCountryInput = {
    id?: string
    cityId?: string | null
    contentId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CityUpdateWithoutCountryInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    content?: TranslatableContentUpdateOneRequiredWithoutCitiesNestedInput
    places?: PlaceUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateWithoutCountryInput = {
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    places?: PlaceUncheckedUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateManyWithoutCountryInput = {
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlaceUpdateWithoutCountryInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneWithoutPlacesNestedInput
    content?: TranslatableContentUpdateOneRequiredWithoutPlacesNestedInput
  }

  export type PlaceUncheckedUpdateWithoutCountryInput = {
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaceUncheckedUpdateManyWithoutCountryInput = {
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    contentId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslatedTextCreateManyContentInput = {
    id?: string
    code3?: string | null
    language: string
    text: string
    type?: string | null
  }

  export type CountryCreateManyContentInput = {
    id?: string
    code: string
    code3: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    createdAt?: Date | string
    updatedAt?: Date | string
    type?: string | null
  }

  export type CityCreateManyContentInput = {
    id?: string
    countryId: string
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    population?: number | null
    timezone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    code3?: string | null
    type?: string | null
  }

  export type PlaceCreateManyContentInput = {
    id?: string
    cityId?: string | null
    countryId?: string | null
    geo: XOR<GeoCoordinatesCreateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableCreateEnvelopeInput, ImageCreateInput> | null
    type: string
    category: string
    subcategory?: string | null
    tags?: PlaceCreatetagsInput | string[]
    rating?: number | null
    address?: string | null
    website?: string | null
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlternativeNameUpdateInput = {
    text?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranslatedTextUpdateWithoutContentInput = {
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TranslatedTextUncheckedUpdateWithoutContentInput = {
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TranslatedTextUncheckedUpdateManyWithoutContentInput = {
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    language?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CountryUpdateWithoutContentInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    cities?: CityUpdateManyWithoutCountryNestedInput
    places?: PlaceUpdateManyWithoutCountryNestedInput
  }

  export type CountryUncheckedUpdateWithoutContentInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    cities?: CityUncheckedUpdateManyWithoutCountryNestedInput
    places?: PlaceUncheckedUpdateManyWithoutCountryNestedInput
  }

  export type CountryUncheckedUpdateManyWithoutContentInput = {
    code?: StringFieldUpdateOperationsInput | string
    code3?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CityUpdateWithoutContentInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    country?: CountryUpdateOneRequiredWithoutCitiesNestedInput
    places?: PlaceUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateWithoutContentInput = {
    countryId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
    places?: PlaceUncheckedUpdateManyWithoutCityNestedInput
  }

  export type CityUncheckedUpdateManyWithoutContentInput = {
    countryId?: StringFieldUpdateOperationsInput | string
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    population?: NullableIntFieldUpdateOperationsInput | number | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    code3?: NullableStringFieldUpdateOperationsInput | string | null
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlaceUpdateWithoutContentInput = {
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    city?: CityUpdateOneWithoutPlacesNestedInput
    country?: CountryUpdateOneWithoutPlacesNestedInput
  }

  export type PlaceUncheckedUpdateWithoutContentInput = {
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    countryId?: NullableStringFieldUpdateOperationsInput | string | null
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlaceUncheckedUpdateManyWithoutContentInput = {
    cityId?: NullableStringFieldUpdateOperationsInput | string | null
    countryId?: NullableStringFieldUpdateOperationsInput | string | null
    geo?: XOR<GeoCoordinatesUpdateEnvelopeInput, GeoCoordinatesCreateInput>
    image?: XOR<ImageNullableUpdateEnvelopeInput, ImageCreateInput> | null
    type?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    subcategory?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: PlaceUpdatetagsInput | string[]
    rating?: NullableFloatFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CityCountOutputTypeDefaultArgs instead
     */
    export type CityCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CityCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CountryCountOutputTypeDefaultArgs instead
     */
    export type CountryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CountryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TranslatableContentCountOutputTypeDefaultArgs instead
     */
    export type TranslatableContentCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TranslatableContentCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlternativeNameDefaultArgs instead
     */
    export type AlternativeNameArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlternativeNameDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GeoCoordinatesDefaultArgs instead
     */
    export type GeoCoordinatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GeoCoordinatesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ImageDefaultArgs instead
     */
    export type ImageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ImageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CityDefaultArgs instead
     */
    export type CityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CountryDefaultArgs instead
     */
    export type CountryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CountryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlaceDefaultArgs instead
     */
    export type PlaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlaceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TranslatableContentDefaultArgs instead
     */
    export type TranslatableContentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TranslatableContentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TranslatedTextDefaultArgs instead
     */
    export type TranslatedTextArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TranslatedTextDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
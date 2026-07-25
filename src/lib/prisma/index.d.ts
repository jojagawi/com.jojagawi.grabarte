
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model CatCategories
 * 
 */
export type CatCategories = $Result.DefaultSelection<Prisma.$CatCategoriesPayload>
/**
 * Model CatDesignsType
 * 
 */
export type CatDesignsType = $Result.DefaultSelection<Prisma.$CatDesignsTypePayload>
/**
 * Model CatFileExtension
 * 
 */
export type CatFileExtension = $Result.DefaultSelection<Prisma.$CatFileExtensionPayload>
/**
 * Model CatFileType
 * 
 */
export type CatFileType = $Result.DefaultSelection<Prisma.$CatFileTypePayload>
/**
 * Model CatMaterials
 * 
 */
export type CatMaterials = $Result.DefaultSelection<Prisma.$CatMaterialsPayload>
/**
 * Model Designs
 * 
 */
export type Designs = $Result.DefaultSelection<Prisma.$DesignsPayload>
/**
 * Model Files
 * 
 */
export type Files = $Result.DefaultSelection<Prisma.$FilesPayload>
/**
 * Model RelDesignsCategories
 * 
 */
export type RelDesignsCategories = $Result.DefaultSelection<Prisma.$RelDesignsCategoriesPayload>
/**
 * Model RelDesignsFiles
 * 
 */
export type RelDesignsFiles = $Result.DefaultSelection<Prisma.$RelDesignsFilesPayload>
/**
 * Model RelDesignsTypes
 * 
 */
export type RelDesignsTypes = $Result.DefaultSelection<Prisma.$RelDesignsTypesPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.catCategories`: Exposes CRUD operations for the **CatCategories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CatCategories
    * const catCategories = await prisma.catCategories.findMany()
    * ```
    */
  get catCategories(): Prisma.CatCategoriesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.catDesignsType`: Exposes CRUD operations for the **CatDesignsType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CatDesignsTypes
    * const catDesignsTypes = await prisma.catDesignsType.findMany()
    * ```
    */
  get catDesignsType(): Prisma.CatDesignsTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.catFileExtension`: Exposes CRUD operations for the **CatFileExtension** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CatFileExtensions
    * const catFileExtensions = await prisma.catFileExtension.findMany()
    * ```
    */
  get catFileExtension(): Prisma.CatFileExtensionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.catFileType`: Exposes CRUD operations for the **CatFileType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CatFileTypes
    * const catFileTypes = await prisma.catFileType.findMany()
    * ```
    */
  get catFileType(): Prisma.CatFileTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.catMaterials`: Exposes CRUD operations for the **CatMaterials** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CatMaterials
    * const catMaterials = await prisma.catMaterials.findMany()
    * ```
    */
  get catMaterials(): Prisma.CatMaterialsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.designs`: Exposes CRUD operations for the **Designs** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Designs
    * const designs = await prisma.designs.findMany()
    * ```
    */
  get designs(): Prisma.DesignsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.files`: Exposes CRUD operations for the **Files** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Files
    * const files = await prisma.files.findMany()
    * ```
    */
  get files(): Prisma.FilesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.relDesignsCategories`: Exposes CRUD operations for the **RelDesignsCategories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RelDesignsCategories
    * const relDesignsCategories = await prisma.relDesignsCategories.findMany()
    * ```
    */
  get relDesignsCategories(): Prisma.RelDesignsCategoriesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.relDesignsFiles`: Exposes CRUD operations for the **RelDesignsFiles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RelDesignsFiles
    * const relDesignsFiles = await prisma.relDesignsFiles.findMany()
    * ```
    */
  get relDesignsFiles(): Prisma.RelDesignsFilesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.relDesignsTypes`: Exposes CRUD operations for the **RelDesignsTypes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RelDesignsTypes
    * const relDesignsTypes = await prisma.relDesignsTypes.findMany()
    * ```
    */
  get relDesignsTypes(): Prisma.RelDesignsTypesDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.9.0
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

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
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    User: 'User',
    CatCategories: 'CatCategories',
    CatDesignsType: 'CatDesignsType',
    CatFileExtension: 'CatFileExtension',
    CatFileType: 'CatFileType',
    CatMaterials: 'CatMaterials',
    Designs: 'Designs',
    Files: 'Files',
    RelDesignsCategories: 'RelDesignsCategories',
    RelDesignsFiles: 'RelDesignsFiles',
    RelDesignsTypes: 'RelDesignsTypes'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "catCategories" | "catDesignsType" | "catFileExtension" | "catFileType" | "catMaterials" | "designs" | "files" | "relDesignsCategories" | "relDesignsFiles" | "relDesignsTypes"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      CatCategories: {
        payload: Prisma.$CatCategoriesPayload<ExtArgs>
        fields: Prisma.CatCategoriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CatCategoriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CatCategoriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>
          }
          findFirst: {
            args: Prisma.CatCategoriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CatCategoriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>
          }
          findMany: {
            args: Prisma.CatCategoriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>[]
          }
          create: {
            args: Prisma.CatCategoriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>
          }
          createMany: {
            args: Prisma.CatCategoriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CatCategoriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>[]
          }
          delete: {
            args: Prisma.CatCategoriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>
          }
          update: {
            args: Prisma.CatCategoriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>
          }
          deleteMany: {
            args: Prisma.CatCategoriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CatCategoriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CatCategoriesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>[]
          }
          upsert: {
            args: Prisma.CatCategoriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatCategoriesPayload>
          }
          aggregate: {
            args: Prisma.CatCategoriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCatCategories>
          }
          groupBy: {
            args: Prisma.CatCategoriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<CatCategoriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.CatCategoriesCountArgs<ExtArgs>
            result: $Utils.Optional<CatCategoriesCountAggregateOutputType> | number
          }
        }
      }
      CatDesignsType: {
        payload: Prisma.$CatDesignsTypePayload<ExtArgs>
        fields: Prisma.CatDesignsTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CatDesignsTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CatDesignsTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>
          }
          findFirst: {
            args: Prisma.CatDesignsTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CatDesignsTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>
          }
          findMany: {
            args: Prisma.CatDesignsTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>[]
          }
          create: {
            args: Prisma.CatDesignsTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>
          }
          createMany: {
            args: Prisma.CatDesignsTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CatDesignsTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>[]
          }
          delete: {
            args: Prisma.CatDesignsTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>
          }
          update: {
            args: Prisma.CatDesignsTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>
          }
          deleteMany: {
            args: Prisma.CatDesignsTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CatDesignsTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CatDesignsTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>[]
          }
          upsert: {
            args: Prisma.CatDesignsTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatDesignsTypePayload>
          }
          aggregate: {
            args: Prisma.CatDesignsTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCatDesignsType>
          }
          groupBy: {
            args: Prisma.CatDesignsTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<CatDesignsTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CatDesignsTypeCountArgs<ExtArgs>
            result: $Utils.Optional<CatDesignsTypeCountAggregateOutputType> | number
          }
        }
      }
      CatFileExtension: {
        payload: Prisma.$CatFileExtensionPayload<ExtArgs>
        fields: Prisma.CatFileExtensionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CatFileExtensionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CatFileExtensionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>
          }
          findFirst: {
            args: Prisma.CatFileExtensionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CatFileExtensionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>
          }
          findMany: {
            args: Prisma.CatFileExtensionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>[]
          }
          create: {
            args: Prisma.CatFileExtensionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>
          }
          createMany: {
            args: Prisma.CatFileExtensionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CatFileExtensionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>[]
          }
          delete: {
            args: Prisma.CatFileExtensionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>
          }
          update: {
            args: Prisma.CatFileExtensionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>
          }
          deleteMany: {
            args: Prisma.CatFileExtensionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CatFileExtensionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CatFileExtensionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>[]
          }
          upsert: {
            args: Prisma.CatFileExtensionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileExtensionPayload>
          }
          aggregate: {
            args: Prisma.CatFileExtensionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCatFileExtension>
          }
          groupBy: {
            args: Prisma.CatFileExtensionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CatFileExtensionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CatFileExtensionCountArgs<ExtArgs>
            result: $Utils.Optional<CatFileExtensionCountAggregateOutputType> | number
          }
        }
      }
      CatFileType: {
        payload: Prisma.$CatFileTypePayload<ExtArgs>
        fields: Prisma.CatFileTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CatFileTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CatFileTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>
          }
          findFirst: {
            args: Prisma.CatFileTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CatFileTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>
          }
          findMany: {
            args: Prisma.CatFileTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>[]
          }
          create: {
            args: Prisma.CatFileTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>
          }
          createMany: {
            args: Prisma.CatFileTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CatFileTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>[]
          }
          delete: {
            args: Prisma.CatFileTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>
          }
          update: {
            args: Prisma.CatFileTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>
          }
          deleteMany: {
            args: Prisma.CatFileTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CatFileTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CatFileTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>[]
          }
          upsert: {
            args: Prisma.CatFileTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatFileTypePayload>
          }
          aggregate: {
            args: Prisma.CatFileTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCatFileType>
          }
          groupBy: {
            args: Prisma.CatFileTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<CatFileTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.CatFileTypeCountArgs<ExtArgs>
            result: $Utils.Optional<CatFileTypeCountAggregateOutputType> | number
          }
        }
      }
      CatMaterials: {
        payload: Prisma.$CatMaterialsPayload<ExtArgs>
        fields: Prisma.CatMaterialsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CatMaterialsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CatMaterialsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>
          }
          findFirst: {
            args: Prisma.CatMaterialsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CatMaterialsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>
          }
          findMany: {
            args: Prisma.CatMaterialsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>[]
          }
          create: {
            args: Prisma.CatMaterialsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>
          }
          createMany: {
            args: Prisma.CatMaterialsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CatMaterialsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>[]
          }
          delete: {
            args: Prisma.CatMaterialsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>
          }
          update: {
            args: Prisma.CatMaterialsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>
          }
          deleteMany: {
            args: Prisma.CatMaterialsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CatMaterialsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CatMaterialsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>[]
          }
          upsert: {
            args: Prisma.CatMaterialsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CatMaterialsPayload>
          }
          aggregate: {
            args: Prisma.CatMaterialsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCatMaterials>
          }
          groupBy: {
            args: Prisma.CatMaterialsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CatMaterialsGroupByOutputType>[]
          }
          count: {
            args: Prisma.CatMaterialsCountArgs<ExtArgs>
            result: $Utils.Optional<CatMaterialsCountAggregateOutputType> | number
          }
        }
      }
      Designs: {
        payload: Prisma.$DesignsPayload<ExtArgs>
        fields: Prisma.DesignsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DesignsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DesignsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>
          }
          findFirst: {
            args: Prisma.DesignsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DesignsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>
          }
          findMany: {
            args: Prisma.DesignsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>[]
          }
          create: {
            args: Prisma.DesignsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>
          }
          createMany: {
            args: Prisma.DesignsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DesignsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>[]
          }
          delete: {
            args: Prisma.DesignsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>
          }
          update: {
            args: Prisma.DesignsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>
          }
          deleteMany: {
            args: Prisma.DesignsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DesignsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DesignsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>[]
          }
          upsert: {
            args: Prisma.DesignsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DesignsPayload>
          }
          aggregate: {
            args: Prisma.DesignsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDesigns>
          }
          groupBy: {
            args: Prisma.DesignsGroupByArgs<ExtArgs>
            result: $Utils.Optional<DesignsGroupByOutputType>[]
          }
          count: {
            args: Prisma.DesignsCountArgs<ExtArgs>
            result: $Utils.Optional<DesignsCountAggregateOutputType> | number
          }
        }
      }
      Files: {
        payload: Prisma.$FilesPayload<ExtArgs>
        fields: Prisma.FilesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FilesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FilesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>
          }
          findFirst: {
            args: Prisma.FilesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FilesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>
          }
          findMany: {
            args: Prisma.FilesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>[]
          }
          create: {
            args: Prisma.FilesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>
          }
          createMany: {
            args: Prisma.FilesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FilesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>[]
          }
          delete: {
            args: Prisma.FilesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>
          }
          update: {
            args: Prisma.FilesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>
          }
          deleteMany: {
            args: Prisma.FilesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FilesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FilesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>[]
          }
          upsert: {
            args: Prisma.FilesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FilesPayload>
          }
          aggregate: {
            args: Prisma.FilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFiles>
          }
          groupBy: {
            args: Prisma.FilesGroupByArgs<ExtArgs>
            result: $Utils.Optional<FilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.FilesCountArgs<ExtArgs>
            result: $Utils.Optional<FilesCountAggregateOutputType> | number
          }
        }
      }
      RelDesignsCategories: {
        payload: Prisma.$RelDesignsCategoriesPayload<ExtArgs>
        fields: Prisma.RelDesignsCategoriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RelDesignsCategoriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RelDesignsCategoriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>
          }
          findFirst: {
            args: Prisma.RelDesignsCategoriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RelDesignsCategoriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>
          }
          findMany: {
            args: Prisma.RelDesignsCategoriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>[]
          }
          create: {
            args: Prisma.RelDesignsCategoriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>
          }
          createMany: {
            args: Prisma.RelDesignsCategoriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RelDesignsCategoriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>[]
          }
          delete: {
            args: Prisma.RelDesignsCategoriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>
          }
          update: {
            args: Prisma.RelDesignsCategoriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>
          }
          deleteMany: {
            args: Prisma.RelDesignsCategoriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RelDesignsCategoriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RelDesignsCategoriesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>[]
          }
          upsert: {
            args: Prisma.RelDesignsCategoriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsCategoriesPayload>
          }
          aggregate: {
            args: Prisma.RelDesignsCategoriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRelDesignsCategories>
          }
          groupBy: {
            args: Prisma.RelDesignsCategoriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<RelDesignsCategoriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.RelDesignsCategoriesCountArgs<ExtArgs>
            result: $Utils.Optional<RelDesignsCategoriesCountAggregateOutputType> | number
          }
        }
      }
      RelDesignsFiles: {
        payload: Prisma.$RelDesignsFilesPayload<ExtArgs>
        fields: Prisma.RelDesignsFilesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RelDesignsFilesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RelDesignsFilesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>
          }
          findFirst: {
            args: Prisma.RelDesignsFilesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RelDesignsFilesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>
          }
          findMany: {
            args: Prisma.RelDesignsFilesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>[]
          }
          create: {
            args: Prisma.RelDesignsFilesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>
          }
          createMany: {
            args: Prisma.RelDesignsFilesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RelDesignsFilesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>[]
          }
          delete: {
            args: Prisma.RelDesignsFilesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>
          }
          update: {
            args: Prisma.RelDesignsFilesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>
          }
          deleteMany: {
            args: Prisma.RelDesignsFilesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RelDesignsFilesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RelDesignsFilesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>[]
          }
          upsert: {
            args: Prisma.RelDesignsFilesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsFilesPayload>
          }
          aggregate: {
            args: Prisma.RelDesignsFilesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRelDesignsFiles>
          }
          groupBy: {
            args: Prisma.RelDesignsFilesGroupByArgs<ExtArgs>
            result: $Utils.Optional<RelDesignsFilesGroupByOutputType>[]
          }
          count: {
            args: Prisma.RelDesignsFilesCountArgs<ExtArgs>
            result: $Utils.Optional<RelDesignsFilesCountAggregateOutputType> | number
          }
        }
      }
      RelDesignsTypes: {
        payload: Prisma.$RelDesignsTypesPayload<ExtArgs>
        fields: Prisma.RelDesignsTypesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RelDesignsTypesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RelDesignsTypesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>
          }
          findFirst: {
            args: Prisma.RelDesignsTypesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RelDesignsTypesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>
          }
          findMany: {
            args: Prisma.RelDesignsTypesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>[]
          }
          create: {
            args: Prisma.RelDesignsTypesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>
          }
          createMany: {
            args: Prisma.RelDesignsTypesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RelDesignsTypesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>[]
          }
          delete: {
            args: Prisma.RelDesignsTypesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>
          }
          update: {
            args: Prisma.RelDesignsTypesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>
          }
          deleteMany: {
            args: Prisma.RelDesignsTypesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RelDesignsTypesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RelDesignsTypesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>[]
          }
          upsert: {
            args: Prisma.RelDesignsTypesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelDesignsTypesPayload>
          }
          aggregate: {
            args: Prisma.RelDesignsTypesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRelDesignsTypes>
          }
          groupBy: {
            args: Prisma.RelDesignsTypesGroupByArgs<ExtArgs>
            result: $Utils.Optional<RelDesignsTypesGroupByOutputType>[]
          }
          count: {
            args: Prisma.RelDesignsTypesCountArgs<ExtArgs>
            result: $Utils.Optional<RelDesignsTypesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
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
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    catCategories?: CatCategoriesOmit
    catDesignsType?: CatDesignsTypeOmit
    catFileExtension?: CatFileExtensionOmit
    catFileType?: CatFileTypeOmit
    catMaterials?: CatMaterialsOmit
    designs?: DesignsOmit
    files?: FilesOmit
    relDesignsCategories?: RelDesignsCategoriesOmit
    relDesignsFiles?: RelDesignsFilesOmit
    relDesignsTypes?: RelDesignsTypesOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'updateManyAndReturn'
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
   * Count Type CatCategoriesCountOutputType
   */

  export type CatCategoriesCountOutputType = {
    relDesignsCategories: number
  }

  export type CatCategoriesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relDesignsCategories?: boolean | CatCategoriesCountOutputTypeCountRelDesignsCategoriesArgs
  }

  // Custom InputTypes
  /**
   * CatCategoriesCountOutputType without action
   */
  export type CatCategoriesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategoriesCountOutputType
     */
    select?: CatCategoriesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CatCategoriesCountOutputType without action
   */
  export type CatCategoriesCountOutputTypeCountRelDesignsCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsCategoriesWhereInput
  }


  /**
   * Count Type CatDesignsTypeCountOutputType
   */

  export type CatDesignsTypeCountOutputType = {
    relDesignsTypes: number
  }

  export type CatDesignsTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relDesignsTypes?: boolean | CatDesignsTypeCountOutputTypeCountRelDesignsTypesArgs
  }

  // Custom InputTypes
  /**
   * CatDesignsTypeCountOutputType without action
   */
  export type CatDesignsTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsTypeCountOutputType
     */
    select?: CatDesignsTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CatDesignsTypeCountOutputType without action
   */
  export type CatDesignsTypeCountOutputTypeCountRelDesignsTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsTypesWhereInput
  }


  /**
   * Count Type CatFileExtensionCountOutputType
   */

  export type CatFileExtensionCountOutputType = {
    files: number
  }

  export type CatFileExtensionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | CatFileExtensionCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * CatFileExtensionCountOutputType without action
   */
  export type CatFileExtensionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtensionCountOutputType
     */
    select?: CatFileExtensionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CatFileExtensionCountOutputType without action
   */
  export type CatFileExtensionCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FilesWhereInput
  }


  /**
   * Count Type CatFileTypeCountOutputType
   */

  export type CatFileTypeCountOutputType = {
    files: number
  }

  export type CatFileTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | CatFileTypeCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * CatFileTypeCountOutputType without action
   */
  export type CatFileTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileTypeCountOutputType
     */
    select?: CatFileTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CatFileTypeCountOutputType without action
   */
  export type CatFileTypeCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FilesWhereInput
  }


  /**
   * Count Type CatMaterialsCountOutputType
   */

  export type CatMaterialsCountOutputType = {
    designs: number
  }

  export type CatMaterialsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    designs?: boolean | CatMaterialsCountOutputTypeCountDesignsArgs
  }

  // Custom InputTypes
  /**
   * CatMaterialsCountOutputType without action
   */
  export type CatMaterialsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterialsCountOutputType
     */
    select?: CatMaterialsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CatMaterialsCountOutputType without action
   */
  export type CatMaterialsCountOutputTypeCountDesignsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DesignsWhereInput
  }


  /**
   * Count Type DesignsCountOutputType
   */

  export type DesignsCountOutputType = {
    relDesignsCategories: number
    relDesignsFiles: number
    relDesignsTypes: number
  }

  export type DesignsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relDesignsCategories?: boolean | DesignsCountOutputTypeCountRelDesignsCategoriesArgs
    relDesignsFiles?: boolean | DesignsCountOutputTypeCountRelDesignsFilesArgs
    relDesignsTypes?: boolean | DesignsCountOutputTypeCountRelDesignsTypesArgs
  }

  // Custom InputTypes
  /**
   * DesignsCountOutputType without action
   */
  export type DesignsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DesignsCountOutputType
     */
    select?: DesignsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DesignsCountOutputType without action
   */
  export type DesignsCountOutputTypeCountRelDesignsCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsCategoriesWhereInput
  }

  /**
   * DesignsCountOutputType without action
   */
  export type DesignsCountOutputTypeCountRelDesignsFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsFilesWhereInput
  }

  /**
   * DesignsCountOutputType without action
   */
  export type DesignsCountOutputTypeCountRelDesignsTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsTypesWhereInput
  }


  /**
   * Count Type FilesCountOutputType
   */

  export type FilesCountOutputType = {
    relDesignsFiles: number
  }

  export type FilesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relDesignsFiles?: boolean | FilesCountOutputTypeCountRelDesignsFilesArgs
  }

  // Custom InputTypes
  /**
   * FilesCountOutputType without action
   */
  export type FilesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FilesCountOutputType
     */
    select?: FilesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FilesCountOutputType without action
   */
  export type FilesCountOutputTypeCountRelDesignsFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsFilesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    name: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    name: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    name: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      name: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model CatCategories
   */

  export type AggregateCatCategories = {
    _count: CatCategoriesCountAggregateOutputType | null
    _avg: CatCategoriesAvgAggregateOutputType | null
    _sum: CatCategoriesSumAggregateOutputType | null
    _min: CatCategoriesMinAggregateOutputType | null
    _max: CatCategoriesMaxAggregateOutputType | null
  }

  export type CatCategoriesAvgAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatCategoriesSumAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatCategoriesMinAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatCategoriesMaxAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatCategoriesCountAggregateOutputType = {
    id: number
    name: number
    status: number
    createdAt: number
    _all: number
  }


  export type CatCategoriesAvgAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatCategoriesSumAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatCategoriesMinAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
  }

  export type CatCategoriesMaxAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
  }

  export type CatCategoriesCountAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type CatCategoriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatCategories to aggregate.
     */
    where?: CatCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatCategories to fetch.
     */
    orderBy?: CatCategoriesOrderByWithRelationInput | CatCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CatCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CatCategories
    **/
    _count?: true | CatCategoriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CatCategoriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CatCategoriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CatCategoriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CatCategoriesMaxAggregateInputType
  }

  export type GetCatCategoriesAggregateType<T extends CatCategoriesAggregateArgs> = {
        [P in keyof T & keyof AggregateCatCategories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCatCategories[P]>
      : GetScalarType<T[P], AggregateCatCategories[P]>
  }




  export type CatCategoriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CatCategoriesWhereInput
    orderBy?: CatCategoriesOrderByWithAggregationInput | CatCategoriesOrderByWithAggregationInput[]
    by: CatCategoriesScalarFieldEnum[] | CatCategoriesScalarFieldEnum
    having?: CatCategoriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CatCategoriesCountAggregateInputType | true
    _avg?: CatCategoriesAvgAggregateInputType
    _sum?: CatCategoriesSumAggregateInputType
    _min?: CatCategoriesMinAggregateInputType
    _max?: CatCategoriesMaxAggregateInputType
  }

  export type CatCategoriesGroupByOutputType = {
    id: number
    name: string | null
    status: number
    createdAt: Date
    _count: CatCategoriesCountAggregateOutputType | null
    _avg: CatCategoriesAvgAggregateOutputType | null
    _sum: CatCategoriesSumAggregateOutputType | null
    _min: CatCategoriesMinAggregateOutputType | null
    _max: CatCategoriesMaxAggregateOutputType | null
  }

  type GetCatCategoriesGroupByPayload<T extends CatCategoriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CatCategoriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CatCategoriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CatCategoriesGroupByOutputType[P]>
            : GetScalarType<T[P], CatCategoriesGroupByOutputType[P]>
        }
      >
    >


  export type CatCategoriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    relDesignsCategories?: boolean | CatCategories$relDesignsCategoriesArgs<ExtArgs>
    _count?: boolean | CatCategoriesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["catCategories"]>

  export type CatCategoriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catCategories"]>

  export type CatCategoriesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catCategories"]>

  export type CatCategoriesSelectScalar = {
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type CatCategoriesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "status" | "createdAt", ExtArgs["result"]["catCategories"]>
  export type CatCategoriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relDesignsCategories?: boolean | CatCategories$relDesignsCategoriesArgs<ExtArgs>
    _count?: boolean | CatCategoriesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CatCategoriesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CatCategoriesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CatCategoriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CatCategories"
    objects: {
      relDesignsCategories: Prisma.$RelDesignsCategoriesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      status: number
      createdAt: Date
    }, ExtArgs["result"]["catCategories"]>
    composites: {}
  }

  type CatCategoriesGetPayload<S extends boolean | null | undefined | CatCategoriesDefaultArgs> = $Result.GetResult<Prisma.$CatCategoriesPayload, S>

  type CatCategoriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CatCategoriesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CatCategoriesCountAggregateInputType | true
    }

  export interface CatCategoriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CatCategories'], meta: { name: 'CatCategories' } }
    /**
     * Find zero or one CatCategories that matches the filter.
     * @param {CatCategoriesFindUniqueArgs} args - Arguments to find a CatCategories
     * @example
     * // Get one CatCategories
     * const catCategories = await prisma.catCategories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CatCategoriesFindUniqueArgs>(args: SelectSubset<T, CatCategoriesFindUniqueArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CatCategories that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CatCategoriesFindUniqueOrThrowArgs} args - Arguments to find a CatCategories
     * @example
     * // Get one CatCategories
     * const catCategories = await prisma.catCategories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CatCategoriesFindUniqueOrThrowArgs>(args: SelectSubset<T, CatCategoriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatCategoriesFindFirstArgs} args - Arguments to find a CatCategories
     * @example
     * // Get one CatCategories
     * const catCategories = await prisma.catCategories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CatCategoriesFindFirstArgs>(args?: SelectSubset<T, CatCategoriesFindFirstArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatCategories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatCategoriesFindFirstOrThrowArgs} args - Arguments to find a CatCategories
     * @example
     * // Get one CatCategories
     * const catCategories = await prisma.catCategories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CatCategoriesFindFirstOrThrowArgs>(args?: SelectSubset<T, CatCategoriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CatCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatCategoriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CatCategories
     * const catCategories = await prisma.catCategories.findMany()
     * 
     * // Get first 10 CatCategories
     * const catCategories = await prisma.catCategories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const catCategoriesWithIdOnly = await prisma.catCategories.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CatCategoriesFindManyArgs>(args?: SelectSubset<T, CatCategoriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CatCategories.
     * @param {CatCategoriesCreateArgs} args - Arguments to create a CatCategories.
     * @example
     * // Create one CatCategories
     * const CatCategories = await prisma.catCategories.create({
     *   data: {
     *     // ... data to create a CatCategories
     *   }
     * })
     * 
     */
    create<T extends CatCategoriesCreateArgs>(args: SelectSubset<T, CatCategoriesCreateArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CatCategories.
     * @param {CatCategoriesCreateManyArgs} args - Arguments to create many CatCategories.
     * @example
     * // Create many CatCategories
     * const catCategories = await prisma.catCategories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CatCategoriesCreateManyArgs>(args?: SelectSubset<T, CatCategoriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CatCategories and returns the data saved in the database.
     * @param {CatCategoriesCreateManyAndReturnArgs} args - Arguments to create many CatCategories.
     * @example
     * // Create many CatCategories
     * const catCategories = await prisma.catCategories.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CatCategories and only return the `id`
     * const catCategoriesWithIdOnly = await prisma.catCategories.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CatCategoriesCreateManyAndReturnArgs>(args?: SelectSubset<T, CatCategoriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CatCategories.
     * @param {CatCategoriesDeleteArgs} args - Arguments to delete one CatCategories.
     * @example
     * // Delete one CatCategories
     * const CatCategories = await prisma.catCategories.delete({
     *   where: {
     *     // ... filter to delete one CatCategories
     *   }
     * })
     * 
     */
    delete<T extends CatCategoriesDeleteArgs>(args: SelectSubset<T, CatCategoriesDeleteArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CatCategories.
     * @param {CatCategoriesUpdateArgs} args - Arguments to update one CatCategories.
     * @example
     * // Update one CatCategories
     * const catCategories = await prisma.catCategories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CatCategoriesUpdateArgs>(args: SelectSubset<T, CatCategoriesUpdateArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CatCategories.
     * @param {CatCategoriesDeleteManyArgs} args - Arguments to filter CatCategories to delete.
     * @example
     * // Delete a few CatCategories
     * const { count } = await prisma.catCategories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CatCategoriesDeleteManyArgs>(args?: SelectSubset<T, CatCategoriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatCategoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CatCategories
     * const catCategories = await prisma.catCategories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CatCategoriesUpdateManyArgs>(args: SelectSubset<T, CatCategoriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatCategories and returns the data updated in the database.
     * @param {CatCategoriesUpdateManyAndReturnArgs} args - Arguments to update many CatCategories.
     * @example
     * // Update many CatCategories
     * const catCategories = await prisma.catCategories.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CatCategories and only return the `id`
     * const catCategoriesWithIdOnly = await prisma.catCategories.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CatCategoriesUpdateManyAndReturnArgs>(args: SelectSubset<T, CatCategoriesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CatCategories.
     * @param {CatCategoriesUpsertArgs} args - Arguments to update or create a CatCategories.
     * @example
     * // Update or create a CatCategories
     * const catCategories = await prisma.catCategories.upsert({
     *   create: {
     *     // ... data to create a CatCategories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CatCategories we want to update
     *   }
     * })
     */
    upsert<T extends CatCategoriesUpsertArgs>(args: SelectSubset<T, CatCategoriesUpsertArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CatCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatCategoriesCountArgs} args - Arguments to filter CatCategories to count.
     * @example
     * // Count the number of CatCategories
     * const count = await prisma.catCategories.count({
     *   where: {
     *     // ... the filter for the CatCategories we want to count
     *   }
     * })
    **/
    count<T extends CatCategoriesCountArgs>(
      args?: Subset<T, CatCategoriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CatCategoriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CatCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatCategoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CatCategoriesAggregateArgs>(args: Subset<T, CatCategoriesAggregateArgs>): Prisma.PrismaPromise<GetCatCategoriesAggregateType<T>>

    /**
     * Group by CatCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatCategoriesGroupByArgs} args - Group by arguments.
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
      T extends CatCategoriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CatCategoriesGroupByArgs['orderBy'] }
        : { orderBy?: CatCategoriesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CatCategoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCatCategoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CatCategories model
   */
  readonly fields: CatCategoriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CatCategories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CatCategoriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    relDesignsCategories<T extends CatCategories$relDesignsCategoriesArgs<ExtArgs> = {}>(args?: Subset<T, CatCategories$relDesignsCategoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CatCategories model
   */
  interface CatCategoriesFieldRefs {
    readonly id: FieldRef<"CatCategories", 'Int'>
    readonly name: FieldRef<"CatCategories", 'String'>
    readonly status: FieldRef<"CatCategories", 'Int'>
    readonly createdAt: FieldRef<"CatCategories", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CatCategories findUnique
   */
  export type CatCategoriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which CatCategories to fetch.
     */
    where: CatCategoriesWhereUniqueInput
  }

  /**
   * CatCategories findUniqueOrThrow
   */
  export type CatCategoriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which CatCategories to fetch.
     */
    where: CatCategoriesWhereUniqueInput
  }

  /**
   * CatCategories findFirst
   */
  export type CatCategoriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which CatCategories to fetch.
     */
    where?: CatCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatCategories to fetch.
     */
    orderBy?: CatCategoriesOrderByWithRelationInput | CatCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatCategories.
     */
    cursor?: CatCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatCategories.
     */
    distinct?: CatCategoriesScalarFieldEnum | CatCategoriesScalarFieldEnum[]
  }

  /**
   * CatCategories findFirstOrThrow
   */
  export type CatCategoriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which CatCategories to fetch.
     */
    where?: CatCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatCategories to fetch.
     */
    orderBy?: CatCategoriesOrderByWithRelationInput | CatCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatCategories.
     */
    cursor?: CatCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatCategories.
     */
    distinct?: CatCategoriesScalarFieldEnum | CatCategoriesScalarFieldEnum[]
  }

  /**
   * CatCategories findMany
   */
  export type CatCategoriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which CatCategories to fetch.
     */
    where?: CatCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatCategories to fetch.
     */
    orderBy?: CatCategoriesOrderByWithRelationInput | CatCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CatCategories.
     */
    cursor?: CatCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatCategories.
     */
    distinct?: CatCategoriesScalarFieldEnum | CatCategoriesScalarFieldEnum[]
  }

  /**
   * CatCategories create
   */
  export type CatCategoriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * The data needed to create a CatCategories.
     */
    data?: XOR<CatCategoriesCreateInput, CatCategoriesUncheckedCreateInput>
  }

  /**
   * CatCategories createMany
   */
  export type CatCategoriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CatCategories.
     */
    data: CatCategoriesCreateManyInput | CatCategoriesCreateManyInput[]
  }

  /**
   * CatCategories createManyAndReturn
   */
  export type CatCategoriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * The data used to create many CatCategories.
     */
    data: CatCategoriesCreateManyInput | CatCategoriesCreateManyInput[]
  }

  /**
   * CatCategories update
   */
  export type CatCategoriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * The data needed to update a CatCategories.
     */
    data: XOR<CatCategoriesUpdateInput, CatCategoriesUncheckedUpdateInput>
    /**
     * Choose, which CatCategories to update.
     */
    where: CatCategoriesWhereUniqueInput
  }

  /**
   * CatCategories updateMany
   */
  export type CatCategoriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CatCategories.
     */
    data: XOR<CatCategoriesUpdateManyMutationInput, CatCategoriesUncheckedUpdateManyInput>
    /**
     * Filter which CatCategories to update
     */
    where?: CatCategoriesWhereInput
    /**
     * Limit how many CatCategories to update.
     */
    limit?: number
  }

  /**
   * CatCategories updateManyAndReturn
   */
  export type CatCategoriesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * The data used to update CatCategories.
     */
    data: XOR<CatCategoriesUpdateManyMutationInput, CatCategoriesUncheckedUpdateManyInput>
    /**
     * Filter which CatCategories to update
     */
    where?: CatCategoriesWhereInput
    /**
     * Limit how many CatCategories to update.
     */
    limit?: number
  }

  /**
   * CatCategories upsert
   */
  export type CatCategoriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * The filter to search for the CatCategories to update in case it exists.
     */
    where: CatCategoriesWhereUniqueInput
    /**
     * In case the CatCategories found by the `where` argument doesn't exist, create a new CatCategories with this data.
     */
    create: XOR<CatCategoriesCreateInput, CatCategoriesUncheckedCreateInput>
    /**
     * In case the CatCategories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CatCategoriesUpdateInput, CatCategoriesUncheckedUpdateInput>
  }

  /**
   * CatCategories delete
   */
  export type CatCategoriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    /**
     * Filter which CatCategories to delete.
     */
    where: CatCategoriesWhereUniqueInput
  }

  /**
   * CatCategories deleteMany
   */
  export type CatCategoriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatCategories to delete
     */
    where?: CatCategoriesWhereInput
    /**
     * Limit how many CatCategories to delete.
     */
    limit?: number
  }

  /**
   * CatCategories.relDesignsCategories
   */
  export type CatCategories$relDesignsCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    where?: RelDesignsCategoriesWhereInput
    orderBy?: RelDesignsCategoriesOrderByWithRelationInput | RelDesignsCategoriesOrderByWithRelationInput[]
    cursor?: RelDesignsCategoriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelDesignsCategoriesScalarFieldEnum | RelDesignsCategoriesScalarFieldEnum[]
  }

  /**
   * CatCategories without action
   */
  export type CatCategoriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
  }


  /**
   * Model CatDesignsType
   */

  export type AggregateCatDesignsType = {
    _count: CatDesignsTypeCountAggregateOutputType | null
    _avg: CatDesignsTypeAvgAggregateOutputType | null
    _sum: CatDesignsTypeSumAggregateOutputType | null
    _min: CatDesignsTypeMinAggregateOutputType | null
    _max: CatDesignsTypeMaxAggregateOutputType | null
  }

  export type CatDesignsTypeAvgAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatDesignsTypeSumAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatDesignsTypeMinAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatDesignsTypeMaxAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatDesignsTypeCountAggregateOutputType = {
    id: number
    name: number
    status: number
    createdAt: number
    _all: number
  }


  export type CatDesignsTypeAvgAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatDesignsTypeSumAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatDesignsTypeMinAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
  }

  export type CatDesignsTypeMaxAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
  }

  export type CatDesignsTypeCountAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type CatDesignsTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatDesignsType to aggregate.
     */
    where?: CatDesignsTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatDesignsTypes to fetch.
     */
    orderBy?: CatDesignsTypeOrderByWithRelationInput | CatDesignsTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CatDesignsTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CatDesignsTypes
    **/
    _count?: true | CatDesignsTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CatDesignsTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CatDesignsTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CatDesignsTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CatDesignsTypeMaxAggregateInputType
  }

  export type GetCatDesignsTypeAggregateType<T extends CatDesignsTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateCatDesignsType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCatDesignsType[P]>
      : GetScalarType<T[P], AggregateCatDesignsType[P]>
  }




  export type CatDesignsTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CatDesignsTypeWhereInput
    orderBy?: CatDesignsTypeOrderByWithAggregationInput | CatDesignsTypeOrderByWithAggregationInput[]
    by: CatDesignsTypeScalarFieldEnum[] | CatDesignsTypeScalarFieldEnum
    having?: CatDesignsTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CatDesignsTypeCountAggregateInputType | true
    _avg?: CatDesignsTypeAvgAggregateInputType
    _sum?: CatDesignsTypeSumAggregateInputType
    _min?: CatDesignsTypeMinAggregateInputType
    _max?: CatDesignsTypeMaxAggregateInputType
  }

  export type CatDesignsTypeGroupByOutputType = {
    id: number
    name: string | null
    status: number
    createdAt: Date
    _count: CatDesignsTypeCountAggregateOutputType | null
    _avg: CatDesignsTypeAvgAggregateOutputType | null
    _sum: CatDesignsTypeSumAggregateOutputType | null
    _min: CatDesignsTypeMinAggregateOutputType | null
    _max: CatDesignsTypeMaxAggregateOutputType | null
  }

  type GetCatDesignsTypeGroupByPayload<T extends CatDesignsTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CatDesignsTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CatDesignsTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CatDesignsTypeGroupByOutputType[P]>
            : GetScalarType<T[P], CatDesignsTypeGroupByOutputType[P]>
        }
      >
    >


  export type CatDesignsTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    relDesignsTypes?: boolean | CatDesignsType$relDesignsTypesArgs<ExtArgs>
    _count?: boolean | CatDesignsTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["catDesignsType"]>

  export type CatDesignsTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catDesignsType"]>

  export type CatDesignsTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catDesignsType"]>

  export type CatDesignsTypeSelectScalar = {
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type CatDesignsTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "status" | "createdAt", ExtArgs["result"]["catDesignsType"]>
  export type CatDesignsTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    relDesignsTypes?: boolean | CatDesignsType$relDesignsTypesArgs<ExtArgs>
    _count?: boolean | CatDesignsTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CatDesignsTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CatDesignsTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CatDesignsTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CatDesignsType"
    objects: {
      relDesignsTypes: Prisma.$RelDesignsTypesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      status: number
      createdAt: Date
    }, ExtArgs["result"]["catDesignsType"]>
    composites: {}
  }

  type CatDesignsTypeGetPayload<S extends boolean | null | undefined | CatDesignsTypeDefaultArgs> = $Result.GetResult<Prisma.$CatDesignsTypePayload, S>

  type CatDesignsTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CatDesignsTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CatDesignsTypeCountAggregateInputType | true
    }

  export interface CatDesignsTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CatDesignsType'], meta: { name: 'CatDesignsType' } }
    /**
     * Find zero or one CatDesignsType that matches the filter.
     * @param {CatDesignsTypeFindUniqueArgs} args - Arguments to find a CatDesignsType
     * @example
     * // Get one CatDesignsType
     * const catDesignsType = await prisma.catDesignsType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CatDesignsTypeFindUniqueArgs>(args: SelectSubset<T, CatDesignsTypeFindUniqueArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CatDesignsType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CatDesignsTypeFindUniqueOrThrowArgs} args - Arguments to find a CatDesignsType
     * @example
     * // Get one CatDesignsType
     * const catDesignsType = await prisma.catDesignsType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CatDesignsTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, CatDesignsTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatDesignsType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatDesignsTypeFindFirstArgs} args - Arguments to find a CatDesignsType
     * @example
     * // Get one CatDesignsType
     * const catDesignsType = await prisma.catDesignsType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CatDesignsTypeFindFirstArgs>(args?: SelectSubset<T, CatDesignsTypeFindFirstArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatDesignsType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatDesignsTypeFindFirstOrThrowArgs} args - Arguments to find a CatDesignsType
     * @example
     * // Get one CatDesignsType
     * const catDesignsType = await prisma.catDesignsType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CatDesignsTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, CatDesignsTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CatDesignsTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatDesignsTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CatDesignsTypes
     * const catDesignsTypes = await prisma.catDesignsType.findMany()
     * 
     * // Get first 10 CatDesignsTypes
     * const catDesignsTypes = await prisma.catDesignsType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const catDesignsTypeWithIdOnly = await prisma.catDesignsType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CatDesignsTypeFindManyArgs>(args?: SelectSubset<T, CatDesignsTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CatDesignsType.
     * @param {CatDesignsTypeCreateArgs} args - Arguments to create a CatDesignsType.
     * @example
     * // Create one CatDesignsType
     * const CatDesignsType = await prisma.catDesignsType.create({
     *   data: {
     *     // ... data to create a CatDesignsType
     *   }
     * })
     * 
     */
    create<T extends CatDesignsTypeCreateArgs>(args: SelectSubset<T, CatDesignsTypeCreateArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CatDesignsTypes.
     * @param {CatDesignsTypeCreateManyArgs} args - Arguments to create many CatDesignsTypes.
     * @example
     * // Create many CatDesignsTypes
     * const catDesignsType = await prisma.catDesignsType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CatDesignsTypeCreateManyArgs>(args?: SelectSubset<T, CatDesignsTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CatDesignsTypes and returns the data saved in the database.
     * @param {CatDesignsTypeCreateManyAndReturnArgs} args - Arguments to create many CatDesignsTypes.
     * @example
     * // Create many CatDesignsTypes
     * const catDesignsType = await prisma.catDesignsType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CatDesignsTypes and only return the `id`
     * const catDesignsTypeWithIdOnly = await prisma.catDesignsType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CatDesignsTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, CatDesignsTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CatDesignsType.
     * @param {CatDesignsTypeDeleteArgs} args - Arguments to delete one CatDesignsType.
     * @example
     * // Delete one CatDesignsType
     * const CatDesignsType = await prisma.catDesignsType.delete({
     *   where: {
     *     // ... filter to delete one CatDesignsType
     *   }
     * })
     * 
     */
    delete<T extends CatDesignsTypeDeleteArgs>(args: SelectSubset<T, CatDesignsTypeDeleteArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CatDesignsType.
     * @param {CatDesignsTypeUpdateArgs} args - Arguments to update one CatDesignsType.
     * @example
     * // Update one CatDesignsType
     * const catDesignsType = await prisma.catDesignsType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CatDesignsTypeUpdateArgs>(args: SelectSubset<T, CatDesignsTypeUpdateArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CatDesignsTypes.
     * @param {CatDesignsTypeDeleteManyArgs} args - Arguments to filter CatDesignsTypes to delete.
     * @example
     * // Delete a few CatDesignsTypes
     * const { count } = await prisma.catDesignsType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CatDesignsTypeDeleteManyArgs>(args?: SelectSubset<T, CatDesignsTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatDesignsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatDesignsTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CatDesignsTypes
     * const catDesignsType = await prisma.catDesignsType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CatDesignsTypeUpdateManyArgs>(args: SelectSubset<T, CatDesignsTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatDesignsTypes and returns the data updated in the database.
     * @param {CatDesignsTypeUpdateManyAndReturnArgs} args - Arguments to update many CatDesignsTypes.
     * @example
     * // Update many CatDesignsTypes
     * const catDesignsType = await prisma.catDesignsType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CatDesignsTypes and only return the `id`
     * const catDesignsTypeWithIdOnly = await prisma.catDesignsType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CatDesignsTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, CatDesignsTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CatDesignsType.
     * @param {CatDesignsTypeUpsertArgs} args - Arguments to update or create a CatDesignsType.
     * @example
     * // Update or create a CatDesignsType
     * const catDesignsType = await prisma.catDesignsType.upsert({
     *   create: {
     *     // ... data to create a CatDesignsType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CatDesignsType we want to update
     *   }
     * })
     */
    upsert<T extends CatDesignsTypeUpsertArgs>(args: SelectSubset<T, CatDesignsTypeUpsertArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CatDesignsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatDesignsTypeCountArgs} args - Arguments to filter CatDesignsTypes to count.
     * @example
     * // Count the number of CatDesignsTypes
     * const count = await prisma.catDesignsType.count({
     *   where: {
     *     // ... the filter for the CatDesignsTypes we want to count
     *   }
     * })
    **/
    count<T extends CatDesignsTypeCountArgs>(
      args?: Subset<T, CatDesignsTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CatDesignsTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CatDesignsType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatDesignsTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CatDesignsTypeAggregateArgs>(args: Subset<T, CatDesignsTypeAggregateArgs>): Prisma.PrismaPromise<GetCatDesignsTypeAggregateType<T>>

    /**
     * Group by CatDesignsType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatDesignsTypeGroupByArgs} args - Group by arguments.
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
      T extends CatDesignsTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CatDesignsTypeGroupByArgs['orderBy'] }
        : { orderBy?: CatDesignsTypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CatDesignsTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCatDesignsTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CatDesignsType model
   */
  readonly fields: CatDesignsTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CatDesignsType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CatDesignsTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    relDesignsTypes<T extends CatDesignsType$relDesignsTypesArgs<ExtArgs> = {}>(args?: Subset<T, CatDesignsType$relDesignsTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CatDesignsType model
   */
  interface CatDesignsTypeFieldRefs {
    readonly id: FieldRef<"CatDesignsType", 'Int'>
    readonly name: FieldRef<"CatDesignsType", 'String'>
    readonly status: FieldRef<"CatDesignsType", 'Int'>
    readonly createdAt: FieldRef<"CatDesignsType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CatDesignsType findUnique
   */
  export type CatDesignsTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatDesignsType to fetch.
     */
    where: CatDesignsTypeWhereUniqueInput
  }

  /**
   * CatDesignsType findUniqueOrThrow
   */
  export type CatDesignsTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatDesignsType to fetch.
     */
    where: CatDesignsTypeWhereUniqueInput
  }

  /**
   * CatDesignsType findFirst
   */
  export type CatDesignsTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatDesignsType to fetch.
     */
    where?: CatDesignsTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatDesignsTypes to fetch.
     */
    orderBy?: CatDesignsTypeOrderByWithRelationInput | CatDesignsTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatDesignsTypes.
     */
    cursor?: CatDesignsTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatDesignsTypes.
     */
    distinct?: CatDesignsTypeScalarFieldEnum | CatDesignsTypeScalarFieldEnum[]
  }

  /**
   * CatDesignsType findFirstOrThrow
   */
  export type CatDesignsTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatDesignsType to fetch.
     */
    where?: CatDesignsTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatDesignsTypes to fetch.
     */
    orderBy?: CatDesignsTypeOrderByWithRelationInput | CatDesignsTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatDesignsTypes.
     */
    cursor?: CatDesignsTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatDesignsTypes.
     */
    distinct?: CatDesignsTypeScalarFieldEnum | CatDesignsTypeScalarFieldEnum[]
  }

  /**
   * CatDesignsType findMany
   */
  export type CatDesignsTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatDesignsTypes to fetch.
     */
    where?: CatDesignsTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatDesignsTypes to fetch.
     */
    orderBy?: CatDesignsTypeOrderByWithRelationInput | CatDesignsTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CatDesignsTypes.
     */
    cursor?: CatDesignsTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatDesignsTypes.
     */
    distinct?: CatDesignsTypeScalarFieldEnum | CatDesignsTypeScalarFieldEnum[]
  }

  /**
   * CatDesignsType create
   */
  export type CatDesignsTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a CatDesignsType.
     */
    data?: XOR<CatDesignsTypeCreateInput, CatDesignsTypeUncheckedCreateInput>
  }

  /**
   * CatDesignsType createMany
   */
  export type CatDesignsTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CatDesignsTypes.
     */
    data: CatDesignsTypeCreateManyInput | CatDesignsTypeCreateManyInput[]
  }

  /**
   * CatDesignsType createManyAndReturn
   */
  export type CatDesignsTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * The data used to create many CatDesignsTypes.
     */
    data: CatDesignsTypeCreateManyInput | CatDesignsTypeCreateManyInput[]
  }

  /**
   * CatDesignsType update
   */
  export type CatDesignsTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a CatDesignsType.
     */
    data: XOR<CatDesignsTypeUpdateInput, CatDesignsTypeUncheckedUpdateInput>
    /**
     * Choose, which CatDesignsType to update.
     */
    where: CatDesignsTypeWhereUniqueInput
  }

  /**
   * CatDesignsType updateMany
   */
  export type CatDesignsTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CatDesignsTypes.
     */
    data: XOR<CatDesignsTypeUpdateManyMutationInput, CatDesignsTypeUncheckedUpdateManyInput>
    /**
     * Filter which CatDesignsTypes to update
     */
    where?: CatDesignsTypeWhereInput
    /**
     * Limit how many CatDesignsTypes to update.
     */
    limit?: number
  }

  /**
   * CatDesignsType updateManyAndReturn
   */
  export type CatDesignsTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * The data used to update CatDesignsTypes.
     */
    data: XOR<CatDesignsTypeUpdateManyMutationInput, CatDesignsTypeUncheckedUpdateManyInput>
    /**
     * Filter which CatDesignsTypes to update
     */
    where?: CatDesignsTypeWhereInput
    /**
     * Limit how many CatDesignsTypes to update.
     */
    limit?: number
  }

  /**
   * CatDesignsType upsert
   */
  export type CatDesignsTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the CatDesignsType to update in case it exists.
     */
    where: CatDesignsTypeWhereUniqueInput
    /**
     * In case the CatDesignsType found by the `where` argument doesn't exist, create a new CatDesignsType with this data.
     */
    create: XOR<CatDesignsTypeCreateInput, CatDesignsTypeUncheckedCreateInput>
    /**
     * In case the CatDesignsType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CatDesignsTypeUpdateInput, CatDesignsTypeUncheckedUpdateInput>
  }

  /**
   * CatDesignsType delete
   */
  export type CatDesignsTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    /**
     * Filter which CatDesignsType to delete.
     */
    where: CatDesignsTypeWhereUniqueInput
  }

  /**
   * CatDesignsType deleteMany
   */
  export type CatDesignsTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatDesignsTypes to delete
     */
    where?: CatDesignsTypeWhereInput
    /**
     * Limit how many CatDesignsTypes to delete.
     */
    limit?: number
  }

  /**
   * CatDesignsType.relDesignsTypes
   */
  export type CatDesignsType$relDesignsTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    where?: RelDesignsTypesWhereInput
    orderBy?: RelDesignsTypesOrderByWithRelationInput | RelDesignsTypesOrderByWithRelationInput[]
    cursor?: RelDesignsTypesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelDesignsTypesScalarFieldEnum | RelDesignsTypesScalarFieldEnum[]
  }

  /**
   * CatDesignsType without action
   */
  export type CatDesignsTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
  }


  /**
   * Model CatFileExtension
   */

  export type AggregateCatFileExtension = {
    _count: CatFileExtensionCountAggregateOutputType | null
    _avg: CatFileExtensionAvgAggregateOutputType | null
    _sum: CatFileExtensionSumAggregateOutputType | null
    _min: CatFileExtensionMinAggregateOutputType | null
    _max: CatFileExtensionMaxAggregateOutputType | null
  }

  export type CatFileExtensionAvgAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatFileExtensionSumAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatFileExtensionMinAggregateOutputType = {
    id: number | null
    name: string | null
    extension: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatFileExtensionMaxAggregateOutputType = {
    id: number | null
    name: string | null
    extension: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatFileExtensionCountAggregateOutputType = {
    id: number
    name: number
    extension: number
    status: number
    createdAt: number
    _all: number
  }


  export type CatFileExtensionAvgAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatFileExtensionSumAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatFileExtensionMinAggregateInputType = {
    id?: true
    name?: true
    extension?: true
    status?: true
    createdAt?: true
  }

  export type CatFileExtensionMaxAggregateInputType = {
    id?: true
    name?: true
    extension?: true
    status?: true
    createdAt?: true
  }

  export type CatFileExtensionCountAggregateInputType = {
    id?: true
    name?: true
    extension?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type CatFileExtensionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatFileExtension to aggregate.
     */
    where?: CatFileExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileExtensions to fetch.
     */
    orderBy?: CatFileExtensionOrderByWithRelationInput | CatFileExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CatFileExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileExtensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CatFileExtensions
    **/
    _count?: true | CatFileExtensionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CatFileExtensionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CatFileExtensionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CatFileExtensionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CatFileExtensionMaxAggregateInputType
  }

  export type GetCatFileExtensionAggregateType<T extends CatFileExtensionAggregateArgs> = {
        [P in keyof T & keyof AggregateCatFileExtension]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCatFileExtension[P]>
      : GetScalarType<T[P], AggregateCatFileExtension[P]>
  }




  export type CatFileExtensionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CatFileExtensionWhereInput
    orderBy?: CatFileExtensionOrderByWithAggregationInput | CatFileExtensionOrderByWithAggregationInput[]
    by: CatFileExtensionScalarFieldEnum[] | CatFileExtensionScalarFieldEnum
    having?: CatFileExtensionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CatFileExtensionCountAggregateInputType | true
    _avg?: CatFileExtensionAvgAggregateInputType
    _sum?: CatFileExtensionSumAggregateInputType
    _min?: CatFileExtensionMinAggregateInputType
    _max?: CatFileExtensionMaxAggregateInputType
  }

  export type CatFileExtensionGroupByOutputType = {
    id: number
    name: string | null
    extension: string | null
    status: number
    createdAt: Date
    _count: CatFileExtensionCountAggregateOutputType | null
    _avg: CatFileExtensionAvgAggregateOutputType | null
    _sum: CatFileExtensionSumAggregateOutputType | null
    _min: CatFileExtensionMinAggregateOutputType | null
    _max: CatFileExtensionMaxAggregateOutputType | null
  }

  type GetCatFileExtensionGroupByPayload<T extends CatFileExtensionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CatFileExtensionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CatFileExtensionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CatFileExtensionGroupByOutputType[P]>
            : GetScalarType<T[P], CatFileExtensionGroupByOutputType[P]>
        }
      >
    >


  export type CatFileExtensionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    extension?: boolean
    status?: boolean
    createdAt?: boolean
    files?: boolean | CatFileExtension$filesArgs<ExtArgs>
    _count?: boolean | CatFileExtensionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["catFileExtension"]>

  export type CatFileExtensionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    extension?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catFileExtension"]>

  export type CatFileExtensionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    extension?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catFileExtension"]>

  export type CatFileExtensionSelectScalar = {
    id?: boolean
    name?: boolean
    extension?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type CatFileExtensionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "extension" | "status" | "createdAt", ExtArgs["result"]["catFileExtension"]>
  export type CatFileExtensionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | CatFileExtension$filesArgs<ExtArgs>
    _count?: boolean | CatFileExtensionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CatFileExtensionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CatFileExtensionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CatFileExtensionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CatFileExtension"
    objects: {
      files: Prisma.$FilesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      extension: string | null
      status: number
      createdAt: Date
    }, ExtArgs["result"]["catFileExtension"]>
    composites: {}
  }

  type CatFileExtensionGetPayload<S extends boolean | null | undefined | CatFileExtensionDefaultArgs> = $Result.GetResult<Prisma.$CatFileExtensionPayload, S>

  type CatFileExtensionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CatFileExtensionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CatFileExtensionCountAggregateInputType | true
    }

  export interface CatFileExtensionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CatFileExtension'], meta: { name: 'CatFileExtension' } }
    /**
     * Find zero or one CatFileExtension that matches the filter.
     * @param {CatFileExtensionFindUniqueArgs} args - Arguments to find a CatFileExtension
     * @example
     * // Get one CatFileExtension
     * const catFileExtension = await prisma.catFileExtension.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CatFileExtensionFindUniqueArgs>(args: SelectSubset<T, CatFileExtensionFindUniqueArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CatFileExtension that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CatFileExtensionFindUniqueOrThrowArgs} args - Arguments to find a CatFileExtension
     * @example
     * // Get one CatFileExtension
     * const catFileExtension = await prisma.catFileExtension.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CatFileExtensionFindUniqueOrThrowArgs>(args: SelectSubset<T, CatFileExtensionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatFileExtension that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileExtensionFindFirstArgs} args - Arguments to find a CatFileExtension
     * @example
     * // Get one CatFileExtension
     * const catFileExtension = await prisma.catFileExtension.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CatFileExtensionFindFirstArgs>(args?: SelectSubset<T, CatFileExtensionFindFirstArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatFileExtension that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileExtensionFindFirstOrThrowArgs} args - Arguments to find a CatFileExtension
     * @example
     * // Get one CatFileExtension
     * const catFileExtension = await prisma.catFileExtension.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CatFileExtensionFindFirstOrThrowArgs>(args?: SelectSubset<T, CatFileExtensionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CatFileExtensions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileExtensionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CatFileExtensions
     * const catFileExtensions = await prisma.catFileExtension.findMany()
     * 
     * // Get first 10 CatFileExtensions
     * const catFileExtensions = await prisma.catFileExtension.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const catFileExtensionWithIdOnly = await prisma.catFileExtension.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CatFileExtensionFindManyArgs>(args?: SelectSubset<T, CatFileExtensionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CatFileExtension.
     * @param {CatFileExtensionCreateArgs} args - Arguments to create a CatFileExtension.
     * @example
     * // Create one CatFileExtension
     * const CatFileExtension = await prisma.catFileExtension.create({
     *   data: {
     *     // ... data to create a CatFileExtension
     *   }
     * })
     * 
     */
    create<T extends CatFileExtensionCreateArgs>(args: SelectSubset<T, CatFileExtensionCreateArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CatFileExtensions.
     * @param {CatFileExtensionCreateManyArgs} args - Arguments to create many CatFileExtensions.
     * @example
     * // Create many CatFileExtensions
     * const catFileExtension = await prisma.catFileExtension.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CatFileExtensionCreateManyArgs>(args?: SelectSubset<T, CatFileExtensionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CatFileExtensions and returns the data saved in the database.
     * @param {CatFileExtensionCreateManyAndReturnArgs} args - Arguments to create many CatFileExtensions.
     * @example
     * // Create many CatFileExtensions
     * const catFileExtension = await prisma.catFileExtension.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CatFileExtensions and only return the `id`
     * const catFileExtensionWithIdOnly = await prisma.catFileExtension.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CatFileExtensionCreateManyAndReturnArgs>(args?: SelectSubset<T, CatFileExtensionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CatFileExtension.
     * @param {CatFileExtensionDeleteArgs} args - Arguments to delete one CatFileExtension.
     * @example
     * // Delete one CatFileExtension
     * const CatFileExtension = await prisma.catFileExtension.delete({
     *   where: {
     *     // ... filter to delete one CatFileExtension
     *   }
     * })
     * 
     */
    delete<T extends CatFileExtensionDeleteArgs>(args: SelectSubset<T, CatFileExtensionDeleteArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CatFileExtension.
     * @param {CatFileExtensionUpdateArgs} args - Arguments to update one CatFileExtension.
     * @example
     * // Update one CatFileExtension
     * const catFileExtension = await prisma.catFileExtension.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CatFileExtensionUpdateArgs>(args: SelectSubset<T, CatFileExtensionUpdateArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CatFileExtensions.
     * @param {CatFileExtensionDeleteManyArgs} args - Arguments to filter CatFileExtensions to delete.
     * @example
     * // Delete a few CatFileExtensions
     * const { count } = await prisma.catFileExtension.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CatFileExtensionDeleteManyArgs>(args?: SelectSubset<T, CatFileExtensionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatFileExtensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileExtensionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CatFileExtensions
     * const catFileExtension = await prisma.catFileExtension.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CatFileExtensionUpdateManyArgs>(args: SelectSubset<T, CatFileExtensionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatFileExtensions and returns the data updated in the database.
     * @param {CatFileExtensionUpdateManyAndReturnArgs} args - Arguments to update many CatFileExtensions.
     * @example
     * // Update many CatFileExtensions
     * const catFileExtension = await prisma.catFileExtension.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CatFileExtensions and only return the `id`
     * const catFileExtensionWithIdOnly = await prisma.catFileExtension.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CatFileExtensionUpdateManyAndReturnArgs>(args: SelectSubset<T, CatFileExtensionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CatFileExtension.
     * @param {CatFileExtensionUpsertArgs} args - Arguments to update or create a CatFileExtension.
     * @example
     * // Update or create a CatFileExtension
     * const catFileExtension = await prisma.catFileExtension.upsert({
     *   create: {
     *     // ... data to create a CatFileExtension
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CatFileExtension we want to update
     *   }
     * })
     */
    upsert<T extends CatFileExtensionUpsertArgs>(args: SelectSubset<T, CatFileExtensionUpsertArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CatFileExtensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileExtensionCountArgs} args - Arguments to filter CatFileExtensions to count.
     * @example
     * // Count the number of CatFileExtensions
     * const count = await prisma.catFileExtension.count({
     *   where: {
     *     // ... the filter for the CatFileExtensions we want to count
     *   }
     * })
    **/
    count<T extends CatFileExtensionCountArgs>(
      args?: Subset<T, CatFileExtensionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CatFileExtensionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CatFileExtension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileExtensionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CatFileExtensionAggregateArgs>(args: Subset<T, CatFileExtensionAggregateArgs>): Prisma.PrismaPromise<GetCatFileExtensionAggregateType<T>>

    /**
     * Group by CatFileExtension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileExtensionGroupByArgs} args - Group by arguments.
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
      T extends CatFileExtensionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CatFileExtensionGroupByArgs['orderBy'] }
        : { orderBy?: CatFileExtensionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CatFileExtensionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCatFileExtensionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CatFileExtension model
   */
  readonly fields: CatFileExtensionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CatFileExtension.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CatFileExtensionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    files<T extends CatFileExtension$filesArgs<ExtArgs> = {}>(args?: Subset<T, CatFileExtension$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CatFileExtension model
   */
  interface CatFileExtensionFieldRefs {
    readonly id: FieldRef<"CatFileExtension", 'Int'>
    readonly name: FieldRef<"CatFileExtension", 'String'>
    readonly extension: FieldRef<"CatFileExtension", 'String'>
    readonly status: FieldRef<"CatFileExtension", 'Int'>
    readonly createdAt: FieldRef<"CatFileExtension", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CatFileExtension findUnique
   */
  export type CatFileExtensionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * Filter, which CatFileExtension to fetch.
     */
    where: CatFileExtensionWhereUniqueInput
  }

  /**
   * CatFileExtension findUniqueOrThrow
   */
  export type CatFileExtensionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * Filter, which CatFileExtension to fetch.
     */
    where: CatFileExtensionWhereUniqueInput
  }

  /**
   * CatFileExtension findFirst
   */
  export type CatFileExtensionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * Filter, which CatFileExtension to fetch.
     */
    where?: CatFileExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileExtensions to fetch.
     */
    orderBy?: CatFileExtensionOrderByWithRelationInput | CatFileExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatFileExtensions.
     */
    cursor?: CatFileExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileExtensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatFileExtensions.
     */
    distinct?: CatFileExtensionScalarFieldEnum | CatFileExtensionScalarFieldEnum[]
  }

  /**
   * CatFileExtension findFirstOrThrow
   */
  export type CatFileExtensionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * Filter, which CatFileExtension to fetch.
     */
    where?: CatFileExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileExtensions to fetch.
     */
    orderBy?: CatFileExtensionOrderByWithRelationInput | CatFileExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatFileExtensions.
     */
    cursor?: CatFileExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileExtensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatFileExtensions.
     */
    distinct?: CatFileExtensionScalarFieldEnum | CatFileExtensionScalarFieldEnum[]
  }

  /**
   * CatFileExtension findMany
   */
  export type CatFileExtensionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * Filter, which CatFileExtensions to fetch.
     */
    where?: CatFileExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileExtensions to fetch.
     */
    orderBy?: CatFileExtensionOrderByWithRelationInput | CatFileExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CatFileExtensions.
     */
    cursor?: CatFileExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileExtensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatFileExtensions.
     */
    distinct?: CatFileExtensionScalarFieldEnum | CatFileExtensionScalarFieldEnum[]
  }

  /**
   * CatFileExtension create
   */
  export type CatFileExtensionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * The data needed to create a CatFileExtension.
     */
    data?: XOR<CatFileExtensionCreateInput, CatFileExtensionUncheckedCreateInput>
  }

  /**
   * CatFileExtension createMany
   */
  export type CatFileExtensionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CatFileExtensions.
     */
    data: CatFileExtensionCreateManyInput | CatFileExtensionCreateManyInput[]
  }

  /**
   * CatFileExtension createManyAndReturn
   */
  export type CatFileExtensionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * The data used to create many CatFileExtensions.
     */
    data: CatFileExtensionCreateManyInput | CatFileExtensionCreateManyInput[]
  }

  /**
   * CatFileExtension update
   */
  export type CatFileExtensionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * The data needed to update a CatFileExtension.
     */
    data: XOR<CatFileExtensionUpdateInput, CatFileExtensionUncheckedUpdateInput>
    /**
     * Choose, which CatFileExtension to update.
     */
    where: CatFileExtensionWhereUniqueInput
  }

  /**
   * CatFileExtension updateMany
   */
  export type CatFileExtensionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CatFileExtensions.
     */
    data: XOR<CatFileExtensionUpdateManyMutationInput, CatFileExtensionUncheckedUpdateManyInput>
    /**
     * Filter which CatFileExtensions to update
     */
    where?: CatFileExtensionWhereInput
    /**
     * Limit how many CatFileExtensions to update.
     */
    limit?: number
  }

  /**
   * CatFileExtension updateManyAndReturn
   */
  export type CatFileExtensionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * The data used to update CatFileExtensions.
     */
    data: XOR<CatFileExtensionUpdateManyMutationInput, CatFileExtensionUncheckedUpdateManyInput>
    /**
     * Filter which CatFileExtensions to update
     */
    where?: CatFileExtensionWhereInput
    /**
     * Limit how many CatFileExtensions to update.
     */
    limit?: number
  }

  /**
   * CatFileExtension upsert
   */
  export type CatFileExtensionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * The filter to search for the CatFileExtension to update in case it exists.
     */
    where: CatFileExtensionWhereUniqueInput
    /**
     * In case the CatFileExtension found by the `where` argument doesn't exist, create a new CatFileExtension with this data.
     */
    create: XOR<CatFileExtensionCreateInput, CatFileExtensionUncheckedCreateInput>
    /**
     * In case the CatFileExtension was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CatFileExtensionUpdateInput, CatFileExtensionUncheckedUpdateInput>
  }

  /**
   * CatFileExtension delete
   */
  export type CatFileExtensionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    /**
     * Filter which CatFileExtension to delete.
     */
    where: CatFileExtensionWhereUniqueInput
  }

  /**
   * CatFileExtension deleteMany
   */
  export type CatFileExtensionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatFileExtensions to delete
     */
    where?: CatFileExtensionWhereInput
    /**
     * Limit how many CatFileExtensions to delete.
     */
    limit?: number
  }

  /**
   * CatFileExtension.files
   */
  export type CatFileExtension$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    where?: FilesWhereInput
    orderBy?: FilesOrderByWithRelationInput | FilesOrderByWithRelationInput[]
    cursor?: FilesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * CatFileExtension without action
   */
  export type CatFileExtensionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
  }


  /**
   * Model CatFileType
   */

  export type AggregateCatFileType = {
    _count: CatFileTypeCountAggregateOutputType | null
    _avg: CatFileTypeAvgAggregateOutputType | null
    _sum: CatFileTypeSumAggregateOutputType | null
    _min: CatFileTypeMinAggregateOutputType | null
    _max: CatFileTypeMaxAggregateOutputType | null
  }

  export type CatFileTypeAvgAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatFileTypeSumAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatFileTypeMinAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatFileTypeMaxAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
  }

  export type CatFileTypeCountAggregateOutputType = {
    id: number
    name: number
    status: number
    createdAt: number
    _all: number
  }


  export type CatFileTypeAvgAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatFileTypeSumAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatFileTypeMinAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
  }

  export type CatFileTypeMaxAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
  }

  export type CatFileTypeCountAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type CatFileTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatFileType to aggregate.
     */
    where?: CatFileTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileTypes to fetch.
     */
    orderBy?: CatFileTypeOrderByWithRelationInput | CatFileTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CatFileTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CatFileTypes
    **/
    _count?: true | CatFileTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CatFileTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CatFileTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CatFileTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CatFileTypeMaxAggregateInputType
  }

  export type GetCatFileTypeAggregateType<T extends CatFileTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateCatFileType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCatFileType[P]>
      : GetScalarType<T[P], AggregateCatFileType[P]>
  }




  export type CatFileTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CatFileTypeWhereInput
    orderBy?: CatFileTypeOrderByWithAggregationInput | CatFileTypeOrderByWithAggregationInput[]
    by: CatFileTypeScalarFieldEnum[] | CatFileTypeScalarFieldEnum
    having?: CatFileTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CatFileTypeCountAggregateInputType | true
    _avg?: CatFileTypeAvgAggregateInputType
    _sum?: CatFileTypeSumAggregateInputType
    _min?: CatFileTypeMinAggregateInputType
    _max?: CatFileTypeMaxAggregateInputType
  }

  export type CatFileTypeGroupByOutputType = {
    id: number
    name: string | null
    status: number
    createdAt: Date
    _count: CatFileTypeCountAggregateOutputType | null
    _avg: CatFileTypeAvgAggregateOutputType | null
    _sum: CatFileTypeSumAggregateOutputType | null
    _min: CatFileTypeMinAggregateOutputType | null
    _max: CatFileTypeMaxAggregateOutputType | null
  }

  type GetCatFileTypeGroupByPayload<T extends CatFileTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CatFileTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CatFileTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CatFileTypeGroupByOutputType[P]>
            : GetScalarType<T[P], CatFileTypeGroupByOutputType[P]>
        }
      >
    >


  export type CatFileTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    files?: boolean | CatFileType$filesArgs<ExtArgs>
    _count?: boolean | CatFileTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["catFileType"]>

  export type CatFileTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catFileType"]>

  export type CatFileTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["catFileType"]>

  export type CatFileTypeSelectScalar = {
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type CatFileTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "status" | "createdAt", ExtArgs["result"]["catFileType"]>
  export type CatFileTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    files?: boolean | CatFileType$filesArgs<ExtArgs>
    _count?: boolean | CatFileTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CatFileTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CatFileTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CatFileTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CatFileType"
    objects: {
      files: Prisma.$FilesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      status: number
      createdAt: Date
    }, ExtArgs["result"]["catFileType"]>
    composites: {}
  }

  type CatFileTypeGetPayload<S extends boolean | null | undefined | CatFileTypeDefaultArgs> = $Result.GetResult<Prisma.$CatFileTypePayload, S>

  type CatFileTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CatFileTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CatFileTypeCountAggregateInputType | true
    }

  export interface CatFileTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CatFileType'], meta: { name: 'CatFileType' } }
    /**
     * Find zero or one CatFileType that matches the filter.
     * @param {CatFileTypeFindUniqueArgs} args - Arguments to find a CatFileType
     * @example
     * // Get one CatFileType
     * const catFileType = await prisma.catFileType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CatFileTypeFindUniqueArgs>(args: SelectSubset<T, CatFileTypeFindUniqueArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CatFileType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CatFileTypeFindUniqueOrThrowArgs} args - Arguments to find a CatFileType
     * @example
     * // Get one CatFileType
     * const catFileType = await prisma.catFileType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CatFileTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, CatFileTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatFileType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileTypeFindFirstArgs} args - Arguments to find a CatFileType
     * @example
     * // Get one CatFileType
     * const catFileType = await prisma.catFileType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CatFileTypeFindFirstArgs>(args?: SelectSubset<T, CatFileTypeFindFirstArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatFileType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileTypeFindFirstOrThrowArgs} args - Arguments to find a CatFileType
     * @example
     * // Get one CatFileType
     * const catFileType = await prisma.catFileType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CatFileTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, CatFileTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CatFileTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CatFileTypes
     * const catFileTypes = await prisma.catFileType.findMany()
     * 
     * // Get first 10 CatFileTypes
     * const catFileTypes = await prisma.catFileType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const catFileTypeWithIdOnly = await prisma.catFileType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CatFileTypeFindManyArgs>(args?: SelectSubset<T, CatFileTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CatFileType.
     * @param {CatFileTypeCreateArgs} args - Arguments to create a CatFileType.
     * @example
     * // Create one CatFileType
     * const CatFileType = await prisma.catFileType.create({
     *   data: {
     *     // ... data to create a CatFileType
     *   }
     * })
     * 
     */
    create<T extends CatFileTypeCreateArgs>(args: SelectSubset<T, CatFileTypeCreateArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CatFileTypes.
     * @param {CatFileTypeCreateManyArgs} args - Arguments to create many CatFileTypes.
     * @example
     * // Create many CatFileTypes
     * const catFileType = await prisma.catFileType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CatFileTypeCreateManyArgs>(args?: SelectSubset<T, CatFileTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CatFileTypes and returns the data saved in the database.
     * @param {CatFileTypeCreateManyAndReturnArgs} args - Arguments to create many CatFileTypes.
     * @example
     * // Create many CatFileTypes
     * const catFileType = await prisma.catFileType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CatFileTypes and only return the `id`
     * const catFileTypeWithIdOnly = await prisma.catFileType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CatFileTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, CatFileTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CatFileType.
     * @param {CatFileTypeDeleteArgs} args - Arguments to delete one CatFileType.
     * @example
     * // Delete one CatFileType
     * const CatFileType = await prisma.catFileType.delete({
     *   where: {
     *     // ... filter to delete one CatFileType
     *   }
     * })
     * 
     */
    delete<T extends CatFileTypeDeleteArgs>(args: SelectSubset<T, CatFileTypeDeleteArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CatFileType.
     * @param {CatFileTypeUpdateArgs} args - Arguments to update one CatFileType.
     * @example
     * // Update one CatFileType
     * const catFileType = await prisma.catFileType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CatFileTypeUpdateArgs>(args: SelectSubset<T, CatFileTypeUpdateArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CatFileTypes.
     * @param {CatFileTypeDeleteManyArgs} args - Arguments to filter CatFileTypes to delete.
     * @example
     * // Delete a few CatFileTypes
     * const { count } = await prisma.catFileType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CatFileTypeDeleteManyArgs>(args?: SelectSubset<T, CatFileTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatFileTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CatFileTypes
     * const catFileType = await prisma.catFileType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CatFileTypeUpdateManyArgs>(args: SelectSubset<T, CatFileTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatFileTypes and returns the data updated in the database.
     * @param {CatFileTypeUpdateManyAndReturnArgs} args - Arguments to update many CatFileTypes.
     * @example
     * // Update many CatFileTypes
     * const catFileType = await prisma.catFileType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CatFileTypes and only return the `id`
     * const catFileTypeWithIdOnly = await prisma.catFileType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CatFileTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, CatFileTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CatFileType.
     * @param {CatFileTypeUpsertArgs} args - Arguments to update or create a CatFileType.
     * @example
     * // Update or create a CatFileType
     * const catFileType = await prisma.catFileType.upsert({
     *   create: {
     *     // ... data to create a CatFileType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CatFileType we want to update
     *   }
     * })
     */
    upsert<T extends CatFileTypeUpsertArgs>(args: SelectSubset<T, CatFileTypeUpsertArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CatFileTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileTypeCountArgs} args - Arguments to filter CatFileTypes to count.
     * @example
     * // Count the number of CatFileTypes
     * const count = await prisma.catFileType.count({
     *   where: {
     *     // ... the filter for the CatFileTypes we want to count
     *   }
     * })
    **/
    count<T extends CatFileTypeCountArgs>(
      args?: Subset<T, CatFileTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CatFileTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CatFileType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CatFileTypeAggregateArgs>(args: Subset<T, CatFileTypeAggregateArgs>): Prisma.PrismaPromise<GetCatFileTypeAggregateType<T>>

    /**
     * Group by CatFileType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatFileTypeGroupByArgs} args - Group by arguments.
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
      T extends CatFileTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CatFileTypeGroupByArgs['orderBy'] }
        : { orderBy?: CatFileTypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CatFileTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCatFileTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CatFileType model
   */
  readonly fields: CatFileTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CatFileType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CatFileTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    files<T extends CatFileType$filesArgs<ExtArgs> = {}>(args?: Subset<T, CatFileType$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CatFileType model
   */
  interface CatFileTypeFieldRefs {
    readonly id: FieldRef<"CatFileType", 'Int'>
    readonly name: FieldRef<"CatFileType", 'String'>
    readonly status: FieldRef<"CatFileType", 'Int'>
    readonly createdAt: FieldRef<"CatFileType", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CatFileType findUnique
   */
  export type CatFileTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatFileType to fetch.
     */
    where: CatFileTypeWhereUniqueInput
  }

  /**
   * CatFileType findUniqueOrThrow
   */
  export type CatFileTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatFileType to fetch.
     */
    where: CatFileTypeWhereUniqueInput
  }

  /**
   * CatFileType findFirst
   */
  export type CatFileTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatFileType to fetch.
     */
    where?: CatFileTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileTypes to fetch.
     */
    orderBy?: CatFileTypeOrderByWithRelationInput | CatFileTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatFileTypes.
     */
    cursor?: CatFileTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatFileTypes.
     */
    distinct?: CatFileTypeScalarFieldEnum | CatFileTypeScalarFieldEnum[]
  }

  /**
   * CatFileType findFirstOrThrow
   */
  export type CatFileTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatFileType to fetch.
     */
    where?: CatFileTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileTypes to fetch.
     */
    orderBy?: CatFileTypeOrderByWithRelationInput | CatFileTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatFileTypes.
     */
    cursor?: CatFileTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatFileTypes.
     */
    distinct?: CatFileTypeScalarFieldEnum | CatFileTypeScalarFieldEnum[]
  }

  /**
   * CatFileType findMany
   */
  export type CatFileTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * Filter, which CatFileTypes to fetch.
     */
    where?: CatFileTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatFileTypes to fetch.
     */
    orderBy?: CatFileTypeOrderByWithRelationInput | CatFileTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CatFileTypes.
     */
    cursor?: CatFileTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatFileTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatFileTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatFileTypes.
     */
    distinct?: CatFileTypeScalarFieldEnum | CatFileTypeScalarFieldEnum[]
  }

  /**
   * CatFileType create
   */
  export type CatFileTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a CatFileType.
     */
    data?: XOR<CatFileTypeCreateInput, CatFileTypeUncheckedCreateInput>
  }

  /**
   * CatFileType createMany
   */
  export type CatFileTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CatFileTypes.
     */
    data: CatFileTypeCreateManyInput | CatFileTypeCreateManyInput[]
  }

  /**
   * CatFileType createManyAndReturn
   */
  export type CatFileTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * The data used to create many CatFileTypes.
     */
    data: CatFileTypeCreateManyInput | CatFileTypeCreateManyInput[]
  }

  /**
   * CatFileType update
   */
  export type CatFileTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a CatFileType.
     */
    data: XOR<CatFileTypeUpdateInput, CatFileTypeUncheckedUpdateInput>
    /**
     * Choose, which CatFileType to update.
     */
    where: CatFileTypeWhereUniqueInput
  }

  /**
   * CatFileType updateMany
   */
  export type CatFileTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CatFileTypes.
     */
    data: XOR<CatFileTypeUpdateManyMutationInput, CatFileTypeUncheckedUpdateManyInput>
    /**
     * Filter which CatFileTypes to update
     */
    where?: CatFileTypeWhereInput
    /**
     * Limit how many CatFileTypes to update.
     */
    limit?: number
  }

  /**
   * CatFileType updateManyAndReturn
   */
  export type CatFileTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * The data used to update CatFileTypes.
     */
    data: XOR<CatFileTypeUpdateManyMutationInput, CatFileTypeUncheckedUpdateManyInput>
    /**
     * Filter which CatFileTypes to update
     */
    where?: CatFileTypeWhereInput
    /**
     * Limit how many CatFileTypes to update.
     */
    limit?: number
  }

  /**
   * CatFileType upsert
   */
  export type CatFileTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the CatFileType to update in case it exists.
     */
    where: CatFileTypeWhereUniqueInput
    /**
     * In case the CatFileType found by the `where` argument doesn't exist, create a new CatFileType with this data.
     */
    create: XOR<CatFileTypeCreateInput, CatFileTypeUncheckedCreateInput>
    /**
     * In case the CatFileType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CatFileTypeUpdateInput, CatFileTypeUncheckedUpdateInput>
  }

  /**
   * CatFileType delete
   */
  export type CatFileTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    /**
     * Filter which CatFileType to delete.
     */
    where: CatFileTypeWhereUniqueInput
  }

  /**
   * CatFileType deleteMany
   */
  export type CatFileTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatFileTypes to delete
     */
    where?: CatFileTypeWhereInput
    /**
     * Limit how many CatFileTypes to delete.
     */
    limit?: number
  }

  /**
   * CatFileType.files
   */
  export type CatFileType$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    where?: FilesWhereInput
    orderBy?: FilesOrderByWithRelationInput | FilesOrderByWithRelationInput[]
    cursor?: FilesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * CatFileType without action
   */
  export type CatFileTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
  }


  /**
   * Model CatMaterials
   */

  export type AggregateCatMaterials = {
    _count: CatMaterialsCountAggregateOutputType | null
    _avg: CatMaterialsAvgAggregateOutputType | null
    _sum: CatMaterialsSumAggregateOutputType | null
    _min: CatMaterialsMinAggregateOutputType | null
    _max: CatMaterialsMaxAggregateOutputType | null
  }

  export type CatMaterialsAvgAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatMaterialsSumAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CatMaterialsMinAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
    slug: string | null
    description: string | null
    icon: string | null
  }

  export type CatMaterialsMaxAggregateOutputType = {
    id: number | null
    name: string | null
    status: number | null
    createdAt: Date | null
    slug: string | null
    description: string | null
    icon: string | null
  }

  export type CatMaterialsCountAggregateOutputType = {
    id: number
    name: number
    status: number
    createdAt: number
    slug: number
    description: number
    icon: number
    _all: number
  }


  export type CatMaterialsAvgAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatMaterialsSumAggregateInputType = {
    id?: true
    status?: true
  }

  export type CatMaterialsMinAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
    slug?: true
    description?: true
    icon?: true
  }

  export type CatMaterialsMaxAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
    slug?: true
    description?: true
    icon?: true
  }

  export type CatMaterialsCountAggregateInputType = {
    id?: true
    name?: true
    status?: true
    createdAt?: true
    slug?: true
    description?: true
    icon?: true
    _all?: true
  }

  export type CatMaterialsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatMaterials to aggregate.
     */
    where?: CatMaterialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatMaterials to fetch.
     */
    orderBy?: CatMaterialsOrderByWithRelationInput | CatMaterialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CatMaterialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CatMaterials
    **/
    _count?: true | CatMaterialsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CatMaterialsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CatMaterialsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CatMaterialsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CatMaterialsMaxAggregateInputType
  }

  export type GetCatMaterialsAggregateType<T extends CatMaterialsAggregateArgs> = {
        [P in keyof T & keyof AggregateCatMaterials]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCatMaterials[P]>
      : GetScalarType<T[P], AggregateCatMaterials[P]>
  }




  export type CatMaterialsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CatMaterialsWhereInput
    orderBy?: CatMaterialsOrderByWithAggregationInput | CatMaterialsOrderByWithAggregationInput[]
    by: CatMaterialsScalarFieldEnum[] | CatMaterialsScalarFieldEnum
    having?: CatMaterialsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CatMaterialsCountAggregateInputType | true
    _avg?: CatMaterialsAvgAggregateInputType
    _sum?: CatMaterialsSumAggregateInputType
    _min?: CatMaterialsMinAggregateInputType
    _max?: CatMaterialsMaxAggregateInputType
  }

  export type CatMaterialsGroupByOutputType = {
    id: number
    name: string | null
    status: number
    createdAt: Date
    slug: string | null
    description: string | null
    icon: string | null
    _count: CatMaterialsCountAggregateOutputType | null
    _avg: CatMaterialsAvgAggregateOutputType | null
    _sum: CatMaterialsSumAggregateOutputType | null
    _min: CatMaterialsMinAggregateOutputType | null
    _max: CatMaterialsMaxAggregateOutputType | null
  }

  type GetCatMaterialsGroupByPayload<T extends CatMaterialsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CatMaterialsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CatMaterialsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CatMaterialsGroupByOutputType[P]>
            : GetScalarType<T[P], CatMaterialsGroupByOutputType[P]>
        }
      >
    >


  export type CatMaterialsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
    designs?: boolean | CatMaterials$designsArgs<ExtArgs>
    _count?: boolean | CatMaterialsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["catMaterials"]>

  export type CatMaterialsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
  }, ExtArgs["result"]["catMaterials"]>

  export type CatMaterialsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
  }, ExtArgs["result"]["catMaterials"]>

  export type CatMaterialsSelectScalar = {
    id?: boolean
    name?: boolean
    status?: boolean
    createdAt?: boolean
    slug?: boolean
    description?: boolean
    icon?: boolean
  }

  export type CatMaterialsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "status" | "createdAt" | "slug" | "description" | "icon", ExtArgs["result"]["catMaterials"]>
  export type CatMaterialsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    designs?: boolean | CatMaterials$designsArgs<ExtArgs>
    _count?: boolean | CatMaterialsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CatMaterialsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CatMaterialsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CatMaterialsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CatMaterials"
    objects: {
      designs: Prisma.$DesignsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      status: number
      createdAt: Date
      slug: string | null
      description: string | null
      icon: string | null
    }, ExtArgs["result"]["catMaterials"]>
    composites: {}
  }

  type CatMaterialsGetPayload<S extends boolean | null | undefined | CatMaterialsDefaultArgs> = $Result.GetResult<Prisma.$CatMaterialsPayload, S>

  type CatMaterialsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CatMaterialsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CatMaterialsCountAggregateInputType | true
    }

  export interface CatMaterialsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CatMaterials'], meta: { name: 'CatMaterials' } }
    /**
     * Find zero or one CatMaterials that matches the filter.
     * @param {CatMaterialsFindUniqueArgs} args - Arguments to find a CatMaterials
     * @example
     * // Get one CatMaterials
     * const catMaterials = await prisma.catMaterials.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CatMaterialsFindUniqueArgs>(args: SelectSubset<T, CatMaterialsFindUniqueArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CatMaterials that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CatMaterialsFindUniqueOrThrowArgs} args - Arguments to find a CatMaterials
     * @example
     * // Get one CatMaterials
     * const catMaterials = await prisma.catMaterials.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CatMaterialsFindUniqueOrThrowArgs>(args: SelectSubset<T, CatMaterialsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatMaterials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatMaterialsFindFirstArgs} args - Arguments to find a CatMaterials
     * @example
     * // Get one CatMaterials
     * const catMaterials = await prisma.catMaterials.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CatMaterialsFindFirstArgs>(args?: SelectSubset<T, CatMaterialsFindFirstArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CatMaterials that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatMaterialsFindFirstOrThrowArgs} args - Arguments to find a CatMaterials
     * @example
     * // Get one CatMaterials
     * const catMaterials = await prisma.catMaterials.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CatMaterialsFindFirstOrThrowArgs>(args?: SelectSubset<T, CatMaterialsFindFirstOrThrowArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CatMaterials that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatMaterialsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CatMaterials
     * const catMaterials = await prisma.catMaterials.findMany()
     * 
     * // Get first 10 CatMaterials
     * const catMaterials = await prisma.catMaterials.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const catMaterialsWithIdOnly = await prisma.catMaterials.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CatMaterialsFindManyArgs>(args?: SelectSubset<T, CatMaterialsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CatMaterials.
     * @param {CatMaterialsCreateArgs} args - Arguments to create a CatMaterials.
     * @example
     * // Create one CatMaterials
     * const CatMaterials = await prisma.catMaterials.create({
     *   data: {
     *     // ... data to create a CatMaterials
     *   }
     * })
     * 
     */
    create<T extends CatMaterialsCreateArgs>(args: SelectSubset<T, CatMaterialsCreateArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CatMaterials.
     * @param {CatMaterialsCreateManyArgs} args - Arguments to create many CatMaterials.
     * @example
     * // Create many CatMaterials
     * const catMaterials = await prisma.catMaterials.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CatMaterialsCreateManyArgs>(args?: SelectSubset<T, CatMaterialsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CatMaterials and returns the data saved in the database.
     * @param {CatMaterialsCreateManyAndReturnArgs} args - Arguments to create many CatMaterials.
     * @example
     * // Create many CatMaterials
     * const catMaterials = await prisma.catMaterials.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CatMaterials and only return the `id`
     * const catMaterialsWithIdOnly = await prisma.catMaterials.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CatMaterialsCreateManyAndReturnArgs>(args?: SelectSubset<T, CatMaterialsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CatMaterials.
     * @param {CatMaterialsDeleteArgs} args - Arguments to delete one CatMaterials.
     * @example
     * // Delete one CatMaterials
     * const CatMaterials = await prisma.catMaterials.delete({
     *   where: {
     *     // ... filter to delete one CatMaterials
     *   }
     * })
     * 
     */
    delete<T extends CatMaterialsDeleteArgs>(args: SelectSubset<T, CatMaterialsDeleteArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CatMaterials.
     * @param {CatMaterialsUpdateArgs} args - Arguments to update one CatMaterials.
     * @example
     * // Update one CatMaterials
     * const catMaterials = await prisma.catMaterials.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CatMaterialsUpdateArgs>(args: SelectSubset<T, CatMaterialsUpdateArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CatMaterials.
     * @param {CatMaterialsDeleteManyArgs} args - Arguments to filter CatMaterials to delete.
     * @example
     * // Delete a few CatMaterials
     * const { count } = await prisma.catMaterials.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CatMaterialsDeleteManyArgs>(args?: SelectSubset<T, CatMaterialsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatMaterialsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CatMaterials
     * const catMaterials = await prisma.catMaterials.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CatMaterialsUpdateManyArgs>(args: SelectSubset<T, CatMaterialsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CatMaterials and returns the data updated in the database.
     * @param {CatMaterialsUpdateManyAndReturnArgs} args - Arguments to update many CatMaterials.
     * @example
     * // Update many CatMaterials
     * const catMaterials = await prisma.catMaterials.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CatMaterials and only return the `id`
     * const catMaterialsWithIdOnly = await prisma.catMaterials.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CatMaterialsUpdateManyAndReturnArgs>(args: SelectSubset<T, CatMaterialsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CatMaterials.
     * @param {CatMaterialsUpsertArgs} args - Arguments to update or create a CatMaterials.
     * @example
     * // Update or create a CatMaterials
     * const catMaterials = await prisma.catMaterials.upsert({
     *   create: {
     *     // ... data to create a CatMaterials
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CatMaterials we want to update
     *   }
     * })
     */
    upsert<T extends CatMaterialsUpsertArgs>(args: SelectSubset<T, CatMaterialsUpsertArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CatMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatMaterialsCountArgs} args - Arguments to filter CatMaterials to count.
     * @example
     * // Count the number of CatMaterials
     * const count = await prisma.catMaterials.count({
     *   where: {
     *     // ... the filter for the CatMaterials we want to count
     *   }
     * })
    **/
    count<T extends CatMaterialsCountArgs>(
      args?: Subset<T, CatMaterialsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CatMaterialsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CatMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatMaterialsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CatMaterialsAggregateArgs>(args: Subset<T, CatMaterialsAggregateArgs>): Prisma.PrismaPromise<GetCatMaterialsAggregateType<T>>

    /**
     * Group by CatMaterials.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CatMaterialsGroupByArgs} args - Group by arguments.
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
      T extends CatMaterialsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CatMaterialsGroupByArgs['orderBy'] }
        : { orderBy?: CatMaterialsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CatMaterialsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCatMaterialsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CatMaterials model
   */
  readonly fields: CatMaterialsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CatMaterials.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CatMaterialsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    designs<T extends CatMaterials$designsArgs<ExtArgs> = {}>(args?: Subset<T, CatMaterials$designsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the CatMaterials model
   */
  interface CatMaterialsFieldRefs {
    readonly id: FieldRef<"CatMaterials", 'Int'>
    readonly name: FieldRef<"CatMaterials", 'String'>
    readonly status: FieldRef<"CatMaterials", 'Int'>
    readonly createdAt: FieldRef<"CatMaterials", 'DateTime'>
    readonly slug: FieldRef<"CatMaterials", 'String'>
    readonly description: FieldRef<"CatMaterials", 'String'>
    readonly icon: FieldRef<"CatMaterials", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CatMaterials findUnique
   */
  export type CatMaterialsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * Filter, which CatMaterials to fetch.
     */
    where: CatMaterialsWhereUniqueInput
  }

  /**
   * CatMaterials findUniqueOrThrow
   */
  export type CatMaterialsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * Filter, which CatMaterials to fetch.
     */
    where: CatMaterialsWhereUniqueInput
  }

  /**
   * CatMaterials findFirst
   */
  export type CatMaterialsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * Filter, which CatMaterials to fetch.
     */
    where?: CatMaterialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatMaterials to fetch.
     */
    orderBy?: CatMaterialsOrderByWithRelationInput | CatMaterialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatMaterials.
     */
    cursor?: CatMaterialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatMaterials.
     */
    distinct?: CatMaterialsScalarFieldEnum | CatMaterialsScalarFieldEnum[]
  }

  /**
   * CatMaterials findFirstOrThrow
   */
  export type CatMaterialsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * Filter, which CatMaterials to fetch.
     */
    where?: CatMaterialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatMaterials to fetch.
     */
    orderBy?: CatMaterialsOrderByWithRelationInput | CatMaterialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CatMaterials.
     */
    cursor?: CatMaterialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatMaterials.
     */
    distinct?: CatMaterialsScalarFieldEnum | CatMaterialsScalarFieldEnum[]
  }

  /**
   * CatMaterials findMany
   */
  export type CatMaterialsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * Filter, which CatMaterials to fetch.
     */
    where?: CatMaterialsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CatMaterials to fetch.
     */
    orderBy?: CatMaterialsOrderByWithRelationInput | CatMaterialsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CatMaterials.
     */
    cursor?: CatMaterialsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CatMaterials from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CatMaterials.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CatMaterials.
     */
    distinct?: CatMaterialsScalarFieldEnum | CatMaterialsScalarFieldEnum[]
  }

  /**
   * CatMaterials create
   */
  export type CatMaterialsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * The data needed to create a CatMaterials.
     */
    data?: XOR<CatMaterialsCreateInput, CatMaterialsUncheckedCreateInput>
  }

  /**
   * CatMaterials createMany
   */
  export type CatMaterialsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CatMaterials.
     */
    data: CatMaterialsCreateManyInput | CatMaterialsCreateManyInput[]
  }

  /**
   * CatMaterials createManyAndReturn
   */
  export type CatMaterialsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * The data used to create many CatMaterials.
     */
    data: CatMaterialsCreateManyInput | CatMaterialsCreateManyInput[]
  }

  /**
   * CatMaterials update
   */
  export type CatMaterialsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * The data needed to update a CatMaterials.
     */
    data: XOR<CatMaterialsUpdateInput, CatMaterialsUncheckedUpdateInput>
    /**
     * Choose, which CatMaterials to update.
     */
    where: CatMaterialsWhereUniqueInput
  }

  /**
   * CatMaterials updateMany
   */
  export type CatMaterialsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CatMaterials.
     */
    data: XOR<CatMaterialsUpdateManyMutationInput, CatMaterialsUncheckedUpdateManyInput>
    /**
     * Filter which CatMaterials to update
     */
    where?: CatMaterialsWhereInput
    /**
     * Limit how many CatMaterials to update.
     */
    limit?: number
  }

  /**
   * CatMaterials updateManyAndReturn
   */
  export type CatMaterialsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * The data used to update CatMaterials.
     */
    data: XOR<CatMaterialsUpdateManyMutationInput, CatMaterialsUncheckedUpdateManyInput>
    /**
     * Filter which CatMaterials to update
     */
    where?: CatMaterialsWhereInput
    /**
     * Limit how many CatMaterials to update.
     */
    limit?: number
  }

  /**
   * CatMaterials upsert
   */
  export type CatMaterialsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * The filter to search for the CatMaterials to update in case it exists.
     */
    where: CatMaterialsWhereUniqueInput
    /**
     * In case the CatMaterials found by the `where` argument doesn't exist, create a new CatMaterials with this data.
     */
    create: XOR<CatMaterialsCreateInput, CatMaterialsUncheckedCreateInput>
    /**
     * In case the CatMaterials was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CatMaterialsUpdateInput, CatMaterialsUncheckedUpdateInput>
  }

  /**
   * CatMaterials delete
   */
  export type CatMaterialsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    /**
     * Filter which CatMaterials to delete.
     */
    where: CatMaterialsWhereUniqueInput
  }

  /**
   * CatMaterials deleteMany
   */
  export type CatMaterialsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CatMaterials to delete
     */
    where?: CatMaterialsWhereInput
    /**
     * Limit how many CatMaterials to delete.
     */
    limit?: number
  }

  /**
   * CatMaterials.designs
   */
  export type CatMaterials$designsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    where?: DesignsWhereInput
    orderBy?: DesignsOrderByWithRelationInput | DesignsOrderByWithRelationInput[]
    cursor?: DesignsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DesignsScalarFieldEnum | DesignsScalarFieldEnum[]
  }

  /**
   * CatMaterials without action
   */
  export type CatMaterialsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
  }


  /**
   * Model Designs
   */

  export type AggregateDesigns = {
    _count: DesignsCountAggregateOutputType | null
    _avg: DesignsAvgAggregateOutputType | null
    _sum: DesignsSumAggregateOutputType | null
    _min: DesignsMinAggregateOutputType | null
    _max: DesignsMaxAggregateOutputType | null
  }

  export type DesignsAvgAggregateOutputType = {
    id: number | null
    status: number | null
    materialId: number | null
  }

  export type DesignsSumAggregateOutputType = {
    id: number | null
    status: number | null
    materialId: number | null
  }

  export type DesignsMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    author: string | null
    status: number | null
    createdAt: Date | null
    materialId: number | null
  }

  export type DesignsMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    author: string | null
    status: number | null
    createdAt: Date | null
    materialId: number | null
  }

  export type DesignsCountAggregateOutputType = {
    id: number
    name: number
    description: number
    author: number
    status: number
    createdAt: number
    materialId: number
    _all: number
  }


  export type DesignsAvgAggregateInputType = {
    id?: true
    status?: true
    materialId?: true
  }

  export type DesignsSumAggregateInputType = {
    id?: true
    status?: true
    materialId?: true
  }

  export type DesignsMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    author?: true
    status?: true
    createdAt?: true
    materialId?: true
  }

  export type DesignsMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    author?: true
    status?: true
    createdAt?: true
    materialId?: true
  }

  export type DesignsCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    author?: true
    status?: true
    createdAt?: true
    materialId?: true
    _all?: true
  }

  export type DesignsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Designs to aggregate.
     */
    where?: DesignsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignsOrderByWithRelationInput | DesignsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DesignsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Designs
    **/
    _count?: true | DesignsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DesignsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DesignsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DesignsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DesignsMaxAggregateInputType
  }

  export type GetDesignsAggregateType<T extends DesignsAggregateArgs> = {
        [P in keyof T & keyof AggregateDesigns]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDesigns[P]>
      : GetScalarType<T[P], AggregateDesigns[P]>
  }




  export type DesignsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DesignsWhereInput
    orderBy?: DesignsOrderByWithAggregationInput | DesignsOrderByWithAggregationInput[]
    by: DesignsScalarFieldEnum[] | DesignsScalarFieldEnum
    having?: DesignsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DesignsCountAggregateInputType | true
    _avg?: DesignsAvgAggregateInputType
    _sum?: DesignsSumAggregateInputType
    _min?: DesignsMinAggregateInputType
    _max?: DesignsMaxAggregateInputType
  }

  export type DesignsGroupByOutputType = {
    id: number
    name: string | null
    description: string | null
    author: string | null
    status: number
    createdAt: Date
    materialId: number | null
    _count: DesignsCountAggregateOutputType | null
    _avg: DesignsAvgAggregateOutputType | null
    _sum: DesignsSumAggregateOutputType | null
    _min: DesignsMinAggregateOutputType | null
    _max: DesignsMaxAggregateOutputType | null
  }

  type GetDesignsGroupByPayload<T extends DesignsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DesignsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DesignsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DesignsGroupByOutputType[P]>
            : GetScalarType<T[P], DesignsGroupByOutputType[P]>
        }
      >
    >


  export type DesignsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    author?: boolean
    status?: boolean
    createdAt?: boolean
    materialId?: boolean
    material?: boolean | Designs$materialArgs<ExtArgs>
    relDesignsCategories?: boolean | Designs$relDesignsCategoriesArgs<ExtArgs>
    relDesignsFiles?: boolean | Designs$relDesignsFilesArgs<ExtArgs>
    relDesignsTypes?: boolean | Designs$relDesignsTypesArgs<ExtArgs>
    _count?: boolean | DesignsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["designs"]>

  export type DesignsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    author?: boolean
    status?: boolean
    createdAt?: boolean
    materialId?: boolean
    material?: boolean | Designs$materialArgs<ExtArgs>
  }, ExtArgs["result"]["designs"]>

  export type DesignsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    author?: boolean
    status?: boolean
    createdAt?: boolean
    materialId?: boolean
    material?: boolean | Designs$materialArgs<ExtArgs>
  }, ExtArgs["result"]["designs"]>

  export type DesignsSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    author?: boolean
    status?: boolean
    createdAt?: boolean
    materialId?: boolean
  }

  export type DesignsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "author" | "status" | "createdAt" | "materialId", ExtArgs["result"]["designs"]>
  export type DesignsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    material?: boolean | Designs$materialArgs<ExtArgs>
    relDesignsCategories?: boolean | Designs$relDesignsCategoriesArgs<ExtArgs>
    relDesignsFiles?: boolean | Designs$relDesignsFilesArgs<ExtArgs>
    relDesignsTypes?: boolean | Designs$relDesignsTypesArgs<ExtArgs>
    _count?: boolean | DesignsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DesignsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    material?: boolean | Designs$materialArgs<ExtArgs>
  }
  export type DesignsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    material?: boolean | Designs$materialArgs<ExtArgs>
  }

  export type $DesignsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Designs"
    objects: {
      material: Prisma.$CatMaterialsPayload<ExtArgs> | null
      relDesignsCategories: Prisma.$RelDesignsCategoriesPayload<ExtArgs>[]
      relDesignsFiles: Prisma.$RelDesignsFilesPayload<ExtArgs>[]
      relDesignsTypes: Prisma.$RelDesignsTypesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      description: string | null
      author: string | null
      status: number
      createdAt: Date
      materialId: number | null
    }, ExtArgs["result"]["designs"]>
    composites: {}
  }

  type DesignsGetPayload<S extends boolean | null | undefined | DesignsDefaultArgs> = $Result.GetResult<Prisma.$DesignsPayload, S>

  type DesignsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DesignsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DesignsCountAggregateInputType | true
    }

  export interface DesignsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Designs'], meta: { name: 'Designs' } }
    /**
     * Find zero or one Designs that matches the filter.
     * @param {DesignsFindUniqueArgs} args - Arguments to find a Designs
     * @example
     * // Get one Designs
     * const designs = await prisma.designs.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DesignsFindUniqueArgs>(args: SelectSubset<T, DesignsFindUniqueArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Designs that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DesignsFindUniqueOrThrowArgs} args - Arguments to find a Designs
     * @example
     * // Get one Designs
     * const designs = await prisma.designs.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DesignsFindUniqueOrThrowArgs>(args: SelectSubset<T, DesignsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Designs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignsFindFirstArgs} args - Arguments to find a Designs
     * @example
     * // Get one Designs
     * const designs = await prisma.designs.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DesignsFindFirstArgs>(args?: SelectSubset<T, DesignsFindFirstArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Designs that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignsFindFirstOrThrowArgs} args - Arguments to find a Designs
     * @example
     * // Get one Designs
     * const designs = await prisma.designs.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DesignsFindFirstOrThrowArgs>(args?: SelectSubset<T, DesignsFindFirstOrThrowArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Designs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Designs
     * const designs = await prisma.designs.findMany()
     * 
     * // Get first 10 Designs
     * const designs = await prisma.designs.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const designsWithIdOnly = await prisma.designs.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DesignsFindManyArgs>(args?: SelectSubset<T, DesignsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Designs.
     * @param {DesignsCreateArgs} args - Arguments to create a Designs.
     * @example
     * // Create one Designs
     * const Designs = await prisma.designs.create({
     *   data: {
     *     // ... data to create a Designs
     *   }
     * })
     * 
     */
    create<T extends DesignsCreateArgs>(args: SelectSubset<T, DesignsCreateArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Designs.
     * @param {DesignsCreateManyArgs} args - Arguments to create many Designs.
     * @example
     * // Create many Designs
     * const designs = await prisma.designs.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DesignsCreateManyArgs>(args?: SelectSubset<T, DesignsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Designs and returns the data saved in the database.
     * @param {DesignsCreateManyAndReturnArgs} args - Arguments to create many Designs.
     * @example
     * // Create many Designs
     * const designs = await prisma.designs.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Designs and only return the `id`
     * const designsWithIdOnly = await prisma.designs.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DesignsCreateManyAndReturnArgs>(args?: SelectSubset<T, DesignsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Designs.
     * @param {DesignsDeleteArgs} args - Arguments to delete one Designs.
     * @example
     * // Delete one Designs
     * const Designs = await prisma.designs.delete({
     *   where: {
     *     // ... filter to delete one Designs
     *   }
     * })
     * 
     */
    delete<T extends DesignsDeleteArgs>(args: SelectSubset<T, DesignsDeleteArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Designs.
     * @param {DesignsUpdateArgs} args - Arguments to update one Designs.
     * @example
     * // Update one Designs
     * const designs = await prisma.designs.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DesignsUpdateArgs>(args: SelectSubset<T, DesignsUpdateArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Designs.
     * @param {DesignsDeleteManyArgs} args - Arguments to filter Designs to delete.
     * @example
     * // Delete a few Designs
     * const { count } = await prisma.designs.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DesignsDeleteManyArgs>(args?: SelectSubset<T, DesignsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Designs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Designs
     * const designs = await prisma.designs.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DesignsUpdateManyArgs>(args: SelectSubset<T, DesignsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Designs and returns the data updated in the database.
     * @param {DesignsUpdateManyAndReturnArgs} args - Arguments to update many Designs.
     * @example
     * // Update many Designs
     * const designs = await prisma.designs.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Designs and only return the `id`
     * const designsWithIdOnly = await prisma.designs.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DesignsUpdateManyAndReturnArgs>(args: SelectSubset<T, DesignsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Designs.
     * @param {DesignsUpsertArgs} args - Arguments to update or create a Designs.
     * @example
     * // Update or create a Designs
     * const designs = await prisma.designs.upsert({
     *   create: {
     *     // ... data to create a Designs
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Designs we want to update
     *   }
     * })
     */
    upsert<T extends DesignsUpsertArgs>(args: SelectSubset<T, DesignsUpsertArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Designs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignsCountArgs} args - Arguments to filter Designs to count.
     * @example
     * // Count the number of Designs
     * const count = await prisma.designs.count({
     *   where: {
     *     // ... the filter for the Designs we want to count
     *   }
     * })
    **/
    count<T extends DesignsCountArgs>(
      args?: Subset<T, DesignsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DesignsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Designs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DesignsAggregateArgs>(args: Subset<T, DesignsAggregateArgs>): Prisma.PrismaPromise<GetDesignsAggregateType<T>>

    /**
     * Group by Designs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DesignsGroupByArgs} args - Group by arguments.
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
      T extends DesignsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DesignsGroupByArgs['orderBy'] }
        : { orderBy?: DesignsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DesignsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDesignsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Designs model
   */
  readonly fields: DesignsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Designs.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DesignsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    material<T extends Designs$materialArgs<ExtArgs> = {}>(args?: Subset<T, Designs$materialArgs<ExtArgs>>): Prisma__CatMaterialsClient<$Result.GetResult<Prisma.$CatMaterialsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    relDesignsCategories<T extends Designs$relDesignsCategoriesArgs<ExtArgs> = {}>(args?: Subset<T, Designs$relDesignsCategoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    relDesignsFiles<T extends Designs$relDesignsFilesArgs<ExtArgs> = {}>(args?: Subset<T, Designs$relDesignsFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    relDesignsTypes<T extends Designs$relDesignsTypesArgs<ExtArgs> = {}>(args?: Subset<T, Designs$relDesignsTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Designs model
   */
  interface DesignsFieldRefs {
    readonly id: FieldRef<"Designs", 'Int'>
    readonly name: FieldRef<"Designs", 'String'>
    readonly description: FieldRef<"Designs", 'String'>
    readonly author: FieldRef<"Designs", 'String'>
    readonly status: FieldRef<"Designs", 'Int'>
    readonly createdAt: FieldRef<"Designs", 'DateTime'>
    readonly materialId: FieldRef<"Designs", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Designs findUnique
   */
  export type DesignsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * Filter, which Designs to fetch.
     */
    where: DesignsWhereUniqueInput
  }

  /**
   * Designs findUniqueOrThrow
   */
  export type DesignsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * Filter, which Designs to fetch.
     */
    where: DesignsWhereUniqueInput
  }

  /**
   * Designs findFirst
   */
  export type DesignsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * Filter, which Designs to fetch.
     */
    where?: DesignsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignsOrderByWithRelationInput | DesignsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Designs.
     */
    cursor?: DesignsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Designs.
     */
    distinct?: DesignsScalarFieldEnum | DesignsScalarFieldEnum[]
  }

  /**
   * Designs findFirstOrThrow
   */
  export type DesignsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * Filter, which Designs to fetch.
     */
    where?: DesignsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignsOrderByWithRelationInput | DesignsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Designs.
     */
    cursor?: DesignsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Designs.
     */
    distinct?: DesignsScalarFieldEnum | DesignsScalarFieldEnum[]
  }

  /**
   * Designs findMany
   */
  export type DesignsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * Filter, which Designs to fetch.
     */
    where?: DesignsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Designs to fetch.
     */
    orderBy?: DesignsOrderByWithRelationInput | DesignsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Designs.
     */
    cursor?: DesignsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Designs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Designs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Designs.
     */
    distinct?: DesignsScalarFieldEnum | DesignsScalarFieldEnum[]
  }

  /**
   * Designs create
   */
  export type DesignsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * The data needed to create a Designs.
     */
    data?: XOR<DesignsCreateInput, DesignsUncheckedCreateInput>
  }

  /**
   * Designs createMany
   */
  export type DesignsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Designs.
     */
    data: DesignsCreateManyInput | DesignsCreateManyInput[]
  }

  /**
   * Designs createManyAndReturn
   */
  export type DesignsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * The data used to create many Designs.
     */
    data: DesignsCreateManyInput | DesignsCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Designs update
   */
  export type DesignsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * The data needed to update a Designs.
     */
    data: XOR<DesignsUpdateInput, DesignsUncheckedUpdateInput>
    /**
     * Choose, which Designs to update.
     */
    where: DesignsWhereUniqueInput
  }

  /**
   * Designs updateMany
   */
  export type DesignsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Designs.
     */
    data: XOR<DesignsUpdateManyMutationInput, DesignsUncheckedUpdateManyInput>
    /**
     * Filter which Designs to update
     */
    where?: DesignsWhereInput
    /**
     * Limit how many Designs to update.
     */
    limit?: number
  }

  /**
   * Designs updateManyAndReturn
   */
  export type DesignsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * The data used to update Designs.
     */
    data: XOR<DesignsUpdateManyMutationInput, DesignsUncheckedUpdateManyInput>
    /**
     * Filter which Designs to update
     */
    where?: DesignsWhereInput
    /**
     * Limit how many Designs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Designs upsert
   */
  export type DesignsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * The filter to search for the Designs to update in case it exists.
     */
    where: DesignsWhereUniqueInput
    /**
     * In case the Designs found by the `where` argument doesn't exist, create a new Designs with this data.
     */
    create: XOR<DesignsCreateInput, DesignsUncheckedCreateInput>
    /**
     * In case the Designs was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DesignsUpdateInput, DesignsUncheckedUpdateInput>
  }

  /**
   * Designs delete
   */
  export type DesignsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    /**
     * Filter which Designs to delete.
     */
    where: DesignsWhereUniqueInput
  }

  /**
   * Designs deleteMany
   */
  export type DesignsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Designs to delete
     */
    where?: DesignsWhereInput
    /**
     * Limit how many Designs to delete.
     */
    limit?: number
  }

  /**
   * Designs.material
   */
  export type Designs$materialArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatMaterials
     */
    select?: CatMaterialsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatMaterials
     */
    omit?: CatMaterialsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatMaterialsInclude<ExtArgs> | null
    where?: CatMaterialsWhereInput
  }

  /**
   * Designs.relDesignsCategories
   */
  export type Designs$relDesignsCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    where?: RelDesignsCategoriesWhereInput
    orderBy?: RelDesignsCategoriesOrderByWithRelationInput | RelDesignsCategoriesOrderByWithRelationInput[]
    cursor?: RelDesignsCategoriesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelDesignsCategoriesScalarFieldEnum | RelDesignsCategoriesScalarFieldEnum[]
  }

  /**
   * Designs.relDesignsFiles
   */
  export type Designs$relDesignsFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    where?: RelDesignsFilesWhereInput
    orderBy?: RelDesignsFilesOrderByWithRelationInput | RelDesignsFilesOrderByWithRelationInput[]
    cursor?: RelDesignsFilesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelDesignsFilesScalarFieldEnum | RelDesignsFilesScalarFieldEnum[]
  }

  /**
   * Designs.relDesignsTypes
   */
  export type Designs$relDesignsTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    where?: RelDesignsTypesWhereInput
    orderBy?: RelDesignsTypesOrderByWithRelationInput | RelDesignsTypesOrderByWithRelationInput[]
    cursor?: RelDesignsTypesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelDesignsTypesScalarFieldEnum | RelDesignsTypesScalarFieldEnum[]
  }

  /**
   * Designs without action
   */
  export type DesignsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
  }


  /**
   * Model Files
   */

  export type AggregateFiles = {
    _count: FilesCountAggregateOutputType | null
    _avg: FilesAvgAggregateOutputType | null
    _sum: FilesSumAggregateOutputType | null
    _min: FilesMinAggregateOutputType | null
    _max: FilesMaxAggregateOutputType | null
  }

  export type FilesAvgAggregateOutputType = {
    id: number | null
    fileTypeId: number | null
    fileExtensionId: number | null
    status: number | null
  }

  export type FilesSumAggregateOutputType = {
    id: number | null
    fileTypeId: number | null
    fileExtensionId: number | null
    status: number | null
  }

  export type FilesMinAggregateOutputType = {
    id: number | null
    fileTypeId: number | null
    fileExtensionId: number | null
    status: number | null
    createdAt: Date | null
    fileData: Bytes | null
  }

  export type FilesMaxAggregateOutputType = {
    id: number | null
    fileTypeId: number | null
    fileExtensionId: number | null
    status: number | null
    createdAt: Date | null
    fileData: Bytes | null
  }

  export type FilesCountAggregateOutputType = {
    id: number
    fileTypeId: number
    fileExtensionId: number
    status: number
    createdAt: number
    fileData: number
    _all: number
  }


  export type FilesAvgAggregateInputType = {
    id?: true
    fileTypeId?: true
    fileExtensionId?: true
    status?: true
  }

  export type FilesSumAggregateInputType = {
    id?: true
    fileTypeId?: true
    fileExtensionId?: true
    status?: true
  }

  export type FilesMinAggregateInputType = {
    id?: true
    fileTypeId?: true
    fileExtensionId?: true
    status?: true
    createdAt?: true
    fileData?: true
  }

  export type FilesMaxAggregateInputType = {
    id?: true
    fileTypeId?: true
    fileExtensionId?: true
    status?: true
    createdAt?: true
    fileData?: true
  }

  export type FilesCountAggregateInputType = {
    id?: true
    fileTypeId?: true
    fileExtensionId?: true
    status?: true
    createdAt?: true
    fileData?: true
    _all?: true
  }

  export type FilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to aggregate.
     */
    where?: FilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FilesOrderByWithRelationInput | FilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Files
    **/
    _count?: true | FilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FilesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FilesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FilesMaxAggregateInputType
  }

  export type GetFilesAggregateType<T extends FilesAggregateArgs> = {
        [P in keyof T & keyof AggregateFiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFiles[P]>
      : GetScalarType<T[P], AggregateFiles[P]>
  }




  export type FilesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FilesWhereInput
    orderBy?: FilesOrderByWithAggregationInput | FilesOrderByWithAggregationInput[]
    by: FilesScalarFieldEnum[] | FilesScalarFieldEnum
    having?: FilesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FilesCountAggregateInputType | true
    _avg?: FilesAvgAggregateInputType
    _sum?: FilesSumAggregateInputType
    _min?: FilesMinAggregateInputType
    _max?: FilesMaxAggregateInputType
  }

  export type FilesGroupByOutputType = {
    id: number
    fileTypeId: number | null
    fileExtensionId: number | null
    status: number
    createdAt: Date
    fileData: Bytes
    _count: FilesCountAggregateOutputType | null
    _avg: FilesAvgAggregateOutputType | null
    _sum: FilesSumAggregateOutputType | null
    _min: FilesMinAggregateOutputType | null
    _max: FilesMaxAggregateOutputType | null
  }

  type GetFilesGroupByPayload<T extends FilesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FilesGroupByOutputType[P]>
            : GetScalarType<T[P], FilesGroupByOutputType[P]>
        }
      >
    >


  export type FilesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileTypeId?: boolean
    fileExtensionId?: boolean
    status?: boolean
    createdAt?: boolean
    fileData?: boolean
    fileType?: boolean | Files$fileTypeArgs<ExtArgs>
    fileExtension?: boolean | Files$fileExtensionArgs<ExtArgs>
    relDesignsFiles?: boolean | Files$relDesignsFilesArgs<ExtArgs>
    _count?: boolean | FilesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["files"]>

  export type FilesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileTypeId?: boolean
    fileExtensionId?: boolean
    status?: boolean
    createdAt?: boolean
    fileData?: boolean
    fileType?: boolean | Files$fileTypeArgs<ExtArgs>
    fileExtension?: boolean | Files$fileExtensionArgs<ExtArgs>
  }, ExtArgs["result"]["files"]>

  export type FilesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fileTypeId?: boolean
    fileExtensionId?: boolean
    status?: boolean
    createdAt?: boolean
    fileData?: boolean
    fileType?: boolean | Files$fileTypeArgs<ExtArgs>
    fileExtension?: boolean | Files$fileExtensionArgs<ExtArgs>
  }, ExtArgs["result"]["files"]>

  export type FilesSelectScalar = {
    id?: boolean
    fileTypeId?: boolean
    fileExtensionId?: boolean
    status?: boolean
    createdAt?: boolean
    fileData?: boolean
  }

  export type FilesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fileTypeId" | "fileExtensionId" | "status" | "createdAt" | "fileData", ExtArgs["result"]["files"]>
  export type FilesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fileType?: boolean | Files$fileTypeArgs<ExtArgs>
    fileExtension?: boolean | Files$fileExtensionArgs<ExtArgs>
    relDesignsFiles?: boolean | Files$relDesignsFilesArgs<ExtArgs>
    _count?: boolean | FilesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FilesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fileType?: boolean | Files$fileTypeArgs<ExtArgs>
    fileExtension?: boolean | Files$fileExtensionArgs<ExtArgs>
  }
  export type FilesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fileType?: boolean | Files$fileTypeArgs<ExtArgs>
    fileExtension?: boolean | Files$fileExtensionArgs<ExtArgs>
  }

  export type $FilesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Files"
    objects: {
      fileType: Prisma.$CatFileTypePayload<ExtArgs> | null
      fileExtension: Prisma.$CatFileExtensionPayload<ExtArgs> | null
      relDesignsFiles: Prisma.$RelDesignsFilesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      fileTypeId: number | null
      fileExtensionId: number | null
      status: number
      createdAt: Date
      fileData: Prisma.Bytes
    }, ExtArgs["result"]["files"]>
    composites: {}
  }

  type FilesGetPayload<S extends boolean | null | undefined | FilesDefaultArgs> = $Result.GetResult<Prisma.$FilesPayload, S>

  type FilesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FilesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FilesCountAggregateInputType | true
    }

  export interface FilesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Files'], meta: { name: 'Files' } }
    /**
     * Find zero or one Files that matches the filter.
     * @param {FilesFindUniqueArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FilesFindUniqueArgs>(args: SelectSubset<T, FilesFindUniqueArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Files that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FilesFindUniqueOrThrowArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FilesFindUniqueOrThrowArgs>(args: SelectSubset<T, FilesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesFindFirstArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FilesFindFirstArgs>(args?: SelectSubset<T, FilesFindFirstArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Files that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesFindFirstOrThrowArgs} args - Arguments to find a Files
     * @example
     * // Get one Files
     * const files = await prisma.files.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FilesFindFirstOrThrowArgs>(args?: SelectSubset<T, FilesFindFirstOrThrowArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Files that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Files
     * const files = await prisma.files.findMany()
     * 
     * // Get first 10 Files
     * const files = await prisma.files.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const filesWithIdOnly = await prisma.files.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FilesFindManyArgs>(args?: SelectSubset<T, FilesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Files.
     * @param {FilesCreateArgs} args - Arguments to create a Files.
     * @example
     * // Create one Files
     * const Files = await prisma.files.create({
     *   data: {
     *     // ... data to create a Files
     *   }
     * })
     * 
     */
    create<T extends FilesCreateArgs>(args: SelectSubset<T, FilesCreateArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Files.
     * @param {FilesCreateManyArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const files = await prisma.files.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FilesCreateManyArgs>(args?: SelectSubset<T, FilesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Files and returns the data saved in the database.
     * @param {FilesCreateManyAndReturnArgs} args - Arguments to create many Files.
     * @example
     * // Create many Files
     * const files = await prisma.files.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Files and only return the `id`
     * const filesWithIdOnly = await prisma.files.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FilesCreateManyAndReturnArgs>(args?: SelectSubset<T, FilesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Files.
     * @param {FilesDeleteArgs} args - Arguments to delete one Files.
     * @example
     * // Delete one Files
     * const Files = await prisma.files.delete({
     *   where: {
     *     // ... filter to delete one Files
     *   }
     * })
     * 
     */
    delete<T extends FilesDeleteArgs>(args: SelectSubset<T, FilesDeleteArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Files.
     * @param {FilesUpdateArgs} args - Arguments to update one Files.
     * @example
     * // Update one Files
     * const files = await prisma.files.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FilesUpdateArgs>(args: SelectSubset<T, FilesUpdateArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Files.
     * @param {FilesDeleteManyArgs} args - Arguments to filter Files to delete.
     * @example
     * // Delete a few Files
     * const { count } = await prisma.files.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FilesDeleteManyArgs>(args?: SelectSubset<T, FilesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Files
     * const files = await prisma.files.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FilesUpdateManyArgs>(args: SelectSubset<T, FilesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Files and returns the data updated in the database.
     * @param {FilesUpdateManyAndReturnArgs} args - Arguments to update many Files.
     * @example
     * // Update many Files
     * const files = await prisma.files.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Files and only return the `id`
     * const filesWithIdOnly = await prisma.files.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FilesUpdateManyAndReturnArgs>(args: SelectSubset<T, FilesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Files.
     * @param {FilesUpsertArgs} args - Arguments to update or create a Files.
     * @example
     * // Update or create a Files
     * const files = await prisma.files.upsert({
     *   create: {
     *     // ... data to create a Files
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Files we want to update
     *   }
     * })
     */
    upsert<T extends FilesUpsertArgs>(args: SelectSubset<T, FilesUpsertArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesCountArgs} args - Arguments to filter Files to count.
     * @example
     * // Count the number of Files
     * const count = await prisma.files.count({
     *   where: {
     *     // ... the filter for the Files we want to count
     *   }
     * })
    **/
    count<T extends FilesCountArgs>(
      args?: Subset<T, FilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FilesAggregateArgs>(args: Subset<T, FilesAggregateArgs>): Prisma.PrismaPromise<GetFilesAggregateType<T>>

    /**
     * Group by Files.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FilesGroupByArgs} args - Group by arguments.
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
      T extends FilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FilesGroupByArgs['orderBy'] }
        : { orderBy?: FilesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FilesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Files model
   */
  readonly fields: FilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Files.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FilesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fileType<T extends Files$fileTypeArgs<ExtArgs> = {}>(args?: Subset<T, Files$fileTypeArgs<ExtArgs>>): Prisma__CatFileTypeClient<$Result.GetResult<Prisma.$CatFileTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    fileExtension<T extends Files$fileExtensionArgs<ExtArgs> = {}>(args?: Subset<T, Files$fileExtensionArgs<ExtArgs>>): Prisma__CatFileExtensionClient<$Result.GetResult<Prisma.$CatFileExtensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    relDesignsFiles<T extends Files$relDesignsFilesArgs<ExtArgs> = {}>(args?: Subset<T, Files$relDesignsFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Files model
   */
  interface FilesFieldRefs {
    readonly id: FieldRef<"Files", 'Int'>
    readonly fileTypeId: FieldRef<"Files", 'Int'>
    readonly fileExtensionId: FieldRef<"Files", 'Int'>
    readonly status: FieldRef<"Files", 'Int'>
    readonly createdAt: FieldRef<"Files", 'DateTime'>
    readonly fileData: FieldRef<"Files", 'Bytes'>
  }
    

  // Custom InputTypes
  /**
   * Files findUnique
   */
  export type FilesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where: FilesWhereUniqueInput
  }

  /**
   * Files findUniqueOrThrow
   */
  export type FilesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where: FilesWhereUniqueInput
  }

  /**
   * Files findFirst
   */
  export type FilesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FilesOrderByWithRelationInput | FilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * Files findFirstOrThrow
   */
  export type FilesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FilesOrderByWithRelationInput | FilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Files.
     */
    cursor?: FilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * Files findMany
   */
  export type FilesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * Filter, which Files to fetch.
     */
    where?: FilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Files to fetch.
     */
    orderBy?: FilesOrderByWithRelationInput | FilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Files.
     */
    cursor?: FilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Files from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Files.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Files.
     */
    distinct?: FilesScalarFieldEnum | FilesScalarFieldEnum[]
  }

  /**
   * Files create
   */
  export type FilesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * The data needed to create a Files.
     */
    data: XOR<FilesCreateInput, FilesUncheckedCreateInput>
  }

  /**
   * Files createMany
   */
  export type FilesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Files.
     */
    data: FilesCreateManyInput | FilesCreateManyInput[]
  }

  /**
   * Files createManyAndReturn
   */
  export type FilesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * The data used to create many Files.
     */
    data: FilesCreateManyInput | FilesCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Files update
   */
  export type FilesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * The data needed to update a Files.
     */
    data: XOR<FilesUpdateInput, FilesUncheckedUpdateInput>
    /**
     * Choose, which Files to update.
     */
    where: FilesWhereUniqueInput
  }

  /**
   * Files updateMany
   */
  export type FilesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Files.
     */
    data: XOR<FilesUpdateManyMutationInput, FilesUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FilesWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
  }

  /**
   * Files updateManyAndReturn
   */
  export type FilesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * The data used to update Files.
     */
    data: XOR<FilesUpdateManyMutationInput, FilesUncheckedUpdateManyInput>
    /**
     * Filter which Files to update
     */
    where?: FilesWhereInput
    /**
     * Limit how many Files to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Files upsert
   */
  export type FilesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * The filter to search for the Files to update in case it exists.
     */
    where: FilesWhereUniqueInput
    /**
     * In case the Files found by the `where` argument doesn't exist, create a new Files with this data.
     */
    create: XOR<FilesCreateInput, FilesUncheckedCreateInput>
    /**
     * In case the Files was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FilesUpdateInput, FilesUncheckedUpdateInput>
  }

  /**
   * Files delete
   */
  export type FilesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    /**
     * Filter which Files to delete.
     */
    where: FilesWhereUniqueInput
  }

  /**
   * Files deleteMany
   */
  export type FilesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Files to delete
     */
    where?: FilesWhereInput
    /**
     * Limit how many Files to delete.
     */
    limit?: number
  }

  /**
   * Files.fileType
   */
  export type Files$fileTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileType
     */
    select?: CatFileTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileType
     */
    omit?: CatFileTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileTypeInclude<ExtArgs> | null
    where?: CatFileTypeWhereInput
  }

  /**
   * Files.fileExtension
   */
  export type Files$fileExtensionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatFileExtension
     */
    select?: CatFileExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatFileExtension
     */
    omit?: CatFileExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatFileExtensionInclude<ExtArgs> | null
    where?: CatFileExtensionWhereInput
  }

  /**
   * Files.relDesignsFiles
   */
  export type Files$relDesignsFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    where?: RelDesignsFilesWhereInput
    orderBy?: RelDesignsFilesOrderByWithRelationInput | RelDesignsFilesOrderByWithRelationInput[]
    cursor?: RelDesignsFilesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelDesignsFilesScalarFieldEnum | RelDesignsFilesScalarFieldEnum[]
  }

  /**
   * Files without action
   */
  export type FilesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
  }


  /**
   * Model RelDesignsCategories
   */

  export type AggregateRelDesignsCategories = {
    _count: RelDesignsCategoriesCountAggregateOutputType | null
    _avg: RelDesignsCategoriesAvgAggregateOutputType | null
    _sum: RelDesignsCategoriesSumAggregateOutputType | null
    _min: RelDesignsCategoriesMinAggregateOutputType | null
    _max: RelDesignsCategoriesMaxAggregateOutputType | null
  }

  export type RelDesignsCategoriesAvgAggregateOutputType = {
    id: number | null
    designId: number | null
    categoryId: number | null
    status: number | null
  }

  export type RelDesignsCategoriesSumAggregateOutputType = {
    id: number | null
    designId: number | null
    categoryId: number | null
    status: number | null
  }

  export type RelDesignsCategoriesMinAggregateOutputType = {
    id: number | null
    designId: number | null
    categoryId: number | null
    status: number | null
    createdAt: Date | null
  }

  export type RelDesignsCategoriesMaxAggregateOutputType = {
    id: number | null
    designId: number | null
    categoryId: number | null
    status: number | null
    createdAt: Date | null
  }

  export type RelDesignsCategoriesCountAggregateOutputType = {
    id: number
    designId: number
    categoryId: number
    status: number
    createdAt: number
    _all: number
  }


  export type RelDesignsCategoriesAvgAggregateInputType = {
    id?: true
    designId?: true
    categoryId?: true
    status?: true
  }

  export type RelDesignsCategoriesSumAggregateInputType = {
    id?: true
    designId?: true
    categoryId?: true
    status?: true
  }

  export type RelDesignsCategoriesMinAggregateInputType = {
    id?: true
    designId?: true
    categoryId?: true
    status?: true
    createdAt?: true
  }

  export type RelDesignsCategoriesMaxAggregateInputType = {
    id?: true
    designId?: true
    categoryId?: true
    status?: true
    createdAt?: true
  }

  export type RelDesignsCategoriesCountAggregateInputType = {
    id?: true
    designId?: true
    categoryId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type RelDesignsCategoriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelDesignsCategories to aggregate.
     */
    where?: RelDesignsCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsCategories to fetch.
     */
    orderBy?: RelDesignsCategoriesOrderByWithRelationInput | RelDesignsCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RelDesignsCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RelDesignsCategories
    **/
    _count?: true | RelDesignsCategoriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RelDesignsCategoriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RelDesignsCategoriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RelDesignsCategoriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RelDesignsCategoriesMaxAggregateInputType
  }

  export type GetRelDesignsCategoriesAggregateType<T extends RelDesignsCategoriesAggregateArgs> = {
        [P in keyof T & keyof AggregateRelDesignsCategories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRelDesignsCategories[P]>
      : GetScalarType<T[P], AggregateRelDesignsCategories[P]>
  }




  export type RelDesignsCategoriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsCategoriesWhereInput
    orderBy?: RelDesignsCategoriesOrderByWithAggregationInput | RelDesignsCategoriesOrderByWithAggregationInput[]
    by: RelDesignsCategoriesScalarFieldEnum[] | RelDesignsCategoriesScalarFieldEnum
    having?: RelDesignsCategoriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RelDesignsCategoriesCountAggregateInputType | true
    _avg?: RelDesignsCategoriesAvgAggregateInputType
    _sum?: RelDesignsCategoriesSumAggregateInputType
    _min?: RelDesignsCategoriesMinAggregateInputType
    _max?: RelDesignsCategoriesMaxAggregateInputType
  }

  export type RelDesignsCategoriesGroupByOutputType = {
    id: number
    designId: number | null
    categoryId: number | null
    status: number
    createdAt: Date
    _count: RelDesignsCategoriesCountAggregateOutputType | null
    _avg: RelDesignsCategoriesAvgAggregateOutputType | null
    _sum: RelDesignsCategoriesSumAggregateOutputType | null
    _min: RelDesignsCategoriesMinAggregateOutputType | null
    _max: RelDesignsCategoriesMaxAggregateOutputType | null
  }

  type GetRelDesignsCategoriesGroupByPayload<T extends RelDesignsCategoriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RelDesignsCategoriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RelDesignsCategoriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RelDesignsCategoriesGroupByOutputType[P]>
            : GetScalarType<T[P], RelDesignsCategoriesGroupByOutputType[P]>
        }
      >
    >


  export type RelDesignsCategoriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    categoryId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsCategories$designArgs<ExtArgs>
    category?: boolean | RelDesignsCategories$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsCategories"]>

  export type RelDesignsCategoriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    categoryId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsCategories$designArgs<ExtArgs>
    category?: boolean | RelDesignsCategories$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsCategories"]>

  export type RelDesignsCategoriesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    categoryId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsCategories$designArgs<ExtArgs>
    category?: boolean | RelDesignsCategories$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsCategories"]>

  export type RelDesignsCategoriesSelectScalar = {
    id?: boolean
    designId?: boolean
    categoryId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type RelDesignsCategoriesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "designId" | "categoryId" | "status" | "createdAt", ExtArgs["result"]["relDesignsCategories"]>
  export type RelDesignsCategoriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsCategories$designArgs<ExtArgs>
    category?: boolean | RelDesignsCategories$categoryArgs<ExtArgs>
  }
  export type RelDesignsCategoriesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsCategories$designArgs<ExtArgs>
    category?: boolean | RelDesignsCategories$categoryArgs<ExtArgs>
  }
  export type RelDesignsCategoriesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsCategories$designArgs<ExtArgs>
    category?: boolean | RelDesignsCategories$categoryArgs<ExtArgs>
  }

  export type $RelDesignsCategoriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RelDesignsCategories"
    objects: {
      design: Prisma.$DesignsPayload<ExtArgs> | null
      category: Prisma.$CatCategoriesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      designId: number | null
      categoryId: number | null
      status: number
      createdAt: Date
    }, ExtArgs["result"]["relDesignsCategories"]>
    composites: {}
  }

  type RelDesignsCategoriesGetPayload<S extends boolean | null | undefined | RelDesignsCategoriesDefaultArgs> = $Result.GetResult<Prisma.$RelDesignsCategoriesPayload, S>

  type RelDesignsCategoriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RelDesignsCategoriesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RelDesignsCategoriesCountAggregateInputType | true
    }

  export interface RelDesignsCategoriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RelDesignsCategories'], meta: { name: 'RelDesignsCategories' } }
    /**
     * Find zero or one RelDesignsCategories that matches the filter.
     * @param {RelDesignsCategoriesFindUniqueArgs} args - Arguments to find a RelDesignsCategories
     * @example
     * // Get one RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RelDesignsCategoriesFindUniqueArgs>(args: SelectSubset<T, RelDesignsCategoriesFindUniqueArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RelDesignsCategories that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RelDesignsCategoriesFindUniqueOrThrowArgs} args - Arguments to find a RelDesignsCategories
     * @example
     * // Get one RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RelDesignsCategoriesFindUniqueOrThrowArgs>(args: SelectSubset<T, RelDesignsCategoriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RelDesignsCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsCategoriesFindFirstArgs} args - Arguments to find a RelDesignsCategories
     * @example
     * // Get one RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RelDesignsCategoriesFindFirstArgs>(args?: SelectSubset<T, RelDesignsCategoriesFindFirstArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RelDesignsCategories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsCategoriesFindFirstOrThrowArgs} args - Arguments to find a RelDesignsCategories
     * @example
     * // Get one RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RelDesignsCategoriesFindFirstOrThrowArgs>(args?: SelectSubset<T, RelDesignsCategoriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RelDesignsCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsCategoriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.findMany()
     * 
     * // Get first 10 RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const relDesignsCategoriesWithIdOnly = await prisma.relDesignsCategories.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RelDesignsCategoriesFindManyArgs>(args?: SelectSubset<T, RelDesignsCategoriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RelDesignsCategories.
     * @param {RelDesignsCategoriesCreateArgs} args - Arguments to create a RelDesignsCategories.
     * @example
     * // Create one RelDesignsCategories
     * const RelDesignsCategories = await prisma.relDesignsCategories.create({
     *   data: {
     *     // ... data to create a RelDesignsCategories
     *   }
     * })
     * 
     */
    create<T extends RelDesignsCategoriesCreateArgs>(args: SelectSubset<T, RelDesignsCategoriesCreateArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RelDesignsCategories.
     * @param {RelDesignsCategoriesCreateManyArgs} args - Arguments to create many RelDesignsCategories.
     * @example
     * // Create many RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RelDesignsCategoriesCreateManyArgs>(args?: SelectSubset<T, RelDesignsCategoriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RelDesignsCategories and returns the data saved in the database.
     * @param {RelDesignsCategoriesCreateManyAndReturnArgs} args - Arguments to create many RelDesignsCategories.
     * @example
     * // Create many RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RelDesignsCategories and only return the `id`
     * const relDesignsCategoriesWithIdOnly = await prisma.relDesignsCategories.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RelDesignsCategoriesCreateManyAndReturnArgs>(args?: SelectSubset<T, RelDesignsCategoriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RelDesignsCategories.
     * @param {RelDesignsCategoriesDeleteArgs} args - Arguments to delete one RelDesignsCategories.
     * @example
     * // Delete one RelDesignsCategories
     * const RelDesignsCategories = await prisma.relDesignsCategories.delete({
     *   where: {
     *     // ... filter to delete one RelDesignsCategories
     *   }
     * })
     * 
     */
    delete<T extends RelDesignsCategoriesDeleteArgs>(args: SelectSubset<T, RelDesignsCategoriesDeleteArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RelDesignsCategories.
     * @param {RelDesignsCategoriesUpdateArgs} args - Arguments to update one RelDesignsCategories.
     * @example
     * // Update one RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RelDesignsCategoriesUpdateArgs>(args: SelectSubset<T, RelDesignsCategoriesUpdateArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RelDesignsCategories.
     * @param {RelDesignsCategoriesDeleteManyArgs} args - Arguments to filter RelDesignsCategories to delete.
     * @example
     * // Delete a few RelDesignsCategories
     * const { count } = await prisma.relDesignsCategories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RelDesignsCategoriesDeleteManyArgs>(args?: SelectSubset<T, RelDesignsCategoriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RelDesignsCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsCategoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RelDesignsCategoriesUpdateManyArgs>(args: SelectSubset<T, RelDesignsCategoriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RelDesignsCategories and returns the data updated in the database.
     * @param {RelDesignsCategoriesUpdateManyAndReturnArgs} args - Arguments to update many RelDesignsCategories.
     * @example
     * // Update many RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RelDesignsCategories and only return the `id`
     * const relDesignsCategoriesWithIdOnly = await prisma.relDesignsCategories.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RelDesignsCategoriesUpdateManyAndReturnArgs>(args: SelectSubset<T, RelDesignsCategoriesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RelDesignsCategories.
     * @param {RelDesignsCategoriesUpsertArgs} args - Arguments to update or create a RelDesignsCategories.
     * @example
     * // Update or create a RelDesignsCategories
     * const relDesignsCategories = await prisma.relDesignsCategories.upsert({
     *   create: {
     *     // ... data to create a RelDesignsCategories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RelDesignsCategories we want to update
     *   }
     * })
     */
    upsert<T extends RelDesignsCategoriesUpsertArgs>(args: SelectSubset<T, RelDesignsCategoriesUpsertArgs<ExtArgs>>): Prisma__RelDesignsCategoriesClient<$Result.GetResult<Prisma.$RelDesignsCategoriesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RelDesignsCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsCategoriesCountArgs} args - Arguments to filter RelDesignsCategories to count.
     * @example
     * // Count the number of RelDesignsCategories
     * const count = await prisma.relDesignsCategories.count({
     *   where: {
     *     // ... the filter for the RelDesignsCategories we want to count
     *   }
     * })
    **/
    count<T extends RelDesignsCategoriesCountArgs>(
      args?: Subset<T, RelDesignsCategoriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RelDesignsCategoriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RelDesignsCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsCategoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RelDesignsCategoriesAggregateArgs>(args: Subset<T, RelDesignsCategoriesAggregateArgs>): Prisma.PrismaPromise<GetRelDesignsCategoriesAggregateType<T>>

    /**
     * Group by RelDesignsCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsCategoriesGroupByArgs} args - Group by arguments.
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
      T extends RelDesignsCategoriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RelDesignsCategoriesGroupByArgs['orderBy'] }
        : { orderBy?: RelDesignsCategoriesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RelDesignsCategoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRelDesignsCategoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RelDesignsCategories model
   */
  readonly fields: RelDesignsCategoriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RelDesignsCategories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RelDesignsCategoriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    design<T extends RelDesignsCategories$designArgs<ExtArgs> = {}>(args?: Subset<T, RelDesignsCategories$designArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    category<T extends RelDesignsCategories$categoryArgs<ExtArgs> = {}>(args?: Subset<T, RelDesignsCategories$categoryArgs<ExtArgs>>): Prisma__CatCategoriesClient<$Result.GetResult<Prisma.$CatCategoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RelDesignsCategories model
   */
  interface RelDesignsCategoriesFieldRefs {
    readonly id: FieldRef<"RelDesignsCategories", 'Int'>
    readonly designId: FieldRef<"RelDesignsCategories", 'Int'>
    readonly categoryId: FieldRef<"RelDesignsCategories", 'Int'>
    readonly status: FieldRef<"RelDesignsCategories", 'Int'>
    readonly createdAt: FieldRef<"RelDesignsCategories", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RelDesignsCategories findUnique
   */
  export type RelDesignsCategoriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsCategories to fetch.
     */
    where: RelDesignsCategoriesWhereUniqueInput
  }

  /**
   * RelDesignsCategories findUniqueOrThrow
   */
  export type RelDesignsCategoriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsCategories to fetch.
     */
    where: RelDesignsCategoriesWhereUniqueInput
  }

  /**
   * RelDesignsCategories findFirst
   */
  export type RelDesignsCategoriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsCategories to fetch.
     */
    where?: RelDesignsCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsCategories to fetch.
     */
    orderBy?: RelDesignsCategoriesOrderByWithRelationInput | RelDesignsCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelDesignsCategories.
     */
    cursor?: RelDesignsCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsCategories.
     */
    distinct?: RelDesignsCategoriesScalarFieldEnum | RelDesignsCategoriesScalarFieldEnum[]
  }

  /**
   * RelDesignsCategories findFirstOrThrow
   */
  export type RelDesignsCategoriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsCategories to fetch.
     */
    where?: RelDesignsCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsCategories to fetch.
     */
    orderBy?: RelDesignsCategoriesOrderByWithRelationInput | RelDesignsCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelDesignsCategories.
     */
    cursor?: RelDesignsCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsCategories.
     */
    distinct?: RelDesignsCategoriesScalarFieldEnum | RelDesignsCategoriesScalarFieldEnum[]
  }

  /**
   * RelDesignsCategories findMany
   */
  export type RelDesignsCategoriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsCategories to fetch.
     */
    where?: RelDesignsCategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsCategories to fetch.
     */
    orderBy?: RelDesignsCategoriesOrderByWithRelationInput | RelDesignsCategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RelDesignsCategories.
     */
    cursor?: RelDesignsCategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsCategories.
     */
    distinct?: RelDesignsCategoriesScalarFieldEnum | RelDesignsCategoriesScalarFieldEnum[]
  }

  /**
   * RelDesignsCategories create
   */
  export type RelDesignsCategoriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * The data needed to create a RelDesignsCategories.
     */
    data?: XOR<RelDesignsCategoriesCreateInput, RelDesignsCategoriesUncheckedCreateInput>
  }

  /**
   * RelDesignsCategories createMany
   */
  export type RelDesignsCategoriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RelDesignsCategories.
     */
    data: RelDesignsCategoriesCreateManyInput | RelDesignsCategoriesCreateManyInput[]
  }

  /**
   * RelDesignsCategories createManyAndReturn
   */
  export type RelDesignsCategoriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * The data used to create many RelDesignsCategories.
     */
    data: RelDesignsCategoriesCreateManyInput | RelDesignsCategoriesCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RelDesignsCategories update
   */
  export type RelDesignsCategoriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * The data needed to update a RelDesignsCategories.
     */
    data: XOR<RelDesignsCategoriesUpdateInput, RelDesignsCategoriesUncheckedUpdateInput>
    /**
     * Choose, which RelDesignsCategories to update.
     */
    where: RelDesignsCategoriesWhereUniqueInput
  }

  /**
   * RelDesignsCategories updateMany
   */
  export type RelDesignsCategoriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RelDesignsCategories.
     */
    data: XOR<RelDesignsCategoriesUpdateManyMutationInput, RelDesignsCategoriesUncheckedUpdateManyInput>
    /**
     * Filter which RelDesignsCategories to update
     */
    where?: RelDesignsCategoriesWhereInput
    /**
     * Limit how many RelDesignsCategories to update.
     */
    limit?: number
  }

  /**
   * RelDesignsCategories updateManyAndReturn
   */
  export type RelDesignsCategoriesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * The data used to update RelDesignsCategories.
     */
    data: XOR<RelDesignsCategoriesUpdateManyMutationInput, RelDesignsCategoriesUncheckedUpdateManyInput>
    /**
     * Filter which RelDesignsCategories to update
     */
    where?: RelDesignsCategoriesWhereInput
    /**
     * Limit how many RelDesignsCategories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RelDesignsCategories upsert
   */
  export type RelDesignsCategoriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * The filter to search for the RelDesignsCategories to update in case it exists.
     */
    where: RelDesignsCategoriesWhereUniqueInput
    /**
     * In case the RelDesignsCategories found by the `where` argument doesn't exist, create a new RelDesignsCategories with this data.
     */
    create: XOR<RelDesignsCategoriesCreateInput, RelDesignsCategoriesUncheckedCreateInput>
    /**
     * In case the RelDesignsCategories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RelDesignsCategoriesUpdateInput, RelDesignsCategoriesUncheckedUpdateInput>
  }

  /**
   * RelDesignsCategories delete
   */
  export type RelDesignsCategoriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
    /**
     * Filter which RelDesignsCategories to delete.
     */
    where: RelDesignsCategoriesWhereUniqueInput
  }

  /**
   * RelDesignsCategories deleteMany
   */
  export type RelDesignsCategoriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelDesignsCategories to delete
     */
    where?: RelDesignsCategoriesWhereInput
    /**
     * Limit how many RelDesignsCategories to delete.
     */
    limit?: number
  }

  /**
   * RelDesignsCategories.design
   */
  export type RelDesignsCategories$designArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    where?: DesignsWhereInput
  }

  /**
   * RelDesignsCategories.category
   */
  export type RelDesignsCategories$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatCategories
     */
    select?: CatCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatCategories
     */
    omit?: CatCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatCategoriesInclude<ExtArgs> | null
    where?: CatCategoriesWhereInput
  }

  /**
   * RelDesignsCategories without action
   */
  export type RelDesignsCategoriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsCategories
     */
    select?: RelDesignsCategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsCategories
     */
    omit?: RelDesignsCategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsCategoriesInclude<ExtArgs> | null
  }


  /**
   * Model RelDesignsFiles
   */

  export type AggregateRelDesignsFiles = {
    _count: RelDesignsFilesCountAggregateOutputType | null
    _avg: RelDesignsFilesAvgAggregateOutputType | null
    _sum: RelDesignsFilesSumAggregateOutputType | null
    _min: RelDesignsFilesMinAggregateOutputType | null
    _max: RelDesignsFilesMaxAggregateOutputType | null
  }

  export type RelDesignsFilesAvgAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
  }

  export type RelDesignsFilesSumAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
  }

  export type RelDesignsFilesMinAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
    createdAt: Date | null
  }

  export type RelDesignsFilesMaxAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
    createdAt: Date | null
  }

  export type RelDesignsFilesCountAggregateOutputType = {
    id: number
    designId: number
    typeId: number
    status: number
    createdAt: number
    _all: number
  }


  export type RelDesignsFilesAvgAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
  }

  export type RelDesignsFilesSumAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
  }

  export type RelDesignsFilesMinAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
    createdAt?: true
  }

  export type RelDesignsFilesMaxAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
    createdAt?: true
  }

  export type RelDesignsFilesCountAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type RelDesignsFilesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelDesignsFiles to aggregate.
     */
    where?: RelDesignsFilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsFiles to fetch.
     */
    orderBy?: RelDesignsFilesOrderByWithRelationInput | RelDesignsFilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RelDesignsFilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RelDesignsFiles
    **/
    _count?: true | RelDesignsFilesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RelDesignsFilesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RelDesignsFilesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RelDesignsFilesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RelDesignsFilesMaxAggregateInputType
  }

  export type GetRelDesignsFilesAggregateType<T extends RelDesignsFilesAggregateArgs> = {
        [P in keyof T & keyof AggregateRelDesignsFiles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRelDesignsFiles[P]>
      : GetScalarType<T[P], AggregateRelDesignsFiles[P]>
  }




  export type RelDesignsFilesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsFilesWhereInput
    orderBy?: RelDesignsFilesOrderByWithAggregationInput | RelDesignsFilesOrderByWithAggregationInput[]
    by: RelDesignsFilesScalarFieldEnum[] | RelDesignsFilesScalarFieldEnum
    having?: RelDesignsFilesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RelDesignsFilesCountAggregateInputType | true
    _avg?: RelDesignsFilesAvgAggregateInputType
    _sum?: RelDesignsFilesSumAggregateInputType
    _min?: RelDesignsFilesMinAggregateInputType
    _max?: RelDesignsFilesMaxAggregateInputType
  }

  export type RelDesignsFilesGroupByOutputType = {
    id: number
    designId: number | null
    typeId: number | null
    status: number
    createdAt: Date
    _count: RelDesignsFilesCountAggregateOutputType | null
    _avg: RelDesignsFilesAvgAggregateOutputType | null
    _sum: RelDesignsFilesSumAggregateOutputType | null
    _min: RelDesignsFilesMinAggregateOutputType | null
    _max: RelDesignsFilesMaxAggregateOutputType | null
  }

  type GetRelDesignsFilesGroupByPayload<T extends RelDesignsFilesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RelDesignsFilesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RelDesignsFilesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RelDesignsFilesGroupByOutputType[P]>
            : GetScalarType<T[P], RelDesignsFilesGroupByOutputType[P]>
        }
      >
    >


  export type RelDesignsFilesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsFiles$designArgs<ExtArgs>
    file?: boolean | RelDesignsFiles$fileArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsFiles"]>

  export type RelDesignsFilesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsFiles$designArgs<ExtArgs>
    file?: boolean | RelDesignsFiles$fileArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsFiles"]>

  export type RelDesignsFilesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsFiles$designArgs<ExtArgs>
    file?: boolean | RelDesignsFiles$fileArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsFiles"]>

  export type RelDesignsFilesSelectScalar = {
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type RelDesignsFilesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "designId" | "typeId" | "status" | "createdAt", ExtArgs["result"]["relDesignsFiles"]>
  export type RelDesignsFilesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsFiles$designArgs<ExtArgs>
    file?: boolean | RelDesignsFiles$fileArgs<ExtArgs>
  }
  export type RelDesignsFilesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsFiles$designArgs<ExtArgs>
    file?: boolean | RelDesignsFiles$fileArgs<ExtArgs>
  }
  export type RelDesignsFilesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsFiles$designArgs<ExtArgs>
    file?: boolean | RelDesignsFiles$fileArgs<ExtArgs>
  }

  export type $RelDesignsFilesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RelDesignsFiles"
    objects: {
      design: Prisma.$DesignsPayload<ExtArgs> | null
      file: Prisma.$FilesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      designId: number | null
      typeId: number | null
      status: number
      createdAt: Date
    }, ExtArgs["result"]["relDesignsFiles"]>
    composites: {}
  }

  type RelDesignsFilesGetPayload<S extends boolean | null | undefined | RelDesignsFilesDefaultArgs> = $Result.GetResult<Prisma.$RelDesignsFilesPayload, S>

  type RelDesignsFilesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RelDesignsFilesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RelDesignsFilesCountAggregateInputType | true
    }

  export interface RelDesignsFilesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RelDesignsFiles'], meta: { name: 'RelDesignsFiles' } }
    /**
     * Find zero or one RelDesignsFiles that matches the filter.
     * @param {RelDesignsFilesFindUniqueArgs} args - Arguments to find a RelDesignsFiles
     * @example
     * // Get one RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RelDesignsFilesFindUniqueArgs>(args: SelectSubset<T, RelDesignsFilesFindUniqueArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RelDesignsFiles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RelDesignsFilesFindUniqueOrThrowArgs} args - Arguments to find a RelDesignsFiles
     * @example
     * // Get one RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RelDesignsFilesFindUniqueOrThrowArgs>(args: SelectSubset<T, RelDesignsFilesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RelDesignsFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsFilesFindFirstArgs} args - Arguments to find a RelDesignsFiles
     * @example
     * // Get one RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RelDesignsFilesFindFirstArgs>(args?: SelectSubset<T, RelDesignsFilesFindFirstArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RelDesignsFiles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsFilesFindFirstOrThrowArgs} args - Arguments to find a RelDesignsFiles
     * @example
     * // Get one RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RelDesignsFilesFindFirstOrThrowArgs>(args?: SelectSubset<T, RelDesignsFilesFindFirstOrThrowArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RelDesignsFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsFilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.findMany()
     * 
     * // Get first 10 RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const relDesignsFilesWithIdOnly = await prisma.relDesignsFiles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RelDesignsFilesFindManyArgs>(args?: SelectSubset<T, RelDesignsFilesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RelDesignsFiles.
     * @param {RelDesignsFilesCreateArgs} args - Arguments to create a RelDesignsFiles.
     * @example
     * // Create one RelDesignsFiles
     * const RelDesignsFiles = await prisma.relDesignsFiles.create({
     *   data: {
     *     // ... data to create a RelDesignsFiles
     *   }
     * })
     * 
     */
    create<T extends RelDesignsFilesCreateArgs>(args: SelectSubset<T, RelDesignsFilesCreateArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RelDesignsFiles.
     * @param {RelDesignsFilesCreateManyArgs} args - Arguments to create many RelDesignsFiles.
     * @example
     * // Create many RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RelDesignsFilesCreateManyArgs>(args?: SelectSubset<T, RelDesignsFilesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RelDesignsFiles and returns the data saved in the database.
     * @param {RelDesignsFilesCreateManyAndReturnArgs} args - Arguments to create many RelDesignsFiles.
     * @example
     * // Create many RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RelDesignsFiles and only return the `id`
     * const relDesignsFilesWithIdOnly = await prisma.relDesignsFiles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RelDesignsFilesCreateManyAndReturnArgs>(args?: SelectSubset<T, RelDesignsFilesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RelDesignsFiles.
     * @param {RelDesignsFilesDeleteArgs} args - Arguments to delete one RelDesignsFiles.
     * @example
     * // Delete one RelDesignsFiles
     * const RelDesignsFiles = await prisma.relDesignsFiles.delete({
     *   where: {
     *     // ... filter to delete one RelDesignsFiles
     *   }
     * })
     * 
     */
    delete<T extends RelDesignsFilesDeleteArgs>(args: SelectSubset<T, RelDesignsFilesDeleteArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RelDesignsFiles.
     * @param {RelDesignsFilesUpdateArgs} args - Arguments to update one RelDesignsFiles.
     * @example
     * // Update one RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RelDesignsFilesUpdateArgs>(args: SelectSubset<T, RelDesignsFilesUpdateArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RelDesignsFiles.
     * @param {RelDesignsFilesDeleteManyArgs} args - Arguments to filter RelDesignsFiles to delete.
     * @example
     * // Delete a few RelDesignsFiles
     * const { count } = await prisma.relDesignsFiles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RelDesignsFilesDeleteManyArgs>(args?: SelectSubset<T, RelDesignsFilesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RelDesignsFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsFilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RelDesignsFilesUpdateManyArgs>(args: SelectSubset<T, RelDesignsFilesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RelDesignsFiles and returns the data updated in the database.
     * @param {RelDesignsFilesUpdateManyAndReturnArgs} args - Arguments to update many RelDesignsFiles.
     * @example
     * // Update many RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RelDesignsFiles and only return the `id`
     * const relDesignsFilesWithIdOnly = await prisma.relDesignsFiles.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RelDesignsFilesUpdateManyAndReturnArgs>(args: SelectSubset<T, RelDesignsFilesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RelDesignsFiles.
     * @param {RelDesignsFilesUpsertArgs} args - Arguments to update or create a RelDesignsFiles.
     * @example
     * // Update or create a RelDesignsFiles
     * const relDesignsFiles = await prisma.relDesignsFiles.upsert({
     *   create: {
     *     // ... data to create a RelDesignsFiles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RelDesignsFiles we want to update
     *   }
     * })
     */
    upsert<T extends RelDesignsFilesUpsertArgs>(args: SelectSubset<T, RelDesignsFilesUpsertArgs<ExtArgs>>): Prisma__RelDesignsFilesClient<$Result.GetResult<Prisma.$RelDesignsFilesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RelDesignsFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsFilesCountArgs} args - Arguments to filter RelDesignsFiles to count.
     * @example
     * // Count the number of RelDesignsFiles
     * const count = await prisma.relDesignsFiles.count({
     *   where: {
     *     // ... the filter for the RelDesignsFiles we want to count
     *   }
     * })
    **/
    count<T extends RelDesignsFilesCountArgs>(
      args?: Subset<T, RelDesignsFilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RelDesignsFilesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RelDesignsFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsFilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RelDesignsFilesAggregateArgs>(args: Subset<T, RelDesignsFilesAggregateArgs>): Prisma.PrismaPromise<GetRelDesignsFilesAggregateType<T>>

    /**
     * Group by RelDesignsFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsFilesGroupByArgs} args - Group by arguments.
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
      T extends RelDesignsFilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RelDesignsFilesGroupByArgs['orderBy'] }
        : { orderBy?: RelDesignsFilesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RelDesignsFilesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRelDesignsFilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RelDesignsFiles model
   */
  readonly fields: RelDesignsFilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RelDesignsFiles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RelDesignsFilesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    design<T extends RelDesignsFiles$designArgs<ExtArgs> = {}>(args?: Subset<T, RelDesignsFiles$designArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    file<T extends RelDesignsFiles$fileArgs<ExtArgs> = {}>(args?: Subset<T, RelDesignsFiles$fileArgs<ExtArgs>>): Prisma__FilesClient<$Result.GetResult<Prisma.$FilesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RelDesignsFiles model
   */
  interface RelDesignsFilesFieldRefs {
    readonly id: FieldRef<"RelDesignsFiles", 'Int'>
    readonly designId: FieldRef<"RelDesignsFiles", 'Int'>
    readonly typeId: FieldRef<"RelDesignsFiles", 'Int'>
    readonly status: FieldRef<"RelDesignsFiles", 'Int'>
    readonly createdAt: FieldRef<"RelDesignsFiles", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RelDesignsFiles findUnique
   */
  export type RelDesignsFilesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsFiles to fetch.
     */
    where: RelDesignsFilesWhereUniqueInput
  }

  /**
   * RelDesignsFiles findUniqueOrThrow
   */
  export type RelDesignsFilesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsFiles to fetch.
     */
    where: RelDesignsFilesWhereUniqueInput
  }

  /**
   * RelDesignsFiles findFirst
   */
  export type RelDesignsFilesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsFiles to fetch.
     */
    where?: RelDesignsFilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsFiles to fetch.
     */
    orderBy?: RelDesignsFilesOrderByWithRelationInput | RelDesignsFilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelDesignsFiles.
     */
    cursor?: RelDesignsFilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsFiles.
     */
    distinct?: RelDesignsFilesScalarFieldEnum | RelDesignsFilesScalarFieldEnum[]
  }

  /**
   * RelDesignsFiles findFirstOrThrow
   */
  export type RelDesignsFilesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsFiles to fetch.
     */
    where?: RelDesignsFilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsFiles to fetch.
     */
    orderBy?: RelDesignsFilesOrderByWithRelationInput | RelDesignsFilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelDesignsFiles.
     */
    cursor?: RelDesignsFilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsFiles.
     */
    distinct?: RelDesignsFilesScalarFieldEnum | RelDesignsFilesScalarFieldEnum[]
  }

  /**
   * RelDesignsFiles findMany
   */
  export type RelDesignsFilesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsFiles to fetch.
     */
    where?: RelDesignsFilesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsFiles to fetch.
     */
    orderBy?: RelDesignsFilesOrderByWithRelationInput | RelDesignsFilesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RelDesignsFiles.
     */
    cursor?: RelDesignsFilesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsFiles.
     */
    distinct?: RelDesignsFilesScalarFieldEnum | RelDesignsFilesScalarFieldEnum[]
  }

  /**
   * RelDesignsFiles create
   */
  export type RelDesignsFilesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * The data needed to create a RelDesignsFiles.
     */
    data?: XOR<RelDesignsFilesCreateInput, RelDesignsFilesUncheckedCreateInput>
  }

  /**
   * RelDesignsFiles createMany
   */
  export type RelDesignsFilesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RelDesignsFiles.
     */
    data: RelDesignsFilesCreateManyInput | RelDesignsFilesCreateManyInput[]
  }

  /**
   * RelDesignsFiles createManyAndReturn
   */
  export type RelDesignsFilesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * The data used to create many RelDesignsFiles.
     */
    data: RelDesignsFilesCreateManyInput | RelDesignsFilesCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RelDesignsFiles update
   */
  export type RelDesignsFilesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * The data needed to update a RelDesignsFiles.
     */
    data: XOR<RelDesignsFilesUpdateInput, RelDesignsFilesUncheckedUpdateInput>
    /**
     * Choose, which RelDesignsFiles to update.
     */
    where: RelDesignsFilesWhereUniqueInput
  }

  /**
   * RelDesignsFiles updateMany
   */
  export type RelDesignsFilesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RelDesignsFiles.
     */
    data: XOR<RelDesignsFilesUpdateManyMutationInput, RelDesignsFilesUncheckedUpdateManyInput>
    /**
     * Filter which RelDesignsFiles to update
     */
    where?: RelDesignsFilesWhereInput
    /**
     * Limit how many RelDesignsFiles to update.
     */
    limit?: number
  }

  /**
   * RelDesignsFiles updateManyAndReturn
   */
  export type RelDesignsFilesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * The data used to update RelDesignsFiles.
     */
    data: XOR<RelDesignsFilesUpdateManyMutationInput, RelDesignsFilesUncheckedUpdateManyInput>
    /**
     * Filter which RelDesignsFiles to update
     */
    where?: RelDesignsFilesWhereInput
    /**
     * Limit how many RelDesignsFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RelDesignsFiles upsert
   */
  export type RelDesignsFilesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * The filter to search for the RelDesignsFiles to update in case it exists.
     */
    where: RelDesignsFilesWhereUniqueInput
    /**
     * In case the RelDesignsFiles found by the `where` argument doesn't exist, create a new RelDesignsFiles with this data.
     */
    create: XOR<RelDesignsFilesCreateInput, RelDesignsFilesUncheckedCreateInput>
    /**
     * In case the RelDesignsFiles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RelDesignsFilesUpdateInput, RelDesignsFilesUncheckedUpdateInput>
  }

  /**
   * RelDesignsFiles delete
   */
  export type RelDesignsFilesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
    /**
     * Filter which RelDesignsFiles to delete.
     */
    where: RelDesignsFilesWhereUniqueInput
  }

  /**
   * RelDesignsFiles deleteMany
   */
  export type RelDesignsFilesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelDesignsFiles to delete
     */
    where?: RelDesignsFilesWhereInput
    /**
     * Limit how many RelDesignsFiles to delete.
     */
    limit?: number
  }

  /**
   * RelDesignsFiles.design
   */
  export type RelDesignsFiles$designArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    where?: DesignsWhereInput
  }

  /**
   * RelDesignsFiles.file
   */
  export type RelDesignsFiles$fileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Files
     */
    select?: FilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Files
     */
    omit?: FilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FilesInclude<ExtArgs> | null
    where?: FilesWhereInput
  }

  /**
   * RelDesignsFiles without action
   */
  export type RelDesignsFilesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsFiles
     */
    select?: RelDesignsFilesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsFiles
     */
    omit?: RelDesignsFilesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsFilesInclude<ExtArgs> | null
  }


  /**
   * Model RelDesignsTypes
   */

  export type AggregateRelDesignsTypes = {
    _count: RelDesignsTypesCountAggregateOutputType | null
    _avg: RelDesignsTypesAvgAggregateOutputType | null
    _sum: RelDesignsTypesSumAggregateOutputType | null
    _min: RelDesignsTypesMinAggregateOutputType | null
    _max: RelDesignsTypesMaxAggregateOutputType | null
  }

  export type RelDesignsTypesAvgAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
  }

  export type RelDesignsTypesSumAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
  }

  export type RelDesignsTypesMinAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
    createdAt: Date | null
  }

  export type RelDesignsTypesMaxAggregateOutputType = {
    id: number | null
    designId: number | null
    typeId: number | null
    status: number | null
    createdAt: Date | null
  }

  export type RelDesignsTypesCountAggregateOutputType = {
    id: number
    designId: number
    typeId: number
    status: number
    createdAt: number
    _all: number
  }


  export type RelDesignsTypesAvgAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
  }

  export type RelDesignsTypesSumAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
  }

  export type RelDesignsTypesMinAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
    createdAt?: true
  }

  export type RelDesignsTypesMaxAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
    createdAt?: true
  }

  export type RelDesignsTypesCountAggregateInputType = {
    id?: true
    designId?: true
    typeId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type RelDesignsTypesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelDesignsTypes to aggregate.
     */
    where?: RelDesignsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsTypes to fetch.
     */
    orderBy?: RelDesignsTypesOrderByWithRelationInput | RelDesignsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RelDesignsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RelDesignsTypes
    **/
    _count?: true | RelDesignsTypesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RelDesignsTypesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RelDesignsTypesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RelDesignsTypesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RelDesignsTypesMaxAggregateInputType
  }

  export type GetRelDesignsTypesAggregateType<T extends RelDesignsTypesAggregateArgs> = {
        [P in keyof T & keyof AggregateRelDesignsTypes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRelDesignsTypes[P]>
      : GetScalarType<T[P], AggregateRelDesignsTypes[P]>
  }




  export type RelDesignsTypesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelDesignsTypesWhereInput
    orderBy?: RelDesignsTypesOrderByWithAggregationInput | RelDesignsTypesOrderByWithAggregationInput[]
    by: RelDesignsTypesScalarFieldEnum[] | RelDesignsTypesScalarFieldEnum
    having?: RelDesignsTypesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RelDesignsTypesCountAggregateInputType | true
    _avg?: RelDesignsTypesAvgAggregateInputType
    _sum?: RelDesignsTypesSumAggregateInputType
    _min?: RelDesignsTypesMinAggregateInputType
    _max?: RelDesignsTypesMaxAggregateInputType
  }

  export type RelDesignsTypesGroupByOutputType = {
    id: number
    designId: number | null
    typeId: number | null
    status: number
    createdAt: Date
    _count: RelDesignsTypesCountAggregateOutputType | null
    _avg: RelDesignsTypesAvgAggregateOutputType | null
    _sum: RelDesignsTypesSumAggregateOutputType | null
    _min: RelDesignsTypesMinAggregateOutputType | null
    _max: RelDesignsTypesMaxAggregateOutputType | null
  }

  type GetRelDesignsTypesGroupByPayload<T extends RelDesignsTypesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RelDesignsTypesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RelDesignsTypesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RelDesignsTypesGroupByOutputType[P]>
            : GetScalarType<T[P], RelDesignsTypesGroupByOutputType[P]>
        }
      >
    >


  export type RelDesignsTypesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsTypes$designArgs<ExtArgs>
    designType?: boolean | RelDesignsTypes$designTypeArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsTypes"]>

  export type RelDesignsTypesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsTypes$designArgs<ExtArgs>
    designType?: boolean | RelDesignsTypes$designTypeArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsTypes"]>

  export type RelDesignsTypesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
    design?: boolean | RelDesignsTypes$designArgs<ExtArgs>
    designType?: boolean | RelDesignsTypes$designTypeArgs<ExtArgs>
  }, ExtArgs["result"]["relDesignsTypes"]>

  export type RelDesignsTypesSelectScalar = {
    id?: boolean
    designId?: boolean
    typeId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type RelDesignsTypesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "designId" | "typeId" | "status" | "createdAt", ExtArgs["result"]["relDesignsTypes"]>
  export type RelDesignsTypesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsTypes$designArgs<ExtArgs>
    designType?: boolean | RelDesignsTypes$designTypeArgs<ExtArgs>
  }
  export type RelDesignsTypesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsTypes$designArgs<ExtArgs>
    designType?: boolean | RelDesignsTypes$designTypeArgs<ExtArgs>
  }
  export type RelDesignsTypesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    design?: boolean | RelDesignsTypes$designArgs<ExtArgs>
    designType?: boolean | RelDesignsTypes$designTypeArgs<ExtArgs>
  }

  export type $RelDesignsTypesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RelDesignsTypes"
    objects: {
      design: Prisma.$DesignsPayload<ExtArgs> | null
      designType: Prisma.$CatDesignsTypePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      designId: number | null
      typeId: number | null
      status: number
      createdAt: Date
    }, ExtArgs["result"]["relDesignsTypes"]>
    composites: {}
  }

  type RelDesignsTypesGetPayload<S extends boolean | null | undefined | RelDesignsTypesDefaultArgs> = $Result.GetResult<Prisma.$RelDesignsTypesPayload, S>

  type RelDesignsTypesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RelDesignsTypesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RelDesignsTypesCountAggregateInputType | true
    }

  export interface RelDesignsTypesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RelDesignsTypes'], meta: { name: 'RelDesignsTypes' } }
    /**
     * Find zero or one RelDesignsTypes that matches the filter.
     * @param {RelDesignsTypesFindUniqueArgs} args - Arguments to find a RelDesignsTypes
     * @example
     * // Get one RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RelDesignsTypesFindUniqueArgs>(args: SelectSubset<T, RelDesignsTypesFindUniqueArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RelDesignsTypes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RelDesignsTypesFindUniqueOrThrowArgs} args - Arguments to find a RelDesignsTypes
     * @example
     * // Get one RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RelDesignsTypesFindUniqueOrThrowArgs>(args: SelectSubset<T, RelDesignsTypesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RelDesignsTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsTypesFindFirstArgs} args - Arguments to find a RelDesignsTypes
     * @example
     * // Get one RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RelDesignsTypesFindFirstArgs>(args?: SelectSubset<T, RelDesignsTypesFindFirstArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RelDesignsTypes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsTypesFindFirstOrThrowArgs} args - Arguments to find a RelDesignsTypes
     * @example
     * // Get one RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RelDesignsTypesFindFirstOrThrowArgs>(args?: SelectSubset<T, RelDesignsTypesFindFirstOrThrowArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RelDesignsTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsTypesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.findMany()
     * 
     * // Get first 10 RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const relDesignsTypesWithIdOnly = await prisma.relDesignsTypes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RelDesignsTypesFindManyArgs>(args?: SelectSubset<T, RelDesignsTypesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RelDesignsTypes.
     * @param {RelDesignsTypesCreateArgs} args - Arguments to create a RelDesignsTypes.
     * @example
     * // Create one RelDesignsTypes
     * const RelDesignsTypes = await prisma.relDesignsTypes.create({
     *   data: {
     *     // ... data to create a RelDesignsTypes
     *   }
     * })
     * 
     */
    create<T extends RelDesignsTypesCreateArgs>(args: SelectSubset<T, RelDesignsTypesCreateArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RelDesignsTypes.
     * @param {RelDesignsTypesCreateManyArgs} args - Arguments to create many RelDesignsTypes.
     * @example
     * // Create many RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RelDesignsTypesCreateManyArgs>(args?: SelectSubset<T, RelDesignsTypesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RelDesignsTypes and returns the data saved in the database.
     * @param {RelDesignsTypesCreateManyAndReturnArgs} args - Arguments to create many RelDesignsTypes.
     * @example
     * // Create many RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RelDesignsTypes and only return the `id`
     * const relDesignsTypesWithIdOnly = await prisma.relDesignsTypes.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RelDesignsTypesCreateManyAndReturnArgs>(args?: SelectSubset<T, RelDesignsTypesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RelDesignsTypes.
     * @param {RelDesignsTypesDeleteArgs} args - Arguments to delete one RelDesignsTypes.
     * @example
     * // Delete one RelDesignsTypes
     * const RelDesignsTypes = await prisma.relDesignsTypes.delete({
     *   where: {
     *     // ... filter to delete one RelDesignsTypes
     *   }
     * })
     * 
     */
    delete<T extends RelDesignsTypesDeleteArgs>(args: SelectSubset<T, RelDesignsTypesDeleteArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RelDesignsTypes.
     * @param {RelDesignsTypesUpdateArgs} args - Arguments to update one RelDesignsTypes.
     * @example
     * // Update one RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RelDesignsTypesUpdateArgs>(args: SelectSubset<T, RelDesignsTypesUpdateArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RelDesignsTypes.
     * @param {RelDesignsTypesDeleteManyArgs} args - Arguments to filter RelDesignsTypes to delete.
     * @example
     * // Delete a few RelDesignsTypes
     * const { count } = await prisma.relDesignsTypes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RelDesignsTypesDeleteManyArgs>(args?: SelectSubset<T, RelDesignsTypesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RelDesignsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsTypesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RelDesignsTypesUpdateManyArgs>(args: SelectSubset<T, RelDesignsTypesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RelDesignsTypes and returns the data updated in the database.
     * @param {RelDesignsTypesUpdateManyAndReturnArgs} args - Arguments to update many RelDesignsTypes.
     * @example
     * // Update many RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RelDesignsTypes and only return the `id`
     * const relDesignsTypesWithIdOnly = await prisma.relDesignsTypes.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RelDesignsTypesUpdateManyAndReturnArgs>(args: SelectSubset<T, RelDesignsTypesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RelDesignsTypes.
     * @param {RelDesignsTypesUpsertArgs} args - Arguments to update or create a RelDesignsTypes.
     * @example
     * // Update or create a RelDesignsTypes
     * const relDesignsTypes = await prisma.relDesignsTypes.upsert({
     *   create: {
     *     // ... data to create a RelDesignsTypes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RelDesignsTypes we want to update
     *   }
     * })
     */
    upsert<T extends RelDesignsTypesUpsertArgs>(args: SelectSubset<T, RelDesignsTypesUpsertArgs<ExtArgs>>): Prisma__RelDesignsTypesClient<$Result.GetResult<Prisma.$RelDesignsTypesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RelDesignsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsTypesCountArgs} args - Arguments to filter RelDesignsTypes to count.
     * @example
     * // Count the number of RelDesignsTypes
     * const count = await prisma.relDesignsTypes.count({
     *   where: {
     *     // ... the filter for the RelDesignsTypes we want to count
     *   }
     * })
    **/
    count<T extends RelDesignsTypesCountArgs>(
      args?: Subset<T, RelDesignsTypesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RelDesignsTypesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RelDesignsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsTypesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RelDesignsTypesAggregateArgs>(args: Subset<T, RelDesignsTypesAggregateArgs>): Prisma.PrismaPromise<GetRelDesignsTypesAggregateType<T>>

    /**
     * Group by RelDesignsTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelDesignsTypesGroupByArgs} args - Group by arguments.
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
      T extends RelDesignsTypesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RelDesignsTypesGroupByArgs['orderBy'] }
        : { orderBy?: RelDesignsTypesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RelDesignsTypesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRelDesignsTypesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RelDesignsTypes model
   */
  readonly fields: RelDesignsTypesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RelDesignsTypes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RelDesignsTypesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    design<T extends RelDesignsTypes$designArgs<ExtArgs> = {}>(args?: Subset<T, RelDesignsTypes$designArgs<ExtArgs>>): Prisma__DesignsClient<$Result.GetResult<Prisma.$DesignsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    designType<T extends RelDesignsTypes$designTypeArgs<ExtArgs> = {}>(args?: Subset<T, RelDesignsTypes$designTypeArgs<ExtArgs>>): Prisma__CatDesignsTypeClient<$Result.GetResult<Prisma.$CatDesignsTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RelDesignsTypes model
   */
  interface RelDesignsTypesFieldRefs {
    readonly id: FieldRef<"RelDesignsTypes", 'Int'>
    readonly designId: FieldRef<"RelDesignsTypes", 'Int'>
    readonly typeId: FieldRef<"RelDesignsTypes", 'Int'>
    readonly status: FieldRef<"RelDesignsTypes", 'Int'>
    readonly createdAt: FieldRef<"RelDesignsTypes", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RelDesignsTypes findUnique
   */
  export type RelDesignsTypesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsTypes to fetch.
     */
    where: RelDesignsTypesWhereUniqueInput
  }

  /**
   * RelDesignsTypes findUniqueOrThrow
   */
  export type RelDesignsTypesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsTypes to fetch.
     */
    where: RelDesignsTypesWhereUniqueInput
  }

  /**
   * RelDesignsTypes findFirst
   */
  export type RelDesignsTypesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsTypes to fetch.
     */
    where?: RelDesignsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsTypes to fetch.
     */
    orderBy?: RelDesignsTypesOrderByWithRelationInput | RelDesignsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelDesignsTypes.
     */
    cursor?: RelDesignsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsTypes.
     */
    distinct?: RelDesignsTypesScalarFieldEnum | RelDesignsTypesScalarFieldEnum[]
  }

  /**
   * RelDesignsTypes findFirstOrThrow
   */
  export type RelDesignsTypesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsTypes to fetch.
     */
    where?: RelDesignsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsTypes to fetch.
     */
    orderBy?: RelDesignsTypesOrderByWithRelationInput | RelDesignsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelDesignsTypes.
     */
    cursor?: RelDesignsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsTypes.
     */
    distinct?: RelDesignsTypesScalarFieldEnum | RelDesignsTypesScalarFieldEnum[]
  }

  /**
   * RelDesignsTypes findMany
   */
  export type RelDesignsTypesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * Filter, which RelDesignsTypes to fetch.
     */
    where?: RelDesignsTypesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelDesignsTypes to fetch.
     */
    orderBy?: RelDesignsTypesOrderByWithRelationInput | RelDesignsTypesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RelDesignsTypes.
     */
    cursor?: RelDesignsTypesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelDesignsTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelDesignsTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelDesignsTypes.
     */
    distinct?: RelDesignsTypesScalarFieldEnum | RelDesignsTypesScalarFieldEnum[]
  }

  /**
   * RelDesignsTypes create
   */
  export type RelDesignsTypesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * The data needed to create a RelDesignsTypes.
     */
    data?: XOR<RelDesignsTypesCreateInput, RelDesignsTypesUncheckedCreateInput>
  }

  /**
   * RelDesignsTypes createMany
   */
  export type RelDesignsTypesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RelDesignsTypes.
     */
    data: RelDesignsTypesCreateManyInput | RelDesignsTypesCreateManyInput[]
  }

  /**
   * RelDesignsTypes createManyAndReturn
   */
  export type RelDesignsTypesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * The data used to create many RelDesignsTypes.
     */
    data: RelDesignsTypesCreateManyInput | RelDesignsTypesCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RelDesignsTypes update
   */
  export type RelDesignsTypesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * The data needed to update a RelDesignsTypes.
     */
    data: XOR<RelDesignsTypesUpdateInput, RelDesignsTypesUncheckedUpdateInput>
    /**
     * Choose, which RelDesignsTypes to update.
     */
    where: RelDesignsTypesWhereUniqueInput
  }

  /**
   * RelDesignsTypes updateMany
   */
  export type RelDesignsTypesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RelDesignsTypes.
     */
    data: XOR<RelDesignsTypesUpdateManyMutationInput, RelDesignsTypesUncheckedUpdateManyInput>
    /**
     * Filter which RelDesignsTypes to update
     */
    where?: RelDesignsTypesWhereInput
    /**
     * Limit how many RelDesignsTypes to update.
     */
    limit?: number
  }

  /**
   * RelDesignsTypes updateManyAndReturn
   */
  export type RelDesignsTypesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * The data used to update RelDesignsTypes.
     */
    data: XOR<RelDesignsTypesUpdateManyMutationInput, RelDesignsTypesUncheckedUpdateManyInput>
    /**
     * Filter which RelDesignsTypes to update
     */
    where?: RelDesignsTypesWhereInput
    /**
     * Limit how many RelDesignsTypes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RelDesignsTypes upsert
   */
  export type RelDesignsTypesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * The filter to search for the RelDesignsTypes to update in case it exists.
     */
    where: RelDesignsTypesWhereUniqueInput
    /**
     * In case the RelDesignsTypes found by the `where` argument doesn't exist, create a new RelDesignsTypes with this data.
     */
    create: XOR<RelDesignsTypesCreateInput, RelDesignsTypesUncheckedCreateInput>
    /**
     * In case the RelDesignsTypes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RelDesignsTypesUpdateInput, RelDesignsTypesUncheckedUpdateInput>
  }

  /**
   * RelDesignsTypes delete
   */
  export type RelDesignsTypesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
    /**
     * Filter which RelDesignsTypes to delete.
     */
    where: RelDesignsTypesWhereUniqueInput
  }

  /**
   * RelDesignsTypes deleteMany
   */
  export type RelDesignsTypesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelDesignsTypes to delete
     */
    where?: RelDesignsTypesWhereInput
    /**
     * Limit how many RelDesignsTypes to delete.
     */
    limit?: number
  }

  /**
   * RelDesignsTypes.design
   */
  export type RelDesignsTypes$designArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Designs
     */
    select?: DesignsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Designs
     */
    omit?: DesignsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DesignsInclude<ExtArgs> | null
    where?: DesignsWhereInput
  }

  /**
   * RelDesignsTypes.designType
   */
  export type RelDesignsTypes$designTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CatDesignsType
     */
    select?: CatDesignsTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CatDesignsType
     */
    omit?: CatDesignsTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CatDesignsTypeInclude<ExtArgs> | null
    where?: CatDesignsTypeWhereInput
  }

  /**
   * RelDesignsTypes without action
   */
  export type RelDesignsTypesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelDesignsTypes
     */
    select?: RelDesignsTypesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RelDesignsTypes
     */
    omit?: RelDesignsTypesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelDesignsTypesInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CatCategoriesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type CatCategoriesScalarFieldEnum = (typeof CatCategoriesScalarFieldEnum)[keyof typeof CatCategoriesScalarFieldEnum]


  export const CatDesignsTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type CatDesignsTypeScalarFieldEnum = (typeof CatDesignsTypeScalarFieldEnum)[keyof typeof CatDesignsTypeScalarFieldEnum]


  export const CatFileExtensionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    extension: 'extension',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type CatFileExtensionScalarFieldEnum = (typeof CatFileExtensionScalarFieldEnum)[keyof typeof CatFileExtensionScalarFieldEnum]


  export const CatFileTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type CatFileTypeScalarFieldEnum = (typeof CatFileTypeScalarFieldEnum)[keyof typeof CatFileTypeScalarFieldEnum]


  export const CatMaterialsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    status: 'status',
    createdAt: 'createdAt',
    slug: 'slug',
    description: 'description',
    icon: 'icon'
  };

  export type CatMaterialsScalarFieldEnum = (typeof CatMaterialsScalarFieldEnum)[keyof typeof CatMaterialsScalarFieldEnum]


  export const DesignsScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    author: 'author',
    status: 'status',
    createdAt: 'createdAt',
    materialId: 'materialId'
  };

  export type DesignsScalarFieldEnum = (typeof DesignsScalarFieldEnum)[keyof typeof DesignsScalarFieldEnum]


  export const FilesScalarFieldEnum: {
    id: 'id',
    fileTypeId: 'fileTypeId',
    fileExtensionId: 'fileExtensionId',
    status: 'status',
    createdAt: 'createdAt',
    fileData: 'fileData'
  };

  export type FilesScalarFieldEnum = (typeof FilesScalarFieldEnum)[keyof typeof FilesScalarFieldEnum]


  export const RelDesignsCategoriesScalarFieldEnum: {
    id: 'id',
    designId: 'designId',
    categoryId: 'categoryId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type RelDesignsCategoriesScalarFieldEnum = (typeof RelDesignsCategoriesScalarFieldEnum)[keyof typeof RelDesignsCategoriesScalarFieldEnum]


  export const RelDesignsFilesScalarFieldEnum: {
    id: 'id',
    designId: 'designId',
    typeId: 'typeId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type RelDesignsFilesScalarFieldEnum = (typeof RelDesignsFilesScalarFieldEnum)[keyof typeof RelDesignsFilesScalarFieldEnum]


  export const RelDesignsTypesScalarFieldEnum: {
    id: 'id',
    designId: 'designId',
    typeId: 'typeId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type RelDesignsTypesScalarFieldEnum = (typeof RelDesignsTypesScalarFieldEnum)[keyof typeof RelDesignsTypesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type CatCategoriesWhereInput = {
    AND?: CatCategoriesWhereInput | CatCategoriesWhereInput[]
    OR?: CatCategoriesWhereInput[]
    NOT?: CatCategoriesWhereInput | CatCategoriesWhereInput[]
    id?: IntFilter<"CatCategories"> | number
    name?: StringNullableFilter<"CatCategories"> | string | null
    status?: IntFilter<"CatCategories"> | number
    createdAt?: DateTimeFilter<"CatCategories"> | Date | string
    relDesignsCategories?: RelDesignsCategoriesListRelationFilter
  }

  export type CatCategoriesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    relDesignsCategories?: RelDesignsCategoriesOrderByRelationAggregateInput
  }

  export type CatCategoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CatCategoriesWhereInput | CatCategoriesWhereInput[]
    OR?: CatCategoriesWhereInput[]
    NOT?: CatCategoriesWhereInput | CatCategoriesWhereInput[]
    name?: StringNullableFilter<"CatCategories"> | string | null
    status?: IntFilter<"CatCategories"> | number
    createdAt?: DateTimeFilter<"CatCategories"> | Date | string
    relDesignsCategories?: RelDesignsCategoriesListRelationFilter
  }, "id">

  export type CatCategoriesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: CatCategoriesCountOrderByAggregateInput
    _avg?: CatCategoriesAvgOrderByAggregateInput
    _max?: CatCategoriesMaxOrderByAggregateInput
    _min?: CatCategoriesMinOrderByAggregateInput
    _sum?: CatCategoriesSumOrderByAggregateInput
  }

  export type CatCategoriesScalarWhereWithAggregatesInput = {
    AND?: CatCategoriesScalarWhereWithAggregatesInput | CatCategoriesScalarWhereWithAggregatesInput[]
    OR?: CatCategoriesScalarWhereWithAggregatesInput[]
    NOT?: CatCategoriesScalarWhereWithAggregatesInput | CatCategoriesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CatCategories"> | number
    name?: StringNullableWithAggregatesFilter<"CatCategories"> | string | null
    status?: IntWithAggregatesFilter<"CatCategories"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CatCategories"> | Date | string
  }

  export type CatDesignsTypeWhereInput = {
    AND?: CatDesignsTypeWhereInput | CatDesignsTypeWhereInput[]
    OR?: CatDesignsTypeWhereInput[]
    NOT?: CatDesignsTypeWhereInput | CatDesignsTypeWhereInput[]
    id?: IntFilter<"CatDesignsType"> | number
    name?: StringNullableFilter<"CatDesignsType"> | string | null
    status?: IntFilter<"CatDesignsType"> | number
    createdAt?: DateTimeFilter<"CatDesignsType"> | Date | string
    relDesignsTypes?: RelDesignsTypesListRelationFilter
  }

  export type CatDesignsTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    relDesignsTypes?: RelDesignsTypesOrderByRelationAggregateInput
  }

  export type CatDesignsTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CatDesignsTypeWhereInput | CatDesignsTypeWhereInput[]
    OR?: CatDesignsTypeWhereInput[]
    NOT?: CatDesignsTypeWhereInput | CatDesignsTypeWhereInput[]
    name?: StringNullableFilter<"CatDesignsType"> | string | null
    status?: IntFilter<"CatDesignsType"> | number
    createdAt?: DateTimeFilter<"CatDesignsType"> | Date | string
    relDesignsTypes?: RelDesignsTypesListRelationFilter
  }, "id">

  export type CatDesignsTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: CatDesignsTypeCountOrderByAggregateInput
    _avg?: CatDesignsTypeAvgOrderByAggregateInput
    _max?: CatDesignsTypeMaxOrderByAggregateInput
    _min?: CatDesignsTypeMinOrderByAggregateInput
    _sum?: CatDesignsTypeSumOrderByAggregateInput
  }

  export type CatDesignsTypeScalarWhereWithAggregatesInput = {
    AND?: CatDesignsTypeScalarWhereWithAggregatesInput | CatDesignsTypeScalarWhereWithAggregatesInput[]
    OR?: CatDesignsTypeScalarWhereWithAggregatesInput[]
    NOT?: CatDesignsTypeScalarWhereWithAggregatesInput | CatDesignsTypeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CatDesignsType"> | number
    name?: StringNullableWithAggregatesFilter<"CatDesignsType"> | string | null
    status?: IntWithAggregatesFilter<"CatDesignsType"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CatDesignsType"> | Date | string
  }

  export type CatFileExtensionWhereInput = {
    AND?: CatFileExtensionWhereInput | CatFileExtensionWhereInput[]
    OR?: CatFileExtensionWhereInput[]
    NOT?: CatFileExtensionWhereInput | CatFileExtensionWhereInput[]
    id?: IntFilter<"CatFileExtension"> | number
    name?: StringNullableFilter<"CatFileExtension"> | string | null
    extension?: StringNullableFilter<"CatFileExtension"> | string | null
    status?: IntFilter<"CatFileExtension"> | number
    createdAt?: DateTimeFilter<"CatFileExtension"> | Date | string
    files?: FilesListRelationFilter
  }

  export type CatFileExtensionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    extension?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    files?: FilesOrderByRelationAggregateInput
  }

  export type CatFileExtensionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CatFileExtensionWhereInput | CatFileExtensionWhereInput[]
    OR?: CatFileExtensionWhereInput[]
    NOT?: CatFileExtensionWhereInput | CatFileExtensionWhereInput[]
    name?: StringNullableFilter<"CatFileExtension"> | string | null
    extension?: StringNullableFilter<"CatFileExtension"> | string | null
    status?: IntFilter<"CatFileExtension"> | number
    createdAt?: DateTimeFilter<"CatFileExtension"> | Date | string
    files?: FilesListRelationFilter
  }, "id">

  export type CatFileExtensionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    extension?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: CatFileExtensionCountOrderByAggregateInput
    _avg?: CatFileExtensionAvgOrderByAggregateInput
    _max?: CatFileExtensionMaxOrderByAggregateInput
    _min?: CatFileExtensionMinOrderByAggregateInput
    _sum?: CatFileExtensionSumOrderByAggregateInput
  }

  export type CatFileExtensionScalarWhereWithAggregatesInput = {
    AND?: CatFileExtensionScalarWhereWithAggregatesInput | CatFileExtensionScalarWhereWithAggregatesInput[]
    OR?: CatFileExtensionScalarWhereWithAggregatesInput[]
    NOT?: CatFileExtensionScalarWhereWithAggregatesInput | CatFileExtensionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CatFileExtension"> | number
    name?: StringNullableWithAggregatesFilter<"CatFileExtension"> | string | null
    extension?: StringNullableWithAggregatesFilter<"CatFileExtension"> | string | null
    status?: IntWithAggregatesFilter<"CatFileExtension"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CatFileExtension"> | Date | string
  }

  export type CatFileTypeWhereInput = {
    AND?: CatFileTypeWhereInput | CatFileTypeWhereInput[]
    OR?: CatFileTypeWhereInput[]
    NOT?: CatFileTypeWhereInput | CatFileTypeWhereInput[]
    id?: IntFilter<"CatFileType"> | number
    name?: StringNullableFilter<"CatFileType"> | string | null
    status?: IntFilter<"CatFileType"> | number
    createdAt?: DateTimeFilter<"CatFileType"> | Date | string
    files?: FilesListRelationFilter
  }

  export type CatFileTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    files?: FilesOrderByRelationAggregateInput
  }

  export type CatFileTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CatFileTypeWhereInput | CatFileTypeWhereInput[]
    OR?: CatFileTypeWhereInput[]
    NOT?: CatFileTypeWhereInput | CatFileTypeWhereInput[]
    name?: StringNullableFilter<"CatFileType"> | string | null
    status?: IntFilter<"CatFileType"> | number
    createdAt?: DateTimeFilter<"CatFileType"> | Date | string
    files?: FilesListRelationFilter
  }, "id">

  export type CatFileTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: CatFileTypeCountOrderByAggregateInput
    _avg?: CatFileTypeAvgOrderByAggregateInput
    _max?: CatFileTypeMaxOrderByAggregateInput
    _min?: CatFileTypeMinOrderByAggregateInput
    _sum?: CatFileTypeSumOrderByAggregateInput
  }

  export type CatFileTypeScalarWhereWithAggregatesInput = {
    AND?: CatFileTypeScalarWhereWithAggregatesInput | CatFileTypeScalarWhereWithAggregatesInput[]
    OR?: CatFileTypeScalarWhereWithAggregatesInput[]
    NOT?: CatFileTypeScalarWhereWithAggregatesInput | CatFileTypeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CatFileType"> | number
    name?: StringNullableWithAggregatesFilter<"CatFileType"> | string | null
    status?: IntWithAggregatesFilter<"CatFileType"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CatFileType"> | Date | string
  }

  export type CatMaterialsWhereInput = {
    AND?: CatMaterialsWhereInput | CatMaterialsWhereInput[]
    OR?: CatMaterialsWhereInput[]
    NOT?: CatMaterialsWhereInput | CatMaterialsWhereInput[]
    id?: IntFilter<"CatMaterials"> | number
    name?: StringNullableFilter<"CatMaterials"> | string | null
    status?: IntFilter<"CatMaterials"> | number
    createdAt?: DateTimeFilter<"CatMaterials"> | Date | string
    slug?: StringNullableFilter<"CatMaterials"> | string | null
    description?: StringNullableFilter<"CatMaterials"> | string | null
    icon?: StringNullableFilter<"CatMaterials"> | string | null
    designs?: DesignsListRelationFilter
  }

  export type CatMaterialsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    slug?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    designs?: DesignsOrderByRelationAggregateInput
  }

  export type CatMaterialsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    slug?: string
    AND?: CatMaterialsWhereInput | CatMaterialsWhereInput[]
    OR?: CatMaterialsWhereInput[]
    NOT?: CatMaterialsWhereInput | CatMaterialsWhereInput[]
    name?: StringNullableFilter<"CatMaterials"> | string | null
    status?: IntFilter<"CatMaterials"> | number
    createdAt?: DateTimeFilter<"CatMaterials"> | Date | string
    description?: StringNullableFilter<"CatMaterials"> | string | null
    icon?: StringNullableFilter<"CatMaterials"> | string | null
    designs?: DesignsListRelationFilter
  }, "id" | "slug">

  export type CatMaterialsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    slug?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    icon?: SortOrderInput | SortOrder
    _count?: CatMaterialsCountOrderByAggregateInput
    _avg?: CatMaterialsAvgOrderByAggregateInput
    _max?: CatMaterialsMaxOrderByAggregateInput
    _min?: CatMaterialsMinOrderByAggregateInput
    _sum?: CatMaterialsSumOrderByAggregateInput
  }

  export type CatMaterialsScalarWhereWithAggregatesInput = {
    AND?: CatMaterialsScalarWhereWithAggregatesInput | CatMaterialsScalarWhereWithAggregatesInput[]
    OR?: CatMaterialsScalarWhereWithAggregatesInput[]
    NOT?: CatMaterialsScalarWhereWithAggregatesInput | CatMaterialsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CatMaterials"> | number
    name?: StringNullableWithAggregatesFilter<"CatMaterials"> | string | null
    status?: IntWithAggregatesFilter<"CatMaterials"> | number
    createdAt?: DateTimeWithAggregatesFilter<"CatMaterials"> | Date | string
    slug?: StringNullableWithAggregatesFilter<"CatMaterials"> | string | null
    description?: StringNullableWithAggregatesFilter<"CatMaterials"> | string | null
    icon?: StringNullableWithAggregatesFilter<"CatMaterials"> | string | null
  }

  export type DesignsWhereInput = {
    AND?: DesignsWhereInput | DesignsWhereInput[]
    OR?: DesignsWhereInput[]
    NOT?: DesignsWhereInput | DesignsWhereInput[]
    id?: IntFilter<"Designs"> | number
    name?: StringNullableFilter<"Designs"> | string | null
    description?: StringNullableFilter<"Designs"> | string | null
    author?: StringNullableFilter<"Designs"> | string | null
    status?: IntFilter<"Designs"> | number
    createdAt?: DateTimeFilter<"Designs"> | Date | string
    materialId?: IntNullableFilter<"Designs"> | number | null
    material?: XOR<CatMaterialsNullableScalarRelationFilter, CatMaterialsWhereInput> | null
    relDesignsCategories?: RelDesignsCategoriesListRelationFilter
    relDesignsFiles?: RelDesignsFilesListRelationFilter
    relDesignsTypes?: RelDesignsTypesListRelationFilter
  }

  export type DesignsOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    author?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    materialId?: SortOrderInput | SortOrder
    material?: CatMaterialsOrderByWithRelationInput
    relDesignsCategories?: RelDesignsCategoriesOrderByRelationAggregateInput
    relDesignsFiles?: RelDesignsFilesOrderByRelationAggregateInput
    relDesignsTypes?: RelDesignsTypesOrderByRelationAggregateInput
  }

  export type DesignsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DesignsWhereInput | DesignsWhereInput[]
    OR?: DesignsWhereInput[]
    NOT?: DesignsWhereInput | DesignsWhereInput[]
    name?: StringNullableFilter<"Designs"> | string | null
    description?: StringNullableFilter<"Designs"> | string | null
    author?: StringNullableFilter<"Designs"> | string | null
    status?: IntFilter<"Designs"> | number
    createdAt?: DateTimeFilter<"Designs"> | Date | string
    materialId?: IntNullableFilter<"Designs"> | number | null
    material?: XOR<CatMaterialsNullableScalarRelationFilter, CatMaterialsWhereInput> | null
    relDesignsCategories?: RelDesignsCategoriesListRelationFilter
    relDesignsFiles?: RelDesignsFilesListRelationFilter
    relDesignsTypes?: RelDesignsTypesListRelationFilter
  }, "id">

  export type DesignsOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    author?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    materialId?: SortOrderInput | SortOrder
    _count?: DesignsCountOrderByAggregateInput
    _avg?: DesignsAvgOrderByAggregateInput
    _max?: DesignsMaxOrderByAggregateInput
    _min?: DesignsMinOrderByAggregateInput
    _sum?: DesignsSumOrderByAggregateInput
  }

  export type DesignsScalarWhereWithAggregatesInput = {
    AND?: DesignsScalarWhereWithAggregatesInput | DesignsScalarWhereWithAggregatesInput[]
    OR?: DesignsScalarWhereWithAggregatesInput[]
    NOT?: DesignsScalarWhereWithAggregatesInput | DesignsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Designs"> | number
    name?: StringNullableWithAggregatesFilter<"Designs"> | string | null
    description?: StringNullableWithAggregatesFilter<"Designs"> | string | null
    author?: StringNullableWithAggregatesFilter<"Designs"> | string | null
    status?: IntWithAggregatesFilter<"Designs"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Designs"> | Date | string
    materialId?: IntNullableWithAggregatesFilter<"Designs"> | number | null
  }

  export type FilesWhereInput = {
    AND?: FilesWhereInput | FilesWhereInput[]
    OR?: FilesWhereInput[]
    NOT?: FilesWhereInput | FilesWhereInput[]
    id?: IntFilter<"Files"> | number
    fileTypeId?: IntNullableFilter<"Files"> | number | null
    fileExtensionId?: IntNullableFilter<"Files"> | number | null
    status?: IntFilter<"Files"> | number
    createdAt?: DateTimeFilter<"Files"> | Date | string
    fileData?: BytesFilter<"Files"> | Bytes
    fileType?: XOR<CatFileTypeNullableScalarRelationFilter, CatFileTypeWhereInput> | null
    fileExtension?: XOR<CatFileExtensionNullableScalarRelationFilter, CatFileExtensionWhereInput> | null
    relDesignsFiles?: RelDesignsFilesListRelationFilter
  }

  export type FilesOrderByWithRelationInput = {
    id?: SortOrder
    fileTypeId?: SortOrderInput | SortOrder
    fileExtensionId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    fileData?: SortOrder
    fileType?: CatFileTypeOrderByWithRelationInput
    fileExtension?: CatFileExtensionOrderByWithRelationInput
    relDesignsFiles?: RelDesignsFilesOrderByRelationAggregateInput
  }

  export type FilesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FilesWhereInput | FilesWhereInput[]
    OR?: FilesWhereInput[]
    NOT?: FilesWhereInput | FilesWhereInput[]
    fileTypeId?: IntNullableFilter<"Files"> | number | null
    fileExtensionId?: IntNullableFilter<"Files"> | number | null
    status?: IntFilter<"Files"> | number
    createdAt?: DateTimeFilter<"Files"> | Date | string
    fileData?: BytesFilter<"Files"> | Bytes
    fileType?: XOR<CatFileTypeNullableScalarRelationFilter, CatFileTypeWhereInput> | null
    fileExtension?: XOR<CatFileExtensionNullableScalarRelationFilter, CatFileExtensionWhereInput> | null
    relDesignsFiles?: RelDesignsFilesListRelationFilter
  }, "id">

  export type FilesOrderByWithAggregationInput = {
    id?: SortOrder
    fileTypeId?: SortOrderInput | SortOrder
    fileExtensionId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    fileData?: SortOrder
    _count?: FilesCountOrderByAggregateInput
    _avg?: FilesAvgOrderByAggregateInput
    _max?: FilesMaxOrderByAggregateInput
    _min?: FilesMinOrderByAggregateInput
    _sum?: FilesSumOrderByAggregateInput
  }

  export type FilesScalarWhereWithAggregatesInput = {
    AND?: FilesScalarWhereWithAggregatesInput | FilesScalarWhereWithAggregatesInput[]
    OR?: FilesScalarWhereWithAggregatesInput[]
    NOT?: FilesScalarWhereWithAggregatesInput | FilesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Files"> | number
    fileTypeId?: IntNullableWithAggregatesFilter<"Files"> | number | null
    fileExtensionId?: IntNullableWithAggregatesFilter<"Files"> | number | null
    status?: IntWithAggregatesFilter<"Files"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Files"> | Date | string
    fileData?: BytesWithAggregatesFilter<"Files"> | Bytes
  }

  export type RelDesignsCategoriesWhereInput = {
    AND?: RelDesignsCategoriesWhereInput | RelDesignsCategoriesWhereInput[]
    OR?: RelDesignsCategoriesWhereInput[]
    NOT?: RelDesignsCategoriesWhereInput | RelDesignsCategoriesWhereInput[]
    id?: IntFilter<"RelDesignsCategories"> | number
    designId?: IntNullableFilter<"RelDesignsCategories"> | number | null
    categoryId?: IntNullableFilter<"RelDesignsCategories"> | number | null
    status?: IntFilter<"RelDesignsCategories"> | number
    createdAt?: DateTimeFilter<"RelDesignsCategories"> | Date | string
    design?: XOR<DesignsNullableScalarRelationFilter, DesignsWhereInput> | null
    category?: XOR<CatCategoriesNullableScalarRelationFilter, CatCategoriesWhereInput> | null
  }

  export type RelDesignsCategoriesOrderByWithRelationInput = {
    id?: SortOrder
    designId?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    design?: DesignsOrderByWithRelationInput
    category?: CatCategoriesOrderByWithRelationInput
  }

  export type RelDesignsCategoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RelDesignsCategoriesWhereInput | RelDesignsCategoriesWhereInput[]
    OR?: RelDesignsCategoriesWhereInput[]
    NOT?: RelDesignsCategoriesWhereInput | RelDesignsCategoriesWhereInput[]
    designId?: IntNullableFilter<"RelDesignsCategories"> | number | null
    categoryId?: IntNullableFilter<"RelDesignsCategories"> | number | null
    status?: IntFilter<"RelDesignsCategories"> | number
    createdAt?: DateTimeFilter<"RelDesignsCategories"> | Date | string
    design?: XOR<DesignsNullableScalarRelationFilter, DesignsWhereInput> | null
    category?: XOR<CatCategoriesNullableScalarRelationFilter, CatCategoriesWhereInput> | null
  }, "id">

  export type RelDesignsCategoriesOrderByWithAggregationInput = {
    id?: SortOrder
    designId?: SortOrderInput | SortOrder
    categoryId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: RelDesignsCategoriesCountOrderByAggregateInput
    _avg?: RelDesignsCategoriesAvgOrderByAggregateInput
    _max?: RelDesignsCategoriesMaxOrderByAggregateInput
    _min?: RelDesignsCategoriesMinOrderByAggregateInput
    _sum?: RelDesignsCategoriesSumOrderByAggregateInput
  }

  export type RelDesignsCategoriesScalarWhereWithAggregatesInput = {
    AND?: RelDesignsCategoriesScalarWhereWithAggregatesInput | RelDesignsCategoriesScalarWhereWithAggregatesInput[]
    OR?: RelDesignsCategoriesScalarWhereWithAggregatesInput[]
    NOT?: RelDesignsCategoriesScalarWhereWithAggregatesInput | RelDesignsCategoriesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RelDesignsCategories"> | number
    designId?: IntNullableWithAggregatesFilter<"RelDesignsCategories"> | number | null
    categoryId?: IntNullableWithAggregatesFilter<"RelDesignsCategories"> | number | null
    status?: IntWithAggregatesFilter<"RelDesignsCategories"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RelDesignsCategories"> | Date | string
  }

  export type RelDesignsFilesWhereInput = {
    AND?: RelDesignsFilesWhereInput | RelDesignsFilesWhereInput[]
    OR?: RelDesignsFilesWhereInput[]
    NOT?: RelDesignsFilesWhereInput | RelDesignsFilesWhereInput[]
    id?: IntFilter<"RelDesignsFiles"> | number
    designId?: IntNullableFilter<"RelDesignsFiles"> | number | null
    typeId?: IntNullableFilter<"RelDesignsFiles"> | number | null
    status?: IntFilter<"RelDesignsFiles"> | number
    createdAt?: DateTimeFilter<"RelDesignsFiles"> | Date | string
    design?: XOR<DesignsNullableScalarRelationFilter, DesignsWhereInput> | null
    file?: XOR<FilesNullableScalarRelationFilter, FilesWhereInput> | null
  }

  export type RelDesignsFilesOrderByWithRelationInput = {
    id?: SortOrder
    designId?: SortOrderInput | SortOrder
    typeId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    design?: DesignsOrderByWithRelationInput
    file?: FilesOrderByWithRelationInput
  }

  export type RelDesignsFilesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RelDesignsFilesWhereInput | RelDesignsFilesWhereInput[]
    OR?: RelDesignsFilesWhereInput[]
    NOT?: RelDesignsFilesWhereInput | RelDesignsFilesWhereInput[]
    designId?: IntNullableFilter<"RelDesignsFiles"> | number | null
    typeId?: IntNullableFilter<"RelDesignsFiles"> | number | null
    status?: IntFilter<"RelDesignsFiles"> | number
    createdAt?: DateTimeFilter<"RelDesignsFiles"> | Date | string
    design?: XOR<DesignsNullableScalarRelationFilter, DesignsWhereInput> | null
    file?: XOR<FilesNullableScalarRelationFilter, FilesWhereInput> | null
  }, "id">

  export type RelDesignsFilesOrderByWithAggregationInput = {
    id?: SortOrder
    designId?: SortOrderInput | SortOrder
    typeId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: RelDesignsFilesCountOrderByAggregateInput
    _avg?: RelDesignsFilesAvgOrderByAggregateInput
    _max?: RelDesignsFilesMaxOrderByAggregateInput
    _min?: RelDesignsFilesMinOrderByAggregateInput
    _sum?: RelDesignsFilesSumOrderByAggregateInput
  }

  export type RelDesignsFilesScalarWhereWithAggregatesInput = {
    AND?: RelDesignsFilesScalarWhereWithAggregatesInput | RelDesignsFilesScalarWhereWithAggregatesInput[]
    OR?: RelDesignsFilesScalarWhereWithAggregatesInput[]
    NOT?: RelDesignsFilesScalarWhereWithAggregatesInput | RelDesignsFilesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RelDesignsFiles"> | number
    designId?: IntNullableWithAggregatesFilter<"RelDesignsFiles"> | number | null
    typeId?: IntNullableWithAggregatesFilter<"RelDesignsFiles"> | number | null
    status?: IntWithAggregatesFilter<"RelDesignsFiles"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RelDesignsFiles"> | Date | string
  }

  export type RelDesignsTypesWhereInput = {
    AND?: RelDesignsTypesWhereInput | RelDesignsTypesWhereInput[]
    OR?: RelDesignsTypesWhereInput[]
    NOT?: RelDesignsTypesWhereInput | RelDesignsTypesWhereInput[]
    id?: IntFilter<"RelDesignsTypes"> | number
    designId?: IntNullableFilter<"RelDesignsTypes"> | number | null
    typeId?: IntNullableFilter<"RelDesignsTypes"> | number | null
    status?: IntFilter<"RelDesignsTypes"> | number
    createdAt?: DateTimeFilter<"RelDesignsTypes"> | Date | string
    design?: XOR<DesignsNullableScalarRelationFilter, DesignsWhereInput> | null
    designType?: XOR<CatDesignsTypeNullableScalarRelationFilter, CatDesignsTypeWhereInput> | null
  }

  export type RelDesignsTypesOrderByWithRelationInput = {
    id?: SortOrder
    designId?: SortOrderInput | SortOrder
    typeId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    design?: DesignsOrderByWithRelationInput
    designType?: CatDesignsTypeOrderByWithRelationInput
  }

  export type RelDesignsTypesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RelDesignsTypesWhereInput | RelDesignsTypesWhereInput[]
    OR?: RelDesignsTypesWhereInput[]
    NOT?: RelDesignsTypesWhereInput | RelDesignsTypesWhereInput[]
    designId?: IntNullableFilter<"RelDesignsTypes"> | number | null
    typeId?: IntNullableFilter<"RelDesignsTypes"> | number | null
    status?: IntFilter<"RelDesignsTypes"> | number
    createdAt?: DateTimeFilter<"RelDesignsTypes"> | Date | string
    design?: XOR<DesignsNullableScalarRelationFilter, DesignsWhereInput> | null
    designType?: XOR<CatDesignsTypeNullableScalarRelationFilter, CatDesignsTypeWhereInput> | null
  }, "id">

  export type RelDesignsTypesOrderByWithAggregationInput = {
    id?: SortOrder
    designId?: SortOrderInput | SortOrder
    typeId?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: RelDesignsTypesCountOrderByAggregateInput
    _avg?: RelDesignsTypesAvgOrderByAggregateInput
    _max?: RelDesignsTypesMaxOrderByAggregateInput
    _min?: RelDesignsTypesMinOrderByAggregateInput
    _sum?: RelDesignsTypesSumOrderByAggregateInput
  }

  export type RelDesignsTypesScalarWhereWithAggregatesInput = {
    AND?: RelDesignsTypesScalarWhereWithAggregatesInput | RelDesignsTypesScalarWhereWithAggregatesInput[]
    OR?: RelDesignsTypesScalarWhereWithAggregatesInput[]
    NOT?: RelDesignsTypesScalarWhereWithAggregatesInput | RelDesignsTypesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RelDesignsTypes"> | number
    designId?: IntNullableWithAggregatesFilter<"RelDesignsTypes"> | number | null
    typeId?: IntNullableWithAggregatesFilter<"RelDesignsTypes"> | number | null
    status?: IntWithAggregatesFilter<"RelDesignsTypes"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RelDesignsTypes"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    name?: string | null
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    name?: string | null
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    name?: string | null
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CatCategoriesCreateInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
    relDesignsCategories?: RelDesignsCategoriesCreateNestedManyWithoutCategoryInput
  }

  export type CatCategoriesUncheckedCreateInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
    relDesignsCategories?: RelDesignsCategoriesUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CatCategoriesUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relDesignsCategories?: RelDesignsCategoriesUpdateManyWithoutCategoryNestedInput
  }

  export type CatCategoriesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relDesignsCategories?: RelDesignsCategoriesUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CatCategoriesCreateManyInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatCategoriesUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatCategoriesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatDesignsTypeCreateInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
    relDesignsTypes?: RelDesignsTypesCreateNestedManyWithoutDesignTypeInput
  }

  export type CatDesignsTypeUncheckedCreateInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
    relDesignsTypes?: RelDesignsTypesUncheckedCreateNestedManyWithoutDesignTypeInput
  }

  export type CatDesignsTypeUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relDesignsTypes?: RelDesignsTypesUpdateManyWithoutDesignTypeNestedInput
  }

  export type CatDesignsTypeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relDesignsTypes?: RelDesignsTypesUncheckedUpdateManyWithoutDesignTypeNestedInput
  }

  export type CatDesignsTypeCreateManyInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatDesignsTypeUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatDesignsTypeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatFileExtensionCreateInput = {
    name?: string | null
    extension?: string | null
    status?: number
    createdAt?: Date | string
    files?: FilesCreateNestedManyWithoutFileExtensionInput
  }

  export type CatFileExtensionUncheckedCreateInput = {
    id?: number
    name?: string | null
    extension?: string | null
    status?: number
    createdAt?: Date | string
    files?: FilesUncheckedCreateNestedManyWithoutFileExtensionInput
  }

  export type CatFileExtensionUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: FilesUpdateManyWithoutFileExtensionNestedInput
  }

  export type CatFileExtensionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: FilesUncheckedUpdateManyWithoutFileExtensionNestedInput
  }

  export type CatFileExtensionCreateManyInput = {
    id?: number
    name?: string | null
    extension?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatFileExtensionUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatFileExtensionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatFileTypeCreateInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
    files?: FilesCreateNestedManyWithoutFileTypeInput
  }

  export type CatFileTypeUncheckedCreateInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
    files?: FilesUncheckedCreateNestedManyWithoutFileTypeInput
  }

  export type CatFileTypeUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: FilesUpdateManyWithoutFileTypeNestedInput
  }

  export type CatFileTypeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    files?: FilesUncheckedUpdateManyWithoutFileTypeNestedInput
  }

  export type CatFileTypeCreateManyInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatFileTypeUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatFileTypeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatMaterialsCreateInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
    slug?: string | null
    description?: string | null
    icon?: string | null
    designs?: DesignsCreateNestedManyWithoutMaterialInput
  }

  export type CatMaterialsUncheckedCreateInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
    slug?: string | null
    description?: string | null
    icon?: string | null
    designs?: DesignsUncheckedCreateNestedManyWithoutMaterialInput
  }

  export type CatMaterialsUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    designs?: DesignsUpdateManyWithoutMaterialNestedInput
  }

  export type CatMaterialsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
    designs?: DesignsUncheckedUpdateManyWithoutMaterialNestedInput
  }

  export type CatMaterialsCreateManyInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
    slug?: string | null
    description?: string | null
    icon?: string | null
  }

  export type CatMaterialsUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CatMaterialsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DesignsCreateInput = {
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    material?: CatMaterialsCreateNestedOneWithoutDesignsInput
    relDesignsCategories?: RelDesignsCategoriesCreateNestedManyWithoutDesignInput
    relDesignsFiles?: RelDesignsFilesCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesCreateNestedManyWithoutDesignInput
  }

  export type DesignsUncheckedCreateInput = {
    id?: number
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    materialId?: number | null
    relDesignsCategories?: RelDesignsCategoriesUncheckedCreateNestedManyWithoutDesignInput
    relDesignsFiles?: RelDesignsFilesUncheckedCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesUncheckedCreateNestedManyWithoutDesignInput
  }

  export type DesignsUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    material?: CatMaterialsUpdateOneWithoutDesignsNestedInput
    relDesignsCategories?: RelDesignsCategoriesUpdateManyWithoutDesignNestedInput
    relDesignsFiles?: RelDesignsFilesUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUpdateManyWithoutDesignNestedInput
  }

  export type DesignsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    materialId?: NullableIntFieldUpdateOperationsInput | number | null
    relDesignsCategories?: RelDesignsCategoriesUncheckedUpdateManyWithoutDesignNestedInput
    relDesignsFiles?: RelDesignsFilesUncheckedUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUncheckedUpdateManyWithoutDesignNestedInput
  }

  export type DesignsCreateManyInput = {
    id?: number
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    materialId?: number | null
  }

  export type DesignsUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    materialId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type FilesCreateInput = {
    status?: number
    createdAt?: Date | string
    fileData: Bytes
    fileType?: CatFileTypeCreateNestedOneWithoutFilesInput
    fileExtension?: CatFileExtensionCreateNestedOneWithoutFilesInput
    relDesignsFiles?: RelDesignsFilesCreateNestedManyWithoutFileInput
  }

  export type FilesUncheckedCreateInput = {
    id?: number
    fileTypeId?: number | null
    fileExtensionId?: number | null
    status?: number
    createdAt?: Date | string
    fileData: Bytes
    relDesignsFiles?: RelDesignsFilesUncheckedCreateNestedManyWithoutFileInput
  }

  export type FilesUpdateInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
    fileType?: CatFileTypeUpdateOneWithoutFilesNestedInput
    fileExtension?: CatFileExtensionUpdateOneWithoutFilesNestedInput
    relDesignsFiles?: RelDesignsFilesUpdateManyWithoutFileNestedInput
  }

  export type FilesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    fileTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    fileExtensionId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
    relDesignsFiles?: RelDesignsFilesUncheckedUpdateManyWithoutFileNestedInput
  }

  export type FilesCreateManyInput = {
    id?: number
    fileTypeId?: number | null
    fileExtensionId?: number | null
    status?: number
    createdAt?: Date | string
    fileData: Bytes
  }

  export type FilesUpdateManyMutationInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
  }

  export type FilesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    fileTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    fileExtensionId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
  }

  export type RelDesignsCategoriesCreateInput = {
    status?: number
    createdAt?: Date | string
    design?: DesignsCreateNestedOneWithoutRelDesignsCategoriesInput
    category?: CatCategoriesCreateNestedOneWithoutRelDesignsCategoriesInput
  }

  export type RelDesignsCategoriesUncheckedCreateInput = {
    id?: number
    designId?: number | null
    categoryId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsCategoriesUpdateInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignsUpdateOneWithoutRelDesignsCategoriesNestedInput
    category?: CatCategoriesUpdateOneWithoutRelDesignsCategoriesNestedInput
  }

  export type RelDesignsCategoriesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsCategoriesCreateManyInput = {
    id?: number
    designId?: number | null
    categoryId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsCategoriesUpdateManyMutationInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsCategoriesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesCreateInput = {
    status?: number
    createdAt?: Date | string
    design?: DesignsCreateNestedOneWithoutRelDesignsFilesInput
    file?: FilesCreateNestedOneWithoutRelDesignsFilesInput
  }

  export type RelDesignsFilesUncheckedCreateInput = {
    id?: number
    designId?: number | null
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsFilesUpdateInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignsUpdateOneWithoutRelDesignsFilesNestedInput
    file?: FilesUpdateOneWithoutRelDesignsFilesNestedInput
  }

  export type RelDesignsFilesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesCreateManyInput = {
    id?: number
    designId?: number | null
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsFilesUpdateManyMutationInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsTypesCreateInput = {
    status?: number
    createdAt?: Date | string
    design?: DesignsCreateNestedOneWithoutRelDesignsTypesInput
    designType?: CatDesignsTypeCreateNestedOneWithoutRelDesignsTypesInput
  }

  export type RelDesignsTypesUncheckedCreateInput = {
    id?: number
    designId?: number | null
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsTypesUpdateInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignsUpdateOneWithoutRelDesignsTypesNestedInput
    designType?: CatDesignsTypeUpdateOneWithoutRelDesignsTypesNestedInput
  }

  export type RelDesignsTypesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsTypesCreateManyInput = {
    id?: number
    designId?: number | null
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsTypesUpdateManyMutationInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsTypesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RelDesignsCategoriesListRelationFilter = {
    every?: RelDesignsCategoriesWhereInput
    some?: RelDesignsCategoriesWhereInput
    none?: RelDesignsCategoriesWhereInput
  }

  export type RelDesignsCategoriesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CatCategoriesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatCategoriesAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type CatCategoriesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatCategoriesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatCategoriesSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type RelDesignsTypesListRelationFilter = {
    every?: RelDesignsTypesWhereInput
    some?: RelDesignsTypesWhereInput
    none?: RelDesignsTypesWhereInput
  }

  export type RelDesignsTypesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CatDesignsTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatDesignsTypeAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type CatDesignsTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatDesignsTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatDesignsTypeSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type FilesListRelationFilter = {
    every?: FilesWhereInput
    some?: FilesWhereInput
    none?: FilesWhereInput
  }

  export type FilesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CatFileExtensionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    extension?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatFileExtensionAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type CatFileExtensionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    extension?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatFileExtensionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    extension?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatFileExtensionSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type CatFileTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatFileTypeAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type CatFileTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatFileTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type CatFileTypeSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type DesignsListRelationFilter = {
    every?: DesignsWhereInput
    some?: DesignsWhereInput
    none?: DesignsWhereInput
  }

  export type DesignsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CatMaterialsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
  }

  export type CatMaterialsAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type CatMaterialsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
  }

  export type CatMaterialsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    icon?: SortOrder
  }

  export type CatMaterialsSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type CatMaterialsNullableScalarRelationFilter = {
    is?: CatMaterialsWhereInput | null
    isNot?: CatMaterialsWhereInput | null
  }

  export type RelDesignsFilesListRelationFilter = {
    every?: RelDesignsFilesWhereInput
    some?: RelDesignsFilesWhereInput
    none?: RelDesignsFilesWhereInput
  }

  export type RelDesignsFilesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DesignsCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    author?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    materialId?: SortOrder
  }

  export type DesignsAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    materialId?: SortOrder
  }

  export type DesignsMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    author?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    materialId?: SortOrder
  }

  export type DesignsMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    author?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    materialId?: SortOrder
  }

  export type DesignsSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    materialId?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
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
  }

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[]
    notIn?: Bytes[]
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type CatFileTypeNullableScalarRelationFilter = {
    is?: CatFileTypeWhereInput | null
    isNot?: CatFileTypeWhereInput | null
  }

  export type CatFileExtensionNullableScalarRelationFilter = {
    is?: CatFileExtensionWhereInput | null
    isNot?: CatFileExtensionWhereInput | null
  }

  export type FilesCountOrderByAggregateInput = {
    id?: SortOrder
    fileTypeId?: SortOrder
    fileExtensionId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    fileData?: SortOrder
  }

  export type FilesAvgOrderByAggregateInput = {
    id?: SortOrder
    fileTypeId?: SortOrder
    fileExtensionId?: SortOrder
    status?: SortOrder
  }

  export type FilesMaxOrderByAggregateInput = {
    id?: SortOrder
    fileTypeId?: SortOrder
    fileExtensionId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    fileData?: SortOrder
  }

  export type FilesMinOrderByAggregateInput = {
    id?: SortOrder
    fileTypeId?: SortOrder
    fileExtensionId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    fileData?: SortOrder
  }

  export type FilesSumOrderByAggregateInput = {
    id?: SortOrder
    fileTypeId?: SortOrder
    fileExtensionId?: SortOrder
    status?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[]
    notIn?: Bytes[]
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type DesignsNullableScalarRelationFilter = {
    is?: DesignsWhereInput | null
    isNot?: DesignsWhereInput | null
  }

  export type CatCategoriesNullableScalarRelationFilter = {
    is?: CatCategoriesWhereInput | null
    isNot?: CatCategoriesWhereInput | null
  }

  export type RelDesignsCategoriesCountOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    categoryId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsCategoriesAvgOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    categoryId?: SortOrder
    status?: SortOrder
  }

  export type RelDesignsCategoriesMaxOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    categoryId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsCategoriesMinOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    categoryId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsCategoriesSumOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    categoryId?: SortOrder
    status?: SortOrder
  }

  export type FilesNullableScalarRelationFilter = {
    is?: FilesWhereInput | null
    isNot?: FilesWhereInput | null
  }

  export type RelDesignsFilesCountOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsFilesAvgOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
  }

  export type RelDesignsFilesMaxOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsFilesMinOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsFilesSumOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
  }

  export type CatDesignsTypeNullableScalarRelationFilter = {
    is?: CatDesignsTypeWhereInput | null
    isNot?: CatDesignsTypeWhereInput | null
  }

  export type RelDesignsTypesCountOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsTypesAvgOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
  }

  export type RelDesignsTypesMaxOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsTypesMinOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type RelDesignsTypesSumOrderByAggregateInput = {
    id?: SortOrder
    designId?: SortOrder
    typeId?: SortOrder
    status?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RelDesignsCategoriesCreateNestedManyWithoutCategoryInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutCategoryInput, RelDesignsCategoriesUncheckedCreateWithoutCategoryInput> | RelDesignsCategoriesCreateWithoutCategoryInput[] | RelDesignsCategoriesUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutCategoryInput | RelDesignsCategoriesCreateOrConnectWithoutCategoryInput[]
    createMany?: RelDesignsCategoriesCreateManyCategoryInputEnvelope
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
  }

  export type RelDesignsCategoriesUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutCategoryInput, RelDesignsCategoriesUncheckedCreateWithoutCategoryInput> | RelDesignsCategoriesCreateWithoutCategoryInput[] | RelDesignsCategoriesUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutCategoryInput | RelDesignsCategoriesCreateOrConnectWithoutCategoryInput[]
    createMany?: RelDesignsCategoriesCreateManyCategoryInputEnvelope
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RelDesignsCategoriesUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutCategoryInput, RelDesignsCategoriesUncheckedCreateWithoutCategoryInput> | RelDesignsCategoriesCreateWithoutCategoryInput[] | RelDesignsCategoriesUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutCategoryInput | RelDesignsCategoriesCreateOrConnectWithoutCategoryInput[]
    upsert?: RelDesignsCategoriesUpsertWithWhereUniqueWithoutCategoryInput | RelDesignsCategoriesUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: RelDesignsCategoriesCreateManyCategoryInputEnvelope
    set?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    disconnect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    delete?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    update?: RelDesignsCategoriesUpdateWithWhereUniqueWithoutCategoryInput | RelDesignsCategoriesUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: RelDesignsCategoriesUpdateManyWithWhereWithoutCategoryInput | RelDesignsCategoriesUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: RelDesignsCategoriesScalarWhereInput | RelDesignsCategoriesScalarWhereInput[]
  }

  export type RelDesignsCategoriesUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutCategoryInput, RelDesignsCategoriesUncheckedCreateWithoutCategoryInput> | RelDesignsCategoriesCreateWithoutCategoryInput[] | RelDesignsCategoriesUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutCategoryInput | RelDesignsCategoriesCreateOrConnectWithoutCategoryInput[]
    upsert?: RelDesignsCategoriesUpsertWithWhereUniqueWithoutCategoryInput | RelDesignsCategoriesUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: RelDesignsCategoriesCreateManyCategoryInputEnvelope
    set?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    disconnect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    delete?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    update?: RelDesignsCategoriesUpdateWithWhereUniqueWithoutCategoryInput | RelDesignsCategoriesUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: RelDesignsCategoriesUpdateManyWithWhereWithoutCategoryInput | RelDesignsCategoriesUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: RelDesignsCategoriesScalarWhereInput | RelDesignsCategoriesScalarWhereInput[]
  }

  export type RelDesignsTypesCreateNestedManyWithoutDesignTypeInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignTypeInput, RelDesignsTypesUncheckedCreateWithoutDesignTypeInput> | RelDesignsTypesCreateWithoutDesignTypeInput[] | RelDesignsTypesUncheckedCreateWithoutDesignTypeInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignTypeInput | RelDesignsTypesCreateOrConnectWithoutDesignTypeInput[]
    createMany?: RelDesignsTypesCreateManyDesignTypeInputEnvelope
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
  }

  export type RelDesignsTypesUncheckedCreateNestedManyWithoutDesignTypeInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignTypeInput, RelDesignsTypesUncheckedCreateWithoutDesignTypeInput> | RelDesignsTypesCreateWithoutDesignTypeInput[] | RelDesignsTypesUncheckedCreateWithoutDesignTypeInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignTypeInput | RelDesignsTypesCreateOrConnectWithoutDesignTypeInput[]
    createMany?: RelDesignsTypesCreateManyDesignTypeInputEnvelope
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
  }

  export type RelDesignsTypesUpdateManyWithoutDesignTypeNestedInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignTypeInput, RelDesignsTypesUncheckedCreateWithoutDesignTypeInput> | RelDesignsTypesCreateWithoutDesignTypeInput[] | RelDesignsTypesUncheckedCreateWithoutDesignTypeInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignTypeInput | RelDesignsTypesCreateOrConnectWithoutDesignTypeInput[]
    upsert?: RelDesignsTypesUpsertWithWhereUniqueWithoutDesignTypeInput | RelDesignsTypesUpsertWithWhereUniqueWithoutDesignTypeInput[]
    createMany?: RelDesignsTypesCreateManyDesignTypeInputEnvelope
    set?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    disconnect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    delete?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    update?: RelDesignsTypesUpdateWithWhereUniqueWithoutDesignTypeInput | RelDesignsTypesUpdateWithWhereUniqueWithoutDesignTypeInput[]
    updateMany?: RelDesignsTypesUpdateManyWithWhereWithoutDesignTypeInput | RelDesignsTypesUpdateManyWithWhereWithoutDesignTypeInput[]
    deleteMany?: RelDesignsTypesScalarWhereInput | RelDesignsTypesScalarWhereInput[]
  }

  export type RelDesignsTypesUncheckedUpdateManyWithoutDesignTypeNestedInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignTypeInput, RelDesignsTypesUncheckedCreateWithoutDesignTypeInput> | RelDesignsTypesCreateWithoutDesignTypeInput[] | RelDesignsTypesUncheckedCreateWithoutDesignTypeInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignTypeInput | RelDesignsTypesCreateOrConnectWithoutDesignTypeInput[]
    upsert?: RelDesignsTypesUpsertWithWhereUniqueWithoutDesignTypeInput | RelDesignsTypesUpsertWithWhereUniqueWithoutDesignTypeInput[]
    createMany?: RelDesignsTypesCreateManyDesignTypeInputEnvelope
    set?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    disconnect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    delete?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    update?: RelDesignsTypesUpdateWithWhereUniqueWithoutDesignTypeInput | RelDesignsTypesUpdateWithWhereUniqueWithoutDesignTypeInput[]
    updateMany?: RelDesignsTypesUpdateManyWithWhereWithoutDesignTypeInput | RelDesignsTypesUpdateManyWithWhereWithoutDesignTypeInput[]
    deleteMany?: RelDesignsTypesScalarWhereInput | RelDesignsTypesScalarWhereInput[]
  }

  export type FilesCreateNestedManyWithoutFileExtensionInput = {
    create?: XOR<FilesCreateWithoutFileExtensionInput, FilesUncheckedCreateWithoutFileExtensionInput> | FilesCreateWithoutFileExtensionInput[] | FilesUncheckedCreateWithoutFileExtensionInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileExtensionInput | FilesCreateOrConnectWithoutFileExtensionInput[]
    createMany?: FilesCreateManyFileExtensionInputEnvelope
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
  }

  export type FilesUncheckedCreateNestedManyWithoutFileExtensionInput = {
    create?: XOR<FilesCreateWithoutFileExtensionInput, FilesUncheckedCreateWithoutFileExtensionInput> | FilesCreateWithoutFileExtensionInput[] | FilesUncheckedCreateWithoutFileExtensionInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileExtensionInput | FilesCreateOrConnectWithoutFileExtensionInput[]
    createMany?: FilesCreateManyFileExtensionInputEnvelope
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
  }

  export type FilesUpdateManyWithoutFileExtensionNestedInput = {
    create?: XOR<FilesCreateWithoutFileExtensionInput, FilesUncheckedCreateWithoutFileExtensionInput> | FilesCreateWithoutFileExtensionInput[] | FilesUncheckedCreateWithoutFileExtensionInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileExtensionInput | FilesCreateOrConnectWithoutFileExtensionInput[]
    upsert?: FilesUpsertWithWhereUniqueWithoutFileExtensionInput | FilesUpsertWithWhereUniqueWithoutFileExtensionInput[]
    createMany?: FilesCreateManyFileExtensionInputEnvelope
    set?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    disconnect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    delete?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    update?: FilesUpdateWithWhereUniqueWithoutFileExtensionInput | FilesUpdateWithWhereUniqueWithoutFileExtensionInput[]
    updateMany?: FilesUpdateManyWithWhereWithoutFileExtensionInput | FilesUpdateManyWithWhereWithoutFileExtensionInput[]
    deleteMany?: FilesScalarWhereInput | FilesScalarWhereInput[]
  }

  export type FilesUncheckedUpdateManyWithoutFileExtensionNestedInput = {
    create?: XOR<FilesCreateWithoutFileExtensionInput, FilesUncheckedCreateWithoutFileExtensionInput> | FilesCreateWithoutFileExtensionInput[] | FilesUncheckedCreateWithoutFileExtensionInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileExtensionInput | FilesCreateOrConnectWithoutFileExtensionInput[]
    upsert?: FilesUpsertWithWhereUniqueWithoutFileExtensionInput | FilesUpsertWithWhereUniqueWithoutFileExtensionInput[]
    createMany?: FilesCreateManyFileExtensionInputEnvelope
    set?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    disconnect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    delete?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    update?: FilesUpdateWithWhereUniqueWithoutFileExtensionInput | FilesUpdateWithWhereUniqueWithoutFileExtensionInput[]
    updateMany?: FilesUpdateManyWithWhereWithoutFileExtensionInput | FilesUpdateManyWithWhereWithoutFileExtensionInput[]
    deleteMany?: FilesScalarWhereInput | FilesScalarWhereInput[]
  }

  export type FilesCreateNestedManyWithoutFileTypeInput = {
    create?: XOR<FilesCreateWithoutFileTypeInput, FilesUncheckedCreateWithoutFileTypeInput> | FilesCreateWithoutFileTypeInput[] | FilesUncheckedCreateWithoutFileTypeInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileTypeInput | FilesCreateOrConnectWithoutFileTypeInput[]
    createMany?: FilesCreateManyFileTypeInputEnvelope
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
  }

  export type FilesUncheckedCreateNestedManyWithoutFileTypeInput = {
    create?: XOR<FilesCreateWithoutFileTypeInput, FilesUncheckedCreateWithoutFileTypeInput> | FilesCreateWithoutFileTypeInput[] | FilesUncheckedCreateWithoutFileTypeInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileTypeInput | FilesCreateOrConnectWithoutFileTypeInput[]
    createMany?: FilesCreateManyFileTypeInputEnvelope
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
  }

  export type FilesUpdateManyWithoutFileTypeNestedInput = {
    create?: XOR<FilesCreateWithoutFileTypeInput, FilesUncheckedCreateWithoutFileTypeInput> | FilesCreateWithoutFileTypeInput[] | FilesUncheckedCreateWithoutFileTypeInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileTypeInput | FilesCreateOrConnectWithoutFileTypeInput[]
    upsert?: FilesUpsertWithWhereUniqueWithoutFileTypeInput | FilesUpsertWithWhereUniqueWithoutFileTypeInput[]
    createMany?: FilesCreateManyFileTypeInputEnvelope
    set?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    disconnect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    delete?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    update?: FilesUpdateWithWhereUniqueWithoutFileTypeInput | FilesUpdateWithWhereUniqueWithoutFileTypeInput[]
    updateMany?: FilesUpdateManyWithWhereWithoutFileTypeInput | FilesUpdateManyWithWhereWithoutFileTypeInput[]
    deleteMany?: FilesScalarWhereInput | FilesScalarWhereInput[]
  }

  export type FilesUncheckedUpdateManyWithoutFileTypeNestedInput = {
    create?: XOR<FilesCreateWithoutFileTypeInput, FilesUncheckedCreateWithoutFileTypeInput> | FilesCreateWithoutFileTypeInput[] | FilesUncheckedCreateWithoutFileTypeInput[]
    connectOrCreate?: FilesCreateOrConnectWithoutFileTypeInput | FilesCreateOrConnectWithoutFileTypeInput[]
    upsert?: FilesUpsertWithWhereUniqueWithoutFileTypeInput | FilesUpsertWithWhereUniqueWithoutFileTypeInput[]
    createMany?: FilesCreateManyFileTypeInputEnvelope
    set?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    disconnect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    delete?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    connect?: FilesWhereUniqueInput | FilesWhereUniqueInput[]
    update?: FilesUpdateWithWhereUniqueWithoutFileTypeInput | FilesUpdateWithWhereUniqueWithoutFileTypeInput[]
    updateMany?: FilesUpdateManyWithWhereWithoutFileTypeInput | FilesUpdateManyWithWhereWithoutFileTypeInput[]
    deleteMany?: FilesScalarWhereInput | FilesScalarWhereInput[]
  }

  export type DesignsCreateNestedManyWithoutMaterialInput = {
    create?: XOR<DesignsCreateWithoutMaterialInput, DesignsUncheckedCreateWithoutMaterialInput> | DesignsCreateWithoutMaterialInput[] | DesignsUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: DesignsCreateOrConnectWithoutMaterialInput | DesignsCreateOrConnectWithoutMaterialInput[]
    createMany?: DesignsCreateManyMaterialInputEnvelope
    connect?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
  }

  export type DesignsUncheckedCreateNestedManyWithoutMaterialInput = {
    create?: XOR<DesignsCreateWithoutMaterialInput, DesignsUncheckedCreateWithoutMaterialInput> | DesignsCreateWithoutMaterialInput[] | DesignsUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: DesignsCreateOrConnectWithoutMaterialInput | DesignsCreateOrConnectWithoutMaterialInput[]
    createMany?: DesignsCreateManyMaterialInputEnvelope
    connect?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
  }

  export type DesignsUpdateManyWithoutMaterialNestedInput = {
    create?: XOR<DesignsCreateWithoutMaterialInput, DesignsUncheckedCreateWithoutMaterialInput> | DesignsCreateWithoutMaterialInput[] | DesignsUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: DesignsCreateOrConnectWithoutMaterialInput | DesignsCreateOrConnectWithoutMaterialInput[]
    upsert?: DesignsUpsertWithWhereUniqueWithoutMaterialInput | DesignsUpsertWithWhereUniqueWithoutMaterialInput[]
    createMany?: DesignsCreateManyMaterialInputEnvelope
    set?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    disconnect?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    delete?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    connect?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    update?: DesignsUpdateWithWhereUniqueWithoutMaterialInput | DesignsUpdateWithWhereUniqueWithoutMaterialInput[]
    updateMany?: DesignsUpdateManyWithWhereWithoutMaterialInput | DesignsUpdateManyWithWhereWithoutMaterialInput[]
    deleteMany?: DesignsScalarWhereInput | DesignsScalarWhereInput[]
  }

  export type DesignsUncheckedUpdateManyWithoutMaterialNestedInput = {
    create?: XOR<DesignsCreateWithoutMaterialInput, DesignsUncheckedCreateWithoutMaterialInput> | DesignsCreateWithoutMaterialInput[] | DesignsUncheckedCreateWithoutMaterialInput[]
    connectOrCreate?: DesignsCreateOrConnectWithoutMaterialInput | DesignsCreateOrConnectWithoutMaterialInput[]
    upsert?: DesignsUpsertWithWhereUniqueWithoutMaterialInput | DesignsUpsertWithWhereUniqueWithoutMaterialInput[]
    createMany?: DesignsCreateManyMaterialInputEnvelope
    set?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    disconnect?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    delete?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    connect?: DesignsWhereUniqueInput | DesignsWhereUniqueInput[]
    update?: DesignsUpdateWithWhereUniqueWithoutMaterialInput | DesignsUpdateWithWhereUniqueWithoutMaterialInput[]
    updateMany?: DesignsUpdateManyWithWhereWithoutMaterialInput | DesignsUpdateManyWithWhereWithoutMaterialInput[]
    deleteMany?: DesignsScalarWhereInput | DesignsScalarWhereInput[]
  }

  export type CatMaterialsCreateNestedOneWithoutDesignsInput = {
    create?: XOR<CatMaterialsCreateWithoutDesignsInput, CatMaterialsUncheckedCreateWithoutDesignsInput>
    connectOrCreate?: CatMaterialsCreateOrConnectWithoutDesignsInput
    connect?: CatMaterialsWhereUniqueInput
  }

  export type RelDesignsCategoriesCreateNestedManyWithoutDesignInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutDesignInput, RelDesignsCategoriesUncheckedCreateWithoutDesignInput> | RelDesignsCategoriesCreateWithoutDesignInput[] | RelDesignsCategoriesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutDesignInput | RelDesignsCategoriesCreateOrConnectWithoutDesignInput[]
    createMany?: RelDesignsCategoriesCreateManyDesignInputEnvelope
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
  }

  export type RelDesignsFilesCreateNestedManyWithoutDesignInput = {
    create?: XOR<RelDesignsFilesCreateWithoutDesignInput, RelDesignsFilesUncheckedCreateWithoutDesignInput> | RelDesignsFilesCreateWithoutDesignInput[] | RelDesignsFilesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutDesignInput | RelDesignsFilesCreateOrConnectWithoutDesignInput[]
    createMany?: RelDesignsFilesCreateManyDesignInputEnvelope
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
  }

  export type RelDesignsTypesCreateNestedManyWithoutDesignInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignInput, RelDesignsTypesUncheckedCreateWithoutDesignInput> | RelDesignsTypesCreateWithoutDesignInput[] | RelDesignsTypesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignInput | RelDesignsTypesCreateOrConnectWithoutDesignInput[]
    createMany?: RelDesignsTypesCreateManyDesignInputEnvelope
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
  }

  export type RelDesignsCategoriesUncheckedCreateNestedManyWithoutDesignInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutDesignInput, RelDesignsCategoriesUncheckedCreateWithoutDesignInput> | RelDesignsCategoriesCreateWithoutDesignInput[] | RelDesignsCategoriesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutDesignInput | RelDesignsCategoriesCreateOrConnectWithoutDesignInput[]
    createMany?: RelDesignsCategoriesCreateManyDesignInputEnvelope
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
  }

  export type RelDesignsFilesUncheckedCreateNestedManyWithoutDesignInput = {
    create?: XOR<RelDesignsFilesCreateWithoutDesignInput, RelDesignsFilesUncheckedCreateWithoutDesignInput> | RelDesignsFilesCreateWithoutDesignInput[] | RelDesignsFilesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutDesignInput | RelDesignsFilesCreateOrConnectWithoutDesignInput[]
    createMany?: RelDesignsFilesCreateManyDesignInputEnvelope
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
  }

  export type RelDesignsTypesUncheckedCreateNestedManyWithoutDesignInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignInput, RelDesignsTypesUncheckedCreateWithoutDesignInput> | RelDesignsTypesCreateWithoutDesignInput[] | RelDesignsTypesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignInput | RelDesignsTypesCreateOrConnectWithoutDesignInput[]
    createMany?: RelDesignsTypesCreateManyDesignInputEnvelope
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
  }

  export type CatMaterialsUpdateOneWithoutDesignsNestedInput = {
    create?: XOR<CatMaterialsCreateWithoutDesignsInput, CatMaterialsUncheckedCreateWithoutDesignsInput>
    connectOrCreate?: CatMaterialsCreateOrConnectWithoutDesignsInput
    upsert?: CatMaterialsUpsertWithoutDesignsInput
    disconnect?: CatMaterialsWhereInput | boolean
    delete?: CatMaterialsWhereInput | boolean
    connect?: CatMaterialsWhereUniqueInput
    update?: XOR<XOR<CatMaterialsUpdateToOneWithWhereWithoutDesignsInput, CatMaterialsUpdateWithoutDesignsInput>, CatMaterialsUncheckedUpdateWithoutDesignsInput>
  }

  export type RelDesignsCategoriesUpdateManyWithoutDesignNestedInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutDesignInput, RelDesignsCategoriesUncheckedCreateWithoutDesignInput> | RelDesignsCategoriesCreateWithoutDesignInput[] | RelDesignsCategoriesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutDesignInput | RelDesignsCategoriesCreateOrConnectWithoutDesignInput[]
    upsert?: RelDesignsCategoriesUpsertWithWhereUniqueWithoutDesignInput | RelDesignsCategoriesUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: RelDesignsCategoriesCreateManyDesignInputEnvelope
    set?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    disconnect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    delete?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    update?: RelDesignsCategoriesUpdateWithWhereUniqueWithoutDesignInput | RelDesignsCategoriesUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: RelDesignsCategoriesUpdateManyWithWhereWithoutDesignInput | RelDesignsCategoriesUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: RelDesignsCategoriesScalarWhereInput | RelDesignsCategoriesScalarWhereInput[]
  }

  export type RelDesignsFilesUpdateManyWithoutDesignNestedInput = {
    create?: XOR<RelDesignsFilesCreateWithoutDesignInput, RelDesignsFilesUncheckedCreateWithoutDesignInput> | RelDesignsFilesCreateWithoutDesignInput[] | RelDesignsFilesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutDesignInput | RelDesignsFilesCreateOrConnectWithoutDesignInput[]
    upsert?: RelDesignsFilesUpsertWithWhereUniqueWithoutDesignInput | RelDesignsFilesUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: RelDesignsFilesCreateManyDesignInputEnvelope
    set?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    disconnect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    delete?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    update?: RelDesignsFilesUpdateWithWhereUniqueWithoutDesignInput | RelDesignsFilesUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: RelDesignsFilesUpdateManyWithWhereWithoutDesignInput | RelDesignsFilesUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: RelDesignsFilesScalarWhereInput | RelDesignsFilesScalarWhereInput[]
  }

  export type RelDesignsTypesUpdateManyWithoutDesignNestedInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignInput, RelDesignsTypesUncheckedCreateWithoutDesignInput> | RelDesignsTypesCreateWithoutDesignInput[] | RelDesignsTypesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignInput | RelDesignsTypesCreateOrConnectWithoutDesignInput[]
    upsert?: RelDesignsTypesUpsertWithWhereUniqueWithoutDesignInput | RelDesignsTypesUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: RelDesignsTypesCreateManyDesignInputEnvelope
    set?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    disconnect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    delete?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    update?: RelDesignsTypesUpdateWithWhereUniqueWithoutDesignInput | RelDesignsTypesUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: RelDesignsTypesUpdateManyWithWhereWithoutDesignInput | RelDesignsTypesUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: RelDesignsTypesScalarWhereInput | RelDesignsTypesScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RelDesignsCategoriesUncheckedUpdateManyWithoutDesignNestedInput = {
    create?: XOR<RelDesignsCategoriesCreateWithoutDesignInput, RelDesignsCategoriesUncheckedCreateWithoutDesignInput> | RelDesignsCategoriesCreateWithoutDesignInput[] | RelDesignsCategoriesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsCategoriesCreateOrConnectWithoutDesignInput | RelDesignsCategoriesCreateOrConnectWithoutDesignInput[]
    upsert?: RelDesignsCategoriesUpsertWithWhereUniqueWithoutDesignInput | RelDesignsCategoriesUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: RelDesignsCategoriesCreateManyDesignInputEnvelope
    set?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    disconnect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    delete?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    connect?: RelDesignsCategoriesWhereUniqueInput | RelDesignsCategoriesWhereUniqueInput[]
    update?: RelDesignsCategoriesUpdateWithWhereUniqueWithoutDesignInput | RelDesignsCategoriesUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: RelDesignsCategoriesUpdateManyWithWhereWithoutDesignInput | RelDesignsCategoriesUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: RelDesignsCategoriesScalarWhereInput | RelDesignsCategoriesScalarWhereInput[]
  }

  export type RelDesignsFilesUncheckedUpdateManyWithoutDesignNestedInput = {
    create?: XOR<RelDesignsFilesCreateWithoutDesignInput, RelDesignsFilesUncheckedCreateWithoutDesignInput> | RelDesignsFilesCreateWithoutDesignInput[] | RelDesignsFilesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutDesignInput | RelDesignsFilesCreateOrConnectWithoutDesignInput[]
    upsert?: RelDesignsFilesUpsertWithWhereUniqueWithoutDesignInput | RelDesignsFilesUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: RelDesignsFilesCreateManyDesignInputEnvelope
    set?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    disconnect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    delete?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    update?: RelDesignsFilesUpdateWithWhereUniqueWithoutDesignInput | RelDesignsFilesUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: RelDesignsFilesUpdateManyWithWhereWithoutDesignInput | RelDesignsFilesUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: RelDesignsFilesScalarWhereInput | RelDesignsFilesScalarWhereInput[]
  }

  export type RelDesignsTypesUncheckedUpdateManyWithoutDesignNestedInput = {
    create?: XOR<RelDesignsTypesCreateWithoutDesignInput, RelDesignsTypesUncheckedCreateWithoutDesignInput> | RelDesignsTypesCreateWithoutDesignInput[] | RelDesignsTypesUncheckedCreateWithoutDesignInput[]
    connectOrCreate?: RelDesignsTypesCreateOrConnectWithoutDesignInput | RelDesignsTypesCreateOrConnectWithoutDesignInput[]
    upsert?: RelDesignsTypesUpsertWithWhereUniqueWithoutDesignInput | RelDesignsTypesUpsertWithWhereUniqueWithoutDesignInput[]
    createMany?: RelDesignsTypesCreateManyDesignInputEnvelope
    set?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    disconnect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    delete?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    connect?: RelDesignsTypesWhereUniqueInput | RelDesignsTypesWhereUniqueInput[]
    update?: RelDesignsTypesUpdateWithWhereUniqueWithoutDesignInput | RelDesignsTypesUpdateWithWhereUniqueWithoutDesignInput[]
    updateMany?: RelDesignsTypesUpdateManyWithWhereWithoutDesignInput | RelDesignsTypesUpdateManyWithWhereWithoutDesignInput[]
    deleteMany?: RelDesignsTypesScalarWhereInput | RelDesignsTypesScalarWhereInput[]
  }

  export type CatFileTypeCreateNestedOneWithoutFilesInput = {
    create?: XOR<CatFileTypeCreateWithoutFilesInput, CatFileTypeUncheckedCreateWithoutFilesInput>
    connectOrCreate?: CatFileTypeCreateOrConnectWithoutFilesInput
    connect?: CatFileTypeWhereUniqueInput
  }

  export type CatFileExtensionCreateNestedOneWithoutFilesInput = {
    create?: XOR<CatFileExtensionCreateWithoutFilesInput, CatFileExtensionUncheckedCreateWithoutFilesInput>
    connectOrCreate?: CatFileExtensionCreateOrConnectWithoutFilesInput
    connect?: CatFileExtensionWhereUniqueInput
  }

  export type RelDesignsFilesCreateNestedManyWithoutFileInput = {
    create?: XOR<RelDesignsFilesCreateWithoutFileInput, RelDesignsFilesUncheckedCreateWithoutFileInput> | RelDesignsFilesCreateWithoutFileInput[] | RelDesignsFilesUncheckedCreateWithoutFileInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutFileInput | RelDesignsFilesCreateOrConnectWithoutFileInput[]
    createMany?: RelDesignsFilesCreateManyFileInputEnvelope
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
  }

  export type RelDesignsFilesUncheckedCreateNestedManyWithoutFileInput = {
    create?: XOR<RelDesignsFilesCreateWithoutFileInput, RelDesignsFilesUncheckedCreateWithoutFileInput> | RelDesignsFilesCreateWithoutFileInput[] | RelDesignsFilesUncheckedCreateWithoutFileInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutFileInput | RelDesignsFilesCreateOrConnectWithoutFileInput[]
    createMany?: RelDesignsFilesCreateManyFileInputEnvelope
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Bytes
  }

  export type CatFileTypeUpdateOneWithoutFilesNestedInput = {
    create?: XOR<CatFileTypeCreateWithoutFilesInput, CatFileTypeUncheckedCreateWithoutFilesInput>
    connectOrCreate?: CatFileTypeCreateOrConnectWithoutFilesInput
    upsert?: CatFileTypeUpsertWithoutFilesInput
    disconnect?: CatFileTypeWhereInput | boolean
    delete?: CatFileTypeWhereInput | boolean
    connect?: CatFileTypeWhereUniqueInput
    update?: XOR<XOR<CatFileTypeUpdateToOneWithWhereWithoutFilesInput, CatFileTypeUpdateWithoutFilesInput>, CatFileTypeUncheckedUpdateWithoutFilesInput>
  }

  export type CatFileExtensionUpdateOneWithoutFilesNestedInput = {
    create?: XOR<CatFileExtensionCreateWithoutFilesInput, CatFileExtensionUncheckedCreateWithoutFilesInput>
    connectOrCreate?: CatFileExtensionCreateOrConnectWithoutFilesInput
    upsert?: CatFileExtensionUpsertWithoutFilesInput
    disconnect?: CatFileExtensionWhereInput | boolean
    delete?: CatFileExtensionWhereInput | boolean
    connect?: CatFileExtensionWhereUniqueInput
    update?: XOR<XOR<CatFileExtensionUpdateToOneWithWhereWithoutFilesInput, CatFileExtensionUpdateWithoutFilesInput>, CatFileExtensionUncheckedUpdateWithoutFilesInput>
  }

  export type RelDesignsFilesUpdateManyWithoutFileNestedInput = {
    create?: XOR<RelDesignsFilesCreateWithoutFileInput, RelDesignsFilesUncheckedCreateWithoutFileInput> | RelDesignsFilesCreateWithoutFileInput[] | RelDesignsFilesUncheckedCreateWithoutFileInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutFileInput | RelDesignsFilesCreateOrConnectWithoutFileInput[]
    upsert?: RelDesignsFilesUpsertWithWhereUniqueWithoutFileInput | RelDesignsFilesUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: RelDesignsFilesCreateManyFileInputEnvelope
    set?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    disconnect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    delete?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    update?: RelDesignsFilesUpdateWithWhereUniqueWithoutFileInput | RelDesignsFilesUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: RelDesignsFilesUpdateManyWithWhereWithoutFileInput | RelDesignsFilesUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: RelDesignsFilesScalarWhereInput | RelDesignsFilesScalarWhereInput[]
  }

  export type RelDesignsFilesUncheckedUpdateManyWithoutFileNestedInput = {
    create?: XOR<RelDesignsFilesCreateWithoutFileInput, RelDesignsFilesUncheckedCreateWithoutFileInput> | RelDesignsFilesCreateWithoutFileInput[] | RelDesignsFilesUncheckedCreateWithoutFileInput[]
    connectOrCreate?: RelDesignsFilesCreateOrConnectWithoutFileInput | RelDesignsFilesCreateOrConnectWithoutFileInput[]
    upsert?: RelDesignsFilesUpsertWithWhereUniqueWithoutFileInput | RelDesignsFilesUpsertWithWhereUniqueWithoutFileInput[]
    createMany?: RelDesignsFilesCreateManyFileInputEnvelope
    set?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    disconnect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    delete?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    connect?: RelDesignsFilesWhereUniqueInput | RelDesignsFilesWhereUniqueInput[]
    update?: RelDesignsFilesUpdateWithWhereUniqueWithoutFileInput | RelDesignsFilesUpdateWithWhereUniqueWithoutFileInput[]
    updateMany?: RelDesignsFilesUpdateManyWithWhereWithoutFileInput | RelDesignsFilesUpdateManyWithWhereWithoutFileInput[]
    deleteMany?: RelDesignsFilesScalarWhereInput | RelDesignsFilesScalarWhereInput[]
  }

  export type DesignsCreateNestedOneWithoutRelDesignsCategoriesInput = {
    create?: XOR<DesignsCreateWithoutRelDesignsCategoriesInput, DesignsUncheckedCreateWithoutRelDesignsCategoriesInput>
    connectOrCreate?: DesignsCreateOrConnectWithoutRelDesignsCategoriesInput
    connect?: DesignsWhereUniqueInput
  }

  export type CatCategoriesCreateNestedOneWithoutRelDesignsCategoriesInput = {
    create?: XOR<CatCategoriesCreateWithoutRelDesignsCategoriesInput, CatCategoriesUncheckedCreateWithoutRelDesignsCategoriesInput>
    connectOrCreate?: CatCategoriesCreateOrConnectWithoutRelDesignsCategoriesInput
    connect?: CatCategoriesWhereUniqueInput
  }

  export type DesignsUpdateOneWithoutRelDesignsCategoriesNestedInput = {
    create?: XOR<DesignsCreateWithoutRelDesignsCategoriesInput, DesignsUncheckedCreateWithoutRelDesignsCategoriesInput>
    connectOrCreate?: DesignsCreateOrConnectWithoutRelDesignsCategoriesInput
    upsert?: DesignsUpsertWithoutRelDesignsCategoriesInput
    disconnect?: DesignsWhereInput | boolean
    delete?: DesignsWhereInput | boolean
    connect?: DesignsWhereUniqueInput
    update?: XOR<XOR<DesignsUpdateToOneWithWhereWithoutRelDesignsCategoriesInput, DesignsUpdateWithoutRelDesignsCategoriesInput>, DesignsUncheckedUpdateWithoutRelDesignsCategoriesInput>
  }

  export type CatCategoriesUpdateOneWithoutRelDesignsCategoriesNestedInput = {
    create?: XOR<CatCategoriesCreateWithoutRelDesignsCategoriesInput, CatCategoriesUncheckedCreateWithoutRelDesignsCategoriesInput>
    connectOrCreate?: CatCategoriesCreateOrConnectWithoutRelDesignsCategoriesInput
    upsert?: CatCategoriesUpsertWithoutRelDesignsCategoriesInput
    disconnect?: CatCategoriesWhereInput | boolean
    delete?: CatCategoriesWhereInput | boolean
    connect?: CatCategoriesWhereUniqueInput
    update?: XOR<XOR<CatCategoriesUpdateToOneWithWhereWithoutRelDesignsCategoriesInput, CatCategoriesUpdateWithoutRelDesignsCategoriesInput>, CatCategoriesUncheckedUpdateWithoutRelDesignsCategoriesInput>
  }

  export type DesignsCreateNestedOneWithoutRelDesignsFilesInput = {
    create?: XOR<DesignsCreateWithoutRelDesignsFilesInput, DesignsUncheckedCreateWithoutRelDesignsFilesInput>
    connectOrCreate?: DesignsCreateOrConnectWithoutRelDesignsFilesInput
    connect?: DesignsWhereUniqueInput
  }

  export type FilesCreateNestedOneWithoutRelDesignsFilesInput = {
    create?: XOR<FilesCreateWithoutRelDesignsFilesInput, FilesUncheckedCreateWithoutRelDesignsFilesInput>
    connectOrCreate?: FilesCreateOrConnectWithoutRelDesignsFilesInput
    connect?: FilesWhereUniqueInput
  }

  export type DesignsUpdateOneWithoutRelDesignsFilesNestedInput = {
    create?: XOR<DesignsCreateWithoutRelDesignsFilesInput, DesignsUncheckedCreateWithoutRelDesignsFilesInput>
    connectOrCreate?: DesignsCreateOrConnectWithoutRelDesignsFilesInput
    upsert?: DesignsUpsertWithoutRelDesignsFilesInput
    disconnect?: DesignsWhereInput | boolean
    delete?: DesignsWhereInput | boolean
    connect?: DesignsWhereUniqueInput
    update?: XOR<XOR<DesignsUpdateToOneWithWhereWithoutRelDesignsFilesInput, DesignsUpdateWithoutRelDesignsFilesInput>, DesignsUncheckedUpdateWithoutRelDesignsFilesInput>
  }

  export type FilesUpdateOneWithoutRelDesignsFilesNestedInput = {
    create?: XOR<FilesCreateWithoutRelDesignsFilesInput, FilesUncheckedCreateWithoutRelDesignsFilesInput>
    connectOrCreate?: FilesCreateOrConnectWithoutRelDesignsFilesInput
    upsert?: FilesUpsertWithoutRelDesignsFilesInput
    disconnect?: FilesWhereInput | boolean
    delete?: FilesWhereInput | boolean
    connect?: FilesWhereUniqueInput
    update?: XOR<XOR<FilesUpdateToOneWithWhereWithoutRelDesignsFilesInput, FilesUpdateWithoutRelDesignsFilesInput>, FilesUncheckedUpdateWithoutRelDesignsFilesInput>
  }

  export type DesignsCreateNestedOneWithoutRelDesignsTypesInput = {
    create?: XOR<DesignsCreateWithoutRelDesignsTypesInput, DesignsUncheckedCreateWithoutRelDesignsTypesInput>
    connectOrCreate?: DesignsCreateOrConnectWithoutRelDesignsTypesInput
    connect?: DesignsWhereUniqueInput
  }

  export type CatDesignsTypeCreateNestedOneWithoutRelDesignsTypesInput = {
    create?: XOR<CatDesignsTypeCreateWithoutRelDesignsTypesInput, CatDesignsTypeUncheckedCreateWithoutRelDesignsTypesInput>
    connectOrCreate?: CatDesignsTypeCreateOrConnectWithoutRelDesignsTypesInput
    connect?: CatDesignsTypeWhereUniqueInput
  }

  export type DesignsUpdateOneWithoutRelDesignsTypesNestedInput = {
    create?: XOR<DesignsCreateWithoutRelDesignsTypesInput, DesignsUncheckedCreateWithoutRelDesignsTypesInput>
    connectOrCreate?: DesignsCreateOrConnectWithoutRelDesignsTypesInput
    upsert?: DesignsUpsertWithoutRelDesignsTypesInput
    disconnect?: DesignsWhereInput | boolean
    delete?: DesignsWhereInput | boolean
    connect?: DesignsWhereUniqueInput
    update?: XOR<XOR<DesignsUpdateToOneWithWhereWithoutRelDesignsTypesInput, DesignsUpdateWithoutRelDesignsTypesInput>, DesignsUncheckedUpdateWithoutRelDesignsTypesInput>
  }

  export type CatDesignsTypeUpdateOneWithoutRelDesignsTypesNestedInput = {
    create?: XOR<CatDesignsTypeCreateWithoutRelDesignsTypesInput, CatDesignsTypeUncheckedCreateWithoutRelDesignsTypesInput>
    connectOrCreate?: CatDesignsTypeCreateOrConnectWithoutRelDesignsTypesInput
    upsert?: CatDesignsTypeUpsertWithoutRelDesignsTypesInput
    disconnect?: CatDesignsTypeWhereInput | boolean
    delete?: CatDesignsTypeWhereInput | boolean
    connect?: CatDesignsTypeWhereUniqueInput
    update?: XOR<XOR<CatDesignsTypeUpdateToOneWithWhereWithoutRelDesignsTypesInput, CatDesignsTypeUpdateWithoutRelDesignsTypesInput>, CatDesignsTypeUncheckedUpdateWithoutRelDesignsTypesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
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

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
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
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
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
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[]
    notIn?: Bytes[]
    not?: NestedBytesFilter<$PrismaModel> | Bytes
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Bytes | BytesFieldRefInput<$PrismaModel>
    in?: Bytes[]
    notIn?: Bytes[]
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Bytes
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type RelDesignsCategoriesCreateWithoutCategoryInput = {
    status?: number
    createdAt?: Date | string
    design?: DesignsCreateNestedOneWithoutRelDesignsCategoriesInput
  }

  export type RelDesignsCategoriesUncheckedCreateWithoutCategoryInput = {
    id?: number
    designId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsCategoriesCreateOrConnectWithoutCategoryInput = {
    where: RelDesignsCategoriesWhereUniqueInput
    create: XOR<RelDesignsCategoriesCreateWithoutCategoryInput, RelDesignsCategoriesUncheckedCreateWithoutCategoryInput>
  }

  export type RelDesignsCategoriesCreateManyCategoryInputEnvelope = {
    data: RelDesignsCategoriesCreateManyCategoryInput | RelDesignsCategoriesCreateManyCategoryInput[]
  }

  export type RelDesignsCategoriesUpsertWithWhereUniqueWithoutCategoryInput = {
    where: RelDesignsCategoriesWhereUniqueInput
    update: XOR<RelDesignsCategoriesUpdateWithoutCategoryInput, RelDesignsCategoriesUncheckedUpdateWithoutCategoryInput>
    create: XOR<RelDesignsCategoriesCreateWithoutCategoryInput, RelDesignsCategoriesUncheckedCreateWithoutCategoryInput>
  }

  export type RelDesignsCategoriesUpdateWithWhereUniqueWithoutCategoryInput = {
    where: RelDesignsCategoriesWhereUniqueInput
    data: XOR<RelDesignsCategoriesUpdateWithoutCategoryInput, RelDesignsCategoriesUncheckedUpdateWithoutCategoryInput>
  }

  export type RelDesignsCategoriesUpdateManyWithWhereWithoutCategoryInput = {
    where: RelDesignsCategoriesScalarWhereInput
    data: XOR<RelDesignsCategoriesUpdateManyMutationInput, RelDesignsCategoriesUncheckedUpdateManyWithoutCategoryInput>
  }

  export type RelDesignsCategoriesScalarWhereInput = {
    AND?: RelDesignsCategoriesScalarWhereInput | RelDesignsCategoriesScalarWhereInput[]
    OR?: RelDesignsCategoriesScalarWhereInput[]
    NOT?: RelDesignsCategoriesScalarWhereInput | RelDesignsCategoriesScalarWhereInput[]
    id?: IntFilter<"RelDesignsCategories"> | number
    designId?: IntNullableFilter<"RelDesignsCategories"> | number | null
    categoryId?: IntNullableFilter<"RelDesignsCategories"> | number | null
    status?: IntFilter<"RelDesignsCategories"> | number
    createdAt?: DateTimeFilter<"RelDesignsCategories"> | Date | string
  }

  export type RelDesignsTypesCreateWithoutDesignTypeInput = {
    status?: number
    createdAt?: Date | string
    design?: DesignsCreateNestedOneWithoutRelDesignsTypesInput
  }

  export type RelDesignsTypesUncheckedCreateWithoutDesignTypeInput = {
    id?: number
    designId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsTypesCreateOrConnectWithoutDesignTypeInput = {
    where: RelDesignsTypesWhereUniqueInput
    create: XOR<RelDesignsTypesCreateWithoutDesignTypeInput, RelDesignsTypesUncheckedCreateWithoutDesignTypeInput>
  }

  export type RelDesignsTypesCreateManyDesignTypeInputEnvelope = {
    data: RelDesignsTypesCreateManyDesignTypeInput | RelDesignsTypesCreateManyDesignTypeInput[]
  }

  export type RelDesignsTypesUpsertWithWhereUniqueWithoutDesignTypeInput = {
    where: RelDesignsTypesWhereUniqueInput
    update: XOR<RelDesignsTypesUpdateWithoutDesignTypeInput, RelDesignsTypesUncheckedUpdateWithoutDesignTypeInput>
    create: XOR<RelDesignsTypesCreateWithoutDesignTypeInput, RelDesignsTypesUncheckedCreateWithoutDesignTypeInput>
  }

  export type RelDesignsTypesUpdateWithWhereUniqueWithoutDesignTypeInput = {
    where: RelDesignsTypesWhereUniqueInput
    data: XOR<RelDesignsTypesUpdateWithoutDesignTypeInput, RelDesignsTypesUncheckedUpdateWithoutDesignTypeInput>
  }

  export type RelDesignsTypesUpdateManyWithWhereWithoutDesignTypeInput = {
    where: RelDesignsTypesScalarWhereInput
    data: XOR<RelDesignsTypesUpdateManyMutationInput, RelDesignsTypesUncheckedUpdateManyWithoutDesignTypeInput>
  }

  export type RelDesignsTypesScalarWhereInput = {
    AND?: RelDesignsTypesScalarWhereInput | RelDesignsTypesScalarWhereInput[]
    OR?: RelDesignsTypesScalarWhereInput[]
    NOT?: RelDesignsTypesScalarWhereInput | RelDesignsTypesScalarWhereInput[]
    id?: IntFilter<"RelDesignsTypes"> | number
    designId?: IntNullableFilter<"RelDesignsTypes"> | number | null
    typeId?: IntNullableFilter<"RelDesignsTypes"> | number | null
    status?: IntFilter<"RelDesignsTypes"> | number
    createdAt?: DateTimeFilter<"RelDesignsTypes"> | Date | string
  }

  export type FilesCreateWithoutFileExtensionInput = {
    status?: number
    createdAt?: Date | string
    fileData: Bytes
    fileType?: CatFileTypeCreateNestedOneWithoutFilesInput
    relDesignsFiles?: RelDesignsFilesCreateNestedManyWithoutFileInput
  }

  export type FilesUncheckedCreateWithoutFileExtensionInput = {
    id?: number
    fileTypeId?: number | null
    status?: number
    createdAt?: Date | string
    fileData: Bytes
    relDesignsFiles?: RelDesignsFilesUncheckedCreateNestedManyWithoutFileInput
  }

  export type FilesCreateOrConnectWithoutFileExtensionInput = {
    where: FilesWhereUniqueInput
    create: XOR<FilesCreateWithoutFileExtensionInput, FilesUncheckedCreateWithoutFileExtensionInput>
  }

  export type FilesCreateManyFileExtensionInputEnvelope = {
    data: FilesCreateManyFileExtensionInput | FilesCreateManyFileExtensionInput[]
  }

  export type FilesUpsertWithWhereUniqueWithoutFileExtensionInput = {
    where: FilesWhereUniqueInput
    update: XOR<FilesUpdateWithoutFileExtensionInput, FilesUncheckedUpdateWithoutFileExtensionInput>
    create: XOR<FilesCreateWithoutFileExtensionInput, FilesUncheckedCreateWithoutFileExtensionInput>
  }

  export type FilesUpdateWithWhereUniqueWithoutFileExtensionInput = {
    where: FilesWhereUniqueInput
    data: XOR<FilesUpdateWithoutFileExtensionInput, FilesUncheckedUpdateWithoutFileExtensionInput>
  }

  export type FilesUpdateManyWithWhereWithoutFileExtensionInput = {
    where: FilesScalarWhereInput
    data: XOR<FilesUpdateManyMutationInput, FilesUncheckedUpdateManyWithoutFileExtensionInput>
  }

  export type FilesScalarWhereInput = {
    AND?: FilesScalarWhereInput | FilesScalarWhereInput[]
    OR?: FilesScalarWhereInput[]
    NOT?: FilesScalarWhereInput | FilesScalarWhereInput[]
    id?: IntFilter<"Files"> | number
    fileTypeId?: IntNullableFilter<"Files"> | number | null
    fileExtensionId?: IntNullableFilter<"Files"> | number | null
    status?: IntFilter<"Files"> | number
    createdAt?: DateTimeFilter<"Files"> | Date | string
    fileData?: BytesFilter<"Files"> | Bytes
  }

  export type FilesCreateWithoutFileTypeInput = {
    status?: number
    createdAt?: Date | string
    fileData: Bytes
    fileExtension?: CatFileExtensionCreateNestedOneWithoutFilesInput
    relDesignsFiles?: RelDesignsFilesCreateNestedManyWithoutFileInput
  }

  export type FilesUncheckedCreateWithoutFileTypeInput = {
    id?: number
    fileExtensionId?: number | null
    status?: number
    createdAt?: Date | string
    fileData: Bytes
    relDesignsFiles?: RelDesignsFilesUncheckedCreateNestedManyWithoutFileInput
  }

  export type FilesCreateOrConnectWithoutFileTypeInput = {
    where: FilesWhereUniqueInput
    create: XOR<FilesCreateWithoutFileTypeInput, FilesUncheckedCreateWithoutFileTypeInput>
  }

  export type FilesCreateManyFileTypeInputEnvelope = {
    data: FilesCreateManyFileTypeInput | FilesCreateManyFileTypeInput[]
  }

  export type FilesUpsertWithWhereUniqueWithoutFileTypeInput = {
    where: FilesWhereUniqueInput
    update: XOR<FilesUpdateWithoutFileTypeInput, FilesUncheckedUpdateWithoutFileTypeInput>
    create: XOR<FilesCreateWithoutFileTypeInput, FilesUncheckedCreateWithoutFileTypeInput>
  }

  export type FilesUpdateWithWhereUniqueWithoutFileTypeInput = {
    where: FilesWhereUniqueInput
    data: XOR<FilesUpdateWithoutFileTypeInput, FilesUncheckedUpdateWithoutFileTypeInput>
  }

  export type FilesUpdateManyWithWhereWithoutFileTypeInput = {
    where: FilesScalarWhereInput
    data: XOR<FilesUpdateManyMutationInput, FilesUncheckedUpdateManyWithoutFileTypeInput>
  }

  export type DesignsCreateWithoutMaterialInput = {
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    relDesignsCategories?: RelDesignsCategoriesCreateNestedManyWithoutDesignInput
    relDesignsFiles?: RelDesignsFilesCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesCreateNestedManyWithoutDesignInput
  }

  export type DesignsUncheckedCreateWithoutMaterialInput = {
    id?: number
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    relDesignsCategories?: RelDesignsCategoriesUncheckedCreateNestedManyWithoutDesignInput
    relDesignsFiles?: RelDesignsFilesUncheckedCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesUncheckedCreateNestedManyWithoutDesignInput
  }

  export type DesignsCreateOrConnectWithoutMaterialInput = {
    where: DesignsWhereUniqueInput
    create: XOR<DesignsCreateWithoutMaterialInput, DesignsUncheckedCreateWithoutMaterialInput>
  }

  export type DesignsCreateManyMaterialInputEnvelope = {
    data: DesignsCreateManyMaterialInput | DesignsCreateManyMaterialInput[]
  }

  export type DesignsUpsertWithWhereUniqueWithoutMaterialInput = {
    where: DesignsWhereUniqueInput
    update: XOR<DesignsUpdateWithoutMaterialInput, DesignsUncheckedUpdateWithoutMaterialInput>
    create: XOR<DesignsCreateWithoutMaterialInput, DesignsUncheckedCreateWithoutMaterialInput>
  }

  export type DesignsUpdateWithWhereUniqueWithoutMaterialInput = {
    where: DesignsWhereUniqueInput
    data: XOR<DesignsUpdateWithoutMaterialInput, DesignsUncheckedUpdateWithoutMaterialInput>
  }

  export type DesignsUpdateManyWithWhereWithoutMaterialInput = {
    where: DesignsScalarWhereInput
    data: XOR<DesignsUpdateManyMutationInput, DesignsUncheckedUpdateManyWithoutMaterialInput>
  }

  export type DesignsScalarWhereInput = {
    AND?: DesignsScalarWhereInput | DesignsScalarWhereInput[]
    OR?: DesignsScalarWhereInput[]
    NOT?: DesignsScalarWhereInput | DesignsScalarWhereInput[]
    id?: IntFilter<"Designs"> | number
    name?: StringNullableFilter<"Designs"> | string | null
    description?: StringNullableFilter<"Designs"> | string | null
    author?: StringNullableFilter<"Designs"> | string | null
    status?: IntFilter<"Designs"> | number
    createdAt?: DateTimeFilter<"Designs"> | Date | string
    materialId?: IntNullableFilter<"Designs"> | number | null
  }

  export type CatMaterialsCreateWithoutDesignsInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
    slug?: string | null
    description?: string | null
    icon?: string | null
  }

  export type CatMaterialsUncheckedCreateWithoutDesignsInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
    slug?: string | null
    description?: string | null
    icon?: string | null
  }

  export type CatMaterialsCreateOrConnectWithoutDesignsInput = {
    where: CatMaterialsWhereUniqueInput
    create: XOR<CatMaterialsCreateWithoutDesignsInput, CatMaterialsUncheckedCreateWithoutDesignsInput>
  }

  export type RelDesignsCategoriesCreateWithoutDesignInput = {
    status?: number
    createdAt?: Date | string
    category?: CatCategoriesCreateNestedOneWithoutRelDesignsCategoriesInput
  }

  export type RelDesignsCategoriesUncheckedCreateWithoutDesignInput = {
    id?: number
    categoryId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsCategoriesCreateOrConnectWithoutDesignInput = {
    where: RelDesignsCategoriesWhereUniqueInput
    create: XOR<RelDesignsCategoriesCreateWithoutDesignInput, RelDesignsCategoriesUncheckedCreateWithoutDesignInput>
  }

  export type RelDesignsCategoriesCreateManyDesignInputEnvelope = {
    data: RelDesignsCategoriesCreateManyDesignInput | RelDesignsCategoriesCreateManyDesignInput[]
  }

  export type RelDesignsFilesCreateWithoutDesignInput = {
    status?: number
    createdAt?: Date | string
    file?: FilesCreateNestedOneWithoutRelDesignsFilesInput
  }

  export type RelDesignsFilesUncheckedCreateWithoutDesignInput = {
    id?: number
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsFilesCreateOrConnectWithoutDesignInput = {
    where: RelDesignsFilesWhereUniqueInput
    create: XOR<RelDesignsFilesCreateWithoutDesignInput, RelDesignsFilesUncheckedCreateWithoutDesignInput>
  }

  export type RelDesignsFilesCreateManyDesignInputEnvelope = {
    data: RelDesignsFilesCreateManyDesignInput | RelDesignsFilesCreateManyDesignInput[]
  }

  export type RelDesignsTypesCreateWithoutDesignInput = {
    status?: number
    createdAt?: Date | string
    designType?: CatDesignsTypeCreateNestedOneWithoutRelDesignsTypesInput
  }

  export type RelDesignsTypesUncheckedCreateWithoutDesignInput = {
    id?: number
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsTypesCreateOrConnectWithoutDesignInput = {
    where: RelDesignsTypesWhereUniqueInput
    create: XOR<RelDesignsTypesCreateWithoutDesignInput, RelDesignsTypesUncheckedCreateWithoutDesignInput>
  }

  export type RelDesignsTypesCreateManyDesignInputEnvelope = {
    data: RelDesignsTypesCreateManyDesignInput | RelDesignsTypesCreateManyDesignInput[]
  }

  export type CatMaterialsUpsertWithoutDesignsInput = {
    update: XOR<CatMaterialsUpdateWithoutDesignsInput, CatMaterialsUncheckedUpdateWithoutDesignsInput>
    create: XOR<CatMaterialsCreateWithoutDesignsInput, CatMaterialsUncheckedCreateWithoutDesignsInput>
    where?: CatMaterialsWhereInput
  }

  export type CatMaterialsUpdateToOneWithWhereWithoutDesignsInput = {
    where?: CatMaterialsWhereInput
    data: XOR<CatMaterialsUpdateWithoutDesignsInput, CatMaterialsUncheckedUpdateWithoutDesignsInput>
  }

  export type CatMaterialsUpdateWithoutDesignsInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CatMaterialsUncheckedUpdateWithoutDesignsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    icon?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RelDesignsCategoriesUpsertWithWhereUniqueWithoutDesignInput = {
    where: RelDesignsCategoriesWhereUniqueInput
    update: XOR<RelDesignsCategoriesUpdateWithoutDesignInput, RelDesignsCategoriesUncheckedUpdateWithoutDesignInput>
    create: XOR<RelDesignsCategoriesCreateWithoutDesignInput, RelDesignsCategoriesUncheckedCreateWithoutDesignInput>
  }

  export type RelDesignsCategoriesUpdateWithWhereUniqueWithoutDesignInput = {
    where: RelDesignsCategoriesWhereUniqueInput
    data: XOR<RelDesignsCategoriesUpdateWithoutDesignInput, RelDesignsCategoriesUncheckedUpdateWithoutDesignInput>
  }

  export type RelDesignsCategoriesUpdateManyWithWhereWithoutDesignInput = {
    where: RelDesignsCategoriesScalarWhereInput
    data: XOR<RelDesignsCategoriesUpdateManyMutationInput, RelDesignsCategoriesUncheckedUpdateManyWithoutDesignInput>
  }

  export type RelDesignsFilesUpsertWithWhereUniqueWithoutDesignInput = {
    where: RelDesignsFilesWhereUniqueInput
    update: XOR<RelDesignsFilesUpdateWithoutDesignInput, RelDesignsFilesUncheckedUpdateWithoutDesignInput>
    create: XOR<RelDesignsFilesCreateWithoutDesignInput, RelDesignsFilesUncheckedCreateWithoutDesignInput>
  }

  export type RelDesignsFilesUpdateWithWhereUniqueWithoutDesignInput = {
    where: RelDesignsFilesWhereUniqueInput
    data: XOR<RelDesignsFilesUpdateWithoutDesignInput, RelDesignsFilesUncheckedUpdateWithoutDesignInput>
  }

  export type RelDesignsFilesUpdateManyWithWhereWithoutDesignInput = {
    where: RelDesignsFilesScalarWhereInput
    data: XOR<RelDesignsFilesUpdateManyMutationInput, RelDesignsFilesUncheckedUpdateManyWithoutDesignInput>
  }

  export type RelDesignsFilesScalarWhereInput = {
    AND?: RelDesignsFilesScalarWhereInput | RelDesignsFilesScalarWhereInput[]
    OR?: RelDesignsFilesScalarWhereInput[]
    NOT?: RelDesignsFilesScalarWhereInput | RelDesignsFilesScalarWhereInput[]
    id?: IntFilter<"RelDesignsFiles"> | number
    designId?: IntNullableFilter<"RelDesignsFiles"> | number | null
    typeId?: IntNullableFilter<"RelDesignsFiles"> | number | null
    status?: IntFilter<"RelDesignsFiles"> | number
    createdAt?: DateTimeFilter<"RelDesignsFiles"> | Date | string
  }

  export type RelDesignsTypesUpsertWithWhereUniqueWithoutDesignInput = {
    where: RelDesignsTypesWhereUniqueInput
    update: XOR<RelDesignsTypesUpdateWithoutDesignInput, RelDesignsTypesUncheckedUpdateWithoutDesignInput>
    create: XOR<RelDesignsTypesCreateWithoutDesignInput, RelDesignsTypesUncheckedCreateWithoutDesignInput>
  }

  export type RelDesignsTypesUpdateWithWhereUniqueWithoutDesignInput = {
    where: RelDesignsTypesWhereUniqueInput
    data: XOR<RelDesignsTypesUpdateWithoutDesignInput, RelDesignsTypesUncheckedUpdateWithoutDesignInput>
  }

  export type RelDesignsTypesUpdateManyWithWhereWithoutDesignInput = {
    where: RelDesignsTypesScalarWhereInput
    data: XOR<RelDesignsTypesUpdateManyMutationInput, RelDesignsTypesUncheckedUpdateManyWithoutDesignInput>
  }

  export type CatFileTypeCreateWithoutFilesInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatFileTypeUncheckedCreateWithoutFilesInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatFileTypeCreateOrConnectWithoutFilesInput = {
    where: CatFileTypeWhereUniqueInput
    create: XOR<CatFileTypeCreateWithoutFilesInput, CatFileTypeUncheckedCreateWithoutFilesInput>
  }

  export type CatFileExtensionCreateWithoutFilesInput = {
    name?: string | null
    extension?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatFileExtensionUncheckedCreateWithoutFilesInput = {
    id?: number
    name?: string | null
    extension?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatFileExtensionCreateOrConnectWithoutFilesInput = {
    where: CatFileExtensionWhereUniqueInput
    create: XOR<CatFileExtensionCreateWithoutFilesInput, CatFileExtensionUncheckedCreateWithoutFilesInput>
  }

  export type RelDesignsFilesCreateWithoutFileInput = {
    status?: number
    createdAt?: Date | string
    design?: DesignsCreateNestedOneWithoutRelDesignsFilesInput
  }

  export type RelDesignsFilesUncheckedCreateWithoutFileInput = {
    id?: number
    designId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsFilesCreateOrConnectWithoutFileInput = {
    where: RelDesignsFilesWhereUniqueInput
    create: XOR<RelDesignsFilesCreateWithoutFileInput, RelDesignsFilesUncheckedCreateWithoutFileInput>
  }

  export type RelDesignsFilesCreateManyFileInputEnvelope = {
    data: RelDesignsFilesCreateManyFileInput | RelDesignsFilesCreateManyFileInput[]
  }

  export type CatFileTypeUpsertWithoutFilesInput = {
    update: XOR<CatFileTypeUpdateWithoutFilesInput, CatFileTypeUncheckedUpdateWithoutFilesInput>
    create: XOR<CatFileTypeCreateWithoutFilesInput, CatFileTypeUncheckedCreateWithoutFilesInput>
    where?: CatFileTypeWhereInput
  }

  export type CatFileTypeUpdateToOneWithWhereWithoutFilesInput = {
    where?: CatFileTypeWhereInput
    data: XOR<CatFileTypeUpdateWithoutFilesInput, CatFileTypeUncheckedUpdateWithoutFilesInput>
  }

  export type CatFileTypeUpdateWithoutFilesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatFileTypeUncheckedUpdateWithoutFilesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatFileExtensionUpsertWithoutFilesInput = {
    update: XOR<CatFileExtensionUpdateWithoutFilesInput, CatFileExtensionUncheckedUpdateWithoutFilesInput>
    create: XOR<CatFileExtensionCreateWithoutFilesInput, CatFileExtensionUncheckedCreateWithoutFilesInput>
    where?: CatFileExtensionWhereInput
  }

  export type CatFileExtensionUpdateToOneWithWhereWithoutFilesInput = {
    where?: CatFileExtensionWhereInput
    data: XOR<CatFileExtensionUpdateWithoutFilesInput, CatFileExtensionUncheckedUpdateWithoutFilesInput>
  }

  export type CatFileExtensionUpdateWithoutFilesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatFileExtensionUncheckedUpdateWithoutFilesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesUpsertWithWhereUniqueWithoutFileInput = {
    where: RelDesignsFilesWhereUniqueInput
    update: XOR<RelDesignsFilesUpdateWithoutFileInput, RelDesignsFilesUncheckedUpdateWithoutFileInput>
    create: XOR<RelDesignsFilesCreateWithoutFileInput, RelDesignsFilesUncheckedCreateWithoutFileInput>
  }

  export type RelDesignsFilesUpdateWithWhereUniqueWithoutFileInput = {
    where: RelDesignsFilesWhereUniqueInput
    data: XOR<RelDesignsFilesUpdateWithoutFileInput, RelDesignsFilesUncheckedUpdateWithoutFileInput>
  }

  export type RelDesignsFilesUpdateManyWithWhereWithoutFileInput = {
    where: RelDesignsFilesScalarWhereInput
    data: XOR<RelDesignsFilesUpdateManyMutationInput, RelDesignsFilesUncheckedUpdateManyWithoutFileInput>
  }

  export type DesignsCreateWithoutRelDesignsCategoriesInput = {
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    material?: CatMaterialsCreateNestedOneWithoutDesignsInput
    relDesignsFiles?: RelDesignsFilesCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesCreateNestedManyWithoutDesignInput
  }

  export type DesignsUncheckedCreateWithoutRelDesignsCategoriesInput = {
    id?: number
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    materialId?: number | null
    relDesignsFiles?: RelDesignsFilesUncheckedCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesUncheckedCreateNestedManyWithoutDesignInput
  }

  export type DesignsCreateOrConnectWithoutRelDesignsCategoriesInput = {
    where: DesignsWhereUniqueInput
    create: XOR<DesignsCreateWithoutRelDesignsCategoriesInput, DesignsUncheckedCreateWithoutRelDesignsCategoriesInput>
  }

  export type CatCategoriesCreateWithoutRelDesignsCategoriesInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatCategoriesUncheckedCreateWithoutRelDesignsCategoriesInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatCategoriesCreateOrConnectWithoutRelDesignsCategoriesInput = {
    where: CatCategoriesWhereUniqueInput
    create: XOR<CatCategoriesCreateWithoutRelDesignsCategoriesInput, CatCategoriesUncheckedCreateWithoutRelDesignsCategoriesInput>
  }

  export type DesignsUpsertWithoutRelDesignsCategoriesInput = {
    update: XOR<DesignsUpdateWithoutRelDesignsCategoriesInput, DesignsUncheckedUpdateWithoutRelDesignsCategoriesInput>
    create: XOR<DesignsCreateWithoutRelDesignsCategoriesInput, DesignsUncheckedCreateWithoutRelDesignsCategoriesInput>
    where?: DesignsWhereInput
  }

  export type DesignsUpdateToOneWithWhereWithoutRelDesignsCategoriesInput = {
    where?: DesignsWhereInput
    data: XOR<DesignsUpdateWithoutRelDesignsCategoriesInput, DesignsUncheckedUpdateWithoutRelDesignsCategoriesInput>
  }

  export type DesignsUpdateWithoutRelDesignsCategoriesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    material?: CatMaterialsUpdateOneWithoutDesignsNestedInput
    relDesignsFiles?: RelDesignsFilesUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUpdateManyWithoutDesignNestedInput
  }

  export type DesignsUncheckedUpdateWithoutRelDesignsCategoriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    materialId?: NullableIntFieldUpdateOperationsInput | number | null
    relDesignsFiles?: RelDesignsFilesUncheckedUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUncheckedUpdateManyWithoutDesignNestedInput
  }

  export type CatCategoriesUpsertWithoutRelDesignsCategoriesInput = {
    update: XOR<CatCategoriesUpdateWithoutRelDesignsCategoriesInput, CatCategoriesUncheckedUpdateWithoutRelDesignsCategoriesInput>
    create: XOR<CatCategoriesCreateWithoutRelDesignsCategoriesInput, CatCategoriesUncheckedCreateWithoutRelDesignsCategoriesInput>
    where?: CatCategoriesWhereInput
  }

  export type CatCategoriesUpdateToOneWithWhereWithoutRelDesignsCategoriesInput = {
    where?: CatCategoriesWhereInput
    data: XOR<CatCategoriesUpdateWithoutRelDesignsCategoriesInput, CatCategoriesUncheckedUpdateWithoutRelDesignsCategoriesInput>
  }

  export type CatCategoriesUpdateWithoutRelDesignsCategoriesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatCategoriesUncheckedUpdateWithoutRelDesignsCategoriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DesignsCreateWithoutRelDesignsFilesInput = {
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    material?: CatMaterialsCreateNestedOneWithoutDesignsInput
    relDesignsCategories?: RelDesignsCategoriesCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesCreateNestedManyWithoutDesignInput
  }

  export type DesignsUncheckedCreateWithoutRelDesignsFilesInput = {
    id?: number
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    materialId?: number | null
    relDesignsCategories?: RelDesignsCategoriesUncheckedCreateNestedManyWithoutDesignInput
    relDesignsTypes?: RelDesignsTypesUncheckedCreateNestedManyWithoutDesignInput
  }

  export type DesignsCreateOrConnectWithoutRelDesignsFilesInput = {
    where: DesignsWhereUniqueInput
    create: XOR<DesignsCreateWithoutRelDesignsFilesInput, DesignsUncheckedCreateWithoutRelDesignsFilesInput>
  }

  export type FilesCreateWithoutRelDesignsFilesInput = {
    status?: number
    createdAt?: Date | string
    fileData: Bytes
    fileType?: CatFileTypeCreateNestedOneWithoutFilesInput
    fileExtension?: CatFileExtensionCreateNestedOneWithoutFilesInput
  }

  export type FilesUncheckedCreateWithoutRelDesignsFilesInput = {
    id?: number
    fileTypeId?: number | null
    fileExtensionId?: number | null
    status?: number
    createdAt?: Date | string
    fileData: Bytes
  }

  export type FilesCreateOrConnectWithoutRelDesignsFilesInput = {
    where: FilesWhereUniqueInput
    create: XOR<FilesCreateWithoutRelDesignsFilesInput, FilesUncheckedCreateWithoutRelDesignsFilesInput>
  }

  export type DesignsUpsertWithoutRelDesignsFilesInput = {
    update: XOR<DesignsUpdateWithoutRelDesignsFilesInput, DesignsUncheckedUpdateWithoutRelDesignsFilesInput>
    create: XOR<DesignsCreateWithoutRelDesignsFilesInput, DesignsUncheckedCreateWithoutRelDesignsFilesInput>
    where?: DesignsWhereInput
  }

  export type DesignsUpdateToOneWithWhereWithoutRelDesignsFilesInput = {
    where?: DesignsWhereInput
    data: XOR<DesignsUpdateWithoutRelDesignsFilesInput, DesignsUncheckedUpdateWithoutRelDesignsFilesInput>
  }

  export type DesignsUpdateWithoutRelDesignsFilesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    material?: CatMaterialsUpdateOneWithoutDesignsNestedInput
    relDesignsCategories?: RelDesignsCategoriesUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUpdateManyWithoutDesignNestedInput
  }

  export type DesignsUncheckedUpdateWithoutRelDesignsFilesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    materialId?: NullableIntFieldUpdateOperationsInput | number | null
    relDesignsCategories?: RelDesignsCategoriesUncheckedUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUncheckedUpdateManyWithoutDesignNestedInput
  }

  export type FilesUpsertWithoutRelDesignsFilesInput = {
    update: XOR<FilesUpdateWithoutRelDesignsFilesInput, FilesUncheckedUpdateWithoutRelDesignsFilesInput>
    create: XOR<FilesCreateWithoutRelDesignsFilesInput, FilesUncheckedCreateWithoutRelDesignsFilesInput>
    where?: FilesWhereInput
  }

  export type FilesUpdateToOneWithWhereWithoutRelDesignsFilesInput = {
    where?: FilesWhereInput
    data: XOR<FilesUpdateWithoutRelDesignsFilesInput, FilesUncheckedUpdateWithoutRelDesignsFilesInput>
  }

  export type FilesUpdateWithoutRelDesignsFilesInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
    fileType?: CatFileTypeUpdateOneWithoutFilesNestedInput
    fileExtension?: CatFileExtensionUpdateOneWithoutFilesNestedInput
  }

  export type FilesUncheckedUpdateWithoutRelDesignsFilesInput = {
    id?: IntFieldUpdateOperationsInput | number
    fileTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    fileExtensionId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
  }

  export type DesignsCreateWithoutRelDesignsTypesInput = {
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    material?: CatMaterialsCreateNestedOneWithoutDesignsInput
    relDesignsCategories?: RelDesignsCategoriesCreateNestedManyWithoutDesignInput
    relDesignsFiles?: RelDesignsFilesCreateNestedManyWithoutDesignInput
  }

  export type DesignsUncheckedCreateWithoutRelDesignsTypesInput = {
    id?: number
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
    materialId?: number | null
    relDesignsCategories?: RelDesignsCategoriesUncheckedCreateNestedManyWithoutDesignInput
    relDesignsFiles?: RelDesignsFilesUncheckedCreateNestedManyWithoutDesignInput
  }

  export type DesignsCreateOrConnectWithoutRelDesignsTypesInput = {
    where: DesignsWhereUniqueInput
    create: XOR<DesignsCreateWithoutRelDesignsTypesInput, DesignsUncheckedCreateWithoutRelDesignsTypesInput>
  }

  export type CatDesignsTypeCreateWithoutRelDesignsTypesInput = {
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatDesignsTypeUncheckedCreateWithoutRelDesignsTypesInput = {
    id?: number
    name?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type CatDesignsTypeCreateOrConnectWithoutRelDesignsTypesInput = {
    where: CatDesignsTypeWhereUniqueInput
    create: XOR<CatDesignsTypeCreateWithoutRelDesignsTypesInput, CatDesignsTypeUncheckedCreateWithoutRelDesignsTypesInput>
  }

  export type DesignsUpsertWithoutRelDesignsTypesInput = {
    update: XOR<DesignsUpdateWithoutRelDesignsTypesInput, DesignsUncheckedUpdateWithoutRelDesignsTypesInput>
    create: XOR<DesignsCreateWithoutRelDesignsTypesInput, DesignsUncheckedCreateWithoutRelDesignsTypesInput>
    where?: DesignsWhereInput
  }

  export type DesignsUpdateToOneWithWhereWithoutRelDesignsTypesInput = {
    where?: DesignsWhereInput
    data: XOR<DesignsUpdateWithoutRelDesignsTypesInput, DesignsUncheckedUpdateWithoutRelDesignsTypesInput>
  }

  export type DesignsUpdateWithoutRelDesignsTypesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    material?: CatMaterialsUpdateOneWithoutDesignsNestedInput
    relDesignsCategories?: RelDesignsCategoriesUpdateManyWithoutDesignNestedInput
    relDesignsFiles?: RelDesignsFilesUpdateManyWithoutDesignNestedInput
  }

  export type DesignsUncheckedUpdateWithoutRelDesignsTypesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    materialId?: NullableIntFieldUpdateOperationsInput | number | null
    relDesignsCategories?: RelDesignsCategoriesUncheckedUpdateManyWithoutDesignNestedInput
    relDesignsFiles?: RelDesignsFilesUncheckedUpdateManyWithoutDesignNestedInput
  }

  export type CatDesignsTypeUpsertWithoutRelDesignsTypesInput = {
    update: XOR<CatDesignsTypeUpdateWithoutRelDesignsTypesInput, CatDesignsTypeUncheckedUpdateWithoutRelDesignsTypesInput>
    create: XOR<CatDesignsTypeCreateWithoutRelDesignsTypesInput, CatDesignsTypeUncheckedCreateWithoutRelDesignsTypesInput>
    where?: CatDesignsTypeWhereInput
  }

  export type CatDesignsTypeUpdateToOneWithWhereWithoutRelDesignsTypesInput = {
    where?: CatDesignsTypeWhereInput
    data: XOR<CatDesignsTypeUpdateWithoutRelDesignsTypesInput, CatDesignsTypeUncheckedUpdateWithoutRelDesignsTypesInput>
  }

  export type CatDesignsTypeUpdateWithoutRelDesignsTypesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CatDesignsTypeUncheckedUpdateWithoutRelDesignsTypesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsCategoriesCreateManyCategoryInput = {
    id?: number
    designId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsCategoriesUpdateWithoutCategoryInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignsUpdateOneWithoutRelDesignsCategoriesNestedInput
  }

  export type RelDesignsCategoriesUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsCategoriesUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsTypesCreateManyDesignTypeInput = {
    id?: number
    designId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsTypesUpdateWithoutDesignTypeInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignsUpdateOneWithoutRelDesignsTypesNestedInput
  }

  export type RelDesignsTypesUncheckedUpdateWithoutDesignTypeInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsTypesUncheckedUpdateManyWithoutDesignTypeInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FilesCreateManyFileExtensionInput = {
    id?: number
    fileTypeId?: number | null
    status?: number
    createdAt?: Date | string
    fileData: Bytes
  }

  export type FilesUpdateWithoutFileExtensionInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
    fileType?: CatFileTypeUpdateOneWithoutFilesNestedInput
    relDesignsFiles?: RelDesignsFilesUpdateManyWithoutFileNestedInput
  }

  export type FilesUncheckedUpdateWithoutFileExtensionInput = {
    id?: IntFieldUpdateOperationsInput | number
    fileTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
    relDesignsFiles?: RelDesignsFilesUncheckedUpdateManyWithoutFileNestedInput
  }

  export type FilesUncheckedUpdateManyWithoutFileExtensionInput = {
    id?: IntFieldUpdateOperationsInput | number
    fileTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
  }

  export type FilesCreateManyFileTypeInput = {
    id?: number
    fileExtensionId?: number | null
    status?: number
    createdAt?: Date | string
    fileData: Bytes
  }

  export type FilesUpdateWithoutFileTypeInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
    fileExtension?: CatFileExtensionUpdateOneWithoutFilesNestedInput
    relDesignsFiles?: RelDesignsFilesUpdateManyWithoutFileNestedInput
  }

  export type FilesUncheckedUpdateWithoutFileTypeInput = {
    id?: IntFieldUpdateOperationsInput | number
    fileExtensionId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
    relDesignsFiles?: RelDesignsFilesUncheckedUpdateManyWithoutFileNestedInput
  }

  export type FilesUncheckedUpdateManyWithoutFileTypeInput = {
    id?: IntFieldUpdateOperationsInput | number
    fileExtensionId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fileData?: BytesFieldUpdateOperationsInput | Bytes
  }

  export type DesignsCreateManyMaterialInput = {
    id?: number
    name?: string | null
    description?: string | null
    author?: string | null
    status?: number
    createdAt?: Date | string
  }

  export type DesignsUpdateWithoutMaterialInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relDesignsCategories?: RelDesignsCategoriesUpdateManyWithoutDesignNestedInput
    relDesignsFiles?: RelDesignsFilesUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUpdateManyWithoutDesignNestedInput
  }

  export type DesignsUncheckedUpdateWithoutMaterialInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relDesignsCategories?: RelDesignsCategoriesUncheckedUpdateManyWithoutDesignNestedInput
    relDesignsFiles?: RelDesignsFilesUncheckedUpdateManyWithoutDesignNestedInput
    relDesignsTypes?: RelDesignsTypesUncheckedUpdateManyWithoutDesignNestedInput
  }

  export type DesignsUncheckedUpdateManyWithoutMaterialInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    author?: NullableStringFieldUpdateOperationsInput | string | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsCategoriesCreateManyDesignInput = {
    id?: number
    categoryId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsFilesCreateManyDesignInput = {
    id?: number
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsTypesCreateManyDesignInput = {
    id?: number
    typeId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsCategoriesUpdateWithoutDesignInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CatCategoriesUpdateOneWithoutRelDesignsCategoriesNestedInput
  }

  export type RelDesignsCategoriesUncheckedUpdateWithoutDesignInput = {
    id?: IntFieldUpdateOperationsInput | number
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsCategoriesUncheckedUpdateManyWithoutDesignInput = {
    id?: IntFieldUpdateOperationsInput | number
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesUpdateWithoutDesignInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    file?: FilesUpdateOneWithoutRelDesignsFilesNestedInput
  }

  export type RelDesignsFilesUncheckedUpdateWithoutDesignInput = {
    id?: IntFieldUpdateOperationsInput | number
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesUncheckedUpdateManyWithoutDesignInput = {
    id?: IntFieldUpdateOperationsInput | number
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsTypesUpdateWithoutDesignInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    designType?: CatDesignsTypeUpdateOneWithoutRelDesignsTypesNestedInput
  }

  export type RelDesignsTypesUncheckedUpdateWithoutDesignInput = {
    id?: IntFieldUpdateOperationsInput | number
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsTypesUncheckedUpdateManyWithoutDesignInput = {
    id?: IntFieldUpdateOperationsInput | number
    typeId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesCreateManyFileInput = {
    id?: number
    designId?: number | null
    status?: number
    createdAt?: Date | string
  }

  export type RelDesignsFilesUpdateWithoutFileInput = {
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    design?: DesignsUpdateOneWithoutRelDesignsFilesNestedInput
  }

  export type RelDesignsFilesUncheckedUpdateWithoutFileInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelDesignsFilesUncheckedUpdateManyWithoutFileInput = {
    id?: IntFieldUpdateOperationsInput | number
    designId?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



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
/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as media from "../media.js";
import type * as mediaViews from "../mediaViews.js";
import type * as menus from "../menus.js";
import type * as privatePages from "../privatePages.js";
import type * as questions from "../questions.js";
import type * as recipes from "../recipes.js";
import type * as seed from "../seed.js";
import type * as staffAuth from "../staffAuth.js";
import type * as tests from "../tests.js";
import type * as usage from "../usage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  media: typeof media;
  mediaViews: typeof mediaViews;
  menus: typeof menus;
  privatePages: typeof privatePages;
  questions: typeof questions;
  recipes: typeof recipes;
  seed: typeof seed;
  staffAuth: typeof staffAuth;
  tests: typeof tests;
  usage: typeof usage;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

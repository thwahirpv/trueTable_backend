/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai_marketing from "../ai/marketing.js";
import type * as ai_supply from "../ai/supply.js";
import type * as analytics from "../analytics.js";
import type * as customers from "../customers.js";
import type * as integrations_whatsapp from "../integrations/whatsapp.js";
import type * as inventory from "../inventory.js";
import type * as marketing from "../marketing.js";
import type * as orders from "../orders.js";
import type * as restaurants from "../restaurants.js";
import type * as staff from "../staff.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "ai/marketing": typeof ai_marketing;
  "ai/supply": typeof ai_supply;
  analytics: typeof analytics;
  customers: typeof customers;
  "integrations/whatsapp": typeof integrations_whatsapp;
  inventory: typeof inventory;
  marketing: typeof marketing;
  orders: typeof orders;
  restaurants: typeof restaurants;
  staff: typeof staff;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

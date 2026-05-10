import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { StorageBalanceResult } from "near-social-js";
// ============================================
export async function near_social_js_storage_balance_of_fun(
	accountId: string
): Promise<StorageBalanceResult | null> {
	// =================
	const result = await near_social_client(near_kit_client()).storageBalanceOf(accountId);
	// =================
	console.log("=================");
	console.log("storageBalanceOf()");
	console.log({ accountId });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

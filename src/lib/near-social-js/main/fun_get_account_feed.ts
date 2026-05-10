import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { AccountFeedOptions, IndexEntry } from "near-social-js";
// ============================================
export async function near_social_js_get_account_feed_fun(
	accountId: string,
	options?: AccountFeedOptions
): Promise<IndexEntry[]> {
	// =================
	const result = await near_social_client(near_kit_client()).getAccountFeed(accountId, options);
	// =================
	console.log("=================");
	console.log("getAccountFeed()");
	console.log({ accountId, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

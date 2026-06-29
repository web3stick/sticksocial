import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { FeedOptions, IndexEntry } from "near-social-js";
// ============================================
export async function near_social_js_get_profile_reposts_fun(
	accountId: string,
	options?: FeedOptions
): Promise<IndexEntry[]> {
	// =================
	const result = (await near_social_client(near_kit_client()).index({
		action: "repost",
		key: "main",
		accountId,
		order: options?.order,
		limit: options?.limit,
		from: options?.from
	})) as IndexEntry[];
	// =================
	console.log("=================");
	console.log("getAccountReposts()");
	console.log({ accountId, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result ?? [];
}
// ============================================

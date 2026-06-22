import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { FeedOptions, IndexEntry } from "near-social-js";
// ============================================
// returns the comments made by `accountId`, newest first.
//
// this works because fun_create_comment.ts writes a DUAL-INDEX entry —
// both under key=<parentItem> (existing SDK behavior) AND under
// key="main" (new behavior, mirroring the repost pattern). the api-server
// (api-server-js/src/social.js indexValue) already handles the array
// shape and pushes each {key, value} pair into its own bucket, so
// /index?action=comment&key=main&accountId=X returns every comment by X.
//
// LIMITATION: only comments written after the dual-index patch are
// queryable by author. comments written with the old single-key format
// remain visible only via their parent post (comments_list.svelte).
export async function near_social_js_get_account_comments_fun(
	accountId: string,
	options?: FeedOptions
): Promise<IndexEntry[]> {
	// =================
	const result = (await near_social_client(near_kit_client()).index({
		action: "comment",
		key: "main",
		accountId,
		order: options?.order,
		limit: options?.limit,
		from: options?.from
	})) as IndexEntry[];
	// =================
	console.log("=================");
	console.log("getAccountComments()");
	console.log({ accountId, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result ?? [];
}
// ============================================

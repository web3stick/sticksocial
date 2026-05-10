import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { FeedOptions, Notification } from "near-social-js";
// ============================================
export async function near_social_js_get_mentioned_feed_fun(
	accountId: string,
	options?: FeedOptions
): Promise<Notification[]> {
	// =================
	const result = await near_social_client(near_kit_client()).getMentionedFeed(accountId, options);
	// =================
	console.log("=================");
	console.log("getMentionedFeed()");
	console.log({ accountId, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
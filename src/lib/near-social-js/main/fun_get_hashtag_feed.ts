import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { FeedOptions, IndexEntry } from "near-social-js";
// ============================================
export async function near_social_js_get_hashtag_feed_fun(
	hashtag: string,
	options?: FeedOptions
): Promise<IndexEntry[]> {
	// =================
	const result = await near_social_client(near_kit_client()).getHashtagFeed(hashtag, options);
	// =================
	console.log("=================");
	console.log("getHashtagFeed()");
	console.log({ hashtag, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
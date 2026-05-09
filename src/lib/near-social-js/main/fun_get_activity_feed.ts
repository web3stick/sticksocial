import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { FeedOptions } from "near-social-js";
// ============================================
export async function get_activity_feed(options?: FeedOptions) {
	const result = await near_social_client(near_kit_client).getActivityFeed(options);
	console.log("=================");
	console.log("getActivityFeed()");
	console.log("=================");
	console.log(result);
	console.log("=================");
	return result;
}
// ============================================

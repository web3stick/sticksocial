import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface NEAR_SOCIAL_JS_FEED_OPTIONS {
	limit?: number;
	from?: number;
	order?: "asc" | "desc";
}
// ============================================
export async function get_activity_feed(options?: NEAR_SOCIAL_JS_FEED_OPTIONS) {
	const result = await near_social_client(near_kit_client()).getActivityFeed(options);
	console.log("=================");
	console.log("getActivityFeed()");
	console.log("=================");
	console.log(result);
	console.log("=================");
	return result;
}
// ============================================

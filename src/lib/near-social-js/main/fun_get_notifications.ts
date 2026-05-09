import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { FeedOptions } from "near-social-js";
// ============================================
export async function get_notifications(accountId: string, options?: FeedOptions) {
	const result = await near_social_client(near_kit_client).getNotifications(accountId, options);
	console.log("=================");
	console.log("getNotifications()");
	console.log("=================");
	console.log(result);
	console.log("=================");
	return result;
}
// ============================================
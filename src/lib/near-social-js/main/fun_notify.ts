import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem } from "near-social-js";
// ============================================
export async function near_social_js_notify_fun(
	signerId: string,
	targetAccountId: string,
	item?: CommentItem,
	type?: string
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).notify(
		signerId,
		targetAccountId,
		item,
		type
	);
	// =================
	console.log("=================");
	console.log("notify()");
	console.log({ signerId, targetAccountId, item, type });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

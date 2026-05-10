import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem } from "near-social-js";
// ============================================
export async function near_social_js_unlike_fun(signerId: string, item: CommentItem): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).unlike(signerId, item);
	// =================
	console.log("=================");
	console.log("unlike()");
	console.log({ signerId, item });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

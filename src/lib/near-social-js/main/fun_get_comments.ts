import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem, IndexEntry } from "near-social-js";
// ============================================
export async function near_social_js_get_comments_fun(
	item: CommentItem
): Promise<IndexEntry[]> {
	// =================
	console.log("=================");
	console.log("getComments()");
	console.log({ item });
	console.log("=================");
	// =================
	const result = await near_social_client(near_kit_client()).getComments(item);
	// =================
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
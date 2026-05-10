import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem, IndexEntry } from "near-social-js";
// ============================================
export async function near_social_js_get_reposts_fun(item: CommentItem): Promise<IndexEntry[]> {
	// =================
	const result = await near_social_client(near_kit_client()).getReposts(item);
	// =================
	console.log("=================");
	console.log("getReposts()");
	console.log({ item });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

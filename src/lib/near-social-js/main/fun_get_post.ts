import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem, Post } from "near-social-js";
// ============================================
interface GetPostOptions {
	comments?: boolean;
}
// ============================================
export async function near_social_js_get_post_fun(
	accountId: string,
	blockHeight: number,
	options?: GetPostOptions
): Promise<(Post & { comments?: any[] }) | null> {
	// =================
	const result = await near_social_client(near_kit_client()).getPost(
		accountId,
		blockHeight,
		options
	);
	// =================
	console.log("=================");
	console.log("getPost()");
	console.log({ accountId, blockHeight, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

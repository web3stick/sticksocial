import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { Comment } from "near-social-js";
// ============================================
export async function near_social_js_create_comment_fun(
	signerId: string,
	comment: Comment
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).createComment(signerId, comment);
	// =================
	console.log("=================");
	console.log("createComment()");
	console.log({ signerId, comment });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
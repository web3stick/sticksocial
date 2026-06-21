import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { Post } from "near-social-js";
// ============================================
export async function near_social_js_create_post_fun(signerId: string, post: Post): Promise<any> {
	// =================
	const builder = await near_social_client(near_kit_client()).createPost(signerId, post);
	const result = await builder.send();
	// =================
	console.log("=================");
	console.log("createPost()");
	console.log({ signerId, post });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

import { near_social_js_get_fun } from "../main/fun_get";
import type { Post } from "near-social-js";
// ============================================
export async function get_account_id_post(
	accountId: string,
	blockHeight: bigint
): Promise<Post | null> {
	const keys = [`${accountId}/post/main`];
	const result = await near_social_js_get_fun({ keys, blockHeight });
	if (!result) return null;
	const accountData = result[accountId] as { post?: { main?: string } } | undefined;
	const mainData = accountData?.post?.main;
	if (!mainData) return null;
	if (typeof mainData === "string") {
		try {
			return JSON.parse(mainData);
		} catch {
			return mainData as unknown as Post;
		}
	}
	return mainData as unknown as Post;
}
// ============================================

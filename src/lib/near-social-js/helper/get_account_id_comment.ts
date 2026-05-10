import { near_social_js_get_fun } from "../main/fun_get";
import type { CommentItem } from "near-social-js";
// ============================================
export interface Comment {
	item: CommentItem;
	type: string;
	text: string;
	image?: {
		ipfs_cid?: string;
		url?: string;
	};
}
// ============================================
export async function get_account_id_comment(
	accountId: string,
	blockHeight: bigint,
): Promise<Comment | null> {
	const keys = [`${accountId}/post/comment`];
	const result = await near_social_js_get_fun({ keys, blockHeight });
	if (!result) return null;
	const accountData = result[accountId] as { post?: { comment?: string } } | undefined;
	const commentStr = accountData?.post?.comment;
	if (!commentStr) return null;
	if (typeof commentStr === "string") {
		try {
			return JSON.parse(commentStr);
		} catch {
			return commentStr as unknown as Comment;
		}
	}
	return commentStr as unknown as Comment;
}
// ============================================
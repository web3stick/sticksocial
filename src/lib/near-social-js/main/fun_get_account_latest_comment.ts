import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { Comment } from "../helper/get_account_id_comment";
// ============================================
export interface AccountLatestComment {
	comment: Comment;
	parentHref: string;
}
// ============================================
// fetches the most recent comment by `accountId` from the social DB.
//
// the social.near contract stores only the LATEST comment per account at
// <accountId>/post/comment — every new comment overwrites the previous
// one. there is no per-commenter history. (posts behave differently:
// every post is indexed under the literal key "main", so the API can
// return N posts per user. comments are keyed by parent post, so they
// can't be enumerated the same way.)
//
// this helper does what the social DB supports today: fetch the most
// recent comment by user X. if the contract is ever extended to retain
// per-commenter history (or the API gains a /index action keyed by
// signer), this is the single place to swap.
export async function near_social_js_get_account_latest_comment_fun(
	accountId: string
): Promise<AccountLatestComment | null> {
	// =================
	const result = (await near_social_client(near_kit_client()).get({
		keys: [`${accountId}/post/comment`]
	})) as Record<string, { post?: { comment?: string } } | undefined> | null;
	// =================
	console.log("=================");
	console.log("getAccountLatestComment()");
	console.log({ accountId });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	const commentStr = result?.[accountId]?.post?.comment;
	if (!commentStr) return null;
	let comment: Comment;
	try {
		comment = typeof commentStr === "string" ? JSON.parse(commentStr) : (commentStr as Comment);
	} catch {
		return null;
	}
	if (!comment.item?.path || comment.item.blockHeight == null) return null;
	// item.path is "<parentAuthor>/post/main"; extract parentAuthor so we
	// can deep-link to the parent post.
	const parentAuthor = comment.item.path.split("/")[0];
	const parentHref = `/post/${parentAuthor}/${comment.item.blockHeight}`;
	return { comment, parentHref };
}
// ============================================

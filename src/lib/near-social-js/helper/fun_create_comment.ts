import { near_social_js_set_fun } from "../main/fun_set";
import type { Comment, CommentItem } from "near-social-js";
// ============================================
// extension of near-social-js's Comment carrying an optional rootItem
// (the top-of-thread post) so the on-chain content shape matches the
// old NEAR Social widget (mob.near/widget/MainPage.N.Comment.Compose).
// see fun_create_comment.ts header for context.
export type CommentWithRoot = Comment & { rootItem?: CommentItem };
// ============================================
// ============================================
// same write-permission fix as like(): all notify entries go under the
// signer's own index with `key` pointing at the target account, so
// social.near can forward the notification without the signer needing
// write permission on someone else's keys.
//
// also restores the @mention / #hashtag extraction that the SDK's
// built-in createComment did before we rewrote it — comments notify
// each @mentioned account and tag the comment under each #hashtag
// so it shows up in hashtag feeds.
//
// DUAL-INDEX: the SDK's createComment writes only a single index entry
// keyed by the parent post item, so /index?action=comment&key=main
// always returns []. we mirror the repost pattern (fun_repost.ts) and
// also write an entry under key="main" so /index with key="main" +
// accountId=X returns every comment by X going forward. the api-server
// (api-server-js/src/social.js indexValue) already handles arrays via
// Array.isArray(parsed) — no server-side change needed.
//
// ROOT-ITEM: the old NEAR Social widget (mob.near/widget/MainPage.N.
// Comment.Compose) stored rootItem alongside item in the comment
// content so consumers can rebuild the full thread without an extra
// lookup. the SDK drops rootItem; we restore it. callers should pass
// rootItem whenever item is itself a comment (i.e. a reply); for top-
// level comments item === rootItem. when rootItem is omitted we fall
// back to item, matching the SDK behavior.
//
// NOTE: only comments made AFTER this patch are queryable by author
// via the dual-index bucket. existing on-chain comments written with
// the old single-key format are not backfilled — they remain queryable
// only via their parent post (the existing comments_list.svelte path
// still works).
// ============================================
const MENTION_REGEX = /@([a-z\d]+[-_]*[a-z\d]*(?:\.[a-z\d]+[-_]*[a-z\d]*)*)/gi;
const HASHTAG_REGEX = /#([a-zA-Z][a-zA-Z0-9_]*)/g;
// ============================================
function extract_mentions(text: string): string[] {
	const matches = text.match(MENTION_REGEX);
	if (!matches) return [];
	const ids = matches
		.map((m) => m.slice(1).toLowerCase())
		.filter((id) => /^[a-z0-9][a-z0-9_-]*(\.[a-z0-9][a-z0-9_-]*)*$/.test(id));
	return [...new Set(ids)];
}
// ============================================
function extract_hashtags(text: string): string[] {
	const matches = text.match(HASHTAG_REGEX);
	if (!matches) return [];
	return [...new Set(matches.map((m) => m.slice(1).toLowerCase()))];
}
// ============================================
export async function near_social_js_create_comment_fun(
	signerId: string,
	comment: CommentWithRoot
): Promise<any> {
	// =================
	const { item, rootItem, text, image } = comment;
	const postAuthor = item.path.split("/")[0];
	const mentions = extract_mentions(text);
	const hashtags = extract_hashtags(text);
	const commentContent: Record<string, any> = { item, text, type: "md" };
	if (rootItem) commentContent.rootItem = rootItem;
	if (image) commentContent.image = image;
	const data: Record<string, any> = {
		[signerId]: {
			post: {
				comment: JSON.stringify(commentContent)
			},
			index: {
				comment: JSON.stringify([
					{ key: item, value: { type: "md" } },
					{ key: "main", value: { type: "md" } }
				])
			}
		}
	};
	// hashtag index entries go under the signer's own keys
	if (hashtags.length > 0) {
		const hashtag_indexes = hashtags.map((tag) => ({
			key: tag,
			value: { type: "hashtag", path: `${signerId}/post/comment` }
		}));
		data[signerId].index.hashtag = JSON.stringify(
			hashtag_indexes.length === 1 ? hashtag_indexes[0] : hashtag_indexes
		);
	}
	// notify the post author (if different) + each mentioned account
	const commentItem = {
		type: "social",
		path: `${signerId}/post/comment`
	} as const;
	const notifies: Array<{ key: string; value: any }> = [];
	if (postAuthor && postAuthor !== signerId) {
		notifies.push({ key: postAuthor, value: { type: "comment", accountId: signerId, item } });
	}
	for (const mentionedAccount of mentions) {
		if (mentionedAccount !== signerId && mentionedAccount !== postAuthor) {
			notifies.push({
				key: mentionedAccount,
				value: { type: "mention", accountId: signerId, item: commentItem }
			});
		}
	}
	if (notifies.length === 1) {
		data[signerId].index.notify = JSON.stringify(notifies[0]);
	} else if (notifies.length > 1) {
		data[signerId].index.notify = JSON.stringify(notifies);
	}
	const result = await near_social_js_set_fun({
		signerId,
		data
	});
	// =================
	console.log("=================");
	console.log("createComment()");
	console.log({ signerId, comment, mentions, hashtags });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

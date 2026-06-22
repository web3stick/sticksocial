import type { FeedOptions, IndexEntry } from "near-social-js";
// ============================================
// comment INDEX entries on the NEAR Social DB are keyed by the parent
// post item ({ type, path, blockHeight }), not by the comment author.
// the API requires a non-empty key and will not return "all comments by
// author X". the SDK's own getAccountFeed({ includeReplies: true }) is
// silently broken on this exact code path.
//
// until the API supports an actor / author filter for the comment index
// (or the SDK exposes one), this helper returns []. the comment_feed
// widget built on top of it degrades to an empty list and the
// /profile/[accountId]/comments tab renders a placeholder.
//
// kept as a named helper so the SDK quirks are isolated and the
// feature can be re-enabled by swapping the body once the API supports
// it.
export async function near_social_js_get_account_comments_fun(
	accountId: string,
	options?: FeedOptions
): Promise<IndexEntry[]> {
	// =================
	console.log("=================");
	console.log("getAccountComments()");
	console.log({ accountId, options });
	console.log("(no-op: API has no author-keyed comment index)");
	console.log("=================");
	// =================
	return [];
}
// ============================================

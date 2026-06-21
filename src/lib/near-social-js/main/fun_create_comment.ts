import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { Comment } from "near-social-js";
// ============================================
// same write-permission fix as like(): all notify entries go under the
// signer's own index with `key` pointing at the target account, so
// social.near can forward the notification without the signer needing
// write permission on someone else's keys.
// ============================================
export async function near_social_js_create_comment_fun(
	signerId: string,
	comment: Comment
): Promise<any> {
	// =================
	const { item, text, image } = comment;
	const postAuthor = item.path.split("/")[0];
	const commentContent: Record<string, any> = { item, text, type: "md" };
	if (image) commentContent.image = image;
	const data: Record<string, any> = {
		[signerId]: {
			post: {
				comment: JSON.stringify(commentContent)
			},
			index: {
				comment: JSON.stringify({ key: item, value: { type: "md" } })
			}
		}
	};
	const notifies: Array<{ key: string; value: any }> = [];
	if (postAuthor && postAuthor !== signerId) {
		notifies.push({ key: postAuthor, value: { type: "comment", accountId: signerId, item } });
	}
	if (notifies.length === 1) {
		data[signerId].index.notify = JSON.stringify(notifies[0]);
	} else if (notifies.length > 1) {
		data[signerId].index.notify = JSON.stringify(notifies);
	}
	const result = await near_social_client(near_kit_client()).set({
		signerId,
		data
	});
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
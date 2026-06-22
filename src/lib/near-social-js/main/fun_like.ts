import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem } from "near-social-js";
// ============================================
// near-social-js's like() writes the notify entry under the
// postAuthor's own index/notify, which requires the signer to have
// write permission on the postAuthor's keys (which nobody grants).
// the working pattern (see NEARBuilders/decentralized-social) is to
// write both like + notify under the signer's own index, with the
// notify entry's `key` set to the postAuthor so social.near forwards
// the notification correctly.
// ============================================
export async function near_social_js_like_fun(signerId: string, item: CommentItem): Promise<any> {
	// =================
	const postAuthor = item.path.split("/")[0];
	const data: Record<string, any> = {
		[signerId]: {
			index: {
				like: JSON.stringify({ key: item, value: { type: "like" } })
			}
		}
	};
	if (postAuthor && postAuthor !== signerId) {
		data[signerId].index.notify = JSON.stringify({
			key: postAuthor,
			value: { type: "like", item }
		});
	}
	const builder = await near_social_client(near_kit_client()).set({
		signerId,
		data
	});
	const result = await builder.send();
	// =================
	console.log("=================");
	console.log("like()");
	console.log({ signerId, item });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

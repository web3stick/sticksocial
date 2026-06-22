import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem } from "near-social-js";
// ============================================
// same write-permission fix as like(): notify goes under the signer's
// own index, with key set to the post author.
// ============================================
export async function near_social_js_repost_fun(signerId: string, item: CommentItem): Promise<any> {
	// =================
	const postAuthor = item.path.split("/")[0];
	const data: Record<string, any> = {
		[signerId]: {
			index: {
				repost: JSON.stringify([
					{ key: "main", value: { type: "repost", item } },
					{ key: item, value: { type: "repost" } }
				])
			}
		}
	};
	if (postAuthor && postAuthor !== signerId) {
		data[signerId].index.notify = JSON.stringify({
			key: postAuthor,
			value: { type: "repost", accountId: signerId, item }
		});
	}
	const builder = await near_social_client(near_kit_client()).set({
		signerId,
		data
	});
	const result = await builder.send();
	// =================
	console.log("=================");
	console.log("repost()");
	console.log({ signerId, item });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { CommentItem } from "near-social-js";
// ============================================
// unlike only writes to the signer's own index/like — no notify.
// ============================================
export async function near_social_js_unlike_fun(signerId: string, item: CommentItem): Promise<any> {
	// =================
	const data = {
		[signerId]: {
			index: {
				like: JSON.stringify({ key: item, value: { type: "unlike" } })
			}
		}
	};
	const builder = await near_social_client(near_kit_client()).set({
		signerId,
		data
	});
	const result = await builder.send();
	// =================
	console.log("=================");
	console.log("unlike()");
	console.log({ signerId, item });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

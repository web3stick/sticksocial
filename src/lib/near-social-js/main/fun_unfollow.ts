import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_unfollow_fun(
	signerId: string,
	accountId: string
): Promise<any> {
	// =================
	const builder = await near_social_client(near_kit_client()).unfollow(signerId, accountId);
	const result = await builder.send();
	// =================
	console.log("=================");
	console.log("unfollow()");
	console.log({ signerId, accountId });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

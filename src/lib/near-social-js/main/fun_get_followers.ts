import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_get_followers_fun(
	accountId: string
): Promise<{ accountId: string }[]> {
	// =================
	const result = await near_social_client(near_kit_client()).getFollowers(accountId);
	// =================
	console.log("=================");
	console.log("getFollowers()");
	console.log({ accountId });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_follow_fun(signerId: string, accountId: string): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).follow(signerId, accountId);
	// =================
	console.log("=================");
	console.log("follow()");
	console.log({ signerId, accountId });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

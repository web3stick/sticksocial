import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_poke_fun(
	signerId: string,
	targetAccountId: string
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).poke(signerId, targetAccountId);
	// =================
	console.log("=================");
	console.log("poke()");
	console.log({ signerId, targetAccountId });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

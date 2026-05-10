import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_get_account_fun(
	accountId: string
): Promise<Record<string, unknown> | null> {
	// =================
	const result = await near_social_client(near_kit_client()).getAccount({ accountId });
	// =================
	console.log("=================");
	console.log("getAccount()");
	console.log({ accountId });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

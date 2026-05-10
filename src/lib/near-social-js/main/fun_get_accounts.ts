import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface NEAR_SOCIAL_JS_GET_ACCOUNTS_OPTIONS {
	fromIndex?: number;
	limit?: number;
}
// ============================================
export async function near_social_js_get_accounts_fun(
	options: NEAR_SOCIAL_JS_GET_ACCOUNTS_OPTIONS
): Promise<Record<string, any> | null> {
	const result = (await near_social_client(near_kit_client()).getAccounts(options)) as Record<
		string,
		any
	> | null;
	// =================
	console.log("=================");
	console.log("getAccounts()");
	console.log(options);
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface NEAR_SOCIAL_JS_SET_OPTIONS {
	signerId: string;
	data: Record<string, Record<string, unknown>>;
	deposit?: string;
	refundUnusedDeposit?: boolean;
}
// ============================================
export async function near_social_js_set_fun(options: NEAR_SOCIAL_JS_SET_OPTIONS): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).set(options);
	// =================
	console.log("=================");
	console.log("set()");
	console.log(options);
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

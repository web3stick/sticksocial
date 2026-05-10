import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export interface NEAR_SOCIAL_JS_GET_OPTIONS {
	keys: string[];
	blockHeight?: bigint;
	returnDeleted?: boolean;
	withBlockHeight?: boolean;
	withNodeId?: boolean;
	withTimestamp?: boolean;
	useApiServer?: boolean;
}
// ============================================
export async function near_social_js_get_fun(
	options: NEAR_SOCIAL_JS_GET_OPTIONS
): Promise<Record<string, any> | null> {
	const result = (await near_social_client(near_kit_client()).get(options)) as Record<
		string,
		any
	> | null;
	// =================
	console.log("=================");
	console.log("get()");
	console.log(options.keys.join(","));
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

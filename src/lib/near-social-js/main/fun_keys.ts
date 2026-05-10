import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface NEAR_SOCIAL_JS_KEYS_OPTIONS {
	keys: string[];
	blockHeight?: bigint;
	returnDeleted?: boolean;
	returnType?: string;
	valuesOnly?: boolean;
	useApiServer?: boolean;
}
// ============================================
export async function near_social_js_keys_fun(
	options: NEAR_SOCIAL_JS_KEYS_OPTIONS
): Promise<Record<string, any> | null> {
	// =================
	const result = (await near_social_client(near_kit_client()).keys(options)) as Record<
		string,
		any
	> | null;
	// =================
	console.log("=================");
	console.log("keys()");
	console.log(options.keys.join(","));
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

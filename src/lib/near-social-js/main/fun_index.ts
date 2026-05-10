import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface NEAR_SOCIAL_JS_INDEX_OPTIONS {
	action: string;
	key: string | {
		type?: string;
		path?: string;
		blockHeight?: number;
	};
	accountId?: string | string[];
	order?: "asc" | "desc";
	limit?: number;
	from?: number;
}
// ============================================
export async function near_social_js_index_fun(
	options: NEAR_SOCIAL_JS_INDEX_OPTIONS
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).index(options);
	// =================
	console.log("=================");
	console.log("index()");
	console.log(options);
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_get_fun(keys: string[]): Promise<Record<string, any> | null> {
	// =================
	const result = (await near_social_client(near_kit_client).get({ keys })) as Record<
		string,
		any
	> | null;
	// =================
	console.log("=================");
	console.log("get()");
	console.log(keys.join(","));
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

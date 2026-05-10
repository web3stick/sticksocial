import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_get_version_fun(): Promise<string> {
	// =================
	const result = await near_social_client(near_kit_client()).getVersion();
	// =================
	console.log("=================");
	console.log("getVersion()");
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
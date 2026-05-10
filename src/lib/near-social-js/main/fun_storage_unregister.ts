import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_storage_unregister_fun(
	signerId: string,
	force?: boolean
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).storageUnregister({ signerId, force });
	// =================
	console.log("=================");
	console.log("storageUnregister()");
	console.log({ signerId, force });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
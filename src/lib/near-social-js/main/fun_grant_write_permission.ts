import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_grant_write_permission_fun(
	signerId: string,
	keys: string[],
	options?: {
		granteeAccountId?: string;
		granteePublicKey?: string;
	}
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).grantWritePermission({
		signerId,
		keys,
		...options,
	});
	// =================
	console.log("=================");
	console.log("grantWritePermission()");
	console.log({ signerId, keys, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
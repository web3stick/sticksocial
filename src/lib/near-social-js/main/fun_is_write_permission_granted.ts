import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
interface IsWritePermissionGrantedOptions {
	key: string;
	granteeAccountId?: string;
	granteePublicKey?: string;
}
// ============================================
export async function near_social_js_is_write_permission_granted_fun(
	options: IsWritePermissionGrantedOptions
): Promise<boolean> {
	// =================
	const result = await near_social_client(near_kit_client()).isWritePermissionGranted(options);
	// =================
	console.log("=================");
	console.log("isWritePermissionGranted()");
	console.log(options);
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_storage_withdraw_fun(
	signerId: string,
	amount?: string
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).storageWithdraw({ signerId, amount });
	// =================
	console.log("=================");
	console.log("storageWithdraw()");
	console.log({ signerId, amount });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
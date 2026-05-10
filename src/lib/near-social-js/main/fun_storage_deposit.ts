import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_storage_deposit_fun(
	signerId: string,
	deposit: string,
	options?: {
		accountId?: string;
		registrationOnly?: boolean;
	}
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).storageDeposit({
		signerId,
		deposit,
		...options
	});
	// =================
	console.log("=================");
	console.log("storageDeposit()");
	console.log({ signerId, options });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
// ============================================
export async function near_social_js_get_contract_id_fun(): Promise<string> {
	// =================
	const result = await near_social_client(near_kit_client()).getContractId();
	// =================
	console.log("=================");
	console.log("getContractId()");
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
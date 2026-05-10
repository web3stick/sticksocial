import { near_kit_client } from "@near-kit-tool-box/web";
import { near_social_client } from "../new";
import type { Profile } from "near-social-js";
// ============================================
export async function near_social_js_set_profile_fun(
	signerId: string,
	profile: Partial<Profile>
): Promise<any> {
	// =================
	const result = await near_social_client(near_kit_client()).setProfile(signerId, profile);
	// =================
	console.log("=================");
	console.log("setProfile()");
	console.log({ signerId, profile });
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================
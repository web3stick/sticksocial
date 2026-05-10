import { z } from "zod";
import { near_social_js_get_fun } from "../main/fun_get";
import { account_id_profile_schema } from "../../types/account_id_profile";
// ============================================
export async function get_account_id_profile(
	accountId: string
): Promise<z.infer<typeof account_id_profile_schema> | null> {
	const keys = [`${accountId}/profile/**`];
	const result = await near_social_js_get_fun({ keys });

	if (!result) return null;

	const accountData = result[accountId] as { profile?: unknown } | undefined;
	const profile = accountData?.profile ?? null;

	if (!profile) return null;

	return account_id_profile_schema.parse(profile);
}
// ============================================

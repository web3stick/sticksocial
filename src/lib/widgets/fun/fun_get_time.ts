import { const_api_near_social, const_api_near_social_endpoints } from "../../ts/const";
// ============================================
export async function get_time_fun(blockHeight?: number): Promise<{ timestamp: number }> {
	const url =
		blockHeight !== undefined
			? `${const_api_near_social}${const_api_near_social_endpoints.time}?blockHeight=${blockHeight}`
			: `${const_api_near_social}${const_api_near_social_endpoints.time}`;
	const response = await fetch(url);
	return (await response.json()) as { timestamp: number };
}
// ============================================

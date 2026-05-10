import { const_api_near_social, const_api_near_social_endpoints } from "../../ts/const";
// ============================================
export async function get_time_fun(
	blockHeight?: number,
): Promise<{ timestamp: number } | null> {
	const url =
		blockHeight !== undefined
			? `${const_api_near_social}${const_api_near_social_endpoints.time}?blockHeight=${blockHeight}`
			: `${const_api_near_social}${const_api_near_social_endpoints.time}`;
	try {
		const response = await fetch(url);
		if (!response.ok) return null;
		const text = await response.text();
		if (text === "null" || text === "" || text === "error") return null;
		const parsed = JSON.parse(text);
		let timestamp: number | undefined;
		if (typeof parsed === "number") {
			timestamp = parsed;
		} else if (parsed && typeof parsed.timestamp === "number") {
			timestamp = parsed.timestamp;
		}
		if (timestamp === undefined) return null;
		return { timestamp };
	} catch {
		return null;
	}
}
// ============================================

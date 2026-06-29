import { near_social_js_index_fun } from "./fun_index";
import type { IndexEntry } from "near-social-js";
// ============================================
interface NEAR_SOCIAL_JS_UNIFIED_FEED_OPTIONS {
	limit?: number;
	from?: number;
	order?: "asc" | "desc";
}
// ============================================
export async function get_unified_feed(
	options?: NEAR_SOCIAL_JS_UNIFIED_FEED_OPTIONS
): Promise<IndexEntry[]> {
	// =================
	const [posts, reposts, comments] = await Promise.all([
		near_social_js_index_fun({ action: "post", key: "main", ...options }),
		near_social_js_index_fun({ action: "repost", key: "main", ...options }),
		near_social_js_index_fun({ action: "comment", key: "main", ...options })
	]);
	// =================
	const all: IndexEntry[] = [...(posts ?? []), ...(reposts ?? []), ...(comments ?? [])];
	// =================
	const seen = new Set<string>();
	const unique = all.filter((entry) => {
		const key = `${entry.accountId}-${entry.blockHeight}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	// =================
	unique.sort((a, b) =>
		options?.order === "asc" ? a.blockHeight - b.blockHeight : b.blockHeight - a.blockHeight
	);
	// =================
	let result: IndexEntry[];
	const limit = options?.limit ?? 10;
	const from = options?.from;
	if (from !== undefined) {
		const fromIndex = unique.findIndex((e) => e.blockHeight <= from);
		if (fromIndex >= 0) {
			result = unique.slice(fromIndex, fromIndex + limit);
		} else {
			result = unique.slice(0, limit);
		}
	} else {
		result = unique.slice(0, limit);
	}
	// =================
	console.log("=================");
	console.log("get_unified_feed()");
	console.log(options);
	console.log("=================");
	console.log(result);
	console.log("=================");
	// =================
	return result;
}
// ============================================

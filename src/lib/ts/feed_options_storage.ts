import {
	DEFAULT_FEED_OPTIONS,
	FEED_OPTIONS_SCHEMA,
	type FEED_OPTIONS_TYPE
} from "$lib/types/feed_options";
// ============================================
const STORAGE_KEY = "feed_options";
// ============================================
export function load_feed_options(): FEED_OPTIONS_TYPE {
	if (typeof localStorage === "undefined") return DEFAULT_FEED_OPTIONS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_FEED_OPTIONS;
		const parsed = JSON.parse(raw);
		const result = FEED_OPTIONS_SCHEMA.safeParse(parsed);
		if (!result.success) return DEFAULT_FEED_OPTIONS;
		return result.data;
	} catch {
		return DEFAULT_FEED_OPTIONS;
	}
}
// ============================================
export function save_feed_options(options: FEED_OPTIONS_TYPE): void {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
}
// ============================================
export function clear_feed_options(): void {
	if (typeof localStorage === "undefined") return;
	localStorage.removeItem(STORAGE_KEY);
}
// ============================================

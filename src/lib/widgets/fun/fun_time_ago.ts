import { get_time_fun } from "./fun_get_time";
// ============================================
export function time_ago_ms(diffMs: number): string {
	if (diffMs < 60000) {
		return `${Math.floor(diffMs / 1000)}s`;
	}
	if (diffMs < 3600000) {
		return `${Math.floor(diffMs / 60000)}m`;
	}
	if (diffMs < 86400000) {
		return `${Math.floor(diffMs / 3600000)}h`;
	}
	return "";
}
// ============================================
export function time_ago_formatted(date: Date, dateNow: Date): string {
	const diffMs = dateNow.getTime() - date.getTime();
	const diffSec = diffMs;
	const timeAgoStr = time_ago_ms(diffMs);
	if (timeAgoStr) return timeAgoStr;
	if (date.getFullYear() === dateNow.getFullYear()) {
		return date.toLocaleString("en-US", {
			month: "short",
			day: "numeric"
		});
	}
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
// ============================================
export function format_time_ago(date: Date, dateNow: Date): { text: string; title: string } {
	const title = `${date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit"
	})}, ${date.toLocaleDateString([], {
		day: "numeric",
		month: "short",
		year: "numeric"
	})}`;
	const text = time_ago_formatted(date, dateNow);
	return { text, title };
}
// ============================================
export async function get_time_ago_fun(
	blockHeight: number,
): Promise<{ text: string; title: string } | "unknown"> {
	const res = await get_time_fun(blockHeight);
	if (!res || !res.timestamp) return "unknown";
	const timeMs = res.timestamp;
	const date = new Date(timeMs);
	const dateNow = new Date();
	return format_time_ago(date, dateNow);
}
// ============================================

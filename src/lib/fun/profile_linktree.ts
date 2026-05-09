// ========================================
export function resolve_linktree_url_fun(platform: string, value: string): string {
	if (!value) return "";
	if (value.startsWith("http://") || value.startsWith("https://")) return value;
	if (platform === "twitter") return `https://twitter.com/${value}`;
	if (platform === "github") return `https://github.com/${value}`;
	if (platform === "telegram") return `https://t.me/${value}`;
	if (platform === "website") return value.startsWith("http") ? value : `https://${value}`;
	return value;
}
// ========================================
export function resolve_linktree_icon_fun(platform: string): string {
	const map: Record<string, string> = {
		twitter: "bi-twitter",
		github: "bi-github",
		telegram: "bi-telegram",
		website: "bi-globe2"
	};
	return map[platform] ?? "bi-link";
}
// ========================================

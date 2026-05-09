// ============================================
const ROUTES = {
	home: { path: "/", label: "HOME" },
	feed: { path: "/feed", label: "FEED" },
	search: { path: "/search", label: "SEARCH" },
	discover: { path: "/discover", label: "DISCOVER" },
	settings: { path: "/settings", label: "SETTINGS" },
	notifications: { path: "/notifications", label: "NOTIFICATIONS" },
	profile: { path: "/profile", label: "PROFILE" },
	profile_auth: { path: "/profile-auth", label: "PROFILE" },
	profile_router: { path: "/profile-router", label: "PROFILE" }
} as const;

export default ROUTES;
// ============================================

<script lang="ts">
	import { House, User, Search, Bell } from "lucide-svelte";
	import ROUTES from "../ts/routes";
	import { page } from "$app/state";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- COMPONENT_NAV -->
<!-- component_nav -->
<nav>
	<a href={ROUTES.feed.path} class:active={page.url.pathname === ROUTES.feed.path}><House /></a>
	<a href={ROUTES.discover.path} class:active={page.url.pathname === ROUTES.discover.path}
		><Search /></a
	>
	<a href={ROUTES.notifications.path} class:active={page.url.pathname === ROUTES.notifications.path}
		><Bell /></a
	>
	<a
		href={ROUTES.profile_router.path}
		class:active={page.url.pathname === ROUTES.profile_router.path ||
			(page.url.pathname.startsWith("/profile/") && page.url.pathname !== "/profile-auth")}
		><User /></a
	>
</nav>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	nav {
		position: fixed;
		bottom: 12px;
		left: 50%;
		transform: translateX(-50%);
		width: 500px;
		max-width: 90vw;
		box-sizing: border-box;

		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 12px 18px;
		border-radius: 22px;

		background: rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(14px) saturate(180%);
		-webkit-backdrop-filter: blur(14px) saturate(180%);

		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.25),
			inset 0 0 0 1px rgba(255, 255, 255, 0.15);

		z-index: 999;
	}

	/* Each icon link */
	nav a {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 48px;
		height: 48px;

		border-radius: 14px;
		color: var(--text-color, currentColor);

		transition: all 0.25s ease;
	}

	/* Hover lift */
	nav a:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-3px);
	}

	/* Tap press */
	nav a:active {
		transform: translateY(0px) scale(0.96);
		background: rgba(255, 255, 255, 0.25);
	}

	/* Active route highlight */
	nav a.active {
		background: rgba(140, 162, 245, 0.25);
		box-shadow: 0 0 10px rgba(140, 162, 245, 0.4);
	}
</style>

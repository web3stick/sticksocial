<script lang="ts">
	import { page } from "$app/state";
	// ============================================
	type TabId = "posts" | "comments" | "reposts" | "followers" | "following";
	let { accountId }: { accountId: string } = $props();
	// ============================================
	const tabs: { id: TabId; label: string }[] = [
		{ id: "posts", label: "POSTS" },
		{ id: "comments", label: "COMMENTS" },
		{ id: "reposts", label: "REPOSTS" },
		{ id: "followers", label: "FOLLOWERS" },
		{ id: "following", label: "FOLLOWING" }
	];
	// ============================================
	function path_for(id: TabId): string {
		return id === "posts" ? `/profile/${accountId}` : `/profile/${accountId}/${id}`;
	}
	// ============================================
	const activeTab = $derived.by<TabId>(() => {
		const path = page.url.pathname;
		if (path === `/profile/${accountId}`) return "posts";
		const prefix = `/profile/${accountId}/`;
		if (path.startsWith(prefix)) {
			const rest = path.slice(prefix.length).split("/")[0];
			if (tabs.some((t) => t.id === rest)) return rest as TabId;
		}
		return "posts";
	});
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- profile_tab_nav -->
<!-- PROFILE_TAB_NAV -->
<div class="tabs-wrap">
	<nav class="tabs">
		{#each tabs as t (t.id)}
			<a
				href={path_for(t.id)}
				class="tab"
				class:active={activeTab === t.id}
				aria-current={activeTab === t.id ? "page" : undefined}
				data-tab={t.id}>{t.label}</a
			>
		{/each}
	</nav>
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.tabs-wrap {
		position: relative;
		width: 500px;
		max-width: 90vw;
		margin: 0 auto 8px;
	}
	.tabs {
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		gap: 0;
		padding: 0;
		border-bottom: 1px solid var(--color-green, #95d58d);

		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;

		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.tabs::-webkit-scrollbar {
		display: none;
	}
	.tab {
		flex: 0 0 auto;
		scroll-snap-align: start;

		background: none;
		border: none;
		border-radius: 0;
		padding: 10px 14px;
		font-size: 12px;
		color: inherit;
		text-decoration: none;
		cursor: pointer;
		opacity: 0.55;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
		white-space: nowrap;
	}
	.tab:hover {
		opacity: 0.85;
	}
	.tab.active {
		opacity: 1;
		font-weight: bold;
		border-bottom-color: currentColor;
	}
	/* right-edge fade so users can see the row is horizontally scrollable.
	   lives on the wrapper (not the scroll container) so it stays put. */
	.tabs-wrap::after {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		bottom: 1px;
		width: 36px;
		pointer-events: none;
		background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
	}
	@media (prefers-color-scheme: dark) {
		.tabs-wrap::after {
			background: linear-gradient(to right, rgba(26, 26, 26, 0) 0%, #1a1a1a 100%);
		}
	}
</style>

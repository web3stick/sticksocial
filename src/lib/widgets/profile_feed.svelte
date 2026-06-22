<script lang="ts">
	import INFINITE_FEED from "./infinite_feed.svelte";
	import COMMENT_VIEW from "./comment_view.svelte";
	import { near_social_js_get_account_feed_fun } from "$lib/near-social-js/main/fun_get_account_feed";
	import { near_social_js_index_fun } from "$lib/near-social-js/main/fun_index";
	import type { FeedOptions } from "near-social-js";
	// ============================================
	type Tab = "posts" | "comments" | "reposts";
	let {
		accountId,
		limit = 10,
		order = "desc" as "asc" | "desc"
	}: {
		accountId: string;
		limit?: number;
		order?: "asc" | "desc";
	} = $props();
	// ============================================
	let tab = $state<Tab>("posts");
	// ============================================
	function fetch_posts(opts: FeedOptions) {
		return near_social_js_get_account_feed_fun(accountId, opts);
	}
	// ============================================
	function fetch_comments(opts: FeedOptions) {
		return near_social_js_index_fun({
			action: "comment",
			key: "main",
			accountId,
			order: opts.order,
			limit: opts.limit,
			from: opts.from
		});
	}
	// ============================================
	function fetch_reposts(opts: FeedOptions) {
		return near_social_js_index_fun({
			action: "repost",
			key: "main",
			accountId,
			order: opts.order,
			limit: opts.limit,
			from: opts.from
		});
	}
	// ============================================
	const tabs: { id: Tab; label: string }[] = [
		{ id: "posts", label: "POSTS" },
		{ id: "comments", label: "COMMENTS" },
		{ id: "reposts", label: "REPOSTS" }
	];
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_profile_feed -->
<!-- WIDGET_PROFILE_FEED -->
<div class="profile-feed">
	<div class="tabs">
		{#each tabs as t (t.id)}
			<button
				class="tab"
				class:active={tab === t.id}
				type="button"
				data-tab={t.id}
				onclick={() => (tab = t.id)}>{t.label}</button
			>
		{/each}
	</div>
	{#key tab}
		{#if tab === "posts"}
			<INFINITE_FEED fetch={fetch_posts} {limit} {order} />
		{:else if tab === "comments"}
			<INFINITE_FEED fetch={fetch_comments} {limit} {order} component={COMMENT_VIEW} />
		{:else}
			<INFINITE_FEED fetch={fetch_reposts} {limit} {order} />
		{/if}
	{/key}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.profile-feed {
		width: 600px;
		max-width: 90vw;
		margin: 0 auto;
	}
	.tabs {
		display: flex;
		gap: 4px;
		padding: 8px 0;
		border-bottom: 1px solid #95d58d;
		margin-bottom: 8px;
	}
	.tab {
		background: none;
		border: none;
		padding: 6px 12px;
		border-radius: 999px;
		font-size: 12px;
		color: inherit;
		cursor: pointer;
		opacity: 0.6;
	}
	.tab:hover {
		opacity: 0.9;
	}
	.tab.active {
		opacity: 1;
		background: #fff8a3;
		font-weight: bold;
	}
</style>

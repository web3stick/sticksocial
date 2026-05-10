<script lang="ts">
	import { get_activity_feed } from "$lib/near-social-js/main/fun_get_activity_feed";
	import { get_account_id_post } from "$lib/near-social-js/helper/get_account_id_post";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import type { IndexEntry, Post } from "near-social-js";
	// ============================================
	interface FeedPost {
		accountId: string;
		blockHeight: number;
		post: Post | null;
	}
	// ============================================
	let { limit = 10, order = "desc" as "asc" | "desc" }: { limit?: number; order?: "asc" | "desc" } = $props();
	// ============================================
	let posts = $state<FeedPost[]>([]);
	let loading = $state(false);
	let hasMore = $state(true);
	let from = $state<number | undefined>(undefined);
	let observer: IntersectionObserver | null = null;
	let loadMoreRef = $state<HTMLDivElement | null>(null);
	let initialLoadDone = $state(false);
	// ============================================
	async function loadPosts() {
		if (loading || !hasMore) return;
		loading = true;
		try {
			const entries = await get_activity_feed({
				limit,
				from,
				order,
			});
			if (entries.length === 0 || entries.length < limit) {
				hasMore = false;
			}
			const uniqueEntries = entries.filter(
				(entry, index, self) =>
					index === self.findIndex((e) => e.accountId === entry.accountId && e.blockHeight === entry.blockHeight)
			);
			const newPosts = await Promise.all(
				uniqueEntries.map(async (entry: IndexEntry) => {
					const post = await get_account_id_post(entry.accountId, entry.blockHeight);
					return {
						accountId: entry.accountId,
						blockHeight: entry.blockHeight,
						post,
					};
				})
			);
			const existingKeys = new Set(posts.map((p) => p.accountId + "-" + p.blockHeight));
			const filteredNewPosts = newPosts.filter((p) => !existingKeys.has(p.accountId + "-" + p.blockHeight));
			posts = [...posts, ...filteredNewPosts];
			from = entries.length > 0 ? entries[entries.length - 1].blockHeight : from;
		} catch (error) {
			console.error("Failed to load posts:", error);
		} finally {
			loading = false;
		}
	}
	// ============================================
	function setupObserver() {
		if (observer) observer.disconnect();
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && hasMore && initialLoadDone) {
					loadPosts();
				}
			},
			{ threshold: 0.1 }
		);
		if (loadMoreRef) observer.observe(loadMoreRef);
	}
	// ============================================
	$effect(() => {
		if (loadMoreRef && !initialLoadDone) {
			initialLoadDone = true;
			loadPosts();
		}
	});
	// ============================================
	$effect(() => {
		if (loadMoreRef) setupObserver();
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_infinite_post_feed -->
<!-- WIDGET_INFINITE_POST_FEED -->
<div class="feed">
	{#each posts as item (item.accountId + "-" + item.blockHeight)}
		<div class="post">
			<p class="meta">{item.accountId}::{Number(item.blockHeight)}</p>
			{#if item.post}
				<p class="text">{item.post.text}</p>
				{#if item.post.image}
					<img class="post-image" src={resolve_image_url_fun(item.post.image)} alt="" />
				{/if}
			{:else}
				<p class="loading">Loading...</p>
			{/if}
		</div>
	{/each}
	<div bind:this={loadMoreRef} class="load-more">
		{#if loading}
			<p>Loading more...</p>
		{/if}
		{#if !hasMore && posts.length > 0}
			<p>No more posts</p>
		{/if}
	</div>
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.feed {
		width: 600px;
		max-width: 90vw;
		margin: 0 auto;
	}
	.post {
		border: 1px solid #eee;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 12px;
	}
	.meta {
		font-size: 12px;
		color: #888;
		margin-bottom: 8px;
	}
	.text {
		font-size: 16px;
		line-height: 1.5;
		white-space: pre-wrap;
	}
	.post-image {
		max-width: 100%;
		border-radius: 8px;
		margin-top: 12px;
	}
	.loading {
		color: #888;
		font-style: italic;
	}
	.load-more {
		padding: 20px;
		text-align: center;
		min-height: 60px;
	}
</style>
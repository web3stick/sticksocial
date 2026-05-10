<script lang="ts">
	import { get_activity_feed } from "$lib/near-social-js/main/fun_get_activity_feed";
	import { get_account_id_post } from "$lib/near-social-js/helper/get_account_id_post";
	import type { IndexEntry, Post } from "near-social-js";
	// ============================================
	interface FeedPost {
		accountId: string;
		blockHeight: number;
		post: Post | null;
	}
	// ============================================
	let { limit = 10 }: { limit?: number } = $props();
	// ============================================
	let posts = $state<FeedPost[]>([]);
	let loading = $state(false);
	let hasMore = $state(true);
	let from = $state(0);
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
				order: "desc",
			});
			if (entries.length === 0 || entries.length < limit) {
				hasMore = false;
			}
			const newPosts = await Promise.all(
				entries.map(async (entry: IndexEntry) => {
					const post = await get_account_id_post(entry.accountId, entry.blockHeight);
					return {
						accountId: entry.accountId,
						blockHeight: entry.blockHeight,
						post,
					};
				})
			);
			posts = [...posts, ...newPosts];
			from += entries.length;
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

<div class="feed">
	{#each posts as item (item.accountId + "-" + item.blockHeight)}
		<div class="post">
			<p class="meta">{item.accountId}::{Number(item.blockHeight)}</p>
			{#if item.post}
				<p class="text">{item.post.text}</p>
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
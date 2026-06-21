<script lang="ts">
	import { get_activity_feed } from "$lib/near-social-js/main/fun_get_activity_feed";
	import { load_feed_options } from "$lib/ts/feed_options_storage";
	import { DEFAULT_FEED_OPTIONS, type FEED_OPTIONS_TYPE } from "$lib/types/feed_options";
	import Post from "./post.svelte";
	import type { IndexEntry } from "near-social-js";
	import { Square } from "lucide-svelte";
	// ============================================
	interface FeedPost {
		accountId: string;
		blockHeight: bigint;
	}
	// ============================================
	const saved = load_feed_options();
	let options = $state<FEED_OPTIONS_TYPE>({ ...saved });
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
				limit: options.limit,
				from,
				order: options.order
			});
			if (entries.length === 0 || entries.length < options.limit) {
				hasMore = false;
			}
			const uniqueEntries = entries.filter(
				(entry, index, self) =>
					index ===
					self.findIndex(
						(e) => e.accountId === entry.accountId && e.blockHeight === entry.blockHeight
					)
			);
			const newPosts: FeedPost[] = uniqueEntries.map((entry: IndexEntry) => ({
				accountId: entry.accountId,
				blockHeight: BigInt(entry.blockHeight)
			}));
			const existingKeys = new Set(posts.map((p) => p.accountId + "-" + p.blockHeight));
			const filteredNewPosts = newPosts.filter(
				(p) => !existingKeys.has(p.accountId + "-" + p.blockHeight)
			);
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
	// ============================================
	export const feed_options_defaults = DEFAULT_FEED_OPTIONS;
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_infinite_post_feed -->
<!-- WIDGET_INFINITE_POST_FEED -->
<div class="feed">
	{#each posts as item (item.accountId + "-" + item.blockHeight)}
		<Post accountId={item.accountId} blockHeight={item.blockHeight} />
	{/each}
	<div bind:this={loadMoreRef} class="load-more">
		{#if loading}
			<p>Loading more...</p>
		{/if}
		{#if !hasMore && posts.length > 0}
			<Square fill="#FFF8A3" color="#FFF8A3" />
			<!-- <p>No more posts</p> -->
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
	.load-more {
		padding: 20px;
		text-align: center;
		min-height: 60px;
	}
</style>

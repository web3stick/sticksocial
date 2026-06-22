<script lang="ts">
	import Post from "./post.svelte";
	import type { IndexEntry, FeedOptions } from "near-social-js";
	import { Square } from "lucide-svelte";
	// ============================================
	interface FeedPost {
		accountId: string;
		blockHeight: bigint;
	}
	// ============================================
	// fetch signature matches the SDK getActivityFeed / getHashtagFeed /
	// getAccountFeed shape: takes FeedOptions, returns IndexEntry[].
	type FeedFetcher = (options: FeedOptions) => Promise<IndexEntry[]>;
	// ============================================
	let {
		fetch,
		limit = 10,
		order = "desc" as "asc" | "desc"
	}: {
		fetch: FeedFetcher;
		limit?: number;
		order?: "asc" | "desc";
	} = $props();
	// ============================================
	let posts = $state<FeedPost[]>([]);
	let loading = $state(false);
	let hasMore = $state(true);
	let from = $state<number | undefined>(undefined);
	let observer: IntersectionObserver | null = null;
	let loadMoreRef = $state<HTMLDivElement | null>(null);
	let initialLoadDone = $state(false);
	// ============================================
	async function load_posts() {
		if (loading || !hasMore) return;
		loading = true;
		try {
			const entries = await fetch({ limit, from, order });
			if (entries.length === 0 || entries.length < limit) {
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
	function setup_observer() {
		if (observer) observer.disconnect();
		observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && hasMore && initialLoadDone) {
					load_posts();
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
			load_posts();
		}
	});
	// ============================================
	$effect(() => {
		if (loadMoreRef) setup_observer();
	});
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_infinite_feed -->
<!-- WIDGET_INFINITE_FEED -->
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
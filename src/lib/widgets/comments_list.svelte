<script lang="ts">
	import type { CommentItem, IndexEntry } from "near-social-js";
	import { near_social_js_get_comments_fun } from "$lib/near-social-js/main/fun_get_comments";
	import COMMENT_VIEW from "./comment_view.svelte";
	// ============================================
	let {
		accountId,
		blockHeight,
		refreshKey = 0,
		highlightedComment = null,
		maxDepth = 5,
		rootItem: rootItemOverride = null,
		onReply
	}: {
		accountId: string;
		blockHeight: bigint;
		refreshKey?: number;
		highlightedComment?: string | null;
		maxDepth?: number;
		rootItem?: CommentItem | null;
		onReply?: (payload: {
			handle: string;
			item: CommentItem;
			rootItem: CommentItem | null;
		}) => void;
	} = $props();
	// ============================================
	let comments = $state<IndexEntry[]>([]);
	let loading = $state(true);
	// ============================================
	const item = $derived<CommentItem>({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	const rootItem = $derived<CommentItem>(rootItemOverride ?? item);
	// ============================================
	async function refresh() {
		loading = true;
		try {
			comments = await near_social_js_get_comments_fun(item);
		} catch (e) {
			console.error("getComments failed", e);
		} finally {
			loading = false;
		}
	}
	$effect(() => {
		refreshKey;
		refresh();
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comments_list -->
<!-- WIDGET_COMMENTS_LIST -->
<div class="comments-list">
	<h3>COMMENTS ({comments.length})</h3>
	{#if loading}
		<p class="loading">Loading comments...</p>
	{:else if comments.length === 0}
		<p class="empty">No comments yet.</p>
	{:else}
		{#each comments as comment (comment.accountId + "-" + comment.blockHeight)}
			<COMMENT_VIEW
				accountId={comment.accountId}
				blockHeight={BigInt(comment.blockHeight)}
				{refreshKey}
				{highlightedComment}
				{maxDepth}
				{rootItem}
				{onReply}
			/>
		{/each}
	{/if}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.comments-list {
		width: 500px;
		max-width: 90vw;
		margin: 12px auto;
		text-align: left;
	}
	.comments-list h3 {
		font-size: 14px;
		margin: 12px 0 6px;
	}
	.loading,
	.empty {
		color: #888;
		font-style: italic;
		font-size: 12px;
	}
</style>

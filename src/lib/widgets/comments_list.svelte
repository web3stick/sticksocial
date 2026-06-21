<script lang="ts">
	import type { IndexEntry } from "near-social-js";
	import { near_social_js_get_comments_fun } from "$lib/near-social-js/main/fun_get_comments";
	import COMMENT_VIEW from "./comment_view.svelte";
	// ============================================
	let { accountId, blockHeight }: { accountId: string; blockHeight: bigint } = $props();
	// ============================================
	let comments = $state<IndexEntry[]>([]);
	let loading = $state(true);
	// ============================================
	const item = $derived({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
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
	// ============================================
	$effect(() => {
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
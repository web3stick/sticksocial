<script lang="ts">
	import { MessageCircle } from "lucide-svelte";
	import type { CommentItem, IndexEntry } from "near-social-js";
	import { near_social_js_get_comments_fun } from "$lib/near-social-js/main/fun_get_comments";
	// ============================================
	let {
		accountId,
		blockHeight,
		refreshKey = 0,
		rootItem = null,
		onReply
	}: {
		accountId: string;
		blockHeight: bigint;
		refreshKey?: number;
		// when set, click replies in-place (the parent's compose form
		// posts against this comment as the immediate parent and the
		// supplied rootItem as the thread root). when omitted, click
		// navigates to /post/<commentAuthor>/<commentBh> which is the
		// original NEAR Social fallback.
		rootItem?: CommentItem | null;
		onReply?: (payload: {
			handle: string;
			item: CommentItem;
			rootItem: CommentItem | null;
		}) => void;
	} = $props();
	// ============================================
	let comments = $state<IndexEntry[]>([]);
	let loading = $state(false);
	// ============================================
	const item = $derived({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	const count = $derived(comments.length);
	// ============================================
	// refetch on mount AND whenever refreshKey bumps (parent signals
	// a new comment was posted and counts should re-sync)
	$effect(() => {
		refreshKey;
		loading = true;
		near_social_js_get_comments_fun(item)
			.then((c) => (comments = c))
			.finally(() => (loading = false));
	});
	// ============================================
	function on_click() {
		if (!onReply) return;
		onReply({
			handle: accountId,
			item: {
				type: "social",
				path: `${accountId}/post/comment`,
				blockHeight: Number(blockHeight)
			},
			rootItem
		});
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comment_button -->
<!-- WIDGET_COMMENT_BUTTON -->
{#if onReply}
	<button class="comment-button" type="button" title="REPLY" onclick={on_click}>
		<MessageCircle />
		<span class="count">{loading ? "..." : count}</span>
	</button>
{:else}
	<a class="comment-button" href="/post/{accountId}/{blockHeight}" title="OPEN THREAD">
		<MessageCircle />
		<span class="count">{loading ? "..." : count}</span>
	</a>
{/if}

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.comment-button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		text-decoration: none;
		color: inherit;
		padding: 4px 8px;
		border-radius: 6px;
		font-size: 12px;
		background: none;
		border: none;
		cursor: pointer;
		font-family: inherit;
	}
	.comment-button:hover {
		background: rgba(77, 159, 255, 0.1);
	}
	.count {
		min-width: 1.5em;
		text-align: left;
	}
</style>

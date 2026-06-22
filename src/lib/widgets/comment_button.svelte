<script lang="ts">
	import { MessageCircle } from "lucide-svelte";
	import type { IndexEntry } from "near-social-js";
	import { near_social_js_get_comments_fun } from "$lib/near-social-js/main/fun_get_comments";
	// ============================================
	let {
		accountId,
		blockHeight
	}: { accountId: string; blockHeight: bigint } = $props();
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
	$effect(() => {
		loading = true;
		near_social_js_get_comments_fun(item)
			.then((c) => (comments = c))
			.finally(() => (loading = false));
	});
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comment_button -->
<!-- WIDGET_COMMENT_BUTTON -->
<a class="comment-button" href="/post/{accountId}/{blockHeight}" title="OPEN THREAD">
	<MessageCircle />
	<span class="count">{loading ? "..." : count}</span>
</a>

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
	}
	.comment-button:hover {
		background: rgba(77, 159, 255, 0.1);
	}
	.count {
		min-width: 1.5em;
		text-align: left;
	}
</style>
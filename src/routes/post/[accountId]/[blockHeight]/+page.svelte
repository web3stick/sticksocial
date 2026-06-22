<script lang="ts">
	import { page } from "$app/state";
	import type { CommentItem } from "near-social-js";
	import POST from "$lib/widgets/post.svelte";
	import COMMENTS_LIST from "$lib/widgets/comments_list.svelte";
	import COMMENT_COMPOSE_FORM from "$lib/widgets/comment_compose_form.svelte";
	import HOME_NAV from "$lib/components/home_nav.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	const blockHeight = $derived(BigInt(page.params.blockHeight ?? "0"));
	// ============================================
	// bumps whenever a new comment is posted so comments_list refetches.
	let refreshKey = $state(0);
	function handle_posted() {
		refreshKey++;
		// a reply to the post (the default) clears the threaded target.
		composeItem = null;
		composeReplyToHandle = null;
	}
	// ============================================
	// when a comment_view fires onReply, we retarget the compose form
	// to that comment (immediate parent) + the post (thread root).
	// comment_view defaults `item` to the post itself, so a fresh page
	// starts with no threaded override — replies go straight onto the
	// post.
	let composeItem = $state<CommentItem | null>(null);
	let composeReplyToHandle = $state<string | null>(null);
	function handle_reply(payload: {
		handle: string;
		item: CommentItem;
		rootItem: CommentItem | null;
	}) {
		composeItem = payload.item;
		composeReplyToHandle = payload.handle;
	}
	// ============================================
	// top-level post item — used as the thread root for replies onto
	// the post itself (no comment in between) and forwarded as
	// rootItem for replies onto sub-comments.
	const rootItem = $derived<CommentItem>({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	{#if accountId && blockHeight > 0n}
		<HOME_NAV />
		<div class="sticky-parent">
			<POST {accountId} {blockHeight} {refreshKey} />
		</div>
		<COMMENTS_LIST {accountId} {blockHeight} {refreshKey} onReply={handle_reply} />
		<div class="reply">
			<h3>REPLY</h3>
			<COMMENT_COMPOSE_FORM
				{accountId}
				{blockHeight}
				item={composeItem}
				{rootItem}
				replyToHandle={composeReplyToHandle}
				onPosted={handle_posted}
			/>
		</div>
	{:else}
		<p>Invalid post URL</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.sticky-parent {
		position: sticky;
		top: 0;
		z-index: 10;
		background: #fff;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	@media (prefers-color-scheme: dark) {
		.sticky-parent {
			background: #1a1a1a;
			border-bottom-color: rgba(255, 255, 255, 0.1);
		}
	}
	.reply {
		width: 500px;
		max-width: 90vw;
		margin: 16px auto;
		text-align: left;
	}
	.reply h3 {
		font-size: 14px;
		margin: 0 0 6px;
	}
</style>

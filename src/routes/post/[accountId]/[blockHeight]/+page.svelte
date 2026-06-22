<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
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
		composeItem = null;
		composeReplyToHandle = null;
	}
	// ============================================
	// when a comment_view fires onReply, we retarget the compose form
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
	const rootItem = $derived<CommentItem>({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	// ============================================
	// — comment permalink hash —
	// /post/<rootAuthor>/<rootBh>#comment-<commenter>-<commentBh>
	// extracts the highlighted comment from the URL hash so the thread
	// page can scroll to it and highlight it.
	const hashMatch = $derived.by(() => {
		const hash = page.url.hash;
		if (!hash || !hash.startsWith("#comment-")) return null;
		const m = hash.match(/^#comment-(.+)-(\d+)$/);
		if (!m) return null;
		return { accountId: m[1], blockHeight: m[2] };
	});
	const highlightedComment = $derived(
		hashMatch ? `${hashMatch.accountId}-${hashMatch.blockHeight}` : null
	);
	// clear the hash after first render so a subsequent reply doesn't
	// re-trigger scroll. we pushState instead of replace so the user
	// keeps a clean URL if they bookmark.
	$effect(() => {
		if (!highlightedComment) return;
		// wait a tick for the DOM to render, then clean the hash
		requestAnimationFrame(() => {
			const clean = page.url.pathname + page.url.search;
			goto(clean, { replaceState: true, noScroll: true });
		});
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
		<COMMENTS_LIST
			{accountId}
			{blockHeight}
			{refreshKey}
			{highlightedComment}
			{rootItem}
			maxDepth={highlightedComment ? 20 : 5}
			onReply={handle_reply}
		/>
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

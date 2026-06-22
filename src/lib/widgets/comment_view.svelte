<script lang="ts">
	import type { CommentItem, IndexEntry } from "near-social-js";
	import {
		get_account_id_comment,
		type Comment
	} from "$lib/near-social-js/helper/get_account_id_comment";
	import { near_social_js_get_comments_fun } from "$lib/near-social-js/main/fun_get_comments";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import { get_time_ago_fun } from "./fun/fun_time_ago";
	import { render_post_text } from "./fun/post_text";
	import LIKE_BUTTON from "./like_button.svelte";
	import COMMENT_BUTTON from "./comment_button.svelte";
	import REPOST_BUTTON from "./repost_button.svelte";
	import COMMENT_VIEW from "./comment_view.svelte";
	// ============================================
	let {
		accountId,
		blockHeight,
		depth = 0,
		maxDepth = 5,
		refreshKey = 0,
		highlightedComment = null,
		rootItem = null,
		onReply
	}: {
		accountId: string;
		blockHeight: bigint;
		depth?: number;
		maxDepth?: number;
		refreshKey?: number;
		highlightedComment?: string | null;
		rootItem?: CommentItem | null;
		onReply?: (payload: {
			handle: string;
			item: CommentItem;
			rootItem: CommentItem | null;
		}) => void;
	} = $props();
	let comment = $state<Comment | null>(null);
	let loading = $state(true);
	let timeAgo = $state<{ text: string; title: string } | "Loading" | "unknown">("Loading");
	let subComments = $state<IndexEntry[]>([]);
	let subLoading = $state(false);
	let showAllReplies = $state(false);
	let commentRef = $state<HTMLDivElement | null>(null);
	// ============================================
	const myKey = $derived(`${accountId}-${blockHeight}`);
	const isHighlighted = $derived(highlightedComment === myKey);
	const MAX_ID_LENGTH = 20;
	const displayId = $derived(
		accountId.length > MAX_ID_LENGTH ? accountId.slice(0, MAX_ID_LENGTH) + "..." : accountId
	);
	const subItem = $derived({
		type: "social",
		path: `${accountId}/post/comment`,
		blockHeight: Number(blockHeight)
	});
	const canRecurse = $derived(depth < maxDepth);
	const selfItem = $derived<CommentItem>({
		type: "social",
		path: `${accountId}/post/comment`,
		blockHeight: Number(blockHeight)
	});
	// — truncation —
	// show first N replies; "show N more" button expands the rest.
	// when highlightedComment is set (permalink nav), skip truncation
	// so the target comment's ancestors all expand fully.
	const INITIAL_VISIBLE_REPLIES = 3;
	const truncate = $derived(
		!highlightedComment && !showAllReplies && subComments.length > INITIAL_VISIBLE_REPLIES
	);
	const visibleReplies = $derived(
		truncate ? subComments.slice(0, INITIAL_VISIBLE_REPLIES) : subComments
	);
	const hiddenCount = $derived(
		truncate ? subComments.length - INITIAL_VISIBLE_REPLIES : 0
	);
	// — breadcrumb chain —
	// for the highlighted comment we walk up via the comment's on-chain
	// `item` (immediate parent) to build the root→...→this path.
	const MAX_CHAIN_DEPTH = 10;
	let breadcrumb = $state<Array<{ accountId: string; blockHeight: string; label: string }>>([]);
	let breadcrumbLoading = $state(false);
	async function build_breadcrumb_chain() {
		if (!comment?.item || !rootItem) return;
		breadcrumbLoading = true;
		const chain: Array<{ accountId: string; blockHeight: string; label: string }> = [];
		let currentId = accountId;
		let currentBh = blockHeight;
		let iterations = 0;
		while (iterations < MAX_CHAIN_DEPTH) {
			const data = await get_account_id_comment(currentId, currentBh);
			if (!data?.item) break;
			const parentAuthor = data.item.path.split("/")[0];
			const parentBh = String(data.item.blockHeight);
			chain.unshift({ accountId: parentAuthor, blockHeight: parentBh, label: parentAuthor });
			const rootAuthor = rootItem.path.split("/")[0];
			if (parentAuthor === rootAuthor && data.item.blockHeight === rootItem.blockHeight) break;
			currentId = parentAuthor;
			currentBh = BigInt(parentBh);
			iterations++;
		}
		breadcrumb = chain;
		breadcrumbLoading = false;
	}
	// ============================================
	$effect(() => {
		loading = true;
		get_account_id_comment(accountId, blockHeight).then((c) => {
			comment = c;
			loading = false;
		});
	});
	$effect(() => {
		get_time_ago_fun(Number(blockHeight)).then((t) => {
			timeAgo = t;
		});
	});
	$effect(() => {
		if (!canRecurse) return;
		refreshKey;
		subLoading = true;
		near_social_js_get_comments_fun(subItem)
			.then((c) => (subComments = c))
			.finally(() => (subLoading = false));
	});
	// when highlighted, auto-expand all replies so ancestors are visible
	$effect(() => {
		if (highlightedComment) showAllReplies = true;
	});
	// scroll into view when highlighted
	$effect(() => {
		if (isHighlighted && commentRef) {
			commentRef.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	});
	// build breadcrumb chain when this is the highlighted comment
	$effect(() => {
		if (!isHighlighted || !comment?.item) {
			breadcrumb = [];
			return;
		}
		build_breadcrumb_chain();
	});
	// ============================================
	function handle_reply() {
		if (!onReply) return;
		onReply({ handle: accountId, item: selfItem, rootItem });
	}
	function expand_replies() {
		showAllReplies = true;
	}
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comment_view -->
<!-- WIDGET_COMMENT_VIEW -->
<div
	class="comment"
	class:highlighted={isHighlighted}
	data-depth={depth}
	bind:this={commentRef}
>
	<!-- — breadcrumb — -->
	{#if isHighlighted && breadcrumb.length > 0}
		<p class="breadcrumb">
			{#each breadcrumb as crumb, i}
				<a href="/post/{crumb.accountId}/{crumb.blockHeight}">{crumb.label}</a>
				<span class="sep">&gt;</span>
			{/each}
			<span class="current">{displayId}</span>
		</p>
	{/if}
	<p class="meta">
		<a href="/profile/{accountId}">{displayId}</a>
		{#if typeof timeAgo === "object" && timeAgo.text}
			<span title={timeAgo.title}>{timeAgo.text}</span>
		{:else}
			{timeAgo}
		{/if}
	</p>
	{#if comment}
		<div class="text">{@html render_post_text(comment.text)}</div>
		{#if comment.image}
			<img class="post-image" src={resolve_image_url_fun(comment.image)} alt="" />
		{/if}
		<div class="actions">
			<LIKE_BUTTON {accountId} {blockHeight} />
			<COMMENT_BUTTON
				{accountId}
				{blockHeight}
				{rootItem}
				onReply={onReply ? handle_reply : undefined}
			/>
			<REPOST_BUTTON {accountId} {blockHeight} />
		</div>
	{:else if loading}
		<p class="loading">Loading...</p>
	{/if}
	<!-- ============== -->
	{#if canRecurse}
		{#if subComments.length > 0}
			<div class="replies">
				{#each visibleReplies as sub (sub.accountId + "-" + sub.blockHeight)}
					<COMMENT_VIEW
						accountId={sub.accountId}
						blockHeight={BigInt(sub.blockHeight)}
						depth={depth + 1}
						{maxDepth}
						{refreshKey}
						{highlightedComment}
						{rootItem}
						onReply={onReply ? handle_reply : undefined}
					/>
				{/each}
			</div>
			{#if hiddenCount > 0}
				<button class="show-more" onclick={expand_replies}>
					show {hiddenCount} more repl{hiddenCount === 1 ? "y" : "ies"}
				</button>
			{/if}
		{:else if subLoading}
			<p class="loading replies-loading">Loading replies...</p>
		{/if}
	{/if}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.comment {
		border-left: 2px solid #95d58d;
		padding: 8px 12px;
		margin: 8px 0;
		text-align: left;
		transition: background-color 0.3s ease;
	}
	.comment[data-depth="1"] {
		border-left-color: #8ca2f5;
	}
	.comment[data-depth="2"] {
		border-left-color: #c9a8f4;
	}
	.comment[data-depth="3"] {
		border-left-color: #ffc58a;
	}
	.comment[data-depth="4"] {
		border-left-color: #ff8a8a;
	}
	.comment[data-depth="5"] {
		border-left-color: #fff8a3;
	}
	.comment.highlighted {
		background: rgba(255, 248, 163, 0.25);
		border-radius: 6px;
		scroll-margin-top: 80px;
	}
	@media (prefers-color-scheme: dark) {
		.comment.highlighted {
			background: rgba(255, 248, 163, 0.08);
		}
	}
	.meta {
		font-size: 11px;
		color: #888;
		margin-bottom: 4px;
		display: flex;
		gap: 8px;
	}
	.text {
		font-size: 14px;
		line-height: 1.4;
	}
	.post-image {
		max-width: 100%;
		border-radius: 6px;
		margin-top: 6px;
	}
	.actions {
		display: flex;
		gap: 8px;
		align-items: center;
		margin-top: 6px;
	}
	.replies {
		margin-top: 6px;
		margin-left: 6px;
	}
	.loading {
		color: #888;
		font-style: italic;
		font-size: 12px;
	}
	.replies-loading {
		margin-top: 6px;
		margin-left: 6px;
	}
	.breadcrumb {
		font-size: 11px;
		color: #888;
		margin: 0 0 6px;
		display: flex;
		align-items: center;
		gap: 4px;
		flex-wrap: wrap;
	}
	.breadcrumb a {
		color: #4d9fff;
		text-decoration: none;
	}
	.breadcrumb a:hover {
		text-decoration: underline;
	}
	.breadcrumb .sep {
		color: #bbb;
	}
	.breadcrumb .current {
		font-weight: 600;
		color: #555;
	}
	.show-more {
		background: none;
		border: 1px solid #ddd;
		border-radius: 6px;
		padding: 4px 10px;
		font-size: 11px;
		color: #4d9fff;
		cursor: pointer;
		margin-top: 4px;
		font-family: inherit;
	}
	.show-more:hover {
		background: rgba(77, 159, 255, 0.08);
		border-color: #4d9fff;
	}
</style>

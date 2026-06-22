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
	// self-import for recursion (svelte:self is deprecated in svelte 5)
	import COMMENT_VIEW from "./comment_view.svelte";
	// ============================================
	let {
		accountId,
		blockHeight,
		depth = 0,
		maxDepth = 5,
		refreshKey = 0,
		rootItem = null,
		onReply
	}: {
		accountId: string;
		blockHeight: bigint;
		depth?: number;
		maxDepth?: number;
		refreshKey?: number;
		// the top-level post of the thread this comment belongs to. passed
		// down so every COMMENT_BUTTON can report it to the parent's
		// compose form; defaults to "this comment is its own root" so
		// comment_view also works when rendered standalone (e.g. in a
		// notification drilldown or a future thread view).
		rootItem?: CommentItem | null;
		// bubbles up when the user clicks the REPLY icon on this
		// comment; the parent uses it to retarget the compose form at
		// this comment (immediate parent) + the supplied rootItem.
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
	// ============================================
	const MAX_ID_LENGTH = 20;
	const displayId = $derived(
		accountId.length > MAX_ID_LENGTH ? accountId.slice(0, MAX_ID_LENGTH) + "..." : accountId
	);
	// sub-comments live at this comment's own /post/comment
	const subItem = $derived({
		type: "social",
		path: `${accountId}/post/comment`,
		blockHeight: Number(blockHeight)
	});
	const canRecurse = $derived(depth < maxDepth);
	// this comment as a CommentItem, used when bubbling up REPLY clicks
	const selfItem = $derived<CommentItem>({
		type: "social",
		path: `${accountId}/post/comment`,
		blockHeight: Number(blockHeight)
	});
	// ============================================
	$effect(() => {
		loading = true;
		get_account_id_comment(accountId, blockHeight).then((c) => {
			comment = c;
			loading = false;
		});
	});
	// ============================================
	$effect(() => {
		get_time_ago_fun(Number(blockHeight)).then((t) => {
			timeAgo = t;
		});
	});
	// ============================================
	// fetch sub-comments when this comment is rendered, when its
	// accountId/blockHeight changes, or when the parent signals a
	// refresh (e.g. a new comment was posted somewhere up the chain)
	$effect(() => {
		if (!canRecurse) return;
		refreshKey;
		subLoading = true;
		near_social_js_get_comments_fun(subItem)
			.then((c) => (subComments = c))
			.finally(() => (subLoading = false));
	});
	// ============================================
	function handle_reply() {
		if (!onReply) return;
		onReply({ handle: accountId, item: selfItem, rootItem });
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comment_view -->
<!-- WIDGET_COMMENT_VIEW -->
<div class="comment" data-depth={depth}>
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
	{#if canRecurse && subComments.length > 0}
		<div class="replies">
			{#each subComments as sub (sub.accountId + "-" + sub.blockHeight)}
				<COMMENT_VIEW
					accountId={sub.accountId}
					blockHeight={BigInt(sub.blockHeight)}
					depth={depth + 1}
					{maxDepth}
					{refreshKey}
					{rootItem}
					onReply={onReply ? handle_reply : undefined}
				/>
			{/each}
		</div>
	{:else if canRecurse && subLoading}
		<p class="loading replies-loading">Loading replies...</p>
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
</style>

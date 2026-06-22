<script lang="ts">
	import type { IndexEntry, Post } from "near-social-js";
	import { get_account_id_post } from "$lib/near-social-js/helper/get_account_id_post";
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
		onReply
	}: {
		accountId: string;
		blockHeight: bigint;
		depth?: number;
		maxDepth?: number;
		refreshKey?: number;
		// bubbles up when the user clicks the REPLY icon on this
		// comment; the parent /post page uses it to prefill + focus the
		// compose textarea at the bottom of the thread.
		onReply?: (handle: string) => void;
	} = $props();
	let post = $state<Post | null>(null);
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
	// ============================================
	$effect(() => {
		loading = true;
		get_account_id_post(accountId, blockHeight).then((p) => {
			post = p;
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
	{#if post}
		<div class="text">{@html render_post_text(post.text)}</div>
		{#if post.image}
			<img class="post-image" src={resolve_image_url_fun(post.image)} alt="" />
		{/if}
		<div class="actions">
			<LIKE_BUTTON {accountId} {blockHeight} />
			<COMMENT_BUTTON {accountId} {blockHeight} {onReply} />
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
					{onReply}
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
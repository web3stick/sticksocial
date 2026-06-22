<script lang="ts">
	import type { Post } from "near-social-js";
	import { get_account_id_post } from "$lib/near-social-js/helper/get_account_id_post";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import { get_time_ago_fun } from "./fun/fun_time_ago";
	import { render_post_text } from "./fun/post_text";
	// ============================================
	let { accountId, blockHeight }: { accountId: string; blockHeight: bigint } = $props();
	let post = $state<Post | null>(null);
	let loading = $state(true);
	let timeAgo = $state<{ text: string; title: string } | "Loading" | "unknown">("Loading");
	const MAX_ID_LENGTH = 20;
	const displayId = $derived(
		accountId.length > MAX_ID_LENGTH ? accountId.slice(0, MAX_ID_LENGTH) + "..." : accountId
	);
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
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comment_view -->
<!-- WIDGET_COMMENT_VIEW -->
<div class="comment">
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
	{:else if loading}
		<p class="loading">Loading...</p>
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
		line-break: anywhere;
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
	.loading {
		color: #888;
		font-style: italic;
		font-size: 12px;
	}
</style>
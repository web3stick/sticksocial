<script lang="ts">
	import { get_account_id_post } from "$lib/near-social-js/helper/get_account_id_post";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import { get_time_ago_fun } from "./fun/fun_time_ago";
	import { render_post_text } from "./fun/post_text";
	import type { Post } from "near-social-js";
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

<div class="post">
	<!-- ============== -->
	<p class="meta">
		<img
			src={`https://i.near.social/magic/large/https://near.social/magic/img/account/${accountId}`}
			alt="PROFILE_PIC"
			class="profile-pic"
		/>
		<a href="/profile/{accountId}">{displayId}</a>
		{#if typeof timeAgo === "object" && timeAgo.text}
			<span title={timeAgo.title}>{timeAgo.text}</span>
		{:else}
			{timeAgo}
		{/if}
	</p>
	<!-- ============== -->
	{#if post}
		<p class="text">{@html render_post_text(post.text)}</p>
		{#if post.image}
			<img class="post-image" src={resolve_image_url_fun(post.image)} alt="" />
		{/if}
	{:else}
		<p class="loading">Loading...</p>
	{/if}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.post {
		width: 500px;
		max-width: 90vw;
		box-sizing: border-box;
		display: inline-block;
		text-align: left;
		border-bottom: 1px solid #95d58d;
		padding: 16px;
		margin-bottom: 12px;
	}
	.meta {
		font-size: 12px;
		color: #888;
		margin-bottom: 8px;
	}
	.profile-pic {
	width: 12px;
	height: 12px;
	}
	/*.text {
		font-size: 16px;
		line-height: 1.5;
		white-space: pre-wrap;
	}*/
	.post-image {
		max-width: 100%;
		width: 100%;
		border-radius: 8px;
		margin-top: 12px;
	}
	.loading {
		color: #888;
		font-style: italic;
	}
</style>

<script lang="ts">
	import { resolve_image_url_fun } from "./fun/profile_image";
	import { get_time_ago_fun } from "./fun/fun_time_ago";
	import { render_post_text } from "./fun/post_text";
	// ============================================
	let {
		accountId,
		blockHeight,
		value
	}: {
		accountId: string;
		blockHeight: bigint;
		value?: unknown;
	} = $props();
	// ============================================
	const MAX_ID_LENGTH = 20;
	const displayId = $derived(
		accountId.length > MAX_ID_LENGTH ? accountId.slice(0, MAX_ID_LENGTH) + "..." : accountId
	);
	// ============================================
	const postValue = $derived(
		value as
			| { text?: string; type?: string; image?: { ipfs_cid?: string; url?: string } }
			| undefined
			| null
	);
	// ============================================
	let timeAgo = $state<{ text: string; title: string } | "Loading" | "unknown">("Loading");
	$effect(() => {
		get_time_ago_fun(Number(blockHeight)).then((t) => {
			timeAgo = t;
		});
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_post_view -->
<!-- WIDGET_POST_VIEW -->
<div class="post">
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
	{#if postValue}
		<div class="text">{@html render_post_text(postValue.text ?? "")}</div>
		{#if postValue.image}
			<img class="post-image" src={resolve_image_url_fun(postValue.image)} alt="" />
		{/if}
	{:else if value !== undefined && value !== null}
		<p class="muted">Post unavailable (unexpected value shape).</p>
	{:else}
		<p class="muted">Post unavailable.</p>
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
		line-break: anywhere;
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
	.text {
		font-size: 16px;
		line-height: 1.5;
	}
	.post-image {
		max-width: 100%;
		width: 100%;
		border-radius: 8px;
		margin-top: 12px;
	}
	.muted {
		color: #888;
		font-style: italic;
		font-size: 12px;
	}
</style>

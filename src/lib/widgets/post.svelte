<script lang="ts">
	import { get_account_id_post } from "$lib/near-social-js/helper/get_account_id_post";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import type { Post } from "near-social-js";

	let { accountId, blockHeight }: { accountId: string; blockHeight: bigint } = $props();

	let post = $state<Post | null>(null);
	let loading = $state(true);

	$effect(() => {
		loading = true;
		get_account_id_post(accountId, blockHeight).then((p) => {
			post = p;
			loading = false;
		});
	});
</script>

<div class="post">
	<p class="meta">{accountId}::{Number(blockHeight)}</p>
	{#if post}
		<p class="text">{post.text}</p>
		{#if post.image}
			<img class="post-image" src={resolve_image_url_fun(post.image)} alt="" />
		{/if}
	{:else}
		<p class="loading">Loading...</p>
	{/if}
</div>

<style>
	.post {
		border: 1px solid #eee;
		border-radius: 8px;
		padding: 16px;
		margin-bottom: 12px;
	}
	.meta {
		font-size: 12px;
		color: #888;
		margin-bottom: 8px;
	}
	.text {
		font-size: 16px;
		line-height: 1.5;
		white-space: pre-wrap;
	}
	.post-image {
		max-width: 100%;
		border-radius: 8px;
		margin-top: 12px;
	}
	.loading {
		color: #888;
		font-style: italic;
	}
</style>
<script lang="ts">
	import type { IndexEntry, Post } from "near-social-js";
	import { get_account_id_post } from "$lib/near-social-js/helper/get_account_id_post";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import { render_post_text } from "./fun/post_text";
	import { Repeat2 } from "lucide-svelte";
	// ============================================
	let {
		accountId,
		blockHeight,
		value
	}: {
		// accountId/blockHeight are the repost's own (the user's block
		// when they fired the repost); value.item below points at the
		// original post we're actually rendering.
		accountId: string;
		blockHeight: bigint;
		value?: IndexEntry["value"];
	} = $props();
	// ============================================
	const MAX_ID_LENGTH = 20;
	const displayId = $derived(
		accountId.length > MAX_ID_LENGTH ? accountId.slice(0, MAX_ID_LENGTH) + "..." : accountId
	);
	// ============================================
	// repost value shape (from near-social-js repost()):
	//   { type: 'repost', item: CommentItem }
	// where CommentItem.path is "<originalAuthor>/post/main".
	const target = $derived.by(() => {
		const v = value as { type?: string; item?: { path?: string; blockHeight?: number } } | undefined;
		if (!v || v.type !== "repost" || !v.item?.path) return null;
		const targetAccountId = v.item.path.split("/")[0];
		const targetBlockHeight = BigInt(v.item.blockHeight ?? 0);
		return { targetAccountId, targetBlockHeight };
	});
	const original = $state<{ post: Post | null }>({ post: null });
	// ============================================
	$effect(() => {
		original.post = null;
		if (!target) return;
		get_account_id_post(target.targetAccountId, target.targetBlockHeight).then(
			(p) => (original.post = p)
		);
	});
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_repost_view -->
<!-- WIDGET_REPOST_VIEW -->
{#if target}
	<div class="repost">
		<p class="byline">
			<Repeat2 />
			REPOSTED BY <a href="/profile/{accountId}">@{displayId}</a>
		</p>
		{#if original.post}
			<a class="original" href="/post/{target.targetAccountId}/{target.targetBlockHeight}">
				<p class="meta">@{target.targetAccountId}</p>
				<div class="text">{@html render_post_text(original.post.text)}</div>
				{#if original.post.image}
					<img class="post-image" src={resolve_image_url_fun(original.post.image)} alt="" />
				{/if}
			</a>
		{:else}
			<p class="loading">Loading original post...</p>
		{/if}
	</div>
{:else}
	<p class="loading">Repost unavailable.</p>
{/if}

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.repost {
		border-left: 2px solid #fff8a3;
		padding: 8px 12px;
		margin: 8px 0;
		text-align: left;
	}
	.byline {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: #888;
		margin: 0 0 6px;
		text-transform: uppercase;
	}
	.byline a {
		color: var(--color-blue, #4d9fff);
		text-decoration: none;
	}
	.byline a:hover {
		text-decoration: underline;
	}
	.original {
		display: block;
		text-decoration: none;
		color: inherit;
		padding: 8px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 6px;
	}
	.original:hover {
		background: rgba(77, 159, 255, 0.05);
	}
	.meta {
		font-size: 11px;
		color: #888;
		margin: 0 0 4px;
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

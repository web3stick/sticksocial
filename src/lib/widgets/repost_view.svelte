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
	// repost value shape (from api.near.social/index with action:repost):
	//   { type: 'repost', item: CommentItem }
	// where CommentItem.path is "<originalAuthor>/post/main".
	// be defensive about the cast — older or partial entries may not
	// match exactly, so fall back to "unavailable" rather than throwing.
	const target = $derived.by(() => {
		const v = value as
			| { type?: string; item?: { type?: string; path?: string; blockHeight?: number } }
			| undefined;
		if (!v || v.type !== "repost") return null;
		const item = v.item;
		if (!item?.path) return null;
		const targetAccountId = item.path.split("/")[0];
		if (!targetAccountId) return null;
		const targetBlockHeight = BigInt(item.blockHeight ?? 0);
		if (targetBlockHeight === 0n) return null;
		return { targetAccountId, targetBlockHeight };
	});
	// ============================================
	type LoadState = "idle" | "loading" | "found" | "missing";
	let original = $state<{ state: LoadState; post: Post | null }>({
		state: "idle",
		post: null
	});
	// ============================================
	$effect(() => {
		original = { state: "idle", post: null };
		if (!target) return;
		original = { state: "loading", post: null };
		get_account_id_post(target.targetAccountId, target.targetBlockHeight).then((p) => {
			original = p ? { state: "found", post: p } : { state: "missing", post: null };
		});
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
			<a href="/profile/{accountId}">@{displayId}</a>
			<span class="dim">reposted</span>
			<a href="/post/{target.targetAccountId}/{target.targetBlockHeight}"
				>@{target.targetAccountId}</a
			>
		</p>
		{#if original.state === "loading"}
			<p class="muted">Loading original post...</p>
		{:else if original.state === "missing"}
			<p class="muted">
				Original post by <a href="/profile/{target.targetAccountId}">@{target.targetAccountId}</a>
				is unavailable.
			</p>
		{:else if original.state === "found" && original.post}
			<div class="original">
				<p class="meta">@{target.targetAccountId}</p>
				<div class="text">{@html render_post_text(original.post.text)}</div>
				{#if original.post.image}
					<img class="post-image" src={resolve_image_url_fun(original.post.image)} alt="" />
				{/if}
				<a class="open" href="/post/{target.targetAccountId}/{target.targetBlockHeight}"
					>OPEN THREAD</a
				>
			</div>
		{/if}
	</div>
{:else if value !== undefined && value !== null}
	<p class="muted">Repost unavailable (unexpected value shape).</p>
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
		flex-wrap: wrap;
	}
	.byline a {
		color: var(--color-blue, #4d9fff);
		text-decoration: none;
	}
	.byline a:hover {
		text-decoration: underline;
	}
	.byline .dim {
		opacity: 0.8;
	}
	.original {
		display: block;
		padding: 8px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 6px;
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
	.open {
		display: inline-block;
		margin-top: 6px;
		font-size: 10px;
		color: var(--color-blue, #4d9fff);
		text-decoration: none;
		text-transform: uppercase;
	}
	.open:hover {
		text-decoration: underline;
	}
	.muted {
		color: #888;
		font-style: italic;
		font-size: 12px;
	}
	.muted a {
		color: var(--color-blue, #4d9fff);
		text-decoration: none;
	}
	.muted a:hover {
		text-decoration: underline;
	}
</style>

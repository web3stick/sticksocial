<script lang="ts">
	import { near_social_js_get_account_latest_comment_fun } from "$lib/near-social-js/main/fun_get_account_latest_comment";
	import { render_post_text } from "./fun/post_text";
	import { resolve_image_url_fun } from "./fun/profile_image";
	// ============================================
	let { accountId }: { accountId: string } = $props();
	// ============================================
	let comment = $state<import("$lib/near-social-js/helper/get_account_id_comment").Comment | null>(
		null
	);
	let parentHref = $state<string>("");
	let parentAuthor = $state<string>("");
	let loading = $state(true);
	// ============================================
	$effect(() => {
		loading = true;
		near_social_js_get_account_latest_comment_fun(accountId).then((r) => {
			if (r) {
				comment = r.comment;
				parentHref = r.parentHref;
				parentAuthor = r.comment.item.path.split("/")[0];
			} else {
				comment = null;
				parentHref = "";
				parentAuthor = "";
			}
			loading = false;
		});
	});
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_latest_comment_view -->
<!-- WIDGET_LATEST_COMMENT_VIEW -->
<div class="latest-comment">
	{#if loading}
		<p class="loading">Loading latest comment...</p>
	{:else if comment}
		<p class="meta">
			latest comment, in reply to <a class="parent-link" href={parentHref}>@{parentAuthor}</a>
		</p>
		<div class="text">{@html render_post_text(comment.text)}</div>
		{#if comment.image}
			<img class="post-image" src={resolve_image_url_fun(comment.image)} alt="" />
		{/if}
	{:else}
		<p class="empty">No comments yet.</p>
	{/if}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.latest-comment {
		text-align: left;
	}
	.meta {
		font-size: 11px;
		color: #888;
		margin-bottom: 6px;
	}
	.parent-link {
		font-weight: bold;
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
	.loading,
	.empty {
		color: #888;
		font-style: italic;
		font-size: 12px;
		padding: 12px 0;
	}
</style>

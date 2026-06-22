<script lang="ts">
	import { page } from "$app/state";
	import POST from "$lib/widgets/post.svelte";
	import COMMENTS_LIST from "$lib/widgets/comments_list.svelte";
	import COMMENT_COMPOSE_FORM from "$lib/widgets/comment_compose_form.svelte";
	import HOME_NAV from "$lib/components/home_nav.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	const blockHeight = $derived(BigInt(page.params.blockHeight ?? "0"));
	// ============================================
	// bumps whenever a new comment is posted so comments_list refetches.
	let refreshKey = $state(0);
	function handle_posted() {
		refreshKey++;
	}
	// ============================================
	// when a comment_view fires onReply(handle), we prefill the compose
	// textarea at the bottom of the page with `@<handle> ` and focus it.
	// defaultDraft is read by the form via a $effect so the latest click
	// always wins over a stale draft.
	let defaultDraft = $state("");
	function handle_reply(handle: string) {
		defaultDraft = `@${handle} `;
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	{#if accountId && blockHeight > 0n}
		<HOME_NAV />
		<div class="sticky-parent">
			<POST {accountId} {blockHeight} {refreshKey} />
		</div>
		<COMMENTS_LIST {accountId} {blockHeight} {refreshKey} onReply={handle_reply} />
		<div class="reply">
			<h3>REPLY</h3>
			<COMMENT_COMPOSE_FORM
				{accountId}
				{blockHeight}
				{defaultDraft}
				onPosted={handle_posted}
			/>
		</div>
	{:else}
		<p>Invalid post URL</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.sticky-parent {
		position: sticky;
		top: 0;
		z-index: 10;
		background: #fff;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	@media (prefers-color-scheme: dark) {
		.sticky-parent {
			background: #1a1a1a;
			border-bottom-color: rgba(255, 255, 255, 0.1);
		}
	}
	.reply {
		width: 500px;
		max-width: 90vw;
		margin: 16px auto;
		text-align: left;
	}
	.reply h3 {
		font-size: 14px;
		margin: 0 0 6px;
	}
</style>

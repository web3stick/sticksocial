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
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	{#if accountId && blockHeight > 0n}
		<HOME_NAV />
		<POST {accountId} {blockHeight} />
		<div class="compose">
			<COMMENT_COMPOSE_FORM {accountId} {blockHeight} onPosted={handle_posted} />
		</div>
		<COMMENTS_LIST {accountId} {blockHeight} {refreshKey} />
	{:else}
		<p>Invalid post URL</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.compose {
		width: 500px;
		max-width: 90vw;
		margin: 12px auto 0;
	}
</style>
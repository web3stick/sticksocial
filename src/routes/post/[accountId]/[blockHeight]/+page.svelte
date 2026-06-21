<script lang="ts">
	import { page } from "$app/state";
	import POST from "$lib/widgets/post.svelte";
	import COMMENTS_LIST from "$lib/widgets/comments_list.svelte";
	import HOME_NAV from "$lib/components/home_nav.svelte";
	// ============================================
	const accountId = $derived(page.params.accountId ?? "");
	const blockHeight = $derived(BigInt(page.params.blockHeight ?? "0"));
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	{#if accountId && blockHeight > 0n}
		<HOME_NAV />
		<POST {accountId} {blockHeight} />
		<COMMENTS_LIST {accountId} {blockHeight} />
	{:else}
		<p>Invalid post URL</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>
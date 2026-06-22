<script lang="ts">
	import { page } from "$app/state";
	import HOME_NAV from "$lib/components/home_nav.svelte";
	import HASHTAG_FEED from "$lib/widgets/hashtag_feed.svelte";
	// ============================================
	const tag = $derived(page.params.tag ?? "");
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	{#if tag}
		<HOME_NAV />
		<h1>#{tag}</h1>
		<HASHTAG_FEED {tag} />
	{:else}
		<p>Invalid hashtag URL</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	h1 {
		font-size: 18px;
		margin: 12px auto;
		width: 500px;
		max-width: 90vw;
		text-align: left;
	}
</style>
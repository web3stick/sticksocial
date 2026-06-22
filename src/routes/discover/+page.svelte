<script lang="ts">
	import HOME_NAV from "$lib/components/home_nav.svelte";
	import INFINITE_POST_FEED from "$lib/widgets/infinite_post_feed.svelte";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>DISCOVER</h1>
	<HOME_NAV />
	<p class="hint">Recent posts from across NEAR Social.</p>
	<INFINITE_POST_FEED />
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
	.hint {
		width: 500px;
		max-width: 90vw;
		margin: 0 auto 12px;
		text-align: left;
		font-size: 12px;
		color: #888;
	}
</style>
<script lang="ts">
	import HOME_NAV from "$lib/components/home_nav.svelte";
	import WIDGET_INFINITE_POST_FEED from "$lib/widgets/infinite_post_feed.svelte";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>FEED</h1>
	<HOME_NAV />
	<WIDGET_INFINITE_POST_FEED limit={50} order="desc" />
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

<script lang="ts">
	import HOME_NAV from "$lib/components/home_nav.svelte";
	import InfinitePostFeed from "$lib/widgets/infinite_post_feed.svelte";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>FEED</h1>
	<HOME_NAV />
	<InfinitePostFeed limit={10} />
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

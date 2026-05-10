<script lang="ts">
	import ROUTES from "../ts/routes";
	import { SlidersHorizontal, Square } from "lucide-svelte";
	// import favicon from "$lib/assets/favicon.svg";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- home_nav -->
<!-- HOME_NAV -->
<nav>
	<!-- <img src={favicon} alt="LOADING"/> -->
	<a href={ROUTES.feed.path}><Square fill="#FFF8A3" color="#FFF8A3" /></a>
	<a href={ROUTES.feed_options.path}><SlidersHorizontal /></a>
</nav>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	nav {
		width: 500px;
		max-width: 90vw;
		/*text-align: right;*/
		border-bottom: 1px solid #95d58d;
		display: flex;
		justify-content: space-between;
	}
</style>

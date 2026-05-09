<script lang="ts">
	import ROUTES from "../ts/routes";
	import { SlidersHorizontal } from "lucide-svelte";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- home_nav -->
<!-- HOME_NAV -->
<nav>
	<a href={ROUTES.profile_auth.path}><SlidersHorizontal /></a>
</nav>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	nav {
		width: 500px;
		max-width: 90vw;
		text-align: right;
		/*display: flex;*/
		/*justify-content: space-between;*/
	}
</style>

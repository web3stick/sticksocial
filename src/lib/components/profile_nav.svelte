<script lang="ts">
	import ROUTES from '../ts/routes';
	import { LogOut, Settings } from 'lucide-svelte';
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- profile_nav -->
<!-- PROFILE_NAV -->
<nav>
	<a href={ROUTES.profile_auth.path}><LogOut /></a>
	<a href={ROUTES.settings.path}><Settings /></a>
</nav>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	nav {
		width: 500px;
		max-width: 90vw;
		display: flex;
		justify-content: space-between;
	}
</style>

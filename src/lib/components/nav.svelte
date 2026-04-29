<script lang="ts">
	import { House, User } from 'lucide-svelte';
	import ROUTES from '../ts/routes';
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- COMPONENT_NAV -->
<!-- component_nav -->
<nav>
    <a href={ROUTES.home.path}><House /></a>
    <a href={ROUTES.profile.path}><User /></a>
</nav>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

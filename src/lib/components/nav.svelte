<script lang="ts">
	import { House, User, Search, Bell } from 'lucide-svelte';
	import ROUTES from '../ts/routes';
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- COMPONENT_NAV -->
<!-- component_nav -->
<nav>
    <a href={ROUTES.home.path}><House /></a>
    <a href={ROUTES.profile.path}><Search /></a>
    <a href={ROUTES.profile.path}><Bell /></a>
    <a href={ROUTES.profile.path}><User /></a>
</nav>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

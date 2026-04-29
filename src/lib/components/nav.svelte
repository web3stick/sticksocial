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
    <a href={ROUTES.search.path}><Search /></a>
    <a href={ROUTES.notifications.path}><Bell /></a>
    <a href={ROUTES.profile.path}><User /></a>
</nav>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
nav {
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);

        width: 500px;
        max-width: 90vw;

        display: flex;
        justify-content: space-between;

        background: rgba(128, 128, 128, 0.1);
        backdrop-filter: blur(10px);

        /*border: 1px solid gray;*/
        border-radius: 20px;
        padding: 10px;
    }
</style>

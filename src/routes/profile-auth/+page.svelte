<script lang="ts">
	import AUTH_BUTTON from "$lib/components/button_auth.svelte";
	import ROUTES from "$lib/ts/routes";
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>LOGIN/LOGOUT</h1>
	<AUTH_BUTTON />
	<a href={ROUTES.profile_router.path}>GO TO PROFILE</a>
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

<script lang="ts">
	import { onMount } from "svelte";
	import HOME_NAV from "$lib/components/home_nav.svelte";
	import WIDGET_COMPOSE_POST_FORM from "$lib/widgets/compose_post_form.svelte";
	import { auth, updateAuthStatus } from "$lib/ts/auth.svelte";
	// ============================================
	let checked = $state(false);
	// ============================================
	onMount(async () => {
		await updateAuthStatus();
		checked = true;
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>COMPOSE</h1>
	<HOME_NAV />
	{#if checked}
		<WIDGET_COMPOSE_POST_FORM />
	{:else}
		<p>Loading...</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

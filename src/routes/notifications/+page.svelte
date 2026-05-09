<script lang="ts">
	import { onMount } from "svelte";
	import { auth, updateAuthStatus } from "$lib/ts/auth.svelte";
	import WIDGET_NOTIFICATIONS_LIST from "$lib/widgets/notifications_list.svelte";
	// ==================================
	let checked = $state(false);
	// ==================================
	onMount(async () => {
		await updateAuthStatus();
		checked = true;
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>NOTIFICATIONS</h1>
	{#if checked && auth.accountId}
		<WIDGET_NOTIFICATIONS_LIST accountId={auth.accountId} />
	{:else if !checked}
		<p>Loading...</p>
	{:else}
		<p>Please log in to view notifications</p>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

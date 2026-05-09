<script lang="ts">
	import { onMount } from 'svelte';
	import { auth, login, logout, updateAuthStatus } from '$lib/ts/auth.svelte';
	// ==================================
	onMount(async () => {
		await updateAuthStatus();
	});
</script>

<!-- =========================================== -->
<!-- =========================================== -->

<!-- AUTH_BUTTON -->
{#if auth.isSignedIn}
	<button onclick={logout}>
		LOGOUT {auth.accountId}
	</button>
{:else}
	<button onclick={login}> LOGIN </button>
{/if}

<!-- =========================================== -->
<!-- =========================================== -->

<style>
	button {
		width: 500px;
	}
</style>

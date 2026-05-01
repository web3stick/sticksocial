<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { near_connect_client } from '@near-kit-tool-box/web';
	import ROUTES from '$lib/ts/routes';
	// ==================================
	let isSignedIn = $state(false);
	let accountId = $state<string | null>(null);
	let checked = $state(false);
	// ==================================
	async function updateAuthStatus() {
		try {
			const wallet = await near_connect_client().wallet();
			const accounts = await wallet.getAccounts();
			if (accounts && accounts.length > 0) {
				console.log('Connected account:', accounts[0].accountId);
				accountId = accounts[0].accountId;
				isSignedIn = true;
			} else {
				console.log('Not connected');
				isSignedIn = false;
			}
		} catch (e) {
			console.error('Auth check failed:', e);
			isSignedIn = false;
		}
		checked = true;
	}
	// ==================================
	onMount(() => {
		updateAuthStatus();
	});
	// ==================================
	$effect(() => {
		if (checked) {
			if (isSignedIn && accountId) {
				goto(`/profile/${accountId}.near`);
			} else {
				goto(ROUTES.profile_auth.path);
			}
		}
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<img src={favicon} alt="Loading"/>
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
    img {
        width: 500px;
        max-width: 90vw;
        /*border: 1px solid red;*/
    }
</style>
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, updateAuthStatus } from '$lib/ts/auth.svelte';
	import ROUTES from '$lib/ts/routes';
	// ==================================
	let checked = $state(false);
	// ==================================
	onMount(async () => {
		await updateAuthStatus();
		checked = true;
	});
	// ==================================
	$effect(() => {
		if (checked) {
			if (auth.isSignedIn && auth.accountId) {
				goto(`/profile/${auth.accountId}`);
			} else {
				goto(ROUTES.profile_auth.path);
			}
		}
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<!-- <img src={favicon} alt="LOADING"/> -->
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	/*img {
        width: 500px;
        max-width: 90vw;
        border: 1px solid red;
    }*/
</style>

<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { get_profile } from '$lib/near-social-js/fun_get_profile';
	import type { Profile } from 'near-social-js';
	// ============================================
	let profile = $state<Profile | null>(null);
	// ============================================
	onMount(async () => {
		const accountId = page.params.accountId;
		if (accountId) {
			profile = await get_profile(accountId);
		}
		// =================
		console.log($state.snapshot(profile));
		// =================
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<h1>PROFILE</h1>
	<p>Account: {page.params.accountId}</p>
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

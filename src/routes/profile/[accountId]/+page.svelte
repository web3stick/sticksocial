<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { get_profile } from '$lib/near-social-js/fun_get_profile';
	import type { Profile } from 'near-social-js';
	// ============================================
	let profile = $state<Profile | null>(null);
	// ============================================
	onMount(async () => {
		// =================
		profile = await get_profile(page.params.accountId);
		// =================
		console.log(profile);
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

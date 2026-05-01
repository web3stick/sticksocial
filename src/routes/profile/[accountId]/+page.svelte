<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { get_profile } from '$lib/near-social-js/fun_get_profile';
	import type { Profile } from 'near-social-js';
	// ============================================
	import PROFILE_BANNER from '$lib/components/profile_banner.svelte';
	import PROFILE_NAV from '$lib/components/profile_nav.svelte';
	// ============================================
	// profile for profile deatils pass to the profile banner componet
	let profile = $state<Profile | null>(null);
	// ============================================
	onMount(async () => {
		const accountId = page.params.accountId;
		if (accountId) {
			profile = await get_profile(accountId);
		}
		// =================
		console.log("=================")
		console.log("/profile/" + accountId);
		console.log($state.snapshot(profile));
		console.log("=================")
		// =================
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<PROFILE_NAV />
	{#if page.params.accountId}
		<PROFILE_BANNER {profile} accountId={page.params.accountId} />
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { get_profile } from '$lib/near-social-js/fun_get_profile';
	import type { Profile } from 'near-social-js';
	// ============================================
	import PROFILE_BANNER from '$lib/components/profile_banner.svelte';
	import PROFILE_NAV from '$lib/components/profile_nav.svelte';
	import SKELETON_PROFILE_BANNER from '$lib/components/skeleton_profile_banner.svelte';
	// ============================================
	// profile for profile deatils pass to the profile banner componet
	let profile = $state<Profile | null>(null);
	let loading = $state(true);
	let ready = $state(false);
	// ============================================
	onMount(async () => {
		const accountId = page.params.accountId;
		if (accountId) {
			profile = await get_profile(accountId);
		}
		loading = false;
		// =================
		console.log("=================")
		console.log("/profile/" + accountId);
		console.log($state.snapshot(profile));
		console.log("=================")
		// =================
	});

	function onSkeletonReady() {
		ready = true;
	}
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section>
	<PROFILE_NAV />
	{#if page.params.accountId}
		<SKELETON_PROFILE_BANNER loading={loading} accountId={page.params.accountId} onReady={onSkeletonReady} />
		{#if ready}
			<PROFILE_BANNER {profile} accountId={page.params.accountId} />
		{/if}
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

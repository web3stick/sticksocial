<script lang="ts">
	import { onMount } from 'svelte';
	import type { Profile } from 'near-social-js';
	import { get_profile } from '$lib/near-social-js/main/fun_get_profile';
	import { resolve_linktree_url_fun } from '$lib/fun/profile_linktree';

	let { accountId }: { accountId: string } = $props();
	let profile = $state<Profile | null>(null);

	onMount(async () => {
		if (accountId) {
			profile = await get_profile(accountId);
		}
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->
{#if profile?.linktree}
	<div class="linktree">
		<p>linktree</p>
		{#each Object.entries(profile.linktree) as [key, url]}
			<a href={resolve_linktree_url_fun(key, url as string)} target="_blank" rel="noopener noreferrer"
				>{key}</a
			>
		{/each}
	</div>
{/if}

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.linktree {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
</style>
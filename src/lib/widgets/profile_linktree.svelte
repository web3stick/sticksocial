<script lang="ts">
	import { onMount } from 'svelte';
	import type { Profile } from 'near-social-js';
	import { get_profile } from '$lib/near-social-js/main/fun_get_profile';
	import { resolve_linktree_url_fun, resolve_linktree_icon_fun } from '$lib/fun/profile_linktree';
	// ============================================
	let { accountId }: { accountId: string } = $props();
	let profile = $state<Profile | null>(null);
	// ============================================
	onMount(async () => {
		if (accountId) {
			profile = await get_profile(accountId);
		}
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
	/>
</svelte:head>

<!-- ============================================ -->
<!-- ============================================ -->

{#if profile?.linktree}
	<div class="linktree">
		<!-- <p>linktree</p> -->
		{#each Object.entries(profile.linktree) as [key, url]}
			<a
				href={resolve_linktree_url_fun(key, url as string)}
				target="_blank"
				rel="noopener noreferrer"
			>
				<button><i class="bi {resolve_linktree_icon_fun(key)}"></i> {key}</button>
			</a>
		{/each}
	</div>
{/if}

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.linktree {
		text-align: left;
		width: 500px;
		max-width: 90vw;
		box-sizing: border-box;
		padding: 0px;
		/*border: 1px solid red;*/
	}
	.linktree button {
		margin-top: 2px;
		margin-bottom: 2px;
		width: 100%;
		border-radius: 3px;
		display: flex;
		justify-content: space-between;
		/*box-sizing: border-box;*/
	}
</style>

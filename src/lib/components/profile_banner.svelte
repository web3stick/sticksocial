<script lang="ts">
	import type { Profile } from 'near-social-js';
	import { resolveImageUrl } from '$lib/ts/profile_fun';
	let { profile } = $props<{ profile: Profile | null }>();
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- profile_banner -->
<!-- PROFILE_BANNER -->
<div>
	<img src={resolveImageUrl(profile?.backgroundImage)} alt="BANNER" class="banner" />
	{#if profile?.image}
		<img src={resolveImageUrl(profile.image)} alt="PROFILE_PIC" class="profile-pic" />
	{/if}
	<h1>{profile?.name}</h1>
	<p>{profile?.description}</p>
	{#if profile.linktree}
		<div class="linktree">
			{#each Object.entries(profile.linktree) as [key, url]}
				<a href={url as string} target="_blank" rel="noopener noreferrer">{key}</a>
			{/each}
		</div>
	{/if}

	<!-- we will use tags in future when i add links to them to routes -->
	<!-- {#if profile?.tags}
		<div class="tags">
			{#each Object.entries(profile.tags) as [tag]}
				<span>{tag}</span>
			{/each}
		</div>
	{/if} -->
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	div {
		text-align: left;
		width: 500px;
		max-width: 90vw;
	}
	.banner {
		width: 500px;
		max-width: 90vw;
	}
	.profile-pic {
		width: 80px;
		height: 80px;
		border-radius: 50%;
	}
	.linktree {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}
</style>

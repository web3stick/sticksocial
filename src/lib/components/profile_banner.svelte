<script lang="ts">
	import type { Profile } from 'near-social-js';
	import { resolveImageUrl, resolveLinkUrl } from '$lib/ts/profile_fun';
	let { profile, accountId } = $props<{ profile: Profile | null; accountId: string }>();

	let expanded = $state(false);
	const MAX_LENGTH = 100;
	const needsTruncation = $derived((profile?.description?.length ?? 0) > MAX_LENGTH);
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- profile_banner -->
<!-- PROFILE_BANNER -->
<div>
    <!-- =========================== -->
	<img src={resolveImageUrl(profile?.backgroundImage)} alt="BANNER" class="banner" />
	{#if accountId}
		<img src={`https://i.near.social/magic/large/https://near.social/magic/img/account/${accountId}`} alt="PROFILE_PIC" class="profile-pic" />
	{/if}
	<!-- =========================== -->
	<h1>{profile?.name}</h1>
	<!-- =========================== -->
	<p>
		{expanded || !needsTruncation ? profile?.description : profile?.description?.slice(0, MAX_LENGTH) + '...'}
		{#if needsTruncation}
			<button class="show-more" onclick={() => expanded = !expanded}>{expanded ? 'SHOW LESS' : 'SHOW MORE'}</button>
		{/if}
	</p>
	<!-- =========================== -->
	{#if profile?.linktree}
		<div class="linktree">
			{#each Object.entries(profile?.linktree ?? {}) as [key, url]}
				<a href={resolveLinkUrl(key, url as string)} target="_blank" rel="noopener noreferrer">{key}</a>
			{/each}
		</div>
	{/if}
	<!-- =========================== -->
	<!-- we will use tags in future when i add links to them to routes -->
	<!-- {#if profile?.tags}
		<div class="tags">
			{#each Object.entries(profile.tags) as [tag]}
				<span>{tag}</span>
			{/each}
		</div>
	{/if} -->
	<!-- =========================== -->
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
    div {
      width: 500px;
      max-width: 90vw;
      margin: 0 auto;
      position: relative;
      text-align: left;
    }
    
    /* Banner */
    .banner {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: 16px;
      filter: brightness(0.9);
    }
    
    /* Floating profile picture */
    .profile-pic {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 4px solid white;
      position: absolute;
      top: 110px;
      left: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    
    /* Name + description container */
    h1, p {
      /*margin-left: 20px;*/
      margin-top: 50px;
    }
    
    h1 {
      font-size: 1.4rem;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 0.95rem;
      opacity: 0.8;
      margin-top: 0;
    }

    .show-more {
      background: none;
      border: none;
      color: var(--color-blue);
      cursor: pointer;
      padding: 0;
      margin-left: 4px;
      font-size: 10px;
    }
    
    /* Linktree pills */
    .linktree {
      margin-top: 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      /*padding-left: 20px;*/
    }
    
   

</style>

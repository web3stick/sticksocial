<script lang="ts">
	import { onMount } from "svelte";
	import type { Profile } from "near-social-js";
	import { get_profile } from "$lib/near-social-js/main/fun_get_profile";
	import { resolve_image_url_fun } from "./fun/profile_image";
	// ============================================
	let profile = $state<Profile | null>(null);
	let loading = $state(true);
	let { accountId } = $props<{ accountId: string }>();
	let expanded = $state(false);
	const MAX_LENGTH = 100;
	const MAX_ID_LENGTH = 20;
	const needsTruncation = $derived((profile?.description?.length ?? 0) > MAX_LENGTH);
	const displayId = $derived(
		accountId.length > MAX_ID_LENGTH ? accountId.slice(0, MAX_ID_LENGTH) + "..." : accountId
	);
	const DEFAULT_BANNER = "https://lipsum.app/random/1600x900";
	const bannerSrc = $derived(resolve_image_url_fun(profile?.backgroundImage) || DEFAULT_BANNER);
	// ============================================
	onMount(async () => {
		if (accountId) {
			profile = await get_profile(accountId);
		}
		loading = false;
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->
{#if loading}
	<!-- <div class="loading">LOADING</div> -->
{:else}
	<!-- ============================================ -->
	<!-- ============================================ -->
	<!-- widget_profile_banner -->
	<!-- WIDGET_PROFILE_BANNER -->
	<div>
		<!-- =========================== -->
		<img src={bannerSrc} alt="BANNER" class="banner" />
		{#if accountId}
			<img
				src={`https://i.near.social/magic/large/https://near.social/magic/img/account/${accountId}`}
				alt="PROFILE_PIC"
				class="profile-pic"
			/>
		{/if}
		<!-- =========================== -->
		<h1>{profile?.name}</h1>
		<p class="account-id" title={accountId}>@{displayId}</p>
		<!-- =========================== -->
		<p>
			{expanded || !needsTruncation
				? profile?.description
				: profile?.description?.slice(0, MAX_LENGTH) + "..."}
			{#if needsTruncation}
				<button class="show-more" onclick={() => (expanded = !expanded)}
					>{expanded ? "SHOW LESS" : "SHOW MORE"}</button
				>
			{/if}
		</p>
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
{/if}

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
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}

	/* Name + description container */
	h1,
	p {
		/*margin-left: 20px;*/
		margin-top: 50px;
	}

	h1 {
		/*font-size: 1.4rem;*/
		margin-bottom: 4px;
	}

	p {
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
	.account-id {
		font-size: 13px;
		color: #888;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>

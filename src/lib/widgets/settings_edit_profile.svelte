<script lang="ts">
	import { onMount } from "svelte";
	import { auth, updateAuthStatus } from "$lib/ts/auth.svelte";
	import { get_profile } from "$lib/near-social-js/main/fun_get_profile";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import type { Profile } from "near-social-js";
	// ==================================
	let profile = $state<Profile | null>(null);
	// ==================================
	let name = $state("");
	let imageUrl = $state("");
	let backdropUrl = $state("");
	let bio = $state("");
	let twitter = $state("");
	let github = $state("");
	let telegram = $state("");
	let website = $state("");
	// ==================================
	onMount(async () => {
		await updateAuthStatus();
		if (auth.accountId) {
			profile = await get_profile(auth.accountId);
			if (profile) {
				name = profile.name ?? "";
				imageUrl = resolve_image_url_fun(profile.image);
				backdropUrl = resolve_image_url_fun(profile.backgroundImage);
				bio = profile.description ?? "";
				twitter = profile.linktree?.["twitter"] ?? "";
				github = profile.linktree?.["github"] ?? "";
				telegram = profile.linktree?.["telegram"] ?? "";
				website = profile.linktree?.["website"] ?? "";
			}
		}
	});
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- SETTINGS_EDIT_PROFILE -->
<div>
	<h3>EDIT PROFILE</h3>
	{#if auth.accountId}
		<img
			src={`https://i.near.social/magic/large/https://near.social/magic/img/account/${auth.accountId}`}
			alt="PROFILE_PIC"
			class="profile-pic"
		/>
	{/if}
	<form>
		<label>
			NAME
			<input type="text" bind:value={name} />
		</label>
		<label>
			IMAGE URL
			<input type="text" bind:value={imageUrl} />
		</label>
		<label>
			BACKDROP IMAGE URL
			<input type="text" bind:value={backdropUrl} />
		</label>
		<label>
			BIO
			<textarea bind:value={bio}></textarea>
		</label>
		<label>
			TWITTER
			<input type="text" bind:value={twitter} />
		</label>
		<label>
			GITHUB
			<input type="text" bind:value={github} />
		</label>
		<label>
			TELEGRAM
			<input type="text" bind:value={telegram} />
		</label>
		<label>
			WEBSITE
			<input type="text" bind:value={website} />
		</label>
	</form>
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	div {
		text-align: left;
	}
	.profile-pic {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		border: 4px solid white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	input,
	textarea {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		/*width: 100%;*/
		width: 500px;
		max-width: 90vw;
		box-sizing: border-box;
	}
	textarea {
		min-height: 80px;
		resize: vertical;
	}
</style>

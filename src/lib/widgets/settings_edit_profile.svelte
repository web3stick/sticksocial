<script lang="ts">
	import { onMount } from "svelte";
	import { auth, updateAuthStatus } from "$lib/ts/auth.svelte";
	import { get_profile } from "$lib/near-social-js/main/fun_get_profile";
	import { near_social_js_set_profile_fun } from "$lib/near-social-js/main/fun_set_profile";
	import { resolve_image_url_fun } from "./fun/profile_image";
	import type { Profile } from "near-social-js";
	// ============================================
	let profile = $state<Profile | null>(null);
	// ============================================
	let name = $state("");
	let imageUrl = $state("");
	let backdropUrl = $state("");
	let bio = $state("");
	let twitter = $state("");
	let github = $state("");
	let telegram = $state("");
	let website = $state("");
	// ============================================
	let busy = $state(false);
	let result = $state<string | null>(null);
	let error = $state<string | null>(null);
	// ============================================
	function parse_image_input(url: string): { ipfs_cid: string } | { url: string } | null {
		const trimmed = url.trim();
		if (!trimmed) return null;
		if (trimmed.startsWith("ipfs://")) return { ipfs_cid: trimmed.slice(7) };
		return { url: trimmed };
	}
	// ============================================
	function build_profile_payload(): Record<string, unknown> {
		const payload: Record<string, unknown> = {};
		const trimmed_name = name.trim();
		if (trimmed_name) payload.name = trimmed_name;
		const trimmed_bio = bio.trim();
		if (trimmed_bio) payload.description = trimmed_bio;
		const img = parse_image_input(imageUrl);
		if (img) payload.image = img;
		const bg = parse_image_input(backdropUrl);
		if (bg) payload.backgroundImage = bg;
		const linktree: Record<string, string> = {};
		if (twitter.trim()) linktree.twitter = twitter.trim();
		if (github.trim()) linktree.github = github.trim();
		if (telegram.trim()) linktree.telegram = telegram.trim();
		if (website.trim()) linktree.website = website.trim();
		if (Object.keys(linktree).length > 0) payload.linktree = linktree;
		return payload;
	}
	// ============================================
	async function refresh_profile() {
		if (!auth.accountId) return;
		const fresh = await get_profile(auth.accountId);
		if (fresh) profile = fresh;
	}
	// ============================================
	async function on_save(e: Event) {
		e.preventDefault();
		if (!auth.accountId || busy) return;
		busy = true;
		result = null;
		error = null;
		try {
			await near_social_js_set_profile_fun(auth.accountId, build_profile_payload());
			await refresh_profile();
			result = "SAVED";
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			console.error("setProfile failed", e);
		} finally {
			busy = false;
		}
	}
	// ============================================
	onMount(async () => {
		await updateAuthStatus();
		if (auth.accountId) {
			await refresh_profile();
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
	// ============================================
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
	{:else}
		<p class="hint">SIGN IN TO EDIT PROFILE</p>
	{/if}
	<form onsubmit={on_save}>
		<label>
			NAME
			<input type="text" bind:value={name} disabled={!auth.accountId || busy} />
		</label>
		<label>
			IMAGE URL
			<input type="text" bind:value={imageUrl} disabled={!auth.accountId || busy} />
		</label>
		<label>
			BACKDROP IMAGE URL
			<input type="text" bind:value={backdropUrl} disabled={!auth.accountId || busy} />
		</label>
		<label>
			BIO
			<textarea bind:value={bio} disabled={!auth.accountId || busy}></textarea>
		</label>
		<label>
			TWITTER
			<input type="text" bind:value={twitter} disabled={!auth.accountId || busy} />
		</label>
		<label>
			GITHUB
			<input type="text" bind:value={github} disabled={!auth.accountId || busy} />
		</label>
		<label>
			TELEGRAM
			<input type="text" bind:value={telegram} disabled={!auth.accountId || busy} />
		</label>
		<label>
			WEBSITE
			<input type="text" bind:value={website} disabled={!auth.accountId || busy} />
		</label>
		<div class="actions">
			<button type="submit" disabled={!auth.accountId || busy}>SAVE</button>
			{#if result}
				<span class="ok">{result}</span>
			{/if}
			{#if error}
				<span class="err">{error}</span>
			{/if}
		</div>
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
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
		width: 500px;
		max-width: 90vw;
		box-sizing: border-box;
	}
	textarea {
		min-height: 80px;
		resize: vertical;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.actions button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
	.ok {
		color: #2e7d32;
		font-weight: bold;
	}
	.err {
		color: #c62828;
		font-size: 12px;
	}
	.hint {
		text-align: center;
		font-style: italic;
		color: #888;
	}
</style>
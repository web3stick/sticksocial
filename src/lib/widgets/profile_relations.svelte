<script lang="ts">
	import type { Profile } from "near-social-js";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_get_followers_fun } from "$lib/near-social-js/main/fun_get_followers";
	import { near_social_js_get_following_fun } from "$lib/near-social-js/main/fun_get_following";
	import { near_social_js_get_fun } from "$lib/near-social-js/main/fun_get";
	import FOLLOW_BUTTON from "./follow_button.svelte";
	// ============================================
	type Mode = "followers" | "following";
	let {
		accountId,
		mode
	}: {
		accountId: string;
		mode: Mode;
	} = $props();
	// ============================================
	interface RelationRow {
		accountId: string;
		name: string;
		isFollowing: boolean;
	}
	let rows = $state<RelationRow[]>([]);
	let loading = $state(true);
	let refreshKey = $state(0);
	// ============================================
	// fetch followers/following list for accountId, batch-fetch each
	// account's profile, and (if signed in) figure out which of those
	// accounts the viewer already follows so each row's follow button
	// can render in the right state without doing its own N round-trips.
	// we close over `accountId` + `mode` synchronously so the effect re-fires
	// when either changes, and use a cancellation guard so an in-flight
	// fetch for the previous accountId can't overwrite the new one.
	$effect(() => {
		refreshKey;
		const target = accountId;
		const targetMode = mode;
		if (!target) return;
		loading = true;
		let cancelled = false;
		(async () => {
			try {
				const ids =
					targetMode === "followers"
						? (await near_social_js_get_followers_fun(target)).map((f) => f.accountId)
						: Object.keys((await near_social_js_get_following_fun(target)) ?? {});
				if (cancelled) return;
				if (ids.length === 0) {
					rows = [];
					loading = false;
					return;
				}
				// batch-fetch all profiles in a single get() call.
				const profileResult = await near_social_js_get_fun({
					keys: ids.flatMap((id) => [`${id}/profile/name`, `${id}/profile/**`])
				});
				if (cancelled) return;
				// viewer followings set — only if signed in.
				let viewerFollowing: Set<string> | null = null;
				if (auth.accountId) {
					const vf = await near_social_js_get_following_fun(auth.accountId);
					if (cancelled) return;
					viewerFollowing = new Set(Object.keys(vf ?? {}));
				}
				rows = ids.map((id) => {
					const profileNode = (profileResult?.[id] as { profile?: Profile } | undefined)
						?.profile;
					return {
						accountId: id,
						name: profileNode?.name ?? "",
						isFollowing: viewerFollowing?.has(id) ?? false
					};
				});
			} catch (e) {
				console.error(`profile_relations (${targetMode}) failed`, e);
				rows = [];
			} finally {
				if (!cancelled) loading = false;
			}
		})();
		return () => {
			cancelled = true;
		};
	});
	// ============================================
	function handle_toggled() {
		// re-fetch after a follow/unfollow so the row state stays in sync
		// with the rest of the list.
		refreshKey++;
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_profile_relations -->
<!-- WIDGET_PROFILE_RELATIONS -->
<div class="relations">
	{#if loading}
		<p class="empty">Loading {mode}...</p>
	{:else if rows.length === 0}
		<p class="empty">No {mode} yet.</p>
	{:else}
		{#each rows as row (row.accountId)}
			<div class="row">
				<a class="avatar" href="/profile/{row.accountId}" aria-label={row.accountId}>
					<img
						src={`https://i.near.social/magic/large/https://near.social/magic/img/account/${row.accountId}`}
						alt=""
					/>
				</a>
				<div class="info">
					<a class="name" href="/profile/{row.accountId}">{row.name || row.accountId}</a>
					<a class="handle" href="/profile/{row.accountId}">@{row.accountId}</a>
				</div>
				{#if auth.accountId && row.accountId !== auth.accountId}
					<FOLLOW_BUTTON
						accountId={row.accountId}
						initialFollowing={row.isFollowing}
						refreshKey={refreshKey}
					/>
				{/if}
			</div>
		{/each}
	{/if}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.relations {
		width: 500px;
		max-width: 90vw;
		margin: 0 auto;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 4px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
	@media (prefers-color-scheme: dark) {
		.row {
			border-bottom-color: rgba(255, 255, 255, 0.08);
		}
	}
	.avatar img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: block;
	}
	.info {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.name {
		font-size: 14px;
		font-weight: bold;
		color: inherit;
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.name:hover {
		text-decoration: underline;
	}
	.handle {
		font-size: 12px;
		color: #888;
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.handle:hover {
		text-decoration: underline;
	}
	.empty {
		color: #888;
		font-style: italic;
		font-size: 12px;
		padding: 12px 4px;
	}
</style>

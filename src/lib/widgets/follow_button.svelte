<script lang="ts">
	import { UserPlus, UserMinus } from "lucide-svelte";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_get_followers_fun } from "$lib/near-social-js/main/fun_get_followers";
	import { near_social_js_follow_fun } from "$lib/near-social-js/main/fun_follow";
	import { near_social_js_unfollow_fun } from "$lib/near-social-js/main/fun_unfollow";
	// ============================================
	let {
		accountId,
		refreshKey = 0,
		initialFollowing = null
	}: {
		accountId: string;
		refreshKey?: number;
		// when the caller already knows whether the viewer follows this
		// account (e.g. profile_relations fetched the viewer's following
		// set once), pass it in to skip the per-row getFollowers fetch.
		// null means "look it up"; true/false is used as-is.
		initialFollowing?: boolean | null;
	} = $props();
	// ============================================
	let followers = $state<{ accountId: string }[]>([]);
	let followedOverride = $state<boolean | null>(null);
	let loading = $state(false);
	let busy = $state(false);
	// ============================================
	const following = $derived(
		followedOverride !== null
			? followedOverride
			: auth.accountId !== null &&
					followers.some((f) => f.accountId === auth.accountId)
	);
	const count = $derived(followers.length);
	const can_toggle = $derived(
		!!auth.accountId && !busy && auth.accountId !== accountId
	);
	// ============================================
	async function refresh() {
		if (!accountId) return;
		loading = true;
		try {
			followers = await near_social_js_get_followers_fun(accountId);
		} catch (e) {
			console.error("getFollowers failed", e);
		} finally {
			loading = false;
		}
	}
	// ============================================
	$effect(() => {
		refreshKey;
		accountId;
		// if the caller passed a known state, use it and skip the fetch.
		if (initialFollowing !== null && initialFollowing !== undefined) {
			followedOverride = initialFollowing;
			loading = false;
			return;
		}
		refresh();
	});
	// ============================================
	async function on_click() {
		if (!can_toggle) return;
		busy = true;
		try {
			if (following) {
				await near_social_js_unfollow_fun(auth.accountId!, accountId);
			} else {
				await near_social_js_follow_fun(auth.accountId!, accountId);
			}
			// flip the override locally so the UI updates instantly when
			// the caller pre-supplied initialFollowing. refresh() also
			// works but does an extra roundtrip.
			if (followedOverride !== null) {
				followedOverride = !following;
			} else {
				await refresh();
			}
		} catch (e) {
			console.error("follow toggle failed", e);
		} finally {
			busy = false;
		}
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_follow_button -->
<!-- WIDGET_FOLLOW_BUTTON -->
<button
	type="button"
	class="follow-button"
	class:following
	disabled={!can_toggle || loading}
	onclick={on_click}
	title={!auth.accountId
		? "SIGN IN TO FOLLOW"
		: auth.accountId === accountId
			? "CAN'T FOLLOW YOURSELF"
			: following
				? "UNFOLLOW"
				: "FOLLOW"}
>
	{#if loading && followedOverride === null}
		<span class="label">...</span>
	{:else if following}
		<UserMinus />
		<span class="label">UNFOLLOW</span>
	{:else}
		<UserPlus />
		<span class="label">FOLLOW</span>
	{/if}
	<span class="count">{loading && followedOverride === null ? "" : count}</span>
</button>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.follow-button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
	}
	.follow-button.following {
		border-color: rgba(0, 0, 0, 0.2);
	}
	@media (prefers-color-scheme: dark) {
		.follow-button.following {
			border-color: rgba(255, 255, 255, 0.2);
		}
	}
	.follow-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
	.follow-button:not(:disabled):hover {
		transform: translateY(-1px);
	}
	.count {
		color: inherit;
		opacity: 0.7;
		font-weight: normal;
	}
</style>
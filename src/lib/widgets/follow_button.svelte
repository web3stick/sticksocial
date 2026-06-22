<script lang="ts">
	import { UserPlus, UserMinus } from "lucide-svelte";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_get_followers_fun } from "$lib/near-social-js/main/fun_get_followers";
	import { near_social_js_follow_fun } from "$lib/near-social-js/main/fun_follow";
	import { near_social_js_unfollow_fun } from "$lib/near-social-js/main/fun_unfollow";
	// ============================================
	let {
		accountId,
		refreshKey = 0
	}: {
		accountId: string;
		refreshKey?: number;
	} = $props();
	// ============================================
	let followers = $state<{ accountId: string }[]>([]);
	let loading = $state(false);
	let busy = $state(false);
	// ============================================
	const following = $derived(
		auth.accountId !== null &&
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
			await refresh();
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
	disabled={!can_toggle}
	onclick={on_click}
	title={!auth.accountId
		? "SIGN IN TO FOLLOW"
		: auth.accountId === accountId
			? "CAN'T FOLLOW YOURSELF"
			: following
				? "UNFOLLOW"
				: "FOLLOW"}
>
	{#if following}
		<UserMinus />
		<span class="label">UNFOLLOW</span>
	{:else}
		<UserPlus />
		<span class="label">FOLLOW</span>
	{/if}
	<span class="count">{loading ? "..." : count}</span>
</button>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.follow-button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid #95d58d;
		background: #fff8a3;
		cursor: pointer;
		font-size: 12px;
		font-weight: bold;
	}
	.follow-button.following {
		background: transparent;
		color: #666;
		border-color: rgba(0, 0, 0, 0.2);
	}
	@media (prefers-color-scheme: dark) {
		.follow-button.following {
			color: #aaa;
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
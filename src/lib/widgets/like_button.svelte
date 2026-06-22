<script lang="ts">
	import { Heart } from "lucide-svelte";
	import type { IndexEntry } from "near-social-js";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_like_fun } from "$lib/near-social-js/main/fun_like";
	import { near_social_js_unlike_fun } from "$lib/near-social-js/main/fun_unlike";
	import { near_social_js_get_likes_fun } from "$lib/near-social-js/main/fun_get_likes";
	// ============================================
	let { accountId, blockHeight }: { accountId: string; blockHeight: bigint } = $props();
	// ============================================
	let likes = $state<IndexEntry[]>([]);
	let loading = $state(false);
	let busy = $state(false);
	// ============================================
	const item = $derived({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	const liked = $derived(
		auth.accountId !== null && likes.some((l) => l.accountId === auth.accountId)
	);
	const count = $derived(likes.length);
	// ============================================
	async function refresh() {
		try {
			likes = await near_social_js_get_likes_fun(item);
		} catch (e) {
			console.error("getLikes failed", e);
		}
	}
	// ============================================
	$effect(() => {
		loading = true;
		refresh().finally(() => (loading = false));
	});
	// ============================================
	async function on_click() {
		if (busy) return;
		if (!auth.accountId) return;
		busy = true;
		try {
			if (liked) {
				await near_social_js_unlike_fun(auth.accountId, item);
			} else {
				await near_social_js_like_fun(auth.accountId, item);
			}
			await refresh();
		} catch (e) {
			console.error("like toggle failed", e);
		} finally {
			busy = false;
		}
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_like_button -->
<!-- WIDGET_LIKE_BUTTON -->
<button
	type="button"
	class="like-button"
	class:liked
	disabled={!auth.accountId || busy}
	onclick={on_click}
	title={auth.accountId ? (liked ? "UNLIKE" : "LIKE") : "SIGN IN TO LIKE"}
>
	<Heart fill={liked ? "#ff4d6d" : "none"} color={liked ? "#ff4d6d" : "currentColor"} />
	<span class="count">{loading ? "..." : count}</span>
</button>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.like-button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 6px;
		color: inherit;
		font-size: 12px;
	}
	.like-button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
	.like-button:not(:disabled):hover {
		background: rgba(255, 77, 109, 0.1);
	}
	.count {
		min-width: 1.5em;
		text-align: left;
	}
</style>

<script lang="ts">
	import { Repeat2 } from "lucide-svelte";
	import type { IndexEntry } from "near-social-js";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_repost_fun } from "$lib/near-social-js/main/fun_repost";
	import { near_social_js_get_reposts_fun } from "$lib/near-social-js/main/fun_get_reposts";
	// ============================================
	let { accountId, blockHeight }: { accountId: string; blockHeight: bigint } = $props();
	// ============================================
	let reposts = $state<IndexEntry[]>([]);
	let loading = $state(false);
	let busy = $state(false);
	// ============================================
	const item = $derived({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	const count = $derived(reposts.length);
	// ============================================
	async function refresh() {
		try {
			reposts = await near_social_js_get_reposts_fun(item);
		} catch (e) {
			console.error("getReposts failed", e);
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
			await near_social_js_repost_fun(auth.accountId, item);
			await refresh();
		} catch (e) {
			console.error("repost failed", e);
		} finally {
			busy = false;
		}
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_repost_button -->
<!-- WIDGET_REPOST_BUTTON -->
<button
	type="button"
	class="repost-button"
	disabled={!auth.accountId || busy}
	onclick={on_click}
	title={auth.accountId ? "REPOST" : "SIGN IN TO REPOST"}
>
	<Repeat2 color={busy ? "#2e7d32" : "currentColor"} />
	<span class="count">{loading ? "..." : count}</span>
</button>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.repost-button {
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
	.repost-button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
	.repost-button:not(:disabled):hover {
		background: rgba(46, 125, 50, 0.1);
	}
	.count {
		min-width: 1.5em;
		text-align: left;
	}
</style>

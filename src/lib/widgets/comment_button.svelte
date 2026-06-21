<script lang="ts">
	import { MessageCircle } from "lucide-svelte";
	import type { IndexEntry } from "near-social-js";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_get_comments_fun } from "$lib/near-social-js/main/fun_get_comments";
	import { near_social_js_create_comment_fun } from "$lib/near-social-js/main/fun_create_comment";
	// ============================================
	let {
		accountId,
		blockHeight
	}: { accountId: string; blockHeight: bigint } = $props();
	// ============================================
	let comments = $state<IndexEntry[]>([]);
	let loading = $state(false);
	let busy = $state(false);
	let open = $state(false);
	let draft = $state("");
	let result = $state<string | null>(null);
	let error = $state<string | null>(null);
	// ============================================
	const item = $derived({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	const count = $derived(comments.length);
	// ============================================
	async function refresh() {
		try {
			comments = await near_social_js_get_comments_fun(item);
		} catch (e) {
			console.error("getComments failed", e);
		}
	}
	// ============================================
	$effect(() => {
		loading = true;
		refresh().finally(() => (loading = false));
	});
	// ============================================
	async function on_submit(e: Event) {
		e.preventDefault();
		if (!auth.accountId) return;
		const trimmed = draft.trim();
		if (!trimmed || busy) return;
		busy = true;
		result = null;
		error = null;
		try {
			await near_social_js_create_comment_fun(auth.accountId, {
				item,
				text: trimmed
			});
			draft = "";
			result = "POSTED";
			await refresh();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			console.error("createComment failed", e);
		} finally {
			busy = false;
		}
	}
	// ============================================
	function toggle() {
		open = !open;
		if (open) result = null;
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comment_button -->
<!-- WIDGET_COMMENT_BUTTON -->
<div class="comment-block">
	<button
		type="button"
		class="comment-button"
		class:active={open}
		onclick={toggle}
		title={open ? "CLOSE REPLY" : "REPLY"}
	>
		<MessageCircle fill={open ? "#4d9fff" : "none"} color={open ? "#4d9fff" : "currentColor"} />
		<span class="count">{loading ? "..." : count}</span>
	</button>
	{#if open}
		{#if !auth.accountId}
			<p class="hint">SIGN IN TO COMMENT</p>
		{:else}
			<form class="reply-form" onsubmit={on_submit}>
				<textarea
					bind:value={draft}
					placeholder="reply..."
					rows="2"
					maxlength="2000"
				></textarea>
				<div class="reply-actions">
					<button type="submit" disabled={!draft.trim() || busy}>REPLY</button>
					{#if result}
						<span class="ok">{result}</span>
					{/if}
					{#if error}
						<span class="err">{error}</span>
					{/if}
				</div>
			</form>
		{/if}
	{/if}
</div>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.comment-block {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.comment-button {
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
		align-self: flex-start;
	}
	.comment-button:hover {
		background: rgba(77, 159, 255, 0.1);
	}
	.count {
		min-width: 1.5em;
		text-align: left;
	}
	.reply-form {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	textarea {
		width: 100%;
		min-height: 60px;
		padding: 6px;
		border: 1px solid #ccc;
		border-radius: 6px;
		resize: vertical;
		font-family: inherit;
		font-size: 12px;
		box-sizing: border-box;
	}
	.reply-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.reply-actions button {
		padding: 4px 10px;
		border-radius: 6px;
		border: 1px solid #4d9fff;
		background: #e6f0ff;
		cursor: pointer;
		font-size: 12px;
	}
	.reply-actions button:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
	.ok {
		color: #2e7d32;
		font-size: 12px;
		font-weight: bold;
	}
	.err {
		color: #c62828;
		font-size: 11px;
	}
	.hint {
		font-style: italic;
		color: #888;
		font-size: 12px;
	}
</style>
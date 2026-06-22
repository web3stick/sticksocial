<script lang="ts">
	import type { CommentItem } from "near-social-js";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_create_comment_fun } from "$lib/near-social-js/main/fun_create_comment";
	// ============================================
	let {
		accountId,
		blockHeight,
		defaultDraft = "",
		onPosted = () => {}
	}: {
		accountId: string;
		blockHeight: bigint;
		// bumped by the /post page when the user clicks REPLY on a
		// comment_view; we apply it to the textarea and focus it so the
		// user can keep typing without reaching for the mouse.
		defaultDraft?: string;
		onPosted?: () => void;
	} = $props();
	// ============================================
	let draft = $state("");
	let busy = $state(false);
	let result = $state<string | null>(null);
	let error = $state<string | null>(null);
	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	// ============================================
	const item = $derived<CommentItem>({
		type: "social",
		path: `${accountId}/post/main`,
		blockHeight: Number(blockHeight)
	});
	const can_post = $derived(!!auth.accountId && !busy && draft.trim().length > 0);
	// ============================================
	// whenever the parent hands us a new defaultDraft (i.e. someone
	// clicked REPLY on a comment), overwrite the current draft and
	// focus the textarea so the user can keep typing.
	$effect(() => {
		if (defaultDraft) {
			draft = defaultDraft;
			textareaRef?.focus();
		}
	});
	// ============================================
	async function on_submit(e: Event) {
		e.preventDefault();
		if (!auth.accountId) return;
		if (!can_post) return;
		busy = true;
		result = null;
		error = null;
		try {
			const trimmed = draft.trim();
			await near_social_js_create_comment_fun(auth.accountId, {
				item,
				text: trimmed
			});
			draft = "";
			defaultDraft = "";
			result = "POSTED";
			onPosted();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			console.error("createComment failed", e);
		} finally {
			busy = false;
		}
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_comment_compose_form -->
<!-- WIDGET_COMMENT_COMPOSE_FORM -->
{#if !auth.accountId}
	<p class="hint">SIGN IN TO COMMENT</p>
{:else}
	<form class="compose-form" onsubmit={on_submit}>
		<textarea
			bind:this={textareaRef}
			bind:value={draft}
			placeholder="reply..."
			rows="3"
			maxlength="2000"
		></textarea>
		<div class="actions">
			<button type="submit" disabled={!can_post}>REPLY</button>
			{#if result}
				<span class="ok">{result}</span>
			{/if}
			{#if error}
				<span class="err">{error}</span>
			{/if}
		</div>
	</form>
{/if}

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.compose-form {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 100%;
		box-sizing: border-box;
	}
	textarea {
		width: 100%;
		min-height: 60px;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 6px;
		resize: vertical;
		font-family: inherit;
		font-size: 13px;
		box-sizing: border-box;
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.actions button:disabled {
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
		text-align: center;
		font-style: italic;
		color: #888;
		font-size: 12px;
	}
</style>
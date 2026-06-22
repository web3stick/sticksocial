<script lang="ts">
	import type { CommentItem } from "near-social-js";
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_create_comment_fun } from "$lib/near-social-js/main/fun_create_comment";
	// ============================================
	let {
		accountId,
		blockHeight,
		// the immediate parent being commented on. defaults to the top-
		// level post (<accountId>/post/main@<blockHeight>). callers
		// replying to a sub-comment should pass the sub-comment's item.
		item: itemOverride = null,
		// the top-level post. defaults to the same as item for top-level
		// comments. for threaded replies pass the original post item so
		// the on-chain rootItem is set and consumers can rebuild the
		// thread later.
		rootItem: rootItemOverride = null,
		// bumped by the /post page when the user clicks REPLY on a
		// comment_view; we apply it to the textarea and focus it so the
		// user can keep typing without reaching for the mouse.
		defaultDraft = "",
		// optional display handle shown in the "replying to" hint.
		replyToHandle = null,
		onPosted = () => {}
	}: {
		accountId: string;
		blockHeight: bigint;
		item?: CommentItem | null;
		rootItem?: CommentItem | null;
		defaultDraft?: string;
		replyToHandle?: string | null;
		onPosted?: () => void;
	} = $props();
	// ============================================
	let draft = $state("");
	let busy = $state(false);
	let result = $state<string | null>(null);
	let error = $state<string | null>(null);
	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	// ============================================
	// default item = the post itself; rootItem defaults to the same.
	const item = $derived<CommentItem>(
		itemOverride ?? {
			type: "social",
			path: `${accountId}/post/main`,
			blockHeight: Number(blockHeight)
		}
	);
	const rootItem = $derived<CommentItem>(rootItemOverride ?? item);
	// are we threading into a sub-comment (item.path ends in /post/comment)?
	const threading = $derived(item.path.endsWith("/post/comment"));
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
				rootItem,
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
	function cancel_reply() {
		defaultDraft = "";
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
	{#if threading || replyToHandle}
		<p class="reply-target">
			replying to
			{#if replyToHandle}<a href="/profile/{replyToHandle}">@{replyToHandle}</a>{/if}
			{#if threading}
				{#if replyToHandle}
					on
				{/if}
				<span class="thread-note">threaded under a comment</span>
			{/if}
			<button type="button" class="cancel" onclick={cancel_reply}>cancel</button>
		</p>
	{/if}
	<form class="compose-form" onsubmit={on_submit}>
		<textarea
			bind:this={textareaRef}
			bind:value={draft}
			placeholder={threading ? "reply to comment..." : "reply..."}
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
	.reply-target {
		display: flex;
		align-items: center;
		gap: 6px;
		flex-wrap: wrap;
		font-size: 12px;
		color: #666;
		background: rgba(140, 162, 245, 0.08);
		border: 1px solid rgba(140, 162, 245, 0.3);
		border-radius: 6px;
		padding: 6px 10px;
		margin: 0 0 6px;
	}
	.reply-target a {
		font-weight: bold;
	}
	.thread-note {
		font-style: italic;
		color: #888;
	}
	.reply-target .cancel {
		margin-left: auto;
		background: none;
		border: none;
		color: #888;
		font-size: 11px;
		cursor: pointer;
		padding: 2px 6px;
		border-radius: 4px;
	}
	.reply-target .cancel:hover {
		background: rgba(0, 0, 0, 0.05);
		color: #444;
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

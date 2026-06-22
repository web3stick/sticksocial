<script lang="ts">
	import { auth } from "$lib/ts/auth.svelte";
	import { near_social_js_create_post_fun } from "$lib/near-social-js/main/fun_create_post";
	import { upload_image_fun } from "./fun/upload_image";
	import type { Post } from "near-social-js";
	// ============================================
	let text = $state("");
	let imageUrl = $state("");
	let busy = $state(false);
	let uploading = $state(false);
	let uploadName = $state<string | null>(null);
	let result = $state<string | null>(null);
	let error = $state<string | null>(null);
	// ============================================
	const can_post = $derived(
		!!auth.accountId && !busy && !uploading && text.trim().length > 0
	);
	// ============================================
	function build_post(): Post {
		const trimmed_text = text.trim();
		if (imageUrl.trim()) {
			const url = imageUrl.trim();
			if (url.startsWith("ipfs://")) {
				return { text: trimmed_text, image: { ipfs_cid: url.slice(7) } };
			}
			return { text: trimmed_text, image: { url } };
		}
		return { text: trimmed_text };
	}
	// ============================================
	async function on_submit(e: Event) {
		e.preventDefault();
		if (!auth.accountId) return;
		if (!can_post) return;
		busy = true;
		result = null;
		error = null;
		try {
			await near_social_js_create_post_fun(auth.accountId, build_post());
			result = "POSTED";
			text = "";
			imageUrl = "";
			uploadName = null;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			console.error("createPost failed", e);
		} finally {
			busy = false;
		}
	}
	// ============================================
	async function on_file(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		uploading = true;
		error = null;
		uploadName = file.name;
		try {
			imageUrl = await upload_image_fun(file);
		} catch (err) {
			error = err instanceof Error ? err.message : String(err);
			console.error("ipfs upload failed", err);
		} finally {
			uploading = false;
			input.value = "";
		}
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_compose_post_form -->
<!-- WIDGET_COMPOSE_POST_FORM -->
{#if !auth.accountId}
	<p class="hint">SIGN IN TO POST</p>
{:else}
	<form class="compose-form" onsubmit={on_submit}>
		<label>
			TEXT
			<textarea
				bind:value={text}
				placeholder="what's happening?"
				rows="4"
				maxlength="2000"
			></textarea>
		</label>
		<!-- ============== -->
		<label>
			IMAGE URL (OPTIONAL)
			<input
				type="text"
				bind:value={imageUrl}
				placeholder="https://... or ipfs://CID"
			/>
		</label>
		<!-- ============== -->
		<div class="upload">
			<label class="upload-btn">
				{uploading ? "UPLOADING..." : "UPLOAD IMAGE"}
				<input
					type="file"
					accept="image/*"
					onchange={on_file}
					disabled={uploading || busy}
				/>
			</label>
			{#if uploadName}
				<span class="upload-name">{uploadName}</span>
			{/if}
		</div>
		<!-- ============== -->
		<div class="actions">
			<button type="submit" disabled={!can_post}>POST</button>
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
		width: 500px;
		max-width: 90vw;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 12px;
		text-align: left;
	}
	textarea {
		width: 100%;
		min-height: 100px;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 6px;
		resize: vertical;
		font-family: inherit;
		box-sizing: border-box;
	}
	input[type="text"] {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 6px;
		box-sizing: border-box;
	}
	.upload {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.upload-btn {
		display: inline-block;
		padding: 6px 12px;
		border: none;
		background-color: #8ca2f5;
		color: #ffffff;
		border-radius: 10px;
		cursor: pointer;
		font-size: 12px;
	}
	.upload-btn:hover {
		background-color: #c9a8f4;
	}
	.upload-btn:has(input:disabled) {
		cursor: not-allowed;
		opacity: 0.6;
	}
	.upload-btn input[type="file"] {
		display: none;
	}
	.upload-name {
		font-size: 11px;
		color: #888;
		font-style: italic;
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
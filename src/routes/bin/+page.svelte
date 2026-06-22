<script lang="ts">
	import { page } from "$app/state";
	import { near_social_js_index_fun } from "$lib/near-social-js/main/fun_index";
	import { near_social_js_get_account_feed_fun } from "$lib/near-social-js/main/fun_get_account_feed";
	// ============================================
	type Probe = "reposts" | "posts" | "comments";
	let accountId = $state(page.url.searchParams.get("account") ?? "mob.near");
	let probe = $state<Probe>("reposts");
	let loading = $state(false);
	let raw = $state<unknown>(null);
	let error = $state<string | null>(null);
	// ============================================
	async function run() {
		loading = true;
		error = null;
		raw = null;
		try {
			if (probe === "reposts") {
				raw = await near_social_js_index_fun({
					action: "repost",
					key: "main",
					accountId,
					order: "desc",
					limit: 5
				});
			} else if (probe === "posts") {
				raw = await near_social_js_get_account_feed_fun(accountId, {
					order: "desc",
					limit: 5
				});
			} else {
				raw = await near_social_js_index_fun({
					action: "comment",
					key: "main",
					accountId,
					order: "desc",
					limit: 5
				});
			}
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}
	// ============================================
	function describe_repost(entry: any): string {
		if (!entry || typeof entry !== "object") return String(entry);
		const v = entry.value;
		if (!v) return `${entry.accountId}@${entry.blockHeight} — no value`;
		if (v.type === "repost" && v.item?.path) {
			const targetAccount = v.item.path.split("/")[0];
			return `${entry.accountId}@${entry.blockHeight} → repost of ${targetAccount}@${v.item.blockHeight}`;
		}
		return `${entry.accountId}@${entry.blockHeight} value=${JSON.stringify(v)}`;
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<section class="bin">
	<h2>SDK BIN</h2>
	<p class="hint">
		debug tool — call near-social-js index / feed functions in-browser and inspect the raw
		response. useful when a feed tab renders 'unavailable' and we need to see what shape the
		API actually returns.
	</p>
	<div class="controls">
		<label>
			ACCOUNT
			<input type="text" bind:value={accountId} placeholder="account.near" />
		</label>
		<label>
			PROBE
			<select bind:value={probe}>
				<option value="reposts">reposts (index action:repost)</option>
				<option value="posts">posts (getAccountFeed)</option>
				<option value="comments">comments (index action:comment)</option>
			</select>
		</label>
		<button type="button" onclick={run} disabled={loading || !accountId}>
			{loading ? "RUNNING..." : "RUN"}
		</button>
	</div>
	{#if error}
		<p class="err">ERROR: {error}</p>
	{/if}
	{#if raw !== null}
		<h3>SUMMARY</h3>
		{#if Array.isArray(raw)}
			{#if raw.length === 0}
				<p class="hint">no entries returned.</p>
			{:else}
				{#if probe === "reposts"}
					<ul class="summary">
						{#each raw as entry, i (i)}
							<li><code>{describe_repost(entry)}</code></li>
						{/each}
					</ul>
				{:else}
					<ul class="summary">
						{#each raw as entry, i (i)}
							<li><code>{entry.accountId}@{entry.blockHeight} value={JSON.stringify(entry.value)}</code></li>
						{/each}
					</ul>
				{/if}
			{/if}
		{:else}
			<p class="hint">response (non-array):</p>
			<pre>{JSON.stringify(raw, null, 2)}</pre>
		{/if}
		<h3>RAW JSON</h3>
		<pre>{JSON.stringify(raw, null, 2)}</pre>
	{/if}
</section>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.bin {
		width: 800px;
		max-width: 95vw;
		margin: 20px auto;
		text-align: left;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.controls {
		display: flex;
		gap: 12px;
		align-items: flex-end;
		flex-wrap: wrap;
		margin-bottom: 16px;
	}
	.controls label {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 11px;
		text-transform: uppercase;
	}
	.controls input,
	.controls select {
		padding: 6px 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: inherit;
		font-size: 13px;
	}
	.summary {
		list-style: none;
		padding: 0;
		margin: 0 0 16px;
	}
	.summary li {
		padding: 4px 0;
		border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
	}
	pre {
		background: rgba(0, 0, 0, 0.05);
		padding: 12px;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 11px;
	}
	.hint {
		color: #888;
		font-style: italic;
		font-size: 12px;
	}
	.err {
		color: #c62828;
		font-weight: bold;
	}
</style>

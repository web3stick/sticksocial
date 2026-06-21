<script lang="ts">
	import {
		DEFAULT_FEED_OPTIONS,
		FEED_OPTIONS_SCHEMA,
		type FEED_OPTIONS_TYPE
	} from "$lib/types/feed_options";
	import {
		clear_feed_options,
		load_feed_options,
		save_feed_options
	} from "$lib/ts/feed_options_storage";
	import { goto } from "$app/navigation";
	// ============================================
	let order = $state<"asc" | "desc">(load_feed_options().order);
	let limit = $state<number>(load_feed_options().limit);
	let saved = $state(false);
	// ============================================
	function on_save(e: Event) {
		e.preventDefault();
		const candidate: FEED_OPTIONS_TYPE = { order, limit };
		const result = FEED_OPTIONS_SCHEMA.safeParse(candidate);
		if (!result.success) return;
		save_feed_options(result.data);
		saved = true;
		setTimeout(() => goto("/feed"), 400);
	}
	// ============================================
	function on_reset(e: Event) {
		e.preventDefault();
		order = DEFAULT_FEED_OPTIONS.order;
		limit = DEFAULT_FEED_OPTIONS.limit;
		clear_feed_options();
		saved = true;
		setTimeout(() => goto("/feed"), 400);
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_feed_options_form -->
<!-- WIDGET_FEED_OPTIONS_FORM -->
<form class="feed-options-form">
	<fieldset>
		<legend>ORDER</legend>
		<label>
			<input type="radio" name="order" value="desc" bind:group={order} />
			DESCENDING (newest first)
		</label>
		<label>
			<input type="radio" name="order" value="asc" bind:group={order} />
			ASCENDING (oldest first)
		</label>
	</fieldset>
	<!-- ============== -->
	<fieldset>
		<legend>BATCH SIZE</legend>
		<label>
			<input type="number" name="limit" min="1" max="100" bind:value={limit} />
			posts per page (1-100)
		</label>
	</fieldset>
	<!-- ============== -->
	<div class="actions">
		<button type="submit" onclick={on_save}>SAVE</button>
		<button type="button" onclick={on_reset}>RESET TO DEFAULTS</button>
		{#if saved}
			<span class="saved">SAVED</span>
		{/if}
	</div>
</form>

<!-- ============================================ -->
<!-- ============================================ -->

<style>
	.feed-options-form {
		width: 500px;
		max-width: 90vw;
		margin: 20px auto 0;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	fieldset {
		border: 1px solid #95d58d;
		border-radius: 6px;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	legend {
		padding: 0 6px;
		font-weight: bold;
	}
	label {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	input[type="number"] {
		width: 80px;
		padding: 4px 6px;
	}
	.actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}
	.saved {
		color: #2e7d32;
		font-weight: bold;
	}
</style>

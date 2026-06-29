<script lang="ts">
	import POST_VIEW from "./post_view.svelte";
	import REPOST_VIEW from "./repost_view.svelte";
	import COMMENT_VIEW from "./comment_view.svelte";
	// ============================================
	let {
		accountId,
		blockHeight,
		value
	}: {
		accountId: string;
		blockHeight: bigint;
		value?: unknown;
	} = $props();
	// ============================================
	const val = $derived(value as { _action?: string; item?: { path?: string } } | undefined | null);
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_poly_feed_renderer -->
<!-- WIDGET_POLY_FEED_RENDERER -->
{#if val?._action === "repost"}
	<REPOST_VIEW {accountId} {blockHeight} {value} />
{:else if val?._action === "comment"}
	<COMMENT_VIEW {accountId} {blockHeight} />
{:else}
	<POST_VIEW {accountId} {blockHeight} />
{/if}

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

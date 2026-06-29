<script lang="ts">
	import INFINITE_FEED from "./infinite_feed.svelte";
	import { get_unified_feed } from "$lib/near-social-js/main/fun_get_unified_feed";
	import { load_feed_options } from "$lib/ts/feed_options_storage";
	import POLY_RENDERER from "./poly_feed_renderer.svelte";
	// ============================================
	const saved = load_feed_options();
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_unified_feed -->
<!-- WIDGET_UNIFIED_FEED -->
<INFINITE_FEED
	fetch={get_unified_feed}
	limit={saved.limit}
	order={saved.order}
	component={POLY_RENDERER}
/>

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

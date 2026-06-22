<script lang="ts">
	import INFINITE_FEED from "./infinite_feed.svelte";
	import { get_activity_feed } from "$lib/near-social-js/main/fun_get_activity_feed";
	import { load_feed_options } from "$lib/ts/feed_options_storage";
	import { DEFAULT_FEED_OPTIONS } from "$lib/types/feed_options";
	// ============================================
	const saved = load_feed_options();
	// ============================================
	export const feed_options_defaults = DEFAULT_FEED_OPTIONS;
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_infinite_post_feed -->
<!-- WIDGET_INFINITE_POST_FEED -->
<INFINITE_FEED fetch={get_activity_feed} limit={saved.limit} order={saved.order} />

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>

<script lang="ts">
	import INFINITE_FEED from "./infinite_feed.svelte";
	import { near_social_js_get_hashtag_feed_fun } from "$lib/near-social-js/main/fun_get_hashtag_feed";
	import type { FeedOptions } from "near-social-js";
	// ============================================
	let { tag }: { tag: string } = $props();
	// ============================================
	function fetch_hashtag_feed(opts: FeedOptions) {
		return near_social_js_get_hashtag_feed_fun(tag, opts);
	}
	// ============================================
</script>

<!-- ============================================ -->
<!-- ============================================ -->

<!-- widget_hashtag_feed -->
<!-- WIDGET_HASHTAG_FEED -->
<INFINITE_FEED fetch={fetch_hashtag_feed} />

<!-- ============================================ -->
<!-- ============================================ -->

<style></style>
